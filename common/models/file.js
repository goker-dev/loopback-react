var CONTAINERS_URL = '/api/containers/';
module.exports = function (File) {

  File.upload = function (ctx, options, cb) {
    if (!options) options = {};
    ctx.req.params.container = 'common';
    File.app.models.container.upload(ctx.req, ctx.result, options, function (err, fileObj) {
      if (err) {
        cb(err);
      } else {
        var fileInfo = fileObj.files.file[0];
        File.create({
          name: fileInfo.name,
          type: fileInfo.type,
          container: fileInfo.container,
          url: CONTAINERS_URL + fileInfo.container + '/download/' + fileInfo.name
        }, function (err, obj) {
          if (err !== null) {
            cb(err);
          } else {
            cb(null, obj);
          }
        });
      }
    });
  };

  File.remoteMethod(
    'upload',
    {
      description: 'Uploads a file',
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'options', type: 'object', http: {source: 'query'}}
      ],
      returns: {
        arg: 'fileObject', type: 'object', root: true
      },
      http: {verb: 'post'}
    }
  );

};
