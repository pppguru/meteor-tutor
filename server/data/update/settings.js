import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Settings from '/collections/settings';

Meteor.methods({
  updateMenu(menu, user) {
    check(user, Object);
    check(menu, Array);

    // Check if Title changes
    const grabSettings = Settings.findOne({});

    return Settings.update(grabSettings, {
      $set: {
        menu,
      },
    });
  },
  siteSettings(settings) {
    check(settings, {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: String,
    });
    // Check if Title changes
    const grabSettings = Settings.findOne({});
    return Settings.update(grabSettings, {
      $set: {
        metaName: settings.metaTitle,
        metaDescription: settings.metaDescription,
        metaKeywords: settings.metaKeywords,
      },
    });
  },
});
