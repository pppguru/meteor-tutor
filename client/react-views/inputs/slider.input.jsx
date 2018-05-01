import React from 'react';
import noUiSlider from 'nouislider';

PriceSlider = React.createClass({
  getInitialState() {
    return {
      rateMin: this.props.min || 35,
      rateMax: this.props.max || 200,
    };
  },

  componentDidMount() {
    this.initSlider();
  },

  /**
   * Initializes our slider and binds the update events
   */
  initSlider() {
    // Fire the Initial Price slider
    const slider = document.getElementById('priceSlider');
    const { minDefault = 35, maxDefault = 200 } = this.props;
    // set our slider constraints
    noUiSlider.create(slider, {
      start: [minDefault, maxDefault],
      connect: true,
      step: 5,
      range: {
        min: 35,
        max: 200,
      },
    });

    // bind the event on update so we can update visually the values
    slider.noUiSlider.on('update', this.onUpdate);

    // bind the event on change so we can get the values once the user if finished
    slider.noUiSlider.on('change', this.onChange);
  },

  /**
   * Updates the state with the newest values so the users can see the new dollar amounts
   * @param {Array} values the min and max values
   */
  onUpdate(values) {
    const [rateMin, rateMax] = values;

    // update the state so we can re-render the values in the UI
    this.setState({
      rateMin: parseInt(rateMin),
      rateMax: parseInt(rateMax),
    });
  },

  /**
   * Triggered on release of the slider sending the values to the parent component
   */
  onChange(values) {
    const [rateMin, rateMax] = values;
    this.props.onChange(parseInt(rateMin, 10), parseInt(rateMax, 10));
  },

  render() {
    return (
      <div className="search--extend-type slider">
        <div id="priceSlider" />
        <div className="search--extend-type-numbers">
          <span>${this.state.rateMin}</span>
          <span>${this.state.rateMax}</span>
        </div>
      </div>
    );
  },
});
