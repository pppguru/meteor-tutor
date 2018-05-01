import { Meteor } from 'meteor/meteor';
import { Presences } from 'meteor/tmeasday:presence';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import React from 'react';
import noUiSlider from 'nouislider';
import algoliasearchHelper from 'algoliasearch-helper';
import algoliasearch from 'algoliasearch';

import Chats from '/collections/chats';
import { getUserNameById, getTutorUrl } from '/client/helpers/helpers-global';

const INDEX_NAME = 'tutorTesting_by_rate_asc';
const PARAMS = {
  facets: ['meetingPreference', 'rate', 'completedPhoto', 'completedSingleSubject', 'completedAvailiability'],
};
const client = algoliasearch(
  Meteor.settings.public.algolia.applicationId,
  Meteor.settings.public.algolia.searchOnlyKey
);

TutorSearch = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      searchValue: null,
      map: null,
      latLang: null,
      lat: null,
      lang: null,
      markers: null,
      searchPreference: 0,
      index: INDEX_NAME,
      tutors: [],
      hits: 0,
      price: 'asc',
      priceDirection: 'price low to high',
      rateLower: 35,
      zipValue: null,
      searchZip: null,
      online: 0,
      visibleMap: true,
      rateHigher: 200,
      mobileShow: false,
      view: 'row',
    };
  },

  getMeteorData() {
    const user = Meteor.user();
    return {
      user,
    };
  },

  algoliaSearch(content) {
    let map = this.state.map,
      self = this,
      oldMarkers = this.state.markers,
      lang = this.state.lang,
      lat = this.state.lat,
      newMarkers = L.mapbox.featureLayer().addTo(map);

    map.eachLayer((layer) => {
      map.removeLayer(layer);
    });

    const myLayer = L.mapbox.featureLayer().addTo(map);

    map.remove();

    L.mapbox.accessToken = Meteor.settings.public.mapboxToken;
    const newMap = L.mapbox.map('map', 'mapbox.streets', {
      zoomControl: false,
      maxZoom: 14,
      minZoom: 7,
    });


    newMap.setView([lat, lang], 14);
    myLayer.setGeoJSON({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lat, lang],
      },
      properties: {
        title: 'Current Location',
        'marker-color': '#ff8888',
        'marker-symbol': 'star',
      },
    });

    self.setState({
      hits: content.nbHits,
    });
    Session.set('hits', content.nbHits);
    Session.set('content', content);

    let i;
    const geoData = [];
    for (i = 0; i < content.hits.length; ++i) {
      const hit = content.hits[i];
      const image = hit.profile.avatar ? hit.profile.avatar : '';
      let url;
      if (hit.meta) {
        url = `https://tutorapp.com/tutor/${hit.meta.state}/${hit.meta.city}/${hit.slug}`;
      }
      const dataPoint = {
        type: 'Feature',
        geometry: {
          coordinates: [
            hit._geoloc.lng,
            hit._geoloc.lat,
          ],
          type: 'Point',
        },
        properties: {
          title: `<img class="map--profile-photo" style="background-image: url(${image});"><br /><h4>${hit.profile.firstName}</h4>`,
          description: `<a href="${url}" class="btn btn--large">View Profile</a>`,
          icon: {
            className: 'map--icon',
            html: `<span class="rate">$${hit.rate}</span>`,
            iconSize: null,
          },
        },
      };
      geoData.push(dataPoint);
      const tutorId = {
        id: hit.id,
      };
      const tutors = self.state.tutors;
      tutors.push(tutorId);
      self.setState({ tutors });
      Session.set('tutors', tutors);
    }
    newMarkers.on('layeradd', (e) => {
      let marker = e.layer,
        feature = marker.feature;

      marker.setIcon(L.divIcon(feature.properties.icon));
    });
    newMarkers.setGeoJSON(geoData).addTo(newMap);
    this.setState({
      map: newMap,
      markers: newMarkers,
    });
  },

  searchTutors(e) {
    e.preventDefault();

    let map = this.state.map,
      latLang = this.state.latLang,
      self = this,
      oldMarkers = this.state.markers,
      zip = this.zip.value;

    if (oldMarkers !== null) {
      map.removeLayer(oldMarkers);
    }


    this.setState({
      searchValue: this.search.value,
      tutors: [],
      mobileShow: false,
    });
    Session.set('searchValue', this.search.value);

    const algoliaHelper = algoliasearchHelper(client, self.state.index, PARAMS);
    const zipSearch = zip ? zip : this.zipDesktop.value;
    if (zipSearch) {
      Meteor.call('geoCodeZip', zipSearch, (err, response) => {
        if (err) {
          if (self.state.searchPreference === 0) {
            algoliaHelper.setQueryParameter('aroundLatLng', latLang)
              .setQueryParameter('hitsPerPage', 150)
              .setQuery(this.search.value)
              .addNumericRefinement('meetingPreference', '<=', 2)
              .addNumericRefinement('completedPhoto', '=', 1)
              .addNumericRefinement('completedSingleSubject', '=', 1)
              .addNumericRefinement('completedAvailiability', '=', 1)
              .addNumericRefinement('online', '>=', self.state.online)
              .addNumericRefinement('rate', '>=', self.state.rateLower)
              .addNumericRefinement('rate', '<=', self.state.rateHigher)
              .search();
          } else {
            algoliaHelper.setQueryParameter('aroundLatLng', latLang)
              .setQueryParameter('hitsPerPage', 150)
              .setQuery(this.search.value)
              .addNumericRefinement('meetingPreference', '=', self.state.searchPreference)
              .addNumericRefinement('completedPhoto', '=', 1)
              .addNumericRefinement('completedSingleSubject', '=', 1)
              .addNumericRefinement('completedAvailiability', '=', 1)
              .addNumericRefinement('online', '>=', self.state.online)
              .addNumericRefinement('rate', '>=', self.state.rateLower)
              .addNumericRefinement('rate', '<=', self.state.rateHigher)
              .search();
          }
        } else {
          Session.set('zipValue', response);
          if (self.state.searchPreference === 0) {
            algoliaHelper.setQueryParameter('aroundLatLng', `${response.lat}, ${response.lang}`)
              .setQueryParameter('hitsPerPage', 150)
              .setQuery(this.search.value)
              .addNumericRefinement('meetingPreference', '<=', 2)
              .addNumericRefinement('completedPhoto', '=', 1)
              .addNumericRefinement('completedSingleSubject', '=', 1)
              .addNumericRefinement('completedAvailiability', '=', 1)
              .addNumericRefinement('online', '>=', self.state.online)
              .addNumericRefinement('rate', '>=', self.state.rateLower)
              .addNumericRefinement('rate', '<=', self.state.rateHigher)
              .search();
            self.setState({
              latLang: `${response.lat}, ${response.lang}`,
              lat: response.lat,
              lang: response.lang,
            });
          } else {
            algoliaHelper.setQueryParameter('aroundLatLng', `${response.lat}, ${response.lang}`)
              .setQueryParameter('hitsPerPage', 150)
              .setQuery(this.search.value)
              .addNumericRefinement('meetingPreference', '=', self.state.searchPreference)
              .addNumericRefinement('completedPhoto', '=', 1)
              .addNumericRefinement('completedSingleSubject', '=', 1)
              .addNumericRefinement('completedAvailiability', '=', 1)
              .addNumericRefinement('online', '>=', self.state.online)
              .addNumericRefinement('rate', '>=', self.state.rateLower)
              .addNumericRefinement('rate', '<=', self.state.rateHigher)
              .search();

            self.setState({
              latLang: `${response.lat}, ${response.lang}`,
              lat: response.lat,
              lang: response.lang,
            });
          }

          self.setState({
            latLang: `${response.lat}, ${response.lang}`,
          });
        }
      });
    } else if (self.state.searchPreference === 0) {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
          .setQueryParameter('hitsPerPage', 150)
          .setQuery(this.search.value)
          .addNumericRefinement('meetingPreference', '<=', 2)
          .addNumericRefinement('completedPhoto', '=', 1)
          .addNumericRefinement('completedSingleSubject', '=', 1)
          .addNumericRefinement('completedAvailiability', '=', 1)
          .addNumericRefinement('online', '>=', self.state.online)
          .addNumericRefinement('rate', '>=', self.state.rateLower)
          .addNumericRefinement('rate', '<=', self.state.rateHigher)
          .search();
    } else {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
          .setQueryParameter('hitsPerPage', 150)
          .setQuery(this.search.value)
          .addNumericRefinement('meetingPreference', '<=', self.state.searchPreference)
          .addNumericRefinement('completedPhoto', '=', 1)
          .addNumericRefinement('completedSingleSubject', '=', 1)
          .addNumericRefinement('completedAvailiability', '=', 1)
          .addNumericRefinement('online', '>=', self.state.online)
          .addNumericRefinement('rate', '>=', self.state.rateLower)
          .addNumericRefinement('rate', '<=', self.state.rateHigher)
          .search();
    }

    algoliaHelper.on('result', (content, state) => {
      // Update the Search
      self.algoliaSearch(content);
    });
  },

  componentDidMount() {
    let lat = Session.get('lat'),
      lang = Session.get('lang'),
      hits = Session.get('hits'),
      content = Session.get('content'),
      online = Session.get('online'),
      rateLower = Session.get('rateLower'),
      rateHigher = Session.get('rateHigher'),
      index = Session.get('index'),
      price = Session.get('price'),
      priceDirection = Session.get('priceDirection'),
      tutors = Session.get('tutors'),
      searchValue = Session.get('searchValue'),
      zipValue = Session.get('zipValue'),
      searchPreference = Session.get('searchPreference');

    L.mapbox.accessToken = Meteor.settings.public.mapboxToken;
    const map = L.mapbox.map('map', 'mapbox.streets', {
      zoomControl: false,
      maxZoom: 14,
      minZoom: 7,
    });

    const myLayer = L.mapbox.featureLayer().addTo(map);
    const markers = L.mapbox.featureLayer().addTo(map);
    const self = this;

    if (!navigator.geolocation) {
      console.log('No Geolocation supported');
    } else if (Session.get('forceSearch') === true) {
      self.setState({
        searchValue: searchValue ? searchValue : self.state.searchValue,
      });
      map.locate();

      Session.set('forceSearch', false);
    } else if (lat !== undefined && lang !== undefined && content !== undefined) {
        // Handle Return Search componentDidMount Stuff!!!
      map.setView([lat, lang], 14);
      myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lang, lat],
        },
        properties: {
          title: 'Current Location',
          'marker-color': '#ff8888',
          'marker-symbol': 'star',
        },
      });
      const algoliaHelper = algoliasearchHelper(client, self.state.index, PARAMS);
      self.setState({
        searchPreference: searchPreference ? searchPreference : self.state.searchPreference,
        lat: lat ? lat : self.state.lat,
        lang: lang ? lang : self.state.lang,
        latLang: `${lat}, ${lang}`,
        rateHigher: rateHigher ? rateHigher : self.state.rateHigher,
        rateLower: rateLower ? rateLower : self.state.rateLower,
        online: online ? online : self.state.online,
        tutors: tutors ? tutors : self.state.tutors,
        index: index ? index : self.state.index,
        price: price ? price : self.state.price,
        priceDirection: priceDirection ? priceDirection : self.state.priceDirection,
        searchZip: zipValue ? zipValue : self.state.searchZip,
        searchValue: searchValue ? searchValue : self.state.searchValue,
        hits,
      });

      let i;
      const geoData = [];
      for (i = 0; i < content.hits.length; ++i) {
        const hit = content.hits[i];
        const image = hit.profile.avatar ? hit.profile.avatar : '';
        let url;
        if (hit.meta) {
          url = `https://tutorapp.com/tutor/${hit.meta.state}/${hit.meta.city}/${hit.slug}`;
        }
        const dataPoint = {
          type: 'Feature',
          geometry: {
            coordinates: [
              hit._geoloc.lng,
              hit._geoloc.lat,
            ],
            type: 'Point',
          },
          properties: {
            title: `<img class="map--profile-photo" style="background-image: url(${image});"><br /><h4>${hit.profile.firstName}</h4>`,
            description: `<a href="${url}" class="btn btn--large">View Profile</a>`,
            icon: {
              className: 'map--icon',
              html: `<span class="rate">$${hit.rate}</span>`,
              iconSize: null,
            },
          },
        };
        geoData.push(dataPoint);
        const tutorId = {
          id: hit.id,
        };
        const tutors = self.state.tutors;
        tutors.push(tutorId);
        self.setState({ tutors });
      }
      markers.on('layeradd', (e) => {
        let marker = e.layer,
          feature = marker.feature;
        marker.setIcon(L.divIcon(feature.properties.icon));
      });
      markers.setGeoJSON(geoData).addTo(map);
    } else {
      self.setState({
        searchValue: searchValue ? searchValue : self.state.searchValue,
      });
      map.locate();
    }

    map.on('locationfound', (e) => {
      // map.fitBounds(e.bounds);
      map.setView([e.latlng.lat, e.latlng.lng], 14);
      myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [e.latlng.lng, e.latlng.lat],
        },
        properties: {
          title: 'Current Location',
          'marker-color': '#ff8888',
          'marker-symbol': 'star',
        },
      });
      const latLang = `${e.latlng.lat},${e.latlng.lng}`;
      self.setState({
        latLang,
        lat: e.latlng.lat,
        lang: e.latlng.lng,
      });

      Session.set('latLang', latLang);
      Session.set('lat', e.latlng.lat);
      Session.set('lang', e.latlng.lng);


      const algoliaHelper = algoliasearchHelper(client, self.state.index, PARAMS);

      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
        .setQueryParameter('hitsPerPage', 150)
        .setQuery(self.state.searchValue)
        .addNumericRefinement('meetingPreference', '<=', 2)
        .addNumericRefinement('completedPhoto', '=', 1)
        .addNumericRefinement('completedSingleSubject', '=', 1)
        .addNumericRefinement('completedAvailiability', '=', 1)
        .addNumericRefinement('online', '>=', self.state.online)
        .addNumericRefinement('rate', '>=', self.state.rateLower)
        .addNumericRefinement('rate', '<=', self.state.rateHigher)
        .search();

      algoliaHelper.on('result', (content, state) => {
        self.setState({
          hits: content.nbHits,
        });

        Session.set('hits', content.nbHits);
        Session.set('content', content);
        let i;
        const geoData = [];
        for (i = 0; i < content.hits.length; ++i) {
          const hit = content.hits[i];
          const image = hit.profile.avatar ? hit.profile.avatar : '';
          let url;
          if (hit.meta) {
            url = `https://tutorapp.com/tutor/${hit.meta.state}/${hit.meta.city}/${hit.slug}`;
          }
          const dataPoint = {
            type: 'Feature',
            geometry: {
              coordinates: [
                hit._geoloc.lng,
                hit._geoloc.lat,
              ],
              type: 'Point',
            },
            properties: {
              title: `<img class="map--profile-photo" style="background-image: url(${image});"><br /><h4>${hit.profile.firstName}</h4>`,
              description: `<a href="${url}" class="btn btn--large">View Profile</a>`,
              icon: {
                className: 'map--icon',
                html: `<span class="rate">$${hit.rate}</span>`,
                iconSize: null,
              },
            },
          };
          geoData.push(dataPoint);
          const tutorId = {
            id: hit.id,
          };
          const tutors = self.state.tutors;
          tutors.push(tutorId);
          self.setState({ tutors });
          Session.set('tutors', tutors);
        }
        markers.on('layeradd', (e) => {
          let marker = e.layer,
            feature = marker.feature;
          marker.setIcon(L.divIcon(feature.properties.icon));
        });
        markers.setGeoJSON(geoData).addTo(map);
      });

      self.setState({
        markers,
      });
    });

    map.on('locationerror', () => {
      const e = {
        latlng: {
          lat: 40.7128,
          lng: -74.0059,
        },
      };
      map.setView([e.latlng.lat, e.latlng.lng], 14);
      myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [e.latlng.lng, e.latlng.lat],
        },
        properties: {
          title: 'Current Location',
          'marker-color': '#ff8888',
          'marker-symbol': 'star',
        },
      });
      const latLang = `${e.latlng.lat}, ${e.latlng.lng}`;
      self.setState({
        latLang,
        lat: e.latlng.lat,
        lang: e.latlng.lng,
      });

      self.setState({
        visibleMap: false,
      });
      const algoliaHelper = algoliasearchHelper(client, self.state.index, PARAMS);
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
        .setQueryParameter('hitsPerPage', 150)
        .setQuery(self.state.searchValue)
        .addNumericRefinement('meetingPreference', '<=', 2)
        .addNumericRefinement('completedPhoto', '=', 1)
        .addNumericRefinement('completedSingleSubject', '=', 1)
        .addNumericRefinement('completedAvailiability', '=', 1)
        .addNumericRefinement('online', '>=', self.state.online)
        .addNumericRefinement('rate', '>=', self.state.rateLower)
        .addNumericRefinement('rate', '<=', self.state.rateHigher)
        .search();

      algoliaHelper.on('result', (content, state) => {
        self.setState({
          hits: content.nbHits,
        });
        Session.set('hits', content.nbHits);
        Session.set('content', content);
        let i;
        const geoData = [];
        for (i = 0; i < content.hits.length; ++i) {
          const hit = content.hits[i];
          const image = hit.profile.avatar ? hit.profile.avatar : '';
          let url;
          if (hit.meta) {
            url = `https://tutorapp.com/tutor/${hit.meta.state}/${hit.meta.city}/${hit.slug}`;
          }
          const dataPoint = {
            type: 'Feature',
            geometry: {
              coordinates: [
                hit._geoloc.lng,
                hit._geoloc.lat,
              ],
              type: 'Point',
            },
            properties: {
              title: `<img class="map--profile-photo" style="background-image: url(${image});"><br /><h4>${hit.profile.firstName}</h4>`,
              description: `<a href="${url}" class="btn btn--large">View Profile</a>`,
              icon: {
                className: 'map--icon',
                html: `<span class="rate">$${hit.rate}</span>`,
                iconSize: null,
              },
            },
          };
          geoData.push(dataPoint);
          const tutorId = {
            id: hit.id,
          };
          const tutors = self.state.tutors;
          tutors.push(tutorId);
          self.setState({ tutors });
          Session.set('tutors', tutors);
        }
        markers.on('layeradd', (e) => {
          let marker = e.layer,
            feature = marker.feature;
          marker.setIcon(L.divIcon(feature.properties.icon));
        });
        markers.setGeoJSON(geoData).addTo(map);
      });

      self.setState({
        markers,
      });
    });

    this.setState({
      map,
    });

    // Fire the Initial Price slider
    const slider = document.getElementById('priceSlider');

    noUiSlider.create(slider, {
    	start: [35, 200],
    	connect: true,
      step: 5,
    	range: {
    		min: 35,
    		max: 200,
    	},
    });

    slider.noUiSlider.on('update', (values, handle) => {
      if (self.state.map) {
        if (handle) {
          self.updatePrice(values);
        } else {
          self.updatePrice(values);
        }
      }
    });

    window.addEventListener('resize', () => {
      self.setState({
        mobileShow: false,
      });
    });
  },

  updatePrice(values) {
    let map = this.state.map,
      latLang = this.state.latLang,
      self = this,
      oldMarkers = this.state.markers;

    this.setState({
      rateLower: parseInt(values[0]),
      rateHigher: parseInt(values[1]),
      tutors: [],
    });

    Session.set('rateLower', parseInt(values[0]));
    Session.set('rateHigher', parseInt(values[1]));

    const algoliaHelper = algoliasearchHelper(client, self.state.index, PARAMS);
    if (this.state.searchPreference === 0) {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
        .setQueryParameter('hitsPerPage', 150)
        .setQuery(this.search.value)
        .addNumericRefinement('meetingPreference', '<=', 2)
        .addNumericRefinement('completedPhoto', '=', 1)
        .addNumericRefinement('completedSingleSubject', '=', 1)
        .addNumericRefinement('completedAvailiability', '=', 1)
        .addNumericRefinement('online', '>=', this.state.online)
        .addNumericRefinement('rate', '>=', parseInt(values[0]))
        .addNumericRefinement('rate', '<=', parseInt(values[1]))
        .search();
    } else {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
        .setQueryParameter('hitsPerPage', 150)
        .setQuery(this.search.value)
        .addNumericRefinement('meetingPreference', '=', this.state.searchPreference)
        .addNumericRefinement('completedPhoto', '=', 1)
        .addNumericRefinement('completedSingleSubject', '=', 1)
        .addNumericRefinement('completedAvailiability', '=', 1)
        .addNumericRefinement('online', '>=', this.state.online)
        .addNumericRefinement('rate', '>=', parseInt(values[0]))
        .addNumericRefinement('rate', '<=', parseInt(values[1]))
        .search();
    }

    algoliaHelper.on('result', (content, state) => {
      // Update the Search
      self.algoliaSearch(content);
    });
  },

  setPreference(e) {
    let map = this.state.map,
      latLang = this.state.latLang,
      self = this,
      oldMarkers = this.state.markers;


    if (oldMarkers !== null) {
      map.removeLayer(oldMarkers);
    }

    if (e.currentTarget.value === '1') {
      this.setState({
        visibleMap: false,
      });
    } else {
      this.setState({
        visibleMap: true,
      });
    }

    Session.set('searchPreference', e.currentTarget);

    this.setState({
      searchValue: this.search.value,
      tutors: [],
      searchPreference: e.currentTarget.value,
    });

    const algoliaHelper = algoliasearchHelper(client, self.state.index, PARAMS);

    if (e.currentTarget.value === 0) {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
        .setQueryParameter('hitsPerPage', 150)
        .setQuery(this.search.value)
        .addNumericRefinement('meetingPreference', '<=', 2)
        .addNumericRefinement('completedPhoto', '=', 1)
        .addNumericRefinement('completedSingleSubject', '=', 1)
        .addNumericRefinement('completedAvailiability', '=', 1)
        .addNumericRefinement('online', '>=', self.state.online)
        .addNumericRefinement('rate', '>=', self.state.rateLower)
        .addNumericRefinement('rate', '<=', self.state.rateHigher)
        .search();
    } else {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
          .setQueryParameter('hitsPerPage', 150)
          .setQuery(this.search.value)
          .addNumericRefinement('meetingPreference', '=', e.currentTarget.value)
          .addNumericRefinement('completedPhoto', '=', 1)
          .addNumericRefinement('completedSingleSubject', '=', 1)
          .addNumericRefinement('completedAvailiability', '=', 1)
          .addNumericRefinement('online', '>=', self.state.online)
          .addNumericRefinement('rate', '>=', self.state.rateLower)
          .addNumericRefinement('rate', '<=', self.state.rateHigher)
          .search();
    }

    algoliaHelper.on('result', (content, state) => {
      // Update the Search
      self.algoliaSearch(content);
    });
  },


  setOnline(e) {
    let online = 0;
    if (e.currentTarget.checked) {
      online = 1;
    }

    let map = this.state.map,
      latLang = this.state.latLang,
      self = this,
      oldMarkers = this.state.markers;


    if (oldMarkers !== null) {
      map.removeLayer(oldMarkers);
    }

    this.setState({
      searchValue: this.search.value,
      tutors: [],
      online,
    });

    Session.set('online', online);

    const algoliaHelper = algoliasearchHelper(client, self.state.index, PARAMS);

    if (self.state.searchPreference === 0) {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
        .setQueryParameter('hitsPerPage', 150)
        .setQuery(this.search.value)
        .addNumericRefinement('meetingPreference', '<=', 2)
        .addNumericRefinement('completedPhoto', '=', 1)
        .addNumericRefinement('completedSingleSubject', '=', 1)
        .addNumericRefinement('completedAvailiability', '=', 1)
        .addNumericRefinement('online', '>=', online)
        .addNumericRefinement('rate', '>=', self.state.rateLower)
        .addNumericRefinement('rate', '<=', self.state.rateHigher)
        .search();
    } else {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
          .setQueryParameter('hitsPerPage', 150)
          .setQuery(this.search.value)
          .addNumericRefinement('meetingPreference', '=', self.state.searchPreference)
          .addNumericRefinement('completedPhoto', '=', 1)
          .addNumericRefinement('completedSingleSubject', '=', 1)
          .addNumericRefinement('completedAvailiability', '=', 1)
          .addNumericRefinement('online', '>=', online)
          .addNumericRefinement('rate', '>=', self.state.rateLower)
          .addNumericRefinement('rate', '<=', self.state.rateHigher)
          .search();
    }

    algoliaHelper.on('result', (content, state) => {
      // Update the Search
      self.algoliaSearch(content);
    });
  },

  renderTutors() {
    return this.state.tutors.map((tutor, i) => {
      return <TutorResult key={i} tutorId={tutor.id} />;
    });
  },
  switchView() {
    this.setState({ view: this.state.view === 'row' ? 'grid' : 'row' });
  },
  toggleMobileFilter() {
    this.setState({ mobileShow: this.state.mobileShow === false ? true : false });
  },
  switchIndex(e) {
    e.preventDefault();
    // Switch the index for the search
    let map = this.state.map,
      latLang = this.state.latLang,
      self = this,
      oldMarkers = this.state.markers;


    if (oldMarkers !== null) {
      map.removeLayer(oldMarkers);
    }

    this.setState({
      searchValue: this.search.value,
      tutors: [],
      price: this.state.price === 'asc' ? 'desc' : 'asc',
      priceDirection: this.state.priceDirection === 'price low to high' ? 'price high to low' : 'price low to high',
      index: this.state.index === 'tutorTesting_by_rate_asc' ? 'tutorTesting_by_rate_desc' : 'tutorTesting_by_rate_asc',
    });

    Session.set('price', this.state.price === 'asc' ? 'desc' : 'asc');
    Session.set('priceDirection', this.state.priceDirection === 'price low to high' ? 'price high to low' : 'price low to high');
    Session.set('index', this.state.index === 'tutorTesting_by_rate_asc' ? 'tutorTesting_by_rate_desc' : 'tutorTesting_by_rate_asc');
    const newIndex = this.state.index === 'tutorTesting_by_rate_asc' ? 'tutorTesting_by_rate_desc' : 'tutorTesting_by_rate_asc';
    const algoliaHelper = algoliasearchHelper(client, newIndex, PARAMS);

    if (self.state.searchPreference === 0) {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
        .setQueryParameter('hitsPerPage', 150)
        .setQuery(this.search.value)
        .addNumericRefinement('meetingPreference', '<=', 2)
        .addNumericRefinement('completedPhoto', '=', 1)
        .addNumericRefinement('completedSingleSubject', '=', 1)
        .addNumericRefinement('completedAvailiability', '=', 1)
        .addNumericRefinement('online', '>=', self.state.online)
        .addNumericRefinement('rate', '>=', self.state.rateLower)
        .addNumericRefinement('rate', '<=', self.state.rateHigher)
        .search();
    } else {
      algoliaHelper.setQueryParameter('aroundLatLng', latLang)
          .setQueryParameter('hitsPerPage', 150)
          .setQuery(this.search.value)
          .addNumericRefinement('meetingPreference', '=', self.state.searchPreference)
          .addNumericRefinement('completedPhoto', '=', 1)
          .addNumericRefinement('completedSingleSubject', '=', 1)
          .addNumericRefinement('completedAvailiability', '=', 1)
          .addNumericRefinement('online', '>=', self.state.online)
          .addNumericRefinement('rate', '>=', self.state.rateLower)
          .addNumericRefinement('rate', '<=', self.state.rateHigher)
          .search();
    }

    algoliaHelper.on('result', (content, state) => {
      // Update the Search
      self.algoliaSearch(content);
    });
  },
  priceFilter() {
    return (
      <h5 className="filters">Filter by <a href="" className={this.state.price} onClick={this.switchIndex}>{this.state.priceDirection}</a></h5>
    );
  },

  render() {
    return (
      <div className="search">
        <div className="search--header">
          <form onSubmit={this.searchTutors}>
            <div className="search--input-header">
              <svg className="search--input-icon" viewBox="0 0 35.23 35.24"><path d="M-74.56-147.87a1.37,1.37,0,0,1,.4,1,1.52,1.52,0,0,1-.4,1.06l-2.07,2.08a1.57,1.57,0,0,1-1.06.4,1.3,1.3,0,0,1-1-.4l-7.92-7.9a14,14,0,0,1-3.78,1.8,14.6,14.6,0,0,1-4.3.63,14.26,14.26,0,0,1-5.69-1.15,15.16,15.16,0,0,1-4.69-3.13,14.46,14.46,0,0,1-3.17-4.66,14.36,14.36,0,0,1-1.14-5.73,14.27,14.27,0,0,1,1.14-5.69,14.8,14.8,0,0,1,3.17-4.68,15.23,15.23,0,0,1,4.67-3.17,14.17,14.17,0,0,1,5.7-1.16A14.36,14.36,0,0,1-89-177.4a14.7,14.7,0,0,1,4.68,3.17,15.08,15.08,0,0,1,3.13,4.68A14.25,14.25,0,0,1-80-163.86a14.7,14.7,0,0,1-.63,4.31,13.64,13.64,0,0,1-1.8,3.76l7.9,7.92h0Zm-29-16a8.5,8.5,0,0,0,.71,3.45,9,9,0,0,0,1.9,2.78,9,9,0,0,0,2.8,1.88,8.58,8.58,0,0,0,3.41.69,8.72,8.72,0,0,0,3.43-.69,8.83,8.83,0,0,0,2.79-1.88,9.15,9.15,0,0,0,1.87-2.78,8.44,8.44,0,0,0,.71-3.45,8.32,8.32,0,0,0-.71-3.41,9.42,9.42,0,0,0-1.87-2.8,8.58,8.58,0,0,0-2.79-1.9,8.71,8.71,0,0,0-3.43-.69,8.58,8.58,0,0,0-3.41.69,8.79,8.79,0,0,0-2.8,1.9,9.21,9.21,0,0,0-1.9,2.8A8.39,8.39,0,0,0-103.53-163.86Z" transform="translate(109.39 178.56)" /></svg>
              <input type="text" ref={c => this.search = c} className="search--input" defaultValue={this.state.searchValue} placeholder="What do you want to learn today?" />
              <button type="submit" className="mobile--submit">
                <svg className="search--input-icon" viewBox="0 0 35.23 35.24"><path d="M-74.56-147.87a1.37,1.37,0,0,1,.4,1,1.52,1.52,0,0,1-.4,1.06l-2.07,2.08a1.57,1.57,0,0,1-1.06.4,1.3,1.3,0,0,1-1-.4l-7.92-7.9a14,14,0,0,1-3.78,1.8,14.6,14.6,0,0,1-4.3.63,14.26,14.26,0,0,1-5.69-1.15,15.16,15.16,0,0,1-4.69-3.13,14.46,14.46,0,0,1-3.17-4.66,14.36,14.36,0,0,1-1.14-5.73,14.27,14.27,0,0,1,1.14-5.69,14.8,14.8,0,0,1,3.17-4.68,15.23,15.23,0,0,1,4.67-3.17,14.17,14.17,0,0,1,5.7-1.16A14.36,14.36,0,0,1-89-177.4a14.7,14.7,0,0,1,4.68,3.17,15.08,15.08,0,0,1,3.13,4.68A14.25,14.25,0,0,1-80-163.86a14.7,14.7,0,0,1-.63,4.31,13.64,13.64,0,0,1-1.8,3.76l7.9,7.92h0Zm-29-16a8.5,8.5,0,0,0,.71,3.45,9,9,0,0,0,1.9,2.78,9,9,0,0,0,2.8,1.88,8.58,8.58,0,0,0,3.41.69,8.72,8.72,0,0,0,3.43-.69,8.83,8.83,0,0,0,2.79-1.88,9.15,9.15,0,0,0,1.87-2.78,8.44,8.44,0,0,0,.71-3.45,8.32,8.32,0,0,0-.71-3.41,9.42,9.42,0,0,0-1.87-2.8,8.58,8.58,0,0,0-2.79-1.9,8.71,8.71,0,0,0-3.43-.69,8.58,8.58,0,0,0-3.41.69,8.79,8.79,0,0,0-2.8,1.9,9.21,9.21,0,0,0-1.9,2.8A8.39,8.39,0,0,0-103.53-163.86Z" transform="translate(109.39 178.56)" /></svg></button>
              <div className="search--extend-type search--extend-type-zip-desktop">
                <svg className="search--extend-zip-icon" viewBox="0 0 22.17 35.47"><title>icon_edu_location</title><path d="M116.75-266.6a11.08,11.08,0,0,0-15.67,0,11.08,11.08,0,0,0,0,15.67s7.83,7.68,7.83,16.55c0-8.87,7.84-16.55,7.84-16.55A11.08,11.08,0,0,0,116.75-266.6Zm-7.84,12.28a4.43,4.43,0,0,1-4.43-4.43,4.43,4.43,0,0,1,4.43-4.43,4.43,4.43,0,0,1,4.44,4.43A4.43,4.43,0,0,1,108.91-254.33Z" transform="translate(-97.84 269.85)" /></svg>
                <input type="text" ref={c => this.zipDesktop = c} className="search--input-zip" placeholder="Filter by Zip Code" defaultValue={this.state.searchZip} />
              </div>
            </div>
            <div className="search--filter-toggle">
              <div className="search--filter-toggle-wrapper">
                <div className="search--filter-toggle-extend">
                  <a href="" className={this.state.mobileShow ? 'open search--filter-toggle-extend-open' : 'search--filter-toggle-extend-open'} onClick={this.toggleMobileFilter}>Filter Search</a>
                </div>
                <div className="search--results-users-viewSwitcher">
                  <div className={this.state.view === 'row' ? 'active icon-list-view' : 'icon-list-view'} onClick={this.switchView}>
                    <div className="icon-list-view-toggle" />
                  </div>
                  <div className={this.state.view === 'grid' ? 'active icon-grid-view' : 'icon-grid-view'} onClick={this.switchView}>
                    <div className="icon-grid-view-toggle" onClick={this.switchView} />
                  </div>
                </div>
              </div>
            </div>
            <div className={this.state.mobileShow ? 'mobile--open search--extend-filters' : 'search--extend-filters'}>
              <div className="search--extend-type search--extend-type-zip">
                <svg className="search--extend-zip-icon" viewBox="0 0 22.17 35.47"><title>icon_edu_location</title><path d="M116.75-266.6a11.08,11.08,0,0,0-15.67,0,11.08,11.08,0,0,0,0,15.67s7.83,7.68,7.83,16.55c0-8.87,7.84-16.55,7.84-16.55A11.08,11.08,0,0,0,116.75-266.6Zm-7.84,12.28a4.43,4.43,0,0,1-4.43-4.43,4.43,4.43,0,0,1,4.43-4.43,4.43,4.43,0,0,1,4.44,4.43A4.43,4.43,0,0,1,108.91-254.33Z" transform="translate(-97.84 269.85)" /></svg>
                <input type="text" ref={c => this.zip = c} className="search--input-zip" placeholder="Filter by Zip Code" defaultValue={this.state.searchZip} />
              </div>
              <div className="search--extend-type">
                <div className="search--online-wrapper">
                  <strong>Online Now</strong><input type="checkbox" onChange={this.setOnline} defaultValue={this.state.online} />
                </div>
              </div>
              <div className="search--extend-type">
                <div className="select-style">
                  <select ref={c => this.tutorType = c} onChange={this.setPreference} defaultValue={this.state.searchPreference}>
                    <option value="0">Online or In-Person</option>
                    <option value="1">Online Only</option>
                    <option value="2">In-Person Only</option>
                  </select>
                </div>
              </div>
              <div className="search--extend-type slider">
                <div id="priceSlider" />
                <div className="search--extend-type-numbers">
                  <span>${this.state.rateLower}</span><span>${this.state.rateHigher}</span>
                </div>
              </div>
              <div className="search--extend-type search--extend-button">
                <button type="submit" className="btn btn--xlarge btn--red btn--arrow search-button">Search tutors</button>
              </div>
            </div>
          </form>
        </div>
        <div className="search--results-container">
          <div id="map" className={this.state.visibleMap ? 'show--map search--results-map' : 'hide--map search--results-map'} />
          <div className={this.state.visibleMap ? 'search--results' : 'search--results full-width'}>
            <div className={`search--results-users ${this.state.view}`}>
              <div className="search--results-users-header">
                <div className="left">
                  <h5>{this.state.hits} Results {this.state.searchValue ? `for ${this.state.searchValue}` : ''}</h5>
                  {this.priceFilter()}
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
                {this.state.hits >= 1 ?
                this.renderTutors()
                : <div className="search--results-empty"><h3>This search criteria yielded no results. Please try again!</h3>
                  <img src="https://s3.amazonaws.com/tutorappllc/tutor-search-illustration.png" />
                </div>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

TutorResult = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const userId = Meteor.userId();
    const tutor = Meteor.users.findOne({ _id: this.props.tutorId });

    let student = false;
    if (this.props.tutorId !== userId) {
      if (Roles.userIsInRole(userId, ['student'])) {
        student = true;
      }
    }
    return {
      tutor,
      student,
    };
  },
  tutorStatus() {
    const filter = { userId: this.props.tutorId };
    const status = Presences.findOne(filter, { fields: { state: true, userId: true } });
    if (status) {
      return (<i className="online--status green" />);
    } else {
      return (<i className="online--status red" />);
    }
  },

  showFull(e) {
    e.preventDefault();
    const div = e.currentTarget.parentNode.parentNode;
    const parent = e.currentTarget.parentNode;
    parent.classList.add('hidden');
    const hidden = div.querySelector('.hiddenBio');
    hidden.classList.add('show');
  },

  renderBio() {
    const tutor = this.data.tutor;
    const fullBio = tutor.profile.biography;
    const length = fullBio.length;
    if (length >= 45) {
      const trimBio = `${fullBio.substring(0, 45)} ...`;
      return (
        <div>
          <p className="trimBio">
            {trimBio} <a href="" onClick={this.showFull}>More</a>
          </p>
          <p className="hiddenBio">{fullBio}</p>
        </div>
       );
    } else {
      return (
        <p>
          {fullBio}
        </p>
      );
    }
  },
  routeProfile(e) {
    e.preventDefault();
    Router.go(getTutorUrl(this.data.tutor._id));
  },

  renderContent() {
    const tutor = this.data.tutor;
    const photo = {
      backgroundImage: `url(${tutor.profile.avatar})`,
    };
    return (
      <div className="search--results-user">
        <div className="search--results-user-wrapper">
          <div className="search--results-user-quick">
            <div className="search--results-user-quick-photo" style={photo} />
            <div className="search--results-user-quick-info">
              <h2><a href={getTutorUrl(this.data.tutor._id)} onClick={this.routeProfile}>{getUserNameById(tutor._id)}</a></h2>
              {this.tutorStatus()}
              <p>{tutor.address.city}, ${tutor.rate}/hour</p>
              <MessageButton tutor={tutor._id} />
            </div>
          </div>
          <div className="search--results-user-details">
            {tutor.profile.biography.length >= 4 ?
              <div className="search--results-user-details-block">
                <h5>About</h5>
                {this.renderBio()}
              </div>
              : '' }
            <div className="search--results-user-details-block">
              <h5>Subjects</h5>
              <TutorProfileSubjects isSearch subjects={tutor.specialities} />
            </div>
            <div className="search--results-user-details-block">
              <h5>Availability</h5>
              <TutorSchedule scheduling={tutor.scheduling} header="hide" backend="true" />
            </div>
          </div>
        </div>
      </div>
    );
  },
  render() {
    if (this.data.tutor !== undefined) {
      return this.renderContent();
    } else {
      return (<div />);
    }
  },
});

