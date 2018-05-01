import { Meteor } from 'meteor/meteor';
import { ReactMeteorData } from 'meteor/react-meteor-data';

import React from 'react';

import Reviews from '/collections/reviews';

TutorProfileReviews = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user();
    return {
      user,
    };
  },
  renderReviews() {
    if (this.props.reviews.length <= 0) {
      return (
        <p>No reviews added yet!</p>
      );
    } else {
      return this.props.reviews.map((reviewId) => {
        return <TutorProfileReviewSingle review={reviewId} key={reviewId} />;
      });
    }
  },
  changeStar(e) {
    console.log('lesgo');
    const name = e.currentTarget.getAttribute('name');
    console.log(name);
  },
  renderForm() {
    // console.log(this.data.user, this.props.tutor);
    // let canReview = this.data.user.hasHadSession;

    if (this.data.user && this.data.user.hasHadSession) {
      return this.data.user.hasHadSession.map((single, i) => {
        if (single === this.props.tutor) {
          return (
            <div key={i}>
              <div className="tutor--review-form">
                <div className="tutor--review-form-wrapper">
                  <h3>Add Review</h3>
                  <form onSubmit={this.handleSubmit}>
                    <div className="tutor--review-form-stars">
                      <div className="tutor--review-star-single">
                        <fieldset>
                          <span className="star-cb-group">
                            <input type="radio" id="communication-5" name="communication" value="5" /><label htmlFor="communication-5">5</label>
                            <input type="radio" id="communication-4" name="communication" value="4" defaultChecked="checked" /><label htmlFor="communication-4">4</label>
                            <input type="radio" id="communication-3" name="communication" value="3" /><label htmlFor="communication-3">3</label>
                            <input type="radio" id="communication-2" name="communication" value="2" /><label htmlFor="communication-2">2</label>
                            <input type="radio" id="communication-1" name="communication" value="1" /><label htmlFor="communication-1">1</label>
                            <input type="radio" id="communication-0" name="communication" value="0" className="star-cb-clear" /><label htmlFor="communication-0">0</label>
                          </span>
                        </fieldset>
                        <h4>Communication</h4>
                      </div>
                      <div className="tutor--review-star-single">
                        <fieldset>
                          <span className="star-cb-group">
                            <input type="radio" id="clarity-5" name="clarity" value="5" /><label htmlFor="clarity-5">5</label>
                            <input type="radio" id="clarity-4" name="clarity" value="4" defaultChecked="checked" /><label htmlFor="clarity-4">4</label>
                            <input type="radio" id="clarity-3" name="clarity" value="3" /><label htmlFor="clarity-3">3</label>
                            <input type="radio" id="clarity-2" name="clarity" value="2" /><label htmlFor="clarity-2">2</label>
                            <input type="radio" id="clarity-1" name="clarity" value="1" /><label htmlFor="clarity-1">1</label>
                            <input type="radio" id="clarity-0" name="clarity" value="0" className="star-cb-clear" /><label htmlFor="clarity-0">0</label>
                          </span>
                        </fieldset>
                        <h4>Clarity</h4>
                      </div>
                      <div className="tutor--review-star-single">
                        <fieldset>
                          <span className="star-cb-group">
                            <input type="radio" id="helpfulness-5" name="helpfulness" value="5" /><label htmlFor="helpfulness-5">5</label>
                            <input type="radio" id="helpfulness-4" name="helpfulness" value="4" defaultChecked="checked" /><label htmlFor="helpfulness-4">4</label>
                            <input type="radio" id="helpfulness-3" name="helpfulness" value="3" /><label htmlFor="helpfulness-3">3</label>
                            <input type="radio" id="helpfulness-2" name="helpfulness" value="2" /><label htmlFor="helpfulness-2">2</label>
                            <input type="radio" id="helpfulness-1" name="helpfulness" value="1" /><label htmlFor="helpfulness-1">1</label>
                            <input type="radio" id="helpfulness-0" name="helpfulness" value="0" className="star-cb-clear" /><label htmlFor="helpfulness-0">0</label>
                          </span>
                        </fieldset>
                        <h4>Helpfulness</h4>
                      </div>
                      <div className="tutor--review-star-single">
                        <fieldset>
                          <span className="star-cb-group">
                            <input type="radio" id="patience-5" name="patience" value="5" /><label htmlFor="patience-5">5</label>
                            <input type="radio" id="patience-4" name="patience" value="4" defaultChecked="checked" /><label htmlFor="patience-4">4</label>
                            <input type="radio" id="patience-3" name="patience" value="3" /><label htmlFor="patience-3">3</label>
                            <input type="radio" id="patience-2" name="patience" value="2" /><label htmlFor="patience-2">2</label>
                            <input type="radio" id="patience-1" name="patience" value="1" /><label htmlFor="patience-1">1</label>
                            <input type="radio" id="patience-0" name="patience" value="0" className="star-cb-clear" /><label htmlFor="patience-0">0</label>
                          </span>
                        </fieldset>
                        <h4>Patience</h4>
                      </div>
                      <div className="tutor--review-star-single">
                        <fieldset>
                          <span className="star-cb-group">
                            <input type="radio" id="professionalism-5" name="professionalism" value="5" /><label htmlFor="professionalism-5">5</label>
                            <input type="radio" id="professionalism-4" name="professionalism" value="4" defaultChecked="checked" /><label htmlFor="professionalism-4">4</label>
                            <input type="radio" id="professionalism-3" name="professionalism" value="3" /><label htmlFor="professionalism-3">3</label>
                            <input type="radio" id="professionalism-2" name="professionalism" value="2" /><label htmlFor="professionalism-2">2</label>
                            <input type="radio" id="professionalism-1" name="professionalism" value="1" /><label htmlFor="professionalism-1">1</label>
                            <input type="radio" id="professionalism-0" name="professionalism" value="0" className="star-cb-clear" /><label htmlFor="professionalism-0">0</label>
                          </span>
                        </fieldset>
                        <h4>Professionalism</h4>
                      </div>
                    </div>
                    <div className="text--block">
                      <label>Public Review
                        <textarea name="publicReview" placeholder="Your Review..." />
                      </label>
                    </div>
                    <div className="text--block">
                      <label>Private Review (Optional)
                        <textarea name="privateReview" placeholder="Your Review..." />
                      </label>
                    </div>
                    <div className="lesson-buttons">
                      <button type="submit" className="btn btn--red btn--xlarge">Add Review</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );
        }
      });
    }
  },
  render() {
    return (
      <div>
        <div className="tutor--reviews">
          <div className="tutor--reviews-wrapper">
            <div className="icon-item">
              <div className="icon-item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.38 36.58"><path d="M451.13,1184.63a1.38,1.38,0,0,1-.6-1.39,1.32,1.32,0,0,1,1.24-.77l11.58-1.69,5.19-10.51a1.34,1.34,0,0,1,1.13-.94,1.39,1.39,0,0,1,1.14.94l5.2,10.51,11.58,1.69a1.32,1.32,0,0,1,1.24.77,1.4,1.4,0,0,1-.53,1.39l-8.4,8.15,2,11.53a1.36,1.36,0,0,1-.35,1.43,1.32,1.32,0,0,1-1.47-.13l-10.35-5.43-10.36,5.43a1.33,1.33,0,0,1-1.48.13,1.36,1.36,0,0,1-.35-1.43l2-11.53Z" transform="translate(-450.49 -1169.34)" /></svg>
              </div>
              <div className="icon-item-copy">
                <h3>Reviews</h3>
              </div>
            </div>
            <div className="reviews--items">
              {this.renderReviews()}
            </div>
          </div>
        </div>
        <div className="tutor--reviews-form">
          {this.renderForm()}
        </div>
      </div>
    );
  },
});

