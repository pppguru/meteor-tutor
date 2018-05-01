import React from 'react';

import { getTutorUrl } from '/client/helpers/helpers-global';

const Biography = React.createClass({
  /**
   * Sets out initial state
   */
  getInitialState() {
    return {
      collapsed: true, // this will be used to toggle the biography full view
    };
  },

  /**
   * Toggles the collapsed state of the biography
   */
  showFull() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  },

  render() {
    const { biography } = this.props;
    const { collapsed } = this.state;
    const length = biography.length;
    return (
      <div>
        {
           length >= 45 && (
             <p className={`trimBio ${collapsed && 'show' || 'hidden'}`}>
               {`${biography.substring(0, 45)} ...`} <a href="" onClick={this.showFull}>More</a>
             </p>
           )
         }
        <p className={`hiddenBio ${length >= 45 && collapsed && 'hidden' || 'show'}`}>
          {biography}
        </p>
      </div>
    );
  },
});

TutorResultItem = React.createClass({
  render() {
    const {
      _id,
      rate,
      address,
      profile: { avatar, firstName, lastName, biography = '' },
      status: { online },
      specialities,
      scheduling,
    } = this.props;

    return (
      <div className="search--results-user">
        <div className="search--results-user-wrapper">
          <div className="search--results-user-quick">
            <div
              className="search--results-user-quick-photo"
              style={{ backgroundImage: `url(${avatar})` }}
            />
            <div className="search--results-user-quick-info">
              <h2>
                <a href={getTutorUrl(_id)} onClick={this.routeProfile}>
                  {firstName} {lastName && `${lastName[0]}.`}
                </a>
              </h2>
              <i className={`online--status ${online && 'green' || 'red'}`} />
              <p>{address.city}, ${rate}/hour</p>
              <MessageButton tutor={_id} />
            </div>
          </div>
          <div className="search--results-user-details">
            {
              biography.length >= 4 && (
                <div className="search--results-user-details-block">
                  <h5>About</h5>
                  <Biography biography={biography} />
                </div>
              )
            }
            <div className="search--results-user-details-block">
              <h5>Subjects</h5>
              <TutorProfileSubjects isSearch subjects={specialities} />
            </div>
            <div className="search--results-user-details-block no-padding-bottom">
              <h5>Availability</h5>
              <TutorSchedule scheduling={scheduling} header="hide" backend="true" />
            </div>
          </div>
        </div>
      </div>
    );
  },
});
