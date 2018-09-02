module.exports = function (app) {
  const User = app.models.User;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;

  User.toggleAdmin = function (id, cb) {
    User.findById(id, function (err, user) {
      if (err) {
        cb(err);
      } else {
        Role.findOrCreate({where: {name: 'admin'}}, {
          name: 'admin'
        }, function (err, role) {
          if (err) cb(err);
          RoleMapping.find({
            where: {
              principalId: user.id,
              roleId: role.id
            }
          }, function (err, principal) {
            if (err) cb(err);
            if (!principal.length)
              RoleMapping.create({
                principalType: RoleMapping.USER,
                principalId: user.id,
                roleId: role.id
              }, function (err, principal) {
                if (err) cb(err);
                cb(null, principal);
              });
            else
              RoleMapping.destroyById(principal[0].id, function (err, principal) {
                if (err) cb(err);
                cb(null, principal);
              });
          });
        });
      }
    });
  }

  User.toggleEditor = function (id, cb) {
    User.findById(id, function (err, user) {
      if (err) {
        cb(err);
      } else {
        Role.findOrCreate({where: {name: 'editor'}}, {
          name: 'admin'
        }, function (err, role) {
          if (err) cb(err);
          RoleMapping.find({
            where: {
              principalId: user.id,
              roleId: role.id
            }
          }, function (err, principal) {
            if (err) cb(err);
            if (!principal.length)
              RoleMapping.create({
                principalType: RoleMapping.USER,
                principalId: user.id,
                roleId: role.id
              }, function (err, principal) {
                if (err) cb(err);
                cb(null, principal);
              });
            else
              RoleMapping.destroyById(principal[0].id, function (err, principal) {
                if (err) cb(err);
                cb(null, principal);
              });
          });
        });
      }
    });
  }
}
