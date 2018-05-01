import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import React from 'react';

import DropDown from '../global/general.dropdown';

/**
 * Transform [Object] to a string url.
 * @param  Object array An array of objects.
 * @return String       Url string.
 */
const arrayObjToUrl = (array) => {
  let url = '';
  if (Array.isArray(array) && Object.keys(array[0]).length !== 0) {
    array.forEach((o) => {
      url += `${o.name}=${o.value}&`;
    });
    url = url.slice(0, -1);
  }
  return url;
};

/**
 * Transform String query into an object.
 * @param  String query A string in query format.
 * @return Object       An object transformed from a string.
 */
// TODO: Upgrade 1.4 - Switch over to ramda or lodash.
const urlToArrObj = (query) => {
  return _.map(
    _.compact(
      _.map(
        query.split('&'), o => o.split('=')
      )
    ), (o) => { return { name: o[0], value: o[1] }; }
  );
};

/**
 * Array that allows us to populate the dropdown options.
 * @type {Array}
 */
const dayOptions = [
  {
    name: 'All Day',
    value: 4,
  },
  {
    name: 'Mornings',
    value: 1,
  },
  {
    name: 'Afternoons',
    value: 2,
  },
  {
    name: 'Evenings',
    value: 3,
  },
];

/**
 * Array generated to create the parent elements of the dropdown list.
 * @type {Array}
 */
const defaultAvailabilityOptions = _.map(
  ['mon', 'tues', 'wednes', 'thurs', 'fri', 'satur', 'sun'], (o, k) => {
    return {
      day: `${o}day`,
      shortTitle: o.toUpperCase().slice(0, 3),
      dayOptions,
    };
  }
);

/**
 * Return object if Object inside array exists.
 * @param  {[Object]} array A collection.
 * @return {Boolean}        Boolean response
 */
const checkIfInAvailable = (arr, obj) => _.findWhere(arr, obj);

const getOptionIndex = (stateArray, object, subOptions) => {
  const currentObject = _.findWhere(stateArray, { name: object.day });
  if (currentObject) {
    return currentObject.value;
  }
};

