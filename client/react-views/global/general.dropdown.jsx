import React, { PropTypes } from 'react';

/**
 * The following component can be used with the followin object structure.
 * {
 *  title: String,
 *  options: [
 *    {
 *      name: String,
 *      value: Number as a string.
 *    }
 *  ],
 *  activeIndex: {
 *    name: String,
 *    value: Number as a string.
 *  },
 *  activeOption: Number as a string,
 * }
 */

const defaultState = {
  dropdownIsActive: false,
  dropdownIsVisible: false,
};

export default class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.setCurrentState = this.setCurrentState.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
  }

  /**
   * Hide dropdown block on click outside the block
   */
  componentDidMount() {
    window.addEventListener('click', this.hideDropdown, false);
  }

  /**
   * Remove click event listener on component unmount
   */
  componentWillUnmount() {
    window.removeEventListener('click', this.hideDropdown, false);
  }

  /**
   * Set state.
   */
  setCurrentState(key, value) {
    this.setState({ [key]: value });
  }

  /**
   * Stop bubbling of click event on click inside the dropdown content
   */
  stopPropagation(e) {
    e.stopPropagation();
  }

  /**
   * Toggle dropdown block visibility
  */
  toggleDropdown() {
    const { dropdownIsVisible } = this.state;
    this.props.handleDropDownToggle(!dropdownIsVisible);
    this.setCurrentState('dropdownIsVisible', !dropdownIsVisible);
  }

  /**
   * Hide dropdown block if it's not active
   */
  hideDropdown() {
    const dropdownIsActive = this.state.dropdownIsActive;
    if (!dropdownIsActive) {
      this.setCurrentState('dropdownIsVisible', false);
    }
  }

  /**
   * Make active on focus
   */
  handleFocus() {
    this.setCurrentState('dropdownIsActive', true);
  }

  /**
   * Clean up everything on blur
   */
  resetState() {
    this.setState(defaultState);
  }

  /**
   * Handle dropdown item click...
   */
  handleOptionClick(index) {
    this.props.handleOptionClick(
      {
        toggleIndex: this.props.index,
        optionIndex: index,
      }
    );
    this.toggleDropdown();
  }

  /**
   * Render DropDown Parent Item.
   */
  renderDropdown() {
    const {
      index,
      title,
      dropDownClass,
      options,
      activeIndex,
      activeOption,
      mobileClass,
    } = this.props;
    const { dropdownIsVisible } = this.state;

    return (
      <div
        className={`dropdown-toggler-container ${!mobileClass && 'relative'}`}
      >
        <ul
          className={dropDownClass}
          onBlur={this.resetState}
          onClick={this.toggleDropdown}
          onFocus={this.handleFocus}
          ref={c => this.togglerIndex = c}
          tabIndex={index}
        >
          <li className={`dropdown-toggler-title ${(activeIndex && 'active') || ''} option-${activeOption || 'inactive'}`}>
            { title }
          </li>
        </ul>
        {
          dropdownIsVisible &&
            <ul
              className="dropdown-box"
            >
              {
                options.map((o, k) =>
                  <li
                    className={`${(activeOption === o.value && 'active') || ''} option${o.value}`}
                    key={o.value}
                    onClick={() => this.handleOptionClick(o.value)}
                    onMouseDown={() => this.handleOptionClick(o.value)}
                  >
                    <span>{ o.name }</span>
                  </li>
                )
              }
            </ul>
          }
      </div>
    );
  }

  render() {
    return (
      this.renderDropdown()
    );
  }
}

DropDown.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string,
  dropDownClass: PropTypes.string,
  options: PropTypes.array,
  activeIndex: PropTypes.object,
  activeOption: PropTypes.string,
  mobileClass: PropTypes.bool,
  handleDropDownToggle: PropTypes.func,
  handleOptionClick: PropTypes.func,
};
