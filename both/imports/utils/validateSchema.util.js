import { check } from 'meteor/check';

import R from 'ramda';

/**
 * [validateSchema description]
 * @param  {[type]} schema [description]
 * @param  {[type]} values [description]
 * @return {[type]}        [description]
 */
const validateSchema = (schema, values) => R.forEach(
    obj => check(values[obj.value], obj.check),
    schema
  );

export default validateSchema;