const Search = React.createClass({
  getInitialState() {
    const {
      subject,
      lat,
      lng,
      rateMin,
      rateMax,
      online,
      meetingPreference,
      sort,
      zipcode,
      availability,
    } = Router.current().params.query;

    return {
      showMap: true,
      tutors: [],
      sort: sort && parseInt(sort) || 1,
      subject: subject || '',
      longitude: lng && parseFloat(lng) || Session.get('longitude') || 0,
      latitude: lat && parseFloat(lat) || Session.get('latitude') || 0,
      rateMin: rateMin && parseInt(rateMin, 10) || 35,
      rateMax: rateMax && parseInt(rateMax, 10) || 200,
      online: online === 'true' ? true : false,
      meetingPreference: meetingPreference ? parseInt(meetingPreference) : 0,
      view: 'row',
      mobileShow: false,
      locationFound: !!lat,
      queryLocationUser: !!lat,
      zipcode,
      dropdownOptions: defaultAvailabilityOptions || {},
      availability: availability ? urlToArrObj(availability) : [{}],
    };
  },

  componentDidMount() {
    // initialize the map
    this.initMap();

    // make our text inputs run on debounce so we don't query on every keyup
    this.setSubject = _.debounce(this.setSubject, 250);
    this.zipSearch = _.debounce(this.zipSearch, 250);

    const { latitude, longitude } = this.state;

    // check if we already have a location to load the map data with
    if (this.state.latitude !== 0) {
      // if we already have a location use that location to load the map for faster load times
      this.onLocateUser({ latitude, longitude });
    }
  },

  /**
   * Updates the map with tutors, current location, and stores the location for next load
   */
  onLocateUser({ latitude, longitude }) {
    // update the components state
    this.setState({ latitude, longitude });

    // store the latitude and longitude for faster load times next time
    Session.setPersistent({ latitude, longitude });

    // update the maps location
    this.map.setView([latitude, longitude], 14);

    // add the users location as a marker on the map
    this.mainMapLayer.setGeoJSON({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      properties: {
        title: 'Current Location',
        'marker-color': '#ff8888',
        'marker-symbol': 'star',
      },
    });

    // search for the tutors then add them to the map
    this.searchForTutors({
      latitude,
      longitude,
    });
  },

  /**
   * Searches for tutors with our current variables once the tutors are found updates the map
   */
  searchForTutors(
    {
      latitude,
      longitude,
      rateMin,
      rateMax,
      online,
      meetingPreference,
      subject,
      sort,
      availability,
    }
  ) {
    const params = {
      lat: latitude || this.state.latitude,
      lng: longitude || this.state.longitude,
      rateMin: rateMin || this.state.rateMin, // the lower end of rate the user is willing to page
      rateMax: rateMax || this.state.rateMax, // the higher end of rate the user is willing to page
      online: typeof online !== 'undefined' ? online : this.state.online, // search for only online users
      meetingPreference: typeof meetingPreference !== 'undefined' ? meetingPreference : this.state.meetingPreference, // meeting preference (online, in person)
      subject: subject || this.state.subject || '', // the subject the user is looking for
      sort: sort || this.state.sort, // the direction we should sort by price
      availability: availability || this.state.availability,
    };
    if (this.state.zipcode) {
      params.zipcode = this.state.zipcode;
    }
    /**
     * Function which redefines the the updated [Object] to a url string.
     * @type Array
     */
    const urlParams = _.extend(_.omit(params, 'availability'), {
      availability: arrayObjToUrl(availability || this.state.availability),
    });
    // set our params in the url so the url is shareable
    Router.go('tutors', {}, { query: urlParams });

    // call our method that will run a geo aggregation on the requested values
    Meteor.call('search/tutors', _.omit(params, 'zipcode'), (err, tutors = []) => {
      this.setState({ tutors });
      this.addTutorsToMap(tutors);
    });
  },

  /**
   * Geocodes by zipcode and updates the map
   */
  zipSearch(event) {
    const { value } = event.target;

    // update the state of the zipcode
    this.setState({ zipcode: value });

    // geocode the zipcode then update the tutors result
    Meteor.call('geoCodeZip', value, (err, res) => {
      if (!err && res) {
        const { lat, lang } = res;
        // fetch the new tutors in this area
        this.onLocateUser({ latitude: lat, longitude: lang });
      }
    });
  },

  /**
   * Gets a users location
   */
  getUsersLocation() {
    // use the native api to get the users location. This should be faster than using mapbox
    if ('geolocation' in navigator) {
    	navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { queryLocationUser, locationFound } = this.state;
        // check if we have found the users coords and if the coords already exist
      if (!locationFound && !queryLocationUser) {
      		this.onLocateUser(coords);
        this.setState({
          locationFound: true,
        });
      }
    	});
    }
  },

  /**
   * Initializes the map
   */
  initMap() {
    // set our access token to mapbox
    L.mapbox.accessToken = Meteor.settings.public.mapboxToken;

    // initialize our map
    this.map = L.mapbox.map('map', 'mapbox.streets', {
      zoomControl: false,
      maxZoom: 14,
      minZoom: 7,
    });

    // create and add a layer to the map
    this.mainMapLayer = L.mapbox.featureLayer().addTo(this.map);
    // create and add a layer to the map
    this.tutorMapLayer = L.mapbox.featureLayer().addTo(this.map);
    // onces the later has been added tell the layer how to render it's markers
    this.tutorMapLayer.on('layeradd', (e) => {
      const marker = e.layer;
      const feature = marker.feature;

      marker.setIcon(L.divIcon(feature.properties.icon));
    });

    // find the users current location
    this.getUsersLocation();
  },

  /**
   * Replaces tutors to the existing tutors layer with new ones
   */
  addTutorsToMap(tutors) {
    // create the array of marker data for the map
    const markers = tutors.map((tutor) => {
      const {
        dist: {
          calculated,
          location: [lng, lat],
        },
        profile: {
          avatar,
          firstName,
        },
        address: {
          city,
          state,
        },
        slug,
        rate,
      } = tutor;
      const url = `https://tutorapp.com/tutor/${state.toLowerCase()}/${city.toLowerCase()}/${slug}`;
      return {
        type: 'Feature',
        geometry: {
          coordinates: [
            lng,
            lat,
          ],
          type: 'Point',
        },
        properties: {
          title: `<img class="map--profile-photo" style="background-image: url(${avatar});"><br /><h4>${firstName}</h4>`,
          description: `<a href="${url}" class="btn btn--large">View Profile</a>`,
          icon: {
            className: 'map--icon',
            html: `<span class="rate">$${rate}</span>`,
            iconSize: null,
          },
        },
      };
    });
    // set the marker data on the tutors layer
    this.tutorMapLayer.setGeoJSON(markers);
  },

  /**
   * Updates the way we view the results
   */
  switchView() {
    // update the way we are viewing the results
    this.setState({ view: this.state.view === 'row' && 'grid' || 'row' });
  },

  /**
   * Updates the current price range
   */
  setPriceRange(rateMin, rateMax) {
    // update the state with the new min and max rates
    this.setState({
      rateMin, rateMax,
    });

    // search for tutors with our updated values
    this.searchForTutors({ rateMin, rateMax });
  },

  /**
   * Sets if we should search for tutors who are currently online
   */
  setOnline(event) {
    const online = event.currentTarget.checked;

    // update the state with the new online state
    this.setState({ online });

    // search for tutors with our updated values
    this.searchForTutors({ online });
  },

  /**
   * Sets the users meeting preference
   */
  setMeetingPreference(event) {
    const meetingPreference = parseInt(event.currentTarget.value);

    // update the state with the new meeting preference
    this.setState({ meetingPreference });

    // search for tutors with our updated values
    this.searchForTutors({ meetingPreference });
  },

  /**
   * Sets the subject the user is looking to learn
   */
  setSubject(event) {
    const subject = event.target.value;

    // update the state with the new subject
    this.setState({ subject });

    // search for tutors with our updated values
    this.searchForTutors({ subject });
  },

  /**
   * Gets the text for the direction we are sorting
   */
  getSortText() {
    return this.state.sort === 1 && 'price low to high' || 'price high to low';
  },

  /**
   * Toggles the direction the user would like to search
   */
  toggleSort() {
    const sort = this.state.sort * -1;
    // update the state with the new sort direction
    this.setState({ sort });

    // search for tutors with our updated values
    this.searchForTutors({ sort });
  },

  /**
   * Toggles the mobile menu
   */
  toggleMobileFilter() {
    // inverse the mobile show state
    this.setState({
      mobileShow: !this.state.mobileShow,
    });
  },

  /**
   * Handle state of availability dropdown.
   */
  handleDropDownToggle(boolean) {
    this.setState({
      availabilityDropDown: boolean,
    });
  },

  /**
   * Filters through the current query, to select the days available.
   */
  setAvailability({ toggleIndex, optionIndex }) {
    const { dropdownOptions, availability } = this.state;
    const o = {
      name: dropdownOptions[toggleIndex].day,
      value: `${_.findWhere(dropdownOptions[toggleIndex].dayOptions, { value: optionIndex }).value}`,
    };
    if (Object.keys(availability[0]).length === 0) {
      const availabilityO = { availability: [o] };
      this.setState(availabilityO);
      this.searchForTutors(availabilityO);
    } else {
      const index = availability.findIndex(obj => obj.name === o.name);
      if (index !== -1) {
        availability.splice(index, 1, o);
        const availIf = { availability };
        this.setState(availIf);
        this.searchForTutors(availIf);
      } else {
        const availElse = { availability: [...availability, o] };
        this.setState(availElse);
        this.searchForTutors(availElse);
      }
    }
  },
  /**
   * Clear out availability array so query resets.
   */
  clearAvailaility() {
    const availClear = { availability: [{}] };
    this.setState(availClear);
    this.searchForTutors(availClear);
  },
  /**
   * Stops the form from submitting
   */
  preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },

  render() {
    const {
      rateMin,
      rateMax,
      subject,
      zipSearch,
      mobileShow,
      view,
      online,
      meetingPreference,
      searchZip,
      tutors,
      sort,
      zipcode,
      dropdownOptions,
      availabilityDropDown,
    } = this.state;
    return (
      <div className="search">
        <div className="search--header">
          <form onSubmit={this.preventDefault}>
            <div className="search--input-header">
              <svg className="search--input-icon" viewBox="0 0 35.23 35.24">
                <path d="M-74.56-147.87a1.37,1.37,0,0,1,.4,1,1.52,1.52,0,0,1-.4,1.06l-2.07,2.08a1.57,1.57,0,0,1-1.06.4,1.3,1.3,0,0,1-1-.4l-7.92-7.9a14,14,0,0,1-3.78,1.8,14.6,14.6,0,0,1-4.3.63,14.26,14.26,0,0,1-5.69-1.15,15.16,15.16,0,0,1-4.69-3.13,14.46,14.46,0,0,1-3.17-4.66,14.36,14.36,0,0,1-1.14-5.73,14.27,14.27,0,0,1,1.14-5.69,14.8,14.8,0,0,1,3.17-4.68,15.23,15.23,0,0,1,4.67-3.17,14.17,14.17,0,0,1,5.7-1.16A14.36,14.36,0,0,1-89-177.4a14.7,14.7,0,0,1,4.68,3.17,15.08,15.08,0,0,1,3.13,4.68A14.25,14.25,0,0,1-80-163.86a14.7,14.7,0,0,1-.63,4.31,13.64,13.64,0,0,1-1.8,3.76l7.9,7.92h0Zm-29-16a8.5,8.5,0,0,0,.71,3.45,9,9,0,0,0,1.9,2.78,9,9,0,0,0,2.8,1.88,8.58,8.58,0,0,0,3.41.69,8.72,8.72,0,0,0,3.43-.69,8.83,8.83,0,0,0,2.79-1.88,9.15,9.15,0,0,0,1.87-2.78,8.44,8.44,0,0,0,.71-3.45,8.32,8.32,0,0,0-.71-3.41,9.42,9.42,0,0,0-1.87-2.8,8.58,8.58,0,0,0-2.79-1.9,8.71,8.71,0,0,0-3.43-.69,8.58,8.58,0,0,0-3.41.69,8.79,8.79,0,0,0-2.8,1.9,9.21,9.21,0,0,0-1.9,2.8A8.39,8.39,0,0,0-103.53-163.86Z" transform="translate(109.39 178.56)" />
              </svg>
              <input
                type="text"
                className="search--input"
                defaultValue={subject}
                placeholder="What do you want to learn today?"
                onChange={this.setSubject}
              />
              <button type="submit" className="mobile--submit">
                <svg className="search--input-icon" viewBox="0 0 35.23 35.24">
                  <path d="M-74.56-147.87a1.37,1.37,0,0,1,.4,1,1.52,1.52,0,0,1-.4,1.06l-2.07,2.08a1.57,1.57,0,0,1-1.06.4,1.3,1.3,0,0,1-1-.4l-7.92-7.9a14,14,0,0,1-3.78,1.8,14.6,14.6,0,0,1-4.3.63,14.26,14.26,0,0,1-5.69-1.15,15.16,15.16,0,0,1-4.69-3.13,14.46,14.46,0,0,1-3.17-4.66,14.36,14.36,0,0,1-1.14-5.73,14.27,14.27,0,0,1,1.14-5.69,14.8,14.8,0,0,1,3.17-4.68,15.23,15.23,0,0,1,4.67-3.17,14.17,14.17,0,0,1,5.7-1.16A14.36,14.36,0,0,1-89-177.4a14.7,14.7,0,0,1,4.68,3.17,15.08,15.08,0,0,1,3.13,4.68A14.25,14.25,0,0,1-80-163.86a14.7,14.7,0,0,1-.63,4.31,13.64,13.64,0,0,1-1.8,3.76l7.9,7.92h0Zm-29-16a8.5,8.5,0,0,0,.71,3.45,9,9,0,0,0,1.9,2.78,9,9,0,0,0,2.8,1.88,8.58,8.58,0,0,0,3.41.69,8.72,8.72,0,0,0,3.43-.69,8.83,8.83,0,0,0,2.79-1.88,9.15,9.15,0,0,0,1.87-2.78,8.44,8.44,0,0,0,.71-3.45,8.32,8.32,0,0,0-.71-3.41,9.42,9.42,0,0,0-1.87-2.8,8.58,8.58,0,0,0-2.79-1.9,8.71,8.71,0,0,0-3.43-.69,8.58,8.58,0,0,0-3.41.69,8.79,8.79,0,0,0-2.8,1.9,9.21,9.21,0,0,0-1.9,2.8A8.39,8.39,0,0,0-103.53-163.86Z" transform="translate(109.39 178.56)" />
                </svg>
              </button>
              <div className="search--extend-type search--extend-type-zip-desktop">
                <svg className="search--extend-zip-icon" viewBox="0 0 22.17 35.47">
                  <path d="M116.75-266.6a11.08,11.08,0,0,0-15.67,0,11.08,11.08,0,0,0,0,15.67s7.83,7.68,7.83,16.55c0-8.87,7.84-16.55,7.84-16.55A11.08,11.08,0,0,0,116.75-266.6Zm-7.84,12.28a4.43,4.43,0,0,1-4.43-4.43,4.43,4.43,0,0,1,4.43-4.43,4.43,4.43,0,0,1,4.44,4.43A4.43,4.43,0,0,1,108.91-254.33Z" transform="translate(-97.84 269.85)" />
                </svg>
                <input
                  type="text"
                  className="search--input-zip"
                  placeholder="Filter by Zip Code"
                  defaultValue={zipcode}
                  onChange={this.zipSearch}
                />
              </div>
            </div>
            <div className="search--filter-toggle">
              <div className="search--filter-toggle-wrapper">
                <div className="search--filter-toggle-extend">
                  <a href="" className={mobileShow ? 'open search--filter-toggle-extend-open' : 'search--filter-toggle-extend-open'} onClick={this.toggleMobileFilter}>Filter Search</a>
                </div>
                <div className="search--results-users-viewSwitcher">
                  <div className={view === 'row' ? 'active icon-list-view' : 'icon-list-view'} onClick={this.switchView}>
                    <div className="icon-list-view-toggle" />
                  </div>
                  <div className={view === 'grid' ? 'active icon-grid-view' : 'icon-grid-view'} onClick={this.switchView}>
                    <div className="icon-grid-view-toggle" />
                  </div>
                </div>
              </div>
            </div>
            <div className={mobileShow ? 'mobile--open search--extend-filters' : 'search--extend-filters'}>
              <div className="search--extend-type search--extend-type-zip">
                <svg className="search--extend-zip-icon" viewBox="0 0 22.17 35.47">
                  <title>icon_edu_location</title>
                  <path d="M116.75-266.6a11.08,11.08,0,0,0-15.67,0,11.08,11.08,0,0,0,0,15.67s7.83,7.68,7.83,16.55c0-8.87,7.84-16.55,7.84-16.55A11.08,11.08,0,0,0,116.75-266.6Zm-7.84,12.28a4.43,4.43,0,0,1-4.43-4.43,4.43,4.43,0,0,1,4.43-4.43,4.43,4.43,0,0,1,4.44,4.43A4.43,4.43,0,0,1,108.91-254.33Z" transform="translate(-97.84 269.85)" />
                </svg>
                <input
                  type="text"
                  className="search--input-zip"
                  placeholder="Filter by Zip Code"
                  defaultValue={zipcode}
                  onChange={this.zipSearch}
                />
              </div>
              <div className="search--extend-type">
                <div className="search--online-wrapper">
                  <strong>Online Now</strong>
                  <input type="checkbox" onChange={this.setOnline} checked={online} />
                </div>
              </div>
              <div className="search--extend-type">
                <div className="select-style">
                  <select
                    onChange={this.setMeetingPreference}
                    defaultValue={meetingPreference}
                  >
                    <option value="0">Online or In-Person</option>
                    <option value="1">Online Only</option>
                    <option value="2">In-Person Only</option>
                  </select>
                </div>
              </div>
              <PriceSlider
                onChange={this.setPriceRange}
                minDefault={rateMin}
                maxDefault={rateMax}
              />
              <div className="search--extend-type availability-filter">
                <span id="availability-filter-title">
                  Availability:
                </span>
                <div className="availability-container">
                  {
                      dropdownOptions.map((o, k) => (
                        <DropDown
                          id={`availableDropdown${k}`}
                          key={k}
                          title={o.shortTitle}
                          index={k}
                          options={o.dayOptions}
                          activeIndex={
                            checkIfInAvailable(this.state.availability, { name: o.day })
                          }
                          activeOption={getOptionIndex(this.state.availability, o, 'dayOptions')}
                          dropDownClass={'availability-dropdown'}
                          handleOptionClick={this.setAvailability}
                          handleDropDownToggle={this.handleDropDownToggle}
                          mobileClass={this.state.mobileShow}
                        />
                      ))
                  }
                  <div className="dropdown-toggler-container">
                    <ul className="availability-dropdown">
                      <li
                        className="dropdown-toggler-title reset"
                        onClick={this.clearAvailaility}
                      >
                        Clear
                      </li>
                    </ul>
                  </div>
                </div>
                {
                  (availabilityDropDown && mobileShow) &&
                  <div id="availabilitySpace" />
                }
              </div>
              <div className="search--extend-type search--extend-button">
                <a
                  href=""
                  className="btn btn--xlarge btn--red btn--arrow search-button"
                  onClick={this.toggleMobileFilter}
                >
                  Search tutors
                </a>
              </div>
            </div>
          </form>
        </div>
        <div className="search--results-container">
          <div id="map" className={this.state.showMap ? 'show--map search--results-map' : 'hide--map search--results-map'} />
          <div className={this.state.showMap ? 'search--results' : 'search--results full-width'}>
            <div className={`search--results-users ${this.state.view}`}>
              <div className="search--results-users-header">
                <div className="left">
                  <h5>{tutors.length} Results {subject ? `for ${subject}` : ''}</h5>
                  <h5 className="filters">
                    Filter by
                    <a href="" className={sort === 1 ? 'asc' : 'desc'} onClick={this.toggleSort}>
                      {` ${this.getSortText()}`}
                    </a>
                  </h5>
                </div>
                <div className="search--results-users-viewSwitcher">
                  <div className="icon-list-view " onClick={this.switchView}>
                    <div className="icon-list-view-toggle" />
                  </div>
                  <div className="icon-grid-view " onClick={this.switchView}>
                    <div className="icon-grid-view-toggle" onClick={this.switchView} />
                  </div>
                </div>
              </div>
              <div className="search--results-users-wrapper">
                {
                this.state.tutors.length >= 1 && (
                  this.state.tutors.map((tutor, i) => (
                    <TutorResultItem key={i} {...tutor} />
                  ))
                ) || (
                  <div className="search--results-empty">
                    <h3>This search criteria yielded no results. Please try again!</h3>
                    <img src="https://s3.amazonaws.com/tutorappllc/tutor-search-illustration.png" />
                  </div>
                )
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

Template.tutors.helpers({
  TutorSearch() {
    return Search;
  },
});
