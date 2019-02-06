const config = require('../../server/config.json');
const sharp = require('sharp');
const nodemailer = require("nodemailer");
const mandrillTransport = require('nodemailer-mandrill-transport');
const from = config.fromMail;

const transport = nodemailer.createTransport(mandrillTransport({
    auth: {
        apiKey: config.mandrillApiKey
    },
    mandrillOptions: {
        async: false
    }
}));

const templateMail = function (title, html) {
    return `<html><head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${title}</title>
        </head><body bgcolor="#FFFFFF">
        <table style="max-width:600px;margin: 0 auto;"><tr><td style="padding:15px;text-align: center;">
        <a href="${config.url}"><img src="${config.url}/favicon.png" alt="${config.name}" 
        style="border:0; max-width:240px; max-height:100px;"></a></td></tr>
        <tr><td>${html}</td></tr>
        <tr><td style="padding:15px;font-size: small; color: #444444;">You’re receiving this email because you have an account in 
        <a href="${config.url}">${config.name}</a>. If you are not sure why you’re receiving this, please contact us.</td>
        </tr></table>
        </body></html>`;
};

module.exports = function (User) {
    User.observe('before save', function (context, next) {
        if (context.instance)
            delete context.instance.unsetAttribute('roles');
        else
            delete context.data.roles;
        next();
    });
    User.afterRemote('create', function (context, user, next) {
        User.generateVerificationToken(user, null, function (err, token) {
            if (err) {
                return next(err);
            }
            console.log('USER', user);
            user.status = true;
            user.verificationToken = token;
            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                const title = 'Account Verification';
                const link = config.url + '/api/users/confirm?uid='
                    + user.id + '&redirect=/signin&token=' + token;
                const html = `<table><tr><td style="padding:15px">Hi <strong>${user.name}</strong>;<br><br>
                    Thanks so much joining ${config.name}! To finish your register you just need to confirm that we got your email right.
                    </td></tr><tr><td style="padding:15px;text-align: center">
                    <a href="${link}" style="display:inline-block;margin:0 auto;padding:15px 20px;border-radius:10px;background:#20a8d8;color: #ffffff;text-decoration:none;">
                    Confirm your account</a>
                    </td></tr><tr><td style="padding:15px">Button not working? Try pasting this link into your browser:<br><br>
                    ${link}</td></tr></table>`;

                // User.app.models.Email.send({
                //     to: user.email,
                //     from: from,
                //     subject: title,
                //     html: templateMail(title, html)
                // }, function (err, res) {
                //     if (err) return console.log('> error sending verify  email', err);
                //     console.log('> sending verify reset email to:', user.email, res);
                // });
                console.log('VERIFICATION LINK', link);
                transport.sendMail({
                    mandrillOptions: {
                        async: false
                    },
                    from: from,
                    to: user.email,
                    subject: title,
                    html: templateMail(title, html)
                }, function (err, info) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(info);
                    }
                });
            });
        });
        next();
    });
    // // Method to render
    // User.afterRemote('prototype.verify', function (context, user, next) {
    //     context.res.render('response', {
    //         title: 'A Link to verify your identity has been sent ' +
    //         'to your email successfully',
    //         content: 'Please check your email and click on the verification link ' +
    //         'before logging in',
    //         redirectTo: '/',
    //         redirectToLinkText: 'Log in'
    //     });
    // });
    //send password reset link when requested
    User.on('resetPasswordRequest', function (user) {
        const url = config.url + '/#!password';
        const html = 'Click the link to reset your password <br><a href="' + url + '/' +
            user.accessToken.id + '">' + url + '/' +
            user.accessToken.id + '</a>';
        console.log('html', html);

        transport.sendMail({
            from: from,
            to: user.email,
            subject: 'Password Reset',
            html: templateMail('Password Reset', html)
        }, function (err, info) {
            if (err) {
                return console.log('Error sending password reset email');
            } else {
                console.log('Sending password reset email to:', user.email, info);
            }
        });
    });
    User.approve = function (id, cb) {
        User.findById(id, function (err, user) {
            if (err) {
                cb(err);
            } else {
                user.emailVerified = true;
                user.adminVerified = true;
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        next(err);
                    }
                    else {
                        const html = '<div style="text-align: center"><h3>Good News</h3>' +
                            '<p> We have just approved your account. ' +
                            'You can play ' + config.name + ' the game whenever you want.</p></div>';
                        transport.sendMail({
                            from: from,
                            to: user.email,
                            subject: 'Account Approved',
                            html: templateMail('Account Approved', html)
                        }, function (err, info) {
                            if (err) {
                                console.log(err);
                                cb(err);
                            }
                            console.log('Sending password reset email to:', user.email, info);
                            cb(null, user);
                        });
                    }
                });
            }
        });
    };
    User.profile = function (username, cb) {
        User.findOne({"where": {"username": username}}, function (err, user) {
            if (err) {
                cb(err);
            } else {
                cb(null, user);
            }
        });
    };
    User.cover = function (id, context, options, cb) {
        const Container = User.app.models.Container;
        const token = options && options.accessToken;
        const root = User.app.dataSources.storage.settings.root;
        User.findById(token && token.userId, function (err, user) {
            if (err) {
                cb(err);
            } else {
                // each user has own container as named by user id
                Container.putContainer(user.id.toString(), function (err, container) {
                    if (err) {
                        cb(err);
                    } else {
                        console.log('CONTAINER CHECK', container);
                        Container.upload(context.req, context.res, {container: container}, function (err, file) {
                            if (err) {
                                cb(err);
                            } else {
                                file = file.files.file && file.files.file.pop();
                                console.log('FILE UPLOADING', file);
                                //console.log('USER IMAGE', user);

                                const normal = file.name.replace(/\./, '_normal.');
                                sharp(root + file.container + '/' + file.name)
                                    .resize(1200, 360, {fit: 'cover'})
                                    .on('error', function (err) {
                                        console.log(err);
                                    })
                                    .jpeg()
                                    .toFile(root + file.container + '/' + normal)
                                    .then(function () {
                                        const thumb = file.name.replace(/\./, '_thumb.');
                                        sharp(root + file.container + '/' + file.name)
                                            .resize(400, 120)
                                            .toFile(root + file.container + '/' + thumb)
                                            .then(function () {
                                                user.updateAttributes({
                                                    'cover': {
                                                        name: file.name,
                                                        type: file.type,
                                                        container: file.container,
                                                        url: '/api/containers/' + file.container + '/download/' + file.name,
                                                        normal: '/api/containers/' + file.container + '/download/' + normal,
                                                        thumb: '/api/containers/' + file.container + '/download/' + thumb
                                                    }
                                                }, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        cb(err);
                                                    }
                                                    console.log('USER COVER SAVED', user);
                                                    cb(null, user);
                                                    //return user.image;
                                                });

                                            })
                                            .catch(err => {
                                                throw err
                                            });

                                    })
                                    .catch(err => {
                                        throw err
                                    });
                            }
                        });
                    }
                });
            }
        });
    };
    User.image = function (id, context, options, cb) {
        const Container = User.app.models.Container;
        const token = options && options.accessToken;
        const root = User.app.dataSources.storage.settings.root;
        //console.log(cb);
        //cb = function(){return console.log()};
        User.findById(token && token.userId, function (err, user) {
            if (err) {
                cb(err);
            } else {
                // each user has own container as named by user id
                Container.putContainer(user.id.toString(), function (err, container) {
                    if (err) {
                        cb(err);
                    } else {
                        Container.upload(context.req, context.res, {container: container}, function (err, file) {
                            if (err) {
                                cb(err);
                            } else {
                                file = file.files.file.pop();
                                //console.log('FILE UPLOADED', file);

                                console.log('FILE UPLOADED', root + file.container + '/' + file.name);

                                const normal = file.name.replace(/\./, '_normal.');

                                sharp(root + file.container + '/' + file.name)
                                    .resize(360, 360, {fit: 'cover'})
                                    //.crop(sharp.strategy.attention)
                                    .on('error', function (err) {
                                        console.log(err);
                                    })
                                    .jpeg()
                                    .toFile(root + file.container + '/' + normal)
                                    .then(function () {
                                        const thumb = file.name.replace(/\./, '_thumb.');
                                        sharp(root + file.container + '/' + file.name)
                                            .resize(50, 50)
                                            .toFile(root + file.container + '/' + thumb)
                                            .then(function () {
                                                user.updateAttributes({
                                                    'image': {
                                                        name: file.name,
                                                        type: file.type,
                                                        container: file.container,
                                                        url: '/api/containers/' + file.container + '/download/' + file.name,
                                                        normal: '/api/containers/' + file.container + '/download/' + normal,
                                                        thumb: '/api/containers/' + file.container + '/download/' + thumb
                                                    }
                                                }, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        cb(err);
                                                    }
                                                    console.log('USER IMAGE SAVED', user);
                                                    cb(null, user);
                                                    //return user.image;
                                                })

                                            })
                                            .catch(err => {
                                                throw err
                                            });

                                    })
                                    .catch(err => {
                                        throw err
                                    });


                            }
                        });
                    }
                });
            }
        });
    };

    const setACL = (id, cb, type) => {
        const Role = User.app.models.Role;
        const RoleMapping = User.app.models.RoleMapping;
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
                            }, function (err) {
                                if (err) cb(err);
                                User.findById(id, function (err, user) {
                                    if (err) {
                                        cb(err);
                                    }
                                    cb(null, user);
                                });
                            });
                        else
                            RoleMapping.destroyById(principal[0].id, function (err) {
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
