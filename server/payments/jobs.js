import Lessons from '/collections/lessons';


PaymentProcessingJob = function(name, fetchRecords, processRecord) {
  this.name = name;
  this._fetchRecords = fetchRecords;
  this._processRecord = processRecord;
};
PaymentProcessingJob.prototype.process = function () {
  this.error = null;
  this.onStart();
  this.fetchRecords();
  this.processRecords();
  return this.results;
};
PaymentProcessingJob.prototype.fetchRecords = function () {
  this.records = null;
  try {
    this.records = this._fetchRecords();
    this.onFetch();
  } catch (e) {
    this.error = e;
    this.onError();
  }
  return this.records;
};
PaymentProcessingJob.prototype.processRecords = function () {
  this.results = null;
  try {
    if (! this.records || typeof this.records.map !== "function") {
      this.onSkipProcessing();
      return;
    }
    this.results = this.records.map(record => this.processRecord(record));
    this.onResults();
  } catch (e) {
    this.error = e;
    this.onError();
  }
  return this.results;
};
PaymentProcessingJob.prototype.processRecord = function (record) {
  return new PaymentProcessingTask(record, this._processRecord, this);
};
PaymentProcessingJob.prototype.onStart = function () {
  console.log(`Payment Job ${this.name}: Started processing.`);
};
PaymentProcessingJob.prototype.onFetch = function () {
  console.log(`Payment Job ${this.name}: Fetched ${this.records.length} records to process.`);
};
PaymentProcessingJob.prototype.onSkipProcessing = function () {
  console.log(`Payment Job ${this.name}: Skipped processing records.`);
  console.log(`Records:`);
  console.log(this.stringify(this.records));
};
PaymentProcessingJob.prototype.onResults = function () {
  console.log(`Payment Job ${this.name}: Completed processing ${this.results.length} records.`);

  var errorCount = this.countErrors(this.results);
  if (errorCount) {
    console.warn(`Payment Job ${this.name}: Found ${errorCount} records with errors.`);
  }
};
PaymentProcessingJob.prototype.onError = function () {
  console.log(`Payment Job ${this.name}: Error while processing records: ${this.error && this.error.message || this.error}`);
  console.error(this.error && this.error.stack || this.error);
};
PaymentProcessingJob.prototype.countErrors = function(records) {
  if (! records || ! records.length) {
    return 0;
  }
  return records.filter(record => record.error).length;
};
PaymentProcessingJob.prototype.stringify = function(record) {
  try {
    return JSON.stringify(record, null, 2);
  } catch (e) {
    return record;
  }
}

var debug = Meteor.settings.debug_payment_processing;
PaymentProcessingTask = function(recordToProcess, processRecord, job) {
  this.name = job && job.name;
  this.job = job;
  this.record = recordToProcess;
  try {
    this.onStart();
    this.result = processRecord.call(this, recordToProcess);
    this.onSuccess();
  } catch (e) {
    this.error = e;
    this.onError();
  }
};
PaymentProcessingTask.prototype.onStart = function () {
  debug && console.log(`Payment Job ${this.name}: Started processing ${this.record && this.record._id}.`);
};
PaymentProcessingTask.prototype.onSuccess = function () {
  debug && console.log(`Payment Job ${this.name}: Completed processing ${this.record && this.record._id}.`)
};
PaymentProcessingTask.prototype.onError = function () {
  console.log(`Payment Job ${this.name}: Error while processing record ${this.record && this.record._id}: ${this.error && this.error.message || this.error}`);
  console.log(`Record to process:`);
  console.log(this.stringify(this.record));
  console.log(`Stack trace:`);
  console.error(this.error && this.error.stack || this.error);

  try {
    PaymentNotifications.notifyAdminOfError(this.name, this.record, this.error);
  } catch (e) {
    console.log("Sending error notification to admin failed.", e.stack);
  }
};
PaymentProcessingTask.prototype.stringify = PaymentProcessingJob.prototype.stringify;

