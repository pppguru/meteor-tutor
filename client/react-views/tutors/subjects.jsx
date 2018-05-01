import React from 'react';

TutorProfileSubjects = React.createClass({
  getInitialState() {
    return {
      expanded: false,
      showExpander: true,
    };
  },
  renderSubjects() {
    if (this.props.subjects) {
      if (this.props.subjects.length <= 0) {
        return (
          <p>No subjects added yet!</p>
        );
      } else {
        return this.props.subjects.map((subject, i) => {
          return <TutorSubjectItem key={i} subject={subject} />;
        });
      }
    } else {
      return this.props.subjects.map((subject, i) => {
        return <TutorSubjectItem key={i} subject={subject} />;
      });
    }
  },
  expandSubjects() {
    this.setState({
      expanded: !this.state.expanded,
    });
  },

  componentDidMount() {
    if (this.props.subjects.length <= 0)
    {
      this.setState({
        showExpander: false,
      });
    }
    else {
      const availableWidth = $('.tutor--subjects-items').width();
      // counts letters in all subjects
      let result = this.props.subjects.reduce((sumLength, currentElm) => {
        return sumLength + currentElm.subject.length;
      }, 0);
      // let 1 letter takes 9 pixels + word count + minimum padding
      result = result * 9 + this.props.subjects.length * 40;
      if (result > availableWidth) {
        this.setState({
          showExpander: true,
        });
      }
      else {
        this.setState({
          showExpander: false,
        });
      }
    }
  },
  render() {
    const expanded = this.state.expanded;
    return (
      <div className="tutor--subjects">
        <div className="tutor--subjects-wrapper">
          <div className="icon-item">
            <div className="icon-item-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.07 35.62"><path d="M399.75,1415h0a1.14,1.14,0,0,0,1.13-1.13h0v-22.19a1.14,1.14,0,0,0-1.13-1.14h-4.29V1385a1.14,1.14,0,0,0-.52-1,1.13,1.13,0,0,0-1.08-.08l-15.37,6.94a1.12,1.12,0,0,0-.62.74h-0.06v22.21h0a5.63,5.63,0,0,0,5.4,5.6h16.53a1.14,1.14,0,0,0,0-2.28A1.1,1.1,0,0,1,399.75,1415Zm-3.16,2.2h-8.93v0h-4.43a3.34,3.34,0,0,1-2.93-2.2h16.3a3.37,3.37,0,0,0-.2,1.11A3.32,3.32,0,0,0,396.59,1417.19Zm-12.34-4.5,10.53-4.76a1.14,1.14,0,0,0,.67-1V1392.8h3.16v19.89H384.25Z" transform="translate(-377.82 -1383.86)" /></svg>
            </div>
            <div className="icon-item-copy">
              <h3>Subjects</h3>
            </div>
          </div>
          <div className="tutor--subjects-items" style={{ height: !!this.props.isSearch && !this.state.expanded ? '37px' : '100%' }}>
            {this.renderSubjects()}
          </div>
          <div className="expand-subjects-button icon-item-copy" onClick={this.expandSubjects} style={{ display: !!this.props.isSearch && this.state.showExpander ? 'block' : 'none' }}>
            <svg viewBox="0 0 24 24">
              {!this.state.expanded ?
                <path d="M12 2q0.414 0 0.707 0.293t0.293 0.707v8h8q0.414 0 0.707 0.293t0.293 0.707-0.293 0.707-0.707 0.293h-8v8q0 0.414-0.293 0.707t-0.707 0.293-0.707-0.293-0.293-0.707v-8h-8q-0.414 0-0.707-0.293t-0.293-0.707 0.293-0.707 0.707-0.293h8v-8q0-0.414 0.293-0.707t0.707-0.293z" />
                  : <path d="M3 11h18q0.414 0 0.707 0.293t0.293 0.707-0.293 0.707-0.707 0.293h-18q-0.414 0-0.707-0.293t-0.293-0.707 0.293-0.707 0.707-0.293z" />
                }
            </svg>

          </div>
        </div>
      </div>
    );
  },
});

TutorSubjectItem = React.createClass({
  getInitialState() {
    return {
      verified: false,
    };
  },
  checkVerified(e) {
    if (e.target.checked) {
      this.setState({
        verified: true,
      });
    } else {
      this.setState({
        verified: false,
      });
    }
  },
  checkVerification() {
    if (this.props.subject.adminApproved === true) {
      return (<div className="tutor-items-verified-check" />);
    }
  },
  render() {
    const verified = this.state.verified;
    const isSearch = this.props.isSearch;
    return (
      <div className="tutor--subject-items-single">
        <h4>{this.props.subject.subject}</h4>
        <div className="tutor--education-items-verified">
          {this.checkVerification()}
        </div>
      </div>
    );
  },
});
