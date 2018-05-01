import { Template } from 'meteor/templating';

import React from 'react';

Payments = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user(),
      userId = Meteor.userId(),
      tutor = Roles.userIsInRole(userId, ['tutor']),
      student = Roles.userIsInRole(userId, ['student']);

    return {
      user,
      student,
      tutor,
    };
  },

  getTutorStatus() {
    if (Roles.userIsInRole(Meteor.userId(), ['tutor'])) {
      return true;
    }
    return false;
  },

  renderForm() {
    if (this.data.student) {
      return <CreditCardForm user={this.data.user} />;
    } else {
      return <BankAccountForm user={this.data.user} />;
    }
  },

  render() {
    const tutor = this.getTutorStatus();
    return (
      <div className="dashboard--account">
        <UserNavigation />
        <div className="dashboard--account-wrapper">
          <div className="dashboard--account-navigation">
            <ul>
              <li><a href="/settings/payments">Payment Preferences</a></li>
              {tutor ? '' : <li><a href="/settings">Name and Photo</a></li> }
              <li><a href="/settings/lesson-history">Lesson History</a></li>
              <li><a href="/settings/transaction-history">Transaction History</a></li>
            </ul>
          </div>
          <div className="dashboard--account-content">
            <div className="icon-item">
              <div className="icon-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.07 35.62"><path d="M399.75,1415h0a1.14,1.14,0,0,0,1.13-1.13h0v-22.19a1.14,1.14,0,0,0-1.13-1.14h-4.29V1385a1.14,1.14,0,0,0-.52-1,1.13,1.13,0,0,0-1.08-.08l-15.37,6.94a1.12,1.12,0,0,0-.62.74h-0.06v22.21h0a5.63,5.63,0,0,0,5.4,5.6h16.53a1.14,1.14,0,0,0,0-2.28A1.1,1.1,0,0,1,399.75,1415Zm-3.16,2.2h-8.93v0h-4.43a3.34,3.34,0,0,1-2.93-2.2h16.3a3.37,3.37,0,0,0-.2,1.11A3.32,3.32,0,0,0,396.59,1417.19Zm-12.34-4.5,10.53-4.76a1.14,1.14,0,0,0,.67-1V1392.8h3.16v19.89H384.25Z" transform="translate(-377.82 -1383.86)" /></svg>
              </div>
              <div className="icon-item-copy">
                <h2>Payment Preferences</h2>
              </div>
            </div>
            {this.renderForm()}
          </div>
        </div>
      </div>
    );
  },
});

