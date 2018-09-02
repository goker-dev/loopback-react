module.exports = function (Model, options) {
  'use strict';
  Model.observe('before save', function event(ctx, next) {
    if (ctx.instance) {
      ctx.instance.unsetAttribute('fullname');
    } else {
      delete ctx.data.fullname;
    }
    next();
  });
};
