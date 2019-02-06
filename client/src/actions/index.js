import axios from 'axios';
import History from '../history.js';
import * as type from './types';

const API_URL = process.env.REACT_APP_API_URL;
const FILE_URL = process.env.REACT_APP_FILE_URL;
let TOKEN = localStorage.getItem('token');
let UID = localStorage.getItem('uid');


export const signUp = (data) => {
    return (dispatch) => {
        axios.post(`${API_URL}/users`, data)
            .then(() => {
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'Check your email for confirmation link.'}
                });
                setTimeout(() => {
                    History.push('/signin')
                }, 1500);
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    };
};

export const setSession = (response) => {
    //response.isAdmin = response.roles.find(x => x.name === 'admin');
    //response.isEditor = response.roles.find(x => x.name === 'editor');
    sessionStorage.setItem('me', JSON.stringify(response));
    return response;
};

export const signIn = (data) => {
    return async (dispatch) => {
        await axios.post(`${API_URL}/users/login`, data)
            .then(response => {
                localStorage.setItem('token', response.data.id);
                localStorage.setItem('uid', response.data.userId);
                localStorage.setItem('ttl', response.data.ttl);
                TOKEN = localStorage.getItem('token');
                UID = localStorage.getItem('uid');
                getUser(response.data.userId)
                    .then(response => {
                        dispatch({type: type.AUTH_USER, payload: setSession(response)});
                        History.push('/home');
                    })
                    .catch(error => dispatch({
                        type: type.ERROR,
                        payload: error.response
                    }));
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    };
};

export const signOut = () => {
    return (dispatch) => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('me');
        TOKEN = null;
        dispatch({
            type: type.UNAUTH_USER,
            payload: null
        });
        History.push('/');
    }
};

export const resetPasswordRequest = (email) => {
    return (dispatch) => {
        axios.post(`${API_URL}/users/reset`, {email})
            .then(() => {
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'We sent an email to you. Please check your email.'}
                })
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    };
};

export const resetPassword = ({token, password}) => {
    return (dispatch) => {
        axios.post(`${API_URL}/users/reset-password`, {newPassword: password}, {
            headers: {authorization: token}
        })
            .then(() => {
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'You has been changed your password successfully.'}
                })
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    };
};

function computeUser(user) {
    user.isAdmin = user.roles.find(x => x.name === 'admin');
    user.isEditor = user.roles.find(x => x.name === 'editor');
    user.isManager = user.roles.find(x => x.name === 'manager');
    user.isWorker = user.roles.find(x => x.name === 'worker');
    user.icon = user.isAdmin ? 'fas fa-user-astronaut'
        : user.isEditor ? 'fa fa-user-secret'
            : user.isManager || user.isWorker ? 'fa fa-user-tie' : 'fa fa-user';
    if (typeof user.image === 'object') {
        user.image.thumb = FILE_URL + user.image.normal;
        user.image.normal = FILE_URL + user.image.normal;
        user.image.url = FILE_URL + user.image.url;
    } else {
        user.image = {
            thumb: 'http://holder.ninja/50x50,P.svg',
            normal: 'http://holder.ninja/250x250,PROFILE.svg',
            url: 'http://holder.ninja/500x500,PROFILE.svg'
        };
    }
    if (typeof user.cover === 'object') {
        user.cover.thumb = FILE_URL + user.cover.normal;
        user.cover.normal = FILE_URL + user.cover.normal;
        user.cover.url = FILE_URL + user.cover.url;
    } else {
        user.cover = {
            thumb: 'http://holder.ninja/400x120,COVER-1200x360.svg',
            normal: 'http://holder.ninja/1200x360,COVER-1200x360.svg',
            url: 'http://holder.ninja/1200x360,COVER-1200x360.svg'
        };
    }
    return user;
}

