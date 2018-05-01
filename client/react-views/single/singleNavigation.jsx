import { Session } from 'meteor/session';

import React from 'react';

SingleNavigation = React.createClass({
  checkSession(session) {
    const route = Session.get('currentRoute');
    if (session === route) {
      return 'active';
    }
  },
  getInitialState() {
    return {
      mobileOpen: false,
    };
  },
  currentSelection() {
    const route = Session.get('currentRoute');
    switch (route) {
      case 'terms-of-use': return 'Terms of Use';
      case 'privacy-policy': return 'Privacy Policy';
      case 'tutor-payment-policy': return 'Tutor Payment Policy';
      case 'independent-tutor-agreement': return 'Independent Tutor Agreement';
      case '24-hour-cancellation': return '24 Hour Cancellation';
      default: return 'Terms of Use';
    }
  },
  getMobileNavStatus() {
    if (this.state.mobileOpen) {
      return 'open';
    }
    return 'closed';
  },
  mobileShow(e) {
    const active = !this.state.mobileOpen;
    this.setState({
      mobileOpen: active,
    });
  },
  hideMenu() {
    const active = !this.state.mobileOpen;
    this.setState({
      mobileOpen: active,
    });
  },

  render() {
    let mobileNavOpened = this.getMobileNavStatus(),
      selectedMenu = this.currentSelection();
    return (
      <div>
        <nav className="dashboard--navigation single-pages terms">
          <ul>
            <li><a href="/terms-of-use" className={this.checkSession('terms-of-use')}>Terms of Use</a></li>
            <li><a href="/privacy-policy" className={this.checkSession('privacy-policy')}>Privacy Policy</a></li>
            <li><a href="/tutor-payment-policy" className={this.checkSession('tutor-payment-policy')}>Tutor Payment Policy</a></li>
            <li><a href="/independent-tutor-agreement" className={this.checkSession('independent-tutor-agreement')}>Independent Tutor Agreement</a></li>
            <li><a href="/24-hour-cancellation" className={this.checkSession('24-hour-cancellation')}>24-hour Cancellation</a></li>
          </ul>
        </nav>
        <div className="header--mobile-main terms" onClick={this.mobileShow}>
          <div className="header--mobile-main-toggle">
            <div className="header--mobile-main-toggle-selected">{selectedMenu}</div>
            <span className={`icono-play ${mobileNavOpened}`} />
          </div>
          <nav className={`${mobileNavOpened} nav nav--mobile-main`} onClick={this.hideMenu}>
            <div className="nav--mobile-main-inner">
              <ul>
                <li><a href="/terms-of-use">Terms of Use</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/tutor-payment-policy">Tutor Payment Policy</a></li>
                <li><a href="/independent-tutor-agreement">Independent Tutor Agreement</a></li>
                <li><a href="/24-hour-cancellation">24-hour Cancellation</a></li>

              </ul>
            </div>
          </nav>
        </div>
      </div>

    );
  },
});
