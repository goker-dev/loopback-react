module.exports = function (app) {
    const User = app.models.user;
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;

    const setACL = (id, cb, type) => {
        User.findById(id, function (err, user) {
            if (err) {
                cb(err);
            } else {
                Role.findOrCreate({where: {name: type}}, {
                    name: type
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
                                User.findById(id, function (err, user) {
                                    if (err) {
                                        cb(err);
                                    }
                                    cb(null, user);
                                });
                            });
                        else
                            RoleMapping.destroyById(principal[0].id, function (err, principal) {
                                if (err) cb(err);
                                User.findById(id, function (err, user) {
                                    if (err) {
                                        cb(err);
                                    }
                                    cb(null, user);
                                });
                            });
                    });
                });
            }
        });
    };

    User.toggleAdmin = function (id, cb) {
        setACL(id, cb, 'admin');
    };

    User.toggleEditor = function (id, cb) {
        setACL(id, cb, 'editor');
    };

    User.toggleManager = function (id, cb) {
        setACL(id, cb, 'manager');
    };

    User.toggleWorker = function (id, cb) {
        setACL(id, cb, 'worker');
    };

    User.toggleStatus = function (id, cb) {
        User.findById(id, function (err, user) {
            if (err) {
                cb(err);
            } else {
                user.status = !user.status;
                user.save(function (err) {
                    if (err) {
                        cb(err);
                    } else {
                        User.findById(id, function (err, user) {
                            if (err) {
                                cb(err);
                            }
                            cb(null, user);
                        });
                    }
                });
            }
        });
    }
};