export const getUser = (uid) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/users/${uid}`, {
            headers: {authorization: localStorage.getItem('token')}
        })
            .then(response => {
                resolve(computeUser(response.data))
            })
            .catch(error => {
                reject(error.response.data.error)
            });
    });
};

export const fetchUser = (id) => {
    return (dispatch) => {
        axios.get(`${API_URL}/users/${id}`, {
            headers: {authorization: localStorage.getItem('token')}
        })
            .then(response => {
                dispatch({type: type.DATA, payload: computeUser(response.data)});
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    }
};

export const getProfile = (username) => {
    return (dispatch) => {
        axios.get(`${API_URL}/users/profile/${username}`, {
            headers: {authorization: localStorage.getItem('token')}
        })
            .then(response => {
                dispatch({type: type.DATA, payload: computeUser(response.data.user)});
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    }

    // return new Promise((resolve, reject) => {
    //     axios.get(`${API_URL}/users/profile/${username}`, {
    //         headers: {authorization: localStorage.getItem('token')}
    //     })
    //         .then(response => {
    //             resolve(computeUser(response.data.user))
    //         })
    //         .catch(error => {
    //             reject(error.response.data.error)
    //         });
    // });
};

export const getSession = (callback) => {
    const token = localStorage.getItem('token');
    const me = sessionStorage.getItem('me');
    if (token) {
        if (me) {
            callback(JSON.parse(me));
        } else {
            getUser(localStorage.getItem('uid'))
                .then((response) => {
                    callback(setSession(response))
                })
                .catch((error) => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('uid');
                    localStorage.removeItem('ttl');
                    window.location.reload(true);
                    throw error;
                });
        }
    } else callback(null)
};

export const addUser = (data) => {
    return (dispatch) => {
        axios.post(`${API_URL}/users`, data)
            .then(() => {
                History.push('/users');
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    };
};

export const settingsAccount = (data) => {
    return (dispatch) => {
        axios.patch(`${API_URL}/users/${UID}`, data,
            {headers: {authorization: TOKEN}})
            .then(response => {
                dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data))});
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'Your account has been updated successfully!'}
                });
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    };
};

export const settingsChangePassword = ({oldPassword, newPassword}) => {
    return (dispatch) => {
        axios.post(`${API_URL}/users/change-password`, {oldPassword, newPassword},
            {headers: {authorization: localStorage.getItem('token')}})
            .then(() => {
                dispatch({
                    type: type.SUCCESS,
                    payload: {name: 'SUCCESS', message: 'Your password has been changed successfully!'}
                });
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    }
};

export const getUsers = () => {
    return (dispatch) => {
        axios.get(`${API_URL}/users/`, {
            headers: {authorization: localStorage.getItem('token')}
        })
            .then(response => {
                dispatch({type: type.DATA, payload: response.data.map(user => computeUser(user))});
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    }
};

export const updateUser = async (data) => {
    await axios.patch(`${API_URL}/users/${data.id}`, data,
        {headers: {authorization: TOKEN}})
        .then(response => {
            return response.data
        })
        .catch(error => {
            throw error.response.data.error.message;
        });
};

export const toggleAdmin = (id, toggleType = 'Admin') => {
    return (dispatch) => {
        axios.post(`${API_URL}/users/${id}/toggle${toggleType}`, {id},
            {headers: {authorization: TOKEN}})
            .then(response => {
                dispatch({type: type.DATA, payload: computeUser(response.data.data)});
            })
            .catch(error => {
                dispatch({
                    type: type.ERROR,
                    payload: error.response
                });
            });
    }
};

export const toggleEditor = (id) => {
    return toggleAdmin(id, 'Editor')
};

export const toggleManager = (id) => {
    return toggleAdmin(id, 'Manager')
};

export const toggleWorker = (id) => {
    return toggleAdmin(id, 'Worker')
};

export const toggleStatus = (id) => {
    return toggleAdmin(id, 'Status')
};

export const uploadCoverImage = (file) => {
    return async (dispatch) => {
        await axios.post(`${API_URL}/users/${UID}/cover`, file, {
            headers: {authorization: TOKEN},
            onUploadProgress: progressEvent => {
                console.log(progressEvent.loaded, progressEvent.total)
            }
        })
            .then(response => {
                dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data.user))});
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    };
};

export const uploadProfileImage = (file) => {
    return async (dispatch) => {
        await axios.post(`${API_URL}/users/${UID}/image`, file, {
            headers: {authorization: TOKEN},
            onUploadProgress: progressEvent => {
                console.log(progressEvent.loaded, progressEvent.total)
            }
        })
            .then(response => {
                dispatch({type: type.AUTH_USER, payload: setSession(computeUser(response.data.user))});
            })
            .catch(error => dispatch({
                type: type.ERROR,
                payload: error.response
            }));
    };
};




