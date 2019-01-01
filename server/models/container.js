'use strict';

module.exports = function (Container) {

  Container.putContainer = function (container, cb) {

    Container.getContainer(container, function (err, c) {
      // if (err)
      //   return cb(err)
      if (c && c.name) {
        console.log('CONTAINER ALREADY EXIST', container);
        cb(null, c.name)
      }
      else {
        Container.createContainer({name: container}, function (err, c) {
          if (err)
            return cb(err)
          console.log('CONTAINER CREATED', container);
          cb(null, c.name)
        });
      }
    });


  };

};
