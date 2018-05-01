import Modules from '/client/modules/_modules';

// Handle the Store Module
const education = (module) => {
  let verifiedDoc = null;
  let adminApproved = false;
  let approvalNeeded = false;
  if (module.querySelector('[name="approval-needed"]').checked === true) {
    verifiedDoc = module.querySelector('.dashboard--settings-education-upload a');
    if (verifiedDoc) {
      approvalNeeded = true;
      verifiedDoc = verifiedDoc.getAttribute('href');
    } else {
      verifiedDoc = null;
    }
  }
  if (module.querySelector('[name="admin-approved"]').checked === true) {
    console.log('sup');
    adminApproved = true;
    approvalNeeded = false;
  }
  return {
    adminApproved,
    approvalNeeded,
    verifiedDocument: verifiedDoc,
    schoolName: module.querySelector('.school').value,
    educationLevel: module.querySelector('.education').value,
  };
};

const serializeEducationContent = () => {
  const modulesArray = [];

  const modules = document.querySelectorAll('.education-module');

  Array.from(modules).forEach((module, index) => {
    const contentArray = [];
    const dataType = module.getAttribute('data-module-type');
    switch (dataType) {
      case 'education':
        row = education(module);
        break;
    }
    modulesArray.splice(index, 0, row);
  });

  return modulesArray;
};

const serializeEducation = () => serializeEducationContent();

Modules.client.serializeEducation = serializeEducation;

const serializeSubjectsContent = () => {
  const modulesArray = [];

  const modules = document.querySelectorAll('.subject-module');

  Array.from(modules).forEach((module, index) => {
    const contentArray = [];
    const dataType = module.getAttribute('data-module-type');
    switch (dataType) {
      case 'subject':
        row = subject(module);
        break;
    }
    modulesArray.splice(index, 0, row);
  });

  return modulesArray;
};

const serializeSubjects = () => serializeSubjectsContent();


// Handle the Store Module
let subject = (module) => {
  let verifiedDoc = null;
  if (module.querySelector('[name="approval-needed"]').checked === true) {
    verifiedDoc = module.querySelector('.dashboard--settings-subjects-upload a');
    if (verifiedDoc) {
      verifiedDoc = verifiedDoc.getAttribute('href');
    } else {
      verifiedDoc = null;
    }
  }
  return {
    adminApproved: module.querySelector('[name="admin-approved"]').checked,
    subject: module.querySelector('.dashboard--settings-subjects-single h4').innerHTML,
    approvalNeeded: module.querySelector('[name="approval-needed"]').checked,
    verifiedDocument: verifiedDoc,
  };
};

Modules.client.serializeSubjects = serializeSubjects;

export default Modules;
