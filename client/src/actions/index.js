import axios from 'axios';
import History from '../history.js';
import * as type from './types';

const API_URL = process.env.REACT_APP_API_URL;
console.log('API_URL', process.env.REACT_APP_API_URL);
let TOKEN = localStorage.getItem('token');
let UID = localStorage.getItem('uid');

export const signUp = (...data) => {
    return async () => {
        await axios.post(`${API_URL}/users`, ...data)
            .then(() => {
                History.push('/signin');
            })
            .catch(error => {
                throw error && error.response && error.response.data.error.message;
            });
    };
};

export const setSession = (response) => {
    response.isAdmin = response.roles.find(x => x.name === 'admin');
    response.isEditor = response.roles.find(x => x.name === 'editor');
    sessionStorage.setItem('me', JSON.stringify(response))
    return response;
};

export const signIn = (...data) => {
    return async (dispatch) => {
        await axios.post(`${API_URL}/users/login`, ...data)
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
                    .catch(error => {
                        throw error.response.data.error.message;
                    })
            })
            .catch(error => {
                throw error.response.data.error.message;
            });
    };
};

export const signOut = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('me');
    TOKEN = null;
    History.push('/');
    return {type: type.UNAUTH_USER, me: false};
};

export const resetPasswordRequest = (email) => {
    return async () => {
        await axios.post(`${API_URL}/users/reset`, {email})
            .then(() => {
            })
            .catch(error => {
                throw error && error.response && error.response.data.error.message;
            });
    };
};

export const resetPassword = ({token, password}) => {
    return async () => {
        await axios.post(`${API_URL}/users/reset-password`, {newPassword: password}, {
            headers: {authorization: token}
        })
            .then(() => {
            })
            .catch(error => {
                throw error && error.response && error.response.data.error.message;
            });
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
    user.image = user.image || {thumbnail: null, normal: null, original: null};
    user.cover = user.cover || {thumbnail: null, normal: null, original: null};
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
    console.log('fetchUser', id);
    return async (dispatch) => {
        axios.get(`${API_URL}/users/${id}`, {
            headers: {authorization: localStorage.getItem('token')}
        })
            .then(response => {
                console.log('fetchUser dispatch', response.data);
                dispatch({type: type.GET_USER_SUCCESS, payload: computeUser(response.data)});
            })
            .catch(error => {
                dispatch({
                    type: type.GET_USER_ERROR,
                    payload: error.response && error.response.data && error.response.data.error.message
                });
            });
    }
};

export const getProfile = (username) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/users/profile/${username}`, {
            headers: {authorization: localStorage.getItem('token')}
        })
            .then(response => {
                resolve(computeUser(response.data.user))
            })
            .catch(error => {
                reject(error.response.data.error)
            });
    });
};

export const getSession = (callback) => {
    const token = localStorage.getItem('token');
    const me = sessionStorage.getItem('me');
    if (token) {
        console.log(token);
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

export const addUser = (...data) => {
    return async () => {
        await axios.post(`${API_URL}/users`, ...data)
            .then(() => {
                History.push('/users');
            })
            .catch(error => {
                throw error && error.response && error.response.data.error.message;
            });
    };
};

export const settingsAccount = (...data) => {
    return async (dispatch) => {
        await axios.patch(`${API_URL}/users/${UID}`, ...data,
            {headers: {authorization: TOKEN}})
            .then(response => {
                dispatch({type: type.AUTH_USER, payload: setSession(response.data)});
            })
            .catch(error => {
                throw error.response.data.error.message;
            });
    };
};

export const settingsChangePassword = ({oldPassword, newPassword}) => {
    return async (dispatch) => {
        await axios.post(`${API_URL}/users/change-password`, {oldPassword, newPassword},
            {headers: {authorization: localStorage.getItem('token')}})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error.response.data.error.message;
            });
    };
};

export const getUsers = () => {
    return async (dispatch) => {
        await axios.get(`${API_URL}/users/`, {
            headers: {authorization: localStorage.getItem('token')}
        })
            .then(response => {
                dispatch({type: type.GET_USERS_SUCCESS, payload: response.data.map(user => computeUser(user))});
            })
            .catch(error => {
                console.log('ERROR --', error);
                dispatch({
                    type: type.GET_USERS_ERROR,
                    payload: error.response && error.response.data && error.response.data.error.message
                });
            });
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
                console.log('toggleType', toggleType, response.data.data.status, computeUser(response.data.data));
                dispatch({type: type.GET_USER_SUCCESS, payload: computeUser(response.data.data)});
            })
            .catch(error => {
                console.log('toggleType error ', toggleType, error);
                dispatch({
                    type: type.GET_USER_ERROR,
                    payload: error.response && error.response.data && error.response.data.error.message
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
    console.log('action toggleStatus');
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
                const me = JSON.parse(sessionStorage.getItem('me'));
                me.cover = response.data.file || me.cover;
                dispatch({type: type.AUTH_USER, payload: setSession(me)});
                //return me;
            })
            .catch(error => {
                console.log('uploadCoverImage ERROR', error);
                //throw error.response.data.error.message;
            })
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
                console.log('uploadProfileImage', response);
                const me = JSON.parse(sessionStorage.getItem('me'));
                me.image = response.data.file || me.image;
                console.log('uploadProfileImage', me);
                dispatch({type: type.AUTH_USER, payload: setSession(me)});
                //return me;
            })
            .catch(error => {
                console.log('uploadProfileImage ERROR', error);
                //throw error.response.data.error.message;
            })
    };
};