PaymentJobs = {
  chargeStudentsForCompletedLessons: new PaymentProcessingJob(
    "Charge Students For Completed Lessons",
    () => Lessons.find({
      payment: "unresolved",
      status: "completed",
      completedAt: {
        // Wait 24 hours for payment processing, this is just good business
        // practice and gives teachers and students time to contact admins
        // if something is wrong.
        $lte: moment().add(Payments.hoursBeforeStudentPayment, 'hours').toDate(),
      },
    }).fetch(),
    (lesson) => {
      Payments.chargeStudentForCompletedLesson(lesson);
    }
  ),
  chargeStudentsForCancelledLessons: new PaymentProcessingJob(
    "Charge Students For Cancelled Lessons",
    () => Lessons.find({
      payment: "unresolved",
      status: "student_cancelled",
      autoBillable: true,
      completedAt: {
        // Wait 24 hours for payment processing, this is just good business
        // practice and gives teachers and students time to contact admins
        // if something is wrong.
        $lte: moment().add(Payments.hoursBeforeStudentPayment, 'hours').toDate(),
      },
    }).fetch(),
    (lesson) => {
      Payments.chargeStudentForCancelledLesson(lesson);
    }
  ),
  payTutorsForCompletedLessons: new PaymentProcessingJob(
    "Pay Tutors For Completed Lessons",
    () => Lessons.find({
      payment: "resolved",
      tutorPaid: { $ne: true },
      status: "completed",
      completedAt: {
        // Wait 24 hours for payment processing, this is just good business
        // practice and gives teachers and students time to contact admins
        // if something is wrong.
        $lte: moment().add(Payments.hoursBeforeTutorPayment, 'hours').toDate(),
      },
    }).fetch(),
    (lesson) => {
      Payments.payTutorForCompletedLesson(lesson);
    }
  ),
  payTutorsForCancelledLessons: new PaymentProcessingJob(
    "Pay Tutors For Cancelled Lessons",
    () => Lessons.find({
      payment: "resolved",
      tutorPaid: { $ne: true },
      status: "student_cancelled",
      autoBillable: true,
      completedAt: {
        // Wait 24 hours for payment processing, this is just good business
        // practice and gives teachers and students time to contact admins
        // if something is wrong.
        $lte: moment().add(Payments.hoursBeforeTutorPayment, 'hours').toDate(),
      },
    }).fetch(),
    (lesson) => {
      Payments.payTutorForCancelledLesson(lesson);
    }
  ),
  issueRewardsForReferrals: new PaymentProcessingJob(
    "Issue Rewards For Referrals",
    () => {
      return Meteor.users.find({
        referredBy: { $exists: true },
        referralRewardPaid: { $ne: true },
        learnedTen: { $ne: true },
        taughtTen: { $ne: true },
      }).fetch();
    },
    (user) => {
      Payments.issueRewardForReferral(user);
    }
  )
};


PaymentJobs.processAll = function() {
  // Prevent infinite loops and overlapping runs of payment processing
  if (PaymentJobs.processAll.running) return;
  PaymentJobs.processAll.running = true;

  // Run all jobs
  _.each(PaymentJobs, (job, name) => {
    if (job instanceof PaymentProcessingJob) {
      job.process();
    }
  });

  PaymentJobs.processAll.running = false;
};
PaymentJobs.processAll.running = false;

// Always run on startup, delayed by 5000 miliseconds to not interfear with
// bootup. (Except in payments debug mode, in which case run immediately)
Meteor.startup(() => {
  Meteor.setTimeout(() => {
    PaymentJobs.processAll();
  }, debug ? 0 : 5000);
});


SyncedCron.add({
  name: "Handle payment processing",
  schedule: function (parse) {
    // In debug mode process payments every two minutes so that payment
    // processing for recent transactions happens almost immediately.
    return debug ? parse.text('every 2 minutes') : parse.text('every 2 hours');
  },
  job: function (intendedAt) {
    PaymentJobs.processAll();
  },
});
