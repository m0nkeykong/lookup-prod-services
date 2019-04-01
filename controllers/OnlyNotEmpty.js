//  Function that checks and validates Dields - used for update empty params issue
const _ = require('lodash');

module.exports = (req, res, next) => {
  const out = {};
  _(req.body).forEach((value, key) => {
      if (!_.isEmpty(value)) {
          out[key] = value;
      }
  });
  req.bodyNotEmpty = out;
  next();
}