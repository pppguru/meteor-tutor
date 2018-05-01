# Tutor App

This app powers TutorApp located [here](http://www.tutorapp.com).

## Software requirements

- Node 7.4.0

- Meteor 1.4.2.3

- React 15.4.1

- MongoDB 3.4.0

- Algolia - Manages the `/tutors` route which handles all the search, geo location, and faceted results

- Amazon S3 - Handles asset management, uploads, resumes, pdfs

- Stripe - Handles credit processing, referral credits, recipient creation for paying tutors

- Mapbox - Handles the maps on tutor profiles, tutor landing, tutor individual profile view

- Compose - Production MongoDB Database

## Setup

  ```
  $ npm install
  ```

## Starting local server

### Development

  ```
  $ meteor --setting=settings.json
  ```

### Staging

  ```
  $ `mongodb://tutor-staging:P74JfS72dEn4ib85EcZZwf6Q5rfzQ6U@candidate.34.mongolayer.com:10851,candidate.19.mongolayer.com:10802/tutor-staging?replicaSet=set-553795e4a31d45db8d000e9d`
  ```

### Production

  ```
  $`MONGO_URL='mongodb://tutorz:ra39dfm!!ds@c802.candidate.19.mongolayer.com:10802,candidate.34.mongolayer.com:10851/tutor-demo' meteor --settings settings.json`
  ```

## Migrating and seeding the database

### Development

  ```
  TBD
  ```

### Staging

  ```
  Not applicable
  ```

### Production

  ```
  Not applicable
  ```

## Deployment

### Staging

  ```
  $ npm install -g mup
  $ mup setup --config .deploy/staging.js
  $ mup deploy --config .deploy/staging.js --settings=settings.json
  $ open http://demo.tutorapp.com
  ```

### Production

  ```
  $ npm install -g mup
  $ mup setup --config .deploy/production.js
  $ mup deploy --config .deploy/production.js --settings=settings.json
  $ open http://tutorapp.com
  ```

## Dummy Accounts

tutorapp tutor accounts:
- zfiltoxv@imgof.com john1234 Kevin Green
- zltfcrqq@pwrby.com john1234 Sarosh Johnson
- zncsunfq@zetmail.com john1234 Céline Dérouille
- fertilenoodle@gmx.com john1234 Sarah H.
- eliza+brenda@tutorthepeople.com raindrop1
- eliza+nancy@tutorthepeople.com raindrop1

## Support

Bug reports and feature requests can be filed with the rest for the project here:

* {File Bug Reports and Features}[https://github.com/tutorappLLC/TutorApp/issues]

## License

Tutor App is released under the <LICENSE-NAME> license.

## Copyright

copyright:: (c) Copyright 2016-2017 Tutor App. All Rights Reserved.