BankAccountForm = React.createClass({

  getInitialState() {
    return {
      updating: false,
    };
  },
  componentDidMount() {
    const self = this;
    return $('#payment').validate({
      rules: {
        accountNumber: {
          required: true,
        },
        routingNumber: {
          required: true,
          minlength: 9,
        },
      },
      messages: {
        accountNumber: {
          required: 'Please enter in a Accounting Number.',
        },
        routingNumber: {
          required: 'Please enter in a Routing Number.',
        },
      },
      submitHandler() {
        const bankAccount = {
          country: 'US',
          currency: 'usd',
          type: 'individual',
          name: $('[name="name"]').val(),
          tax_id: $('[name="taxId"]').val(),
          routing_number: $('[name="routingNumber"]').val(),
          account_number: $('[name="accountNumber"]').val(),
        };

        const submitButton = $('input[type="submit"]').val('loading');

        Meteor.call('createRecipient', bankAccount, (error, response) => {
          if (error) {
            alert(error.reason);
            submitButton.val('Resubmit Bank Account');
          } else {
            submitButton.val('Add Bank Account');
            // TODO: What is the purpose of this 'setState' call?
            // to just spin for 5 seconds after the bank account is added?
            self.setState({
              updating: true,
            });
            setTimeout(() => {
              self.setState({
                updating: false,
              });
            }, 5000);
          }
        });
      },
    });
  },

  submitForm(e) {
    e.preventDefault();
  },

  accountForm() {
    if (this.props.user.recipient) {
      return (
        <div className="dashboard--acount-form forms forms--inputs">

          <p> We currently only support direct deposit in the United States.</p>
          <p>In order to be paid with direct deposit you need to connect your bank account to our system.</p>
          <h3>Your bank account ending in: {this.props.user.recipient.last4} is currently on file with us.</h3>
        </div>
      );
    } else {
      return (
        <div className="">
          {this.state.updating ? <Notification type="success" message="Bank Account Saved!" /> : ''}
          <div className="dashboard--acount-form forms forms--inputs">

            <p> We currently only support direct deposit in the United States.</p>
            <p>In order to be paid with direct deposit you need to connect your bank account to our system:</p>
            <form id="payment" onSubmit={this.submitForm}>
              <div className="">
                <label>Full Legal Name
                  <input name="name" ref="name" required /></label>
              </div>
              <div className="">
                <label>Tax Id (SSN)
                  <input name="taxId" ref="taxId" required /></label>
              </div>
              <div className="">
                <label>Account Number
                  <input name="accountNumber" required /></label>
              </div>
              <div className="">
                <label>Routing Number
                  <input name="routingNumber" required /></label>
              </div>
              <div className="forms--input-wrapper">
                <button type="submit" className="btn btn--xlarge btn--arrow">Add Bank Account</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  },
  render() {
    return this.accountForm();
  },
});

CreditCardForm = React.createClass({
  submitForm(e) {
    e.preventDefault();
  },

  getInitialState() {
    return {
      updating: false,
    };
  },
  componentDidMount() {
    return $('#payment').validate({
      rules: {
        cardNumber: {
          creditcard: true,
          required: true,
        },
        month: {
          required: true,
        },
        year: {
          required: true,
        },
        cvc: {
          required: true,
        },
      },
      messages: {
        cardNumber: {
          creditcard: 'Please enter a valid credit card.',
          required: 'Required.',
        },
        month: {
          required: 'Required.',
        },
        year: {
          required: 'Required.',
        },
        cvc: {
          required: 'Required.',
        },
      },
      submitHandler() {
        const self = this;
        const customer = {
          card: {
            number: $('[name="cardNumber"]').val(),
            exp_month: $('[name="month"]').val(),
            exp_year: $('[name="year"]').val(),
            cvc: $('[name="cvc"]').val(),
          },
        };

        const submitButton = $('input[type="submit"]').val('loading');

        Meteor.call('createCustomer', customer, (error, response) => {
          if (error) {
            alert(error.reason);
            submitButton.val('reset');
          } else {

          }
        });
      },
    });
  },

  deleteCard(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to remove this card?') == true) {
      const user = Meteor.userId();

      Meteor.call('deleteCreditCard', user, (error, response) => {
        if (error) {
          alert(error.reason);
        } else {
          console.log(response);
        }
      });
    }
  },

  creditCardForm() {
    if (this.props.user.payment) {
      return (
        <div className="dashboard--acount-form forms forms--inputs">
          <p>Your card will be charged 24 hours after each confirmed lesson</p>
          <h3>You currently have a card on file with us: {this.props.user.payment.card.type} &mdash; {this.props.user.payment.card.lastFour}</h3>
          <a href="" className="btn btn--large" onClick={this.deleteCard}>Delete Card?</a>
        </div>
      );
    } else {
      return (
        <div className="">

          {this.state.updating ? <Notification type="success" message="Credit Card Saved!" /> : ''}
          <div className="dashboard--acount-form forms forms--inputs">
            <p>Your card will be charged 24 hours after each confirmed lesson</p>
            <form id="payment" onSubmit={this.submitForm}>
              <div className="">
                <label>Credit Card Number
                  <input name="cardNumber" required /></label>
              </div>
              <div className="dashboard--account-form-fields-wrapper">
                <div>
                  <label>Expiration
                    <div className="select-style">
                      <select name="month" required>
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                        <option value="06">06</option>
                        <option value="07">07</option>
                        <option value="08">08</option>
                        <option value="09">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select></div>
                  </label>
                </div>
                <div>
                  <label>&nbsp;
                    <div className="select-style">
                      <select name="year" required>
                        <option value="2016">2016</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                      </select></div>
                  </label>
                </div>
                <div>
                  <label>CVC
                    <input name="cvc" required /></label>
                </div>
              </div>

              <div className="forms--input-wrapper">
                <button type="submit" className="btn btn--xlarge btn--arrow">Add Card</button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  },
  render() {
    return this.creditCardForm();
  },
});

Template.creditCard.helpers({
  Payments() {
    return Payments;
  },
});
