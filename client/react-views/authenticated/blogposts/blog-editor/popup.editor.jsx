import React from 'react';
import EventHorizon from 'meteor/patrickml:event-horizon';

const PopupEditor = props =>
  <div className="popup-editor-container">
    <div className="popup-title">
      <h4>
        {'Welcome to your blog!'}
      </h4>
    </div>
    <div className="popup-paragraphs">
      <p>
        {
          `Here you can write articles about your favorite academic subjects. Anyone who joins Tutor
          App via your blog post(s) will feed into your referral credits.`
        }
      </p>
      <p>
        {
          `For example, if someone finds your article on Google, signs up and learns or teaches for
          10 hours, you'll earn $50!`
        }
      </p>
    </div>
    <div
      className="popup-close ion-close-round"
      onClick={() => EventHorizon.dispatch('UPDATE_POST_OBJECT', { showPopUp: false })}
    />
  </div>

;
export default PopupEditor;
