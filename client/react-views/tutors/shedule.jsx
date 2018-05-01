import React from 'react';

TutorSchedule = React.createClass({
  PropTypes: {
    return: {
      scheduling: React.PropTypes.array.isRequired,
    },
  },
  componentDidMount() {

  },
  renderDays() {
    return this.props.scheduling.map((schedule, i) => {
      if (parseInt(schedule.value) === 0 || schedule.value === null) {
        return;
      } else {
        return <TutorScheduleDay key={i} schedule={schedule} />;
      }
    });
  },
  renderPreference() {
    const preference = this.props.meeting;
    console.log(preference);
    switch (preference) {
      case 0:
        return (
          <div>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 40 40"><g><circle className="st0" cx="23.6" cy="17.8" r="2.5" /><path className="st0" d="M22.9,21.3c-0.1,0-0.1,0.1-0.1,0.2c0.2,0.4,0.3,0.9,0.3,1.4v3.3c0,0.1,0,0.2,0,0.3c0,0.1,0,0.2,0.1,0.2h4.1c0.2,0,0.4-0.2,0.4-0.4v-2.8c0-1.2-1-2.1-2.1-2.1H22.9z" /><circle className="st0" cx="17" cy="16.3" r="2.9" /><path className="st0" d="M12.3,26.1v-3.3c0-1.4,1.1-2.5,2.5-2.5h4.4c1.4,0,2.5,1.1,2.5,2.5v3.3c0,0.3-0.2,0.5-0.5,0.5h-8.4C12.6,26.6,12.3,26.4,12.3,26.1z" /></g><g><path className="st0" d="M20,1.4c10.3,0,18.6,8.3,18.6,18.6S30.3,38.6,20,38.6S1.4,30.3,1.4,20S9.7,1.4,20,1.4 M20,0.9C9.4,0.9,0.9,9.4,0.9,20S9.4,39.1,20,39.1S39.1,30.6,39.1,20S30.6,0.9,20,0.9L20,0.9z" /></g></svg>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 40 40"><g><path className="st0" d="M20,1.4c10.3,0,18.6,8.3,18.6,18.6S30.3,38.6,20,38.6S1.4,30.3,1.4,20S9.7,1.4,20,1.4 M20,0.9C9.4,0.9,0.9,9.4,0.9,20S9.4,39.1,20,39.1S39.1,30.6,39.1,20S30.6,0.9,20,0.9L20,0.9z" /></g><polygon className="st0" points="16.2,12.4 16.2,25.3 19.2,22.5 22.5,28.8 24.5,27.7 21.4,21.6 25.5,21.6 " /></svg>
            <span>in person or online</span>
          </div>
        );
        break;
      case 1:
        return (
          <div>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 40 40"><g><path className="st0" d="M20,1.4c10.3,0,18.6,8.3,18.6,18.6S30.3,38.6,20,38.6S1.4,30.3,1.4,20S9.7,1.4,20,1.4 M20,0.9C9.4,0.9,0.9,9.4,0.9,20S9.4,39.1,20,39.1S39.1,30.6,39.1,20S30.6,0.9,20,0.9L20,0.9z" /></g><polygon className="st0" points="16.2,12.4 16.2,25.3 19.2,22.5 22.5,28.8 24.5,27.7 21.4,21.6 25.5,21.6 " /></svg>
            <span>online only</span>
          </div>
        );
        break;
      case 2:
        return (
          <div>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 40 40"><g><circle className="st0" cx="23.6" cy="17.8" r="2.5" /><path className="st0" d="M22.9,21.3c-0.1,0-0.1,0.1-0.1,0.2c0.2,0.4,0.3,0.9,0.3,1.4v3.3c0,0.1,0,0.2,0,0.3c0,0.1,0,0.2,0.1,0.2h4.1c0.2,0,0.4-0.2,0.4-0.4v-2.8c0-1.2-1-2.1-2.1-2.1H22.9z" /><circle className="st0" cx="17" cy="16.3" r="2.9" /><path className="st0" d="M12.3,26.1v-3.3c0-1.4,1.1-2.5,2.5-2.5h4.4c1.4,0,2.5,1.1,2.5,2.5v3.3c0,0.3-0.2,0.5-0.5,0.5h-8.4C12.6,26.6,12.3,26.4,12.3,26.1z" /></g><g><path className="st0" d="M20,1.4c10.3,0,18.6,8.3,18.6,18.6S30.3,38.6,20,38.6S1.4,30.3,1.4,20S9.7,1.4,20,1.4 M20,0.9C9.4,0.9,0.9,9.4,0.9,20S9.4,39.1,20,39.1S39.1,30.6,39.1,20S30.6,0.9,20,0.9L20,0.9z" /></g></svg>
            <span>in person only</span>
          </div>
        );
        break;
    }
  },
  renderHeader() {
    const headerHide = this.props.header;
    if (headerHide === 'hide') {
      return;
    } else {
      return (
        <div className="icon-item">
          <div className="icon-item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path d="M37.82,166.5A13.5,13.5,0,1,1,24.32,180a13.52,13.52,0,0,1,13.5-13.5m0-4.5a18,18,0,1,0,18,18,18,18,0,0,0-18-18h0Z" transform="translate(-19.82 -162)" /><path d="M43.92,182.9l-3.85-3.85v-8H35.55v9a2.23,2.23,0,0,0,.78,1.68l4.41,4.41Z" transform="translate(-19.82 -162)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h3>Availability</h3>
          </div>
          <div className="icon--helpers">
            {this.renderPreference()}
          </div>
        </div>
      );
    }
  },

  render() {
    return (
      <div className="tutor--scheduling">
        <div className="tutor--scheduling-wrapper">
          {this.renderHeader()}
          <ul className="tutor--scheduling-days">
            {this.renderDays()}
          </ul>
        </div>
      </div>
    );
  },
});

TutorScheduleDay = React.createClass({
  renderName() {
    return this.props.schedule.name.slice(0, 3);
  },
  renderTime() {
    switch (parseInt(this.props.schedule.value)) {
      case null:
        return 'Not Available';
        break;
      case 0:
        return 'Not Available';
        break;
      case 1:
        return 'Mornings';
        break;
      case 2:
        return 'Afternoons';
        break;
      case 3:
        return 'Evenings';
        break;
      case 4:
        return 'All Day';
        break;
    }
  },
  render() {
    return (
      <li className={`available-${this.props.schedule.value}`}>
        <div className="tutor--scheduling-days-day">
          <h4>{this.renderName()}</h4>
        </div>
        <div className="tutor--scheduling-days-time">
          <h3>{this.renderTime()}</h3>
        </div>
      </li>
    );
  },
});