MessageButton = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const user = Meteor.user(),
      userId = Meteor.userId(),
      student = Roles.userIsInRole(userId, ['student']);
    return {
      user,
      student,
    };
  },
  getLoginStatus() {
    if (!this.data.user && !this.data.userLogginIn) { return false; }
    if (this.data.user) { return true; }
    return false;
  },
  getStudentStatus() {
    if (this.data.student) { return true; }
    return false;
  },
  messageTutor(e) {
    e.preventDefault();
    url = `${window.location.origin}/chat`;
    let userId = Meteor.userId(),
      self = this,
      user = Meteor.user(),
      tutor = this.props.tutor,
      chat = {
        student_id: userId,
        tutor_id: tutor,
      };

    const chatExists = Chats.findOne({ tutor_id: tutor, student_id: userId });

    if (chatExists) {
      const chatObject = {
        slug: self.props.tutor.slug,
        id: chatExists._id,
      };
      Router.go('chat', chatObject);
    } else {
      return Meteor.call('createChat', chat, url, (error, response) => {
        if (error) {
          return alert(error.reason);
        } else {
          const chat = Chats.findOne({ tutor_id: tutor, student_id: userId });
          const chatObject = {
            slug: $('.tutor-listing .messages').data('slug'),
            id: chat._id,
          };
          Router.go('chat', chatObject);
        }
      });
    }
  },
  render() {
    let loginStatus = this.getLoginStatus(),
      studentStatus = this.getStudentStatus();

    return (
      <div className="tutor--butons-student">
        {loginStatus ?
          <div className="tutor--buttons-student-auth">
            {studentStatus ? <a href="" className="btn btn--large" onClick={this.messageTutor}><svg viewBox="0 0 42.63 35.53"><title>icon_envelope</title><path d="M324.76,1268.43a8.15,8.15,0,0,0,2.43-.36,12.56,12.56,0,0,0,2.22-.92,17.24,17.24,0,0,0,2.06-1.29c0.66-.48,1.31-1,1.94-1.49q2.89-2.31,5.83-4.52l5.92-4.43,0.48-.36a3.54,3.54,0,0,0,.48-0.41v20.94a2.58,2.58,0,0,1-.77,1.87,2.54,2.54,0,0,1-1.87.79H306.13a2.69,2.69,0,0,1-2.66-2.66v-20.94a3.52,3.52,0,0,0,.48.41l0.47,0.36,5.92,4.43q2.94,2.21,5.83,4.52,0.91,0.72,1.9,1.45a19.21,19.21,0,0,0,2.06,1.32,11.4,11.4,0,0,0,2.24.95A8,8,0,0,0,324.76,1268.43Zm0-5.29a3.62,3.62,0,0,1-1.55-.4,11.9,11.9,0,0,1-1.63-1q-0.8-.56-1.56-1.19c-0.51-.42-1-0.76-1.34-1l-5.54-4.21-5.59-4.23a13.26,13.26,0,0,1-1.24-1.12,12.16,12.16,0,0,1-1.32-1.56,12,12,0,0,1-1-1.74,3.66,3.66,0,0,1-.43-1.59,2.13,2.13,0,0,1,.84-1.66,2.72,2.72,0,0,1,1.78-.7h37.33a2.69,2.69,0,0,1,1.77.7,2.13,2.13,0,0,1,.82,1.66,3.67,3.67,0,0,1-.43,1.59,12,12,0,0,1-1,1.74,12.55,12.55,0,0,1-1.32,1.56,13.49,13.49,0,0,1-1.24,1.12q-2.84,2.12-5.59,4.22l-5.54,4.22c-0.39.28-.83,0.62-1.33,1s-1,.82-1.56,1.19a12.07,12.07,0,0,1-1.64,1,3.57,3.57,0,0,1-1.53.4h-0.09Z" transform="translate(-303.48 -1242.71)" /></svg> Message</a> : '' }
          </div>
          : <div className="tutor--buttons-student-auth">
            <a href="/login" className="btn btn--large"><svg viewBox="0 0 42.63 35.53"><title>icon_envelope</title><path d="M324.76,1268.43a8.15,8.15,0,0,0,2.43-.36,12.56,12.56,0,0,0,2.22-.92,17.24,17.24,0,0,0,2.06-1.29c0.66-.48,1.31-1,1.94-1.49q2.89-2.31,5.83-4.52l5.92-4.43,0.48-.36a3.54,3.54,0,0,0,.48-0.41v20.94a2.58,2.58,0,0,1-.77,1.87,2.54,2.54,0,0,1-1.87.79H306.13a2.69,2.69,0,0,1-2.66-2.66v-20.94a3.52,3.52,0,0,0,.48.41l0.47,0.36,5.92,4.43q2.94,2.21,5.83,4.52,0.91,0.72,1.9,1.45a19.21,19.21,0,0,0,2.06,1.32,11.4,11.4,0,0,0,2.24.95A8,8,0,0,0,324.76,1268.43Zm0-5.29a3.62,3.62,0,0,1-1.55-.4,11.9,11.9,0,0,1-1.63-1q-0.8-.56-1.56-1.19c-0.51-.42-1-0.76-1.34-1l-5.54-4.21-5.59-4.23a13.26,13.26,0,0,1-1.24-1.12,12.16,12.16,0,0,1-1.32-1.56,12,12,0,0,1-1-1.74,3.66,3.66,0,0,1-.43-1.59,2.13,2.13,0,0,1,.84-1.66,2.72,2.72,0,0,1,1.78-.7h37.33a2.69,2.69,0,0,1,1.77.7,2.13,2.13,0,0,1,.82,1.66,3.67,3.67,0,0,1-.43,1.59,12,12,0,0,1-1,1.74,12.55,12.55,0,0,1-1.32,1.56,13.49,13.49,0,0,1-1.24,1.12q-2.84,2.12-5.59,4.22l-5.54,4.22c-0.39.28-.83,0.62-1.33,1s-1,.82-1.56,1.19a12.07,12.07,0,0,1-1.64,1,3.57,3.57,0,0,1-1.53.4h-0.09Z" transform="translate(-303.48 -1242.71)" /></svg> Message</a>
          </div>
        }
      </div>
    );
  },
});
