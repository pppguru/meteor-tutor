import React from 'react';

TutorProfileEducation = React.createClass({
  renderEducation() {
    if (this.props.education) {
      if (this.props.education.length <= 0) {
        return (
          <p>No education added yet!</p>
        );
      } else {
        return this.props.education.map((edu, i) => {
          return <TutorEducationItem key={i} edu={edu} />;
        });
      }
    } else {
      return this.props.education.map((edu, i) => {
        return <TutorEducationItem key={i} edu={edu} />;
      });
    }
    console.log(this.props);
  },
  renderContent() {
    return (
      <div className="tutor--education">
        <div className="tutor--education-wrapper">
          <div className="icon-item">
            <div className="icon-item-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68.14 42.34"><path d="M17.25,39.55l-5.68-2.34L45.64,23.14,79.71,37.21,45.64,51.27,20.09,40.72V65.48H17.25V39.55ZM45.64,54.62l-17-7.56V59.56s6.09,5.92,17,5.92,17-5.92,17-5.92V47.07Z" transform="translate(-11.57 -23.14)" /></svg>
            </div>
            <div className="icon-item-copy">
              <h3>Education</h3>
            </div>
          </div>
          <div className="education--items">
            {this.renderEducation()}
          </div>
        </div>
      </div>
    );
  },
  render() {
    if (this.props.education) {
      return this.renderContent();
    } else {
      return (<div>Loading...</div>);
    }
  },
});

TutorEducationItem = React.createClass({
  checkVerification() {
    if (this.props.edu.adminApproved) {
      return (
        <div className="tutor-items-verified-check">Verified</div>
      );
    }
  },
  render() {
    return (
      <div className="tutor--education-items-single">
        <div className="icon-item">
          <div className="icon-item-icon clear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.17 35.47"><title>icon_edu_location</title><path d="M116.75-266.6a11.08,11.08,0,0,0-15.67,0,11.08,11.08,0,0,0,0,15.67s7.83,7.68,7.83,16.55c0-8.87,7.84-16.55,7.84-16.55A11.08,11.08,0,0,0,116.75-266.6Zm-7.84,12.28a4.43,4.43,0,0,1-4.43-4.43,4.43,4.43,0,0,1,4.43-4.43,4.43,4.43,0,0,1,4.44,4.43A4.43,4.43,0,0,1,108.91-254.33Z" transform="translate(-97.84 269.85)" /></svg>
          </div>
          <div className="icon-item-copy">
            <h4>{this.props.edu.schoolName}</h4>
            <p>{this.props.edu.educationLevel}</p>
          </div>
          <div className="tutor--education-items-verfied">
            {this.checkVerification()}
          </div>
        </div>
      </div>
    );
  },
});
