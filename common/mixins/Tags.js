'use strict';
module.exports = function (Model, options) {
  // give each dog a unique tag for tracking
  Model.defineProperty('tags', {
    type: String,
    'defaultFn': 'uuid',
    index: true,
    unique: true,
  });
};
