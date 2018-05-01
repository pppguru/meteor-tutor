import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Counts } from 'meteor/tmeasday:publish-counts';

import Lessons from '/collections/lessons';
import Chats from '/collections/chats';
import Messages from '/collections/messages';

MessagesPreview = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const chats = Chats.find({}, { $sort: { updatedAt: -1 }, limit: 3 }).fetch();
    const messages = Messages.find().fetch();
    return {
      chats,
      messages,
      counts: Counts.get('notification-count'),
    };
  },
  renderChats() {
    return this.data.chats.map((chat) => {
      return <ChatPreview key={chat._id} chat={chat} />;
    });
  },
  renderCounts() {
    if (this.data.counts >= 1) {
      return (<span className="dashboard--messages-notifications">{this.data.counts} new</span>);
    }
  },

  chatsExist() {
    if (this.data.chats.length >= 1 && this.data.messages.length >= 1) {
      return true;
    }
    return false;
  },

  renderEmpty() {
    return (
      <div className="icon-item">
        <div className="icon-item-icon">
          <svg viewBox="0 0 90 57.1"><path d="M94.1,50.3L80.7,27.2a11.39,11.39,0,0,0-9.5-5.4H28.8a11.78,11.78,0,0,0-9.5,5.4L5.9,50.3A8.62,8.62,0,0,0,5,55V74.9a4,4,0,0,0,4,4H91a4,4,0,0,0,4-4V55A8.46,8.46,0,0,0,94.1,50.3ZM50.5,61.7a9.94,9.94,0,0,1-10-9.9H14.3L26.2,31.3a3.89,3.89,0,0,1,2.5-1.5H71.1a3.46,3.46,0,0,1,2.5,1.5L85.5,51.8h-25A10,10,0,0,1,50.5,61.7Z" transform="translate(-5 -21.8)" /></svg>
        </div>
        <div className="icon-item-copy">
          <h3>You have no messages</h3>
        </div>
      </div>
    );
  },

  render() {
    const chatExists = this.chatsExist();

    return (
      <div className="dashboard--messages-card dashboard-card">
        <div className="dashboard--messages-card-wrapper">
          <div className="dashboard--messages-header">
            <h2>Messages {this.renderCounts()}</h2><a href="/inbox">View All</a>
          </div>
          <div className="dashboard--messages-preview">
            {chatExists ? this.renderChats() : this.renderEmpty() }
          </div>
        </div>
      </div>
    );
  },
});


ChatPreview = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const currentUser = Meteor.userId();
    const lesson = Lessons.findOne({ chat_id: this.props.chat._id }, { sort: { createdAt: -1 } });
    let user, message, filter, status;
    if (Roles.userIsInRole(currentUser, ['tutor'])) {
      user = Meteor.users.findOne({ _id: this.props.chat.student_id });
      message = Messages.findOne({ student_id: this.props.chat.student_id }, { sort: { time: -1 }, limit: 1 });
      filter = { userId: this.props.chat.student_id };
      status = Presences.findOne(filter, { fields: { state: true, userId: true } });
    } else if (Roles.userIsInRole(currentUser, ['student'])) {
      user = Meteor.users.findOne({ _id: this.props.chat.tutor_id });
      message = Messages.findOne({ tutor_id: this.props.chat.tutor_id }, { sort: { time: -1 }, limit: 1 });
      filter = { userId: this.props.chat.tutor_id };
      status = Presences.findOne(filter, { fields: { state: true, userId: true } });
    }
    return {
      message,
      lesson,
      user,
      status,
    };
  },
  render() {
    if (this.data.user && this.data.message) {
      return <ChatDash chat={this.props.chat} lesson={this.data.lesson} user={this.data.user} status={this.data.status} message={this.data.message} />;
    } else {
      return (<div />);
    }
  },
});

ChatDash = React.createClass({
  checkStatus() {
    if (this.props.status) {
      return (<span className="status--circle status--online" />);
    }
  },
  checkLesson() {
    if (this.props.lesson) {
      if (this.props.lesson.status === 'pending' || this.props.lesson.status === 'modified') {
        return (<span className="lesson--status pending">Lesson Pending</span>);
      } else if (this.props.lesson.status === 'completed') {
        return (<span className="lesson--status completed">Recently Completed a Lesson</span>);
      } else if (this.props.lesson.status === 'student_cancelled' || this.props.lesson.status === 'tutor_cancelled') {
        return (<span className="lesson--status cancelled">Cancelled Lesson</span>);
      } else if (this.props.lesson.status === 'accepted') {
        return (<span className="lesson--status accepted">You have an upcoming Lesson</span>);
      } else if (this.props.lesson.status === 'declined') {
        return (<span className="lesson--status dclined">Edits are needed to accept Lesson</span>);
      } else {
        return;
      }
    } else {
      return;
    }
  },
  checkRead() {
    const user = Meteor.userId();
    if (this.props.message.read === false) {
      if (user._id !== this.props.message.from_id) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  },
  render() {
    const fullMessage = this.props.message.message;
    let trim = fullMessage;
    const length = fullMessage.length;
    if (length >= 24) {
      trim = `${fullMessage.substring(0, 24)} ...`;
    }
    const lastName = this.props.user.profile.lastName.substring(0, 1);
    const style = {
      backgroundImage: `url(${this.props.user.profile.avatar})`,
    };
    return (
      <div className="dashboard--messages-single">
        <a href={`/chat/${this.props.chat._id}`}>
          <span style={style} className="dashboard--messages-single-avatar" />
        </a>
        {this.checkStatus()}
        <a href={`/chat/${this.props.chat._id}`}>
          <h3>{this.props.user.profile.firstName} {lastName}.</h3>
          <p className={`read-${this.checkRead()}`}>{trim}</p>
          {this.checkLesson()}
        </a>
      </div>
    );
  },
});
