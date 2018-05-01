import { Meteor } from 'meteor/meteor';
import { GeoCoder } from 'meteor/aldeed:geocoder';

Meteor.methods({
  geoCodeZip(zipcode) {
    check(zipcode, String);

    // Initialize the geocoder
    const geo = new GeoCoder({
      httpAdapter: 'https',
    });

    const geoPull = geo.geocode(zipcode);

    if (geoPull.length > 0) {
      const latLang = {
        lat: geoPull[0].latitude,
        lang: geoPull[0].longitude,
      };
      return latLang;
    } else {
      return false;
    }
  },
});