TutorProfileReviewSingle = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const review = Reviews.findOne({ _id: this.props.review });
    const user = Meteor.users.findOne({
      _id: review.reviewer,
    }, {
      fields: {
        _id: 1,
        profile: 1,
      },
    });

    return {
      review,
      user,
    };
  },
  review() {
    console.log(this.data.review);
  },
  render() {
    userAvatar = {
      backgroundImage: `url(${this.data.user.profile.avatar})`,
    };
    return (
      <div className="tutor--reviews-single">
        <div className="tutor--reviews-single-user" style={userAvatar} />
        <div className="tutor--reviews-single-review">
          <div className="stars">
            <fieldset>
              <span className="star-cb-group">
                <input type="radio" id="5" name="" value="5" /><label htmlFor="5">5</label>
                <input type="radio" id="4" name="" value="4" defaultChecked="checked" /><label htmlFor="4">4</label>
                <input type="radio" id="3" name="" value="3" /><label htmlFor="3">3</label>
                <input type="radio" id="2" name="" value="2" /><label htmlFor="2">2</label>
                <input type="radio" id="1" name="" value="1" /><label htmlFor="1">1</label>
                <input type="radio" id="0" name="" value="0" className="star-cb-clear" /><label htmlFor="0">0</label>
              </span>
            </fieldset>
          </div>
          <div className="review">
            {this.data.review.content}
          </div>
        </div>
      </div>
    );
  },
});
