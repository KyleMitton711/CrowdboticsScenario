import http from "@/http.js";
const API = new http();

const state = {
  user: null
};

const getters = {
  user: state => state.user
};

const mutations = {
  SET_USER: (state, payload) => {
    state.user = Object.assign({}, payload);
  }
};

const actions = {
  login: ({ commit }, payload) => {
    return API.post('/rest-auth/login/', payload).then(result => {
      console.log(result);
      // localStorage.setItem("token", token);
      commit("SET_USER", result);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  logout: ({ commit }) => {
    return API.post('/rest-auth/logout/').then(result => {
      commit("SET_USER", null);
      return result;
    }).catch(e => {
      return e.data;
    })
  },

  register: ({ commit }, payload) => {
    return API.post('/rest-auth/registration/', payload).then(result => {
      commit("SET_USER", null);
      return result;
    }).catch(e => {
      return e.data;
    })
  },

  resetPassword: ({ commit }, payload) => {
    return API.post('/rest-auth/password/reset/', payload).then(result => {
      commit();
      return result;
    }).catch(e => {
      return e.data;
    })
  },

  changePassword: ({ commit }, payload) => {
    return API.post('/rest-auth/password/change/', payload).then(result => {
      commit();
      return result;
    }).catch(e => {
      return e.data;
    })
  },

  updateProfile: ({ commit }, payload) => {
    return API.put('/rest-auth/user/', payload).then(result => {
      commit("SET_USER");
      return result;
    }).catch(e => {
      return e.data;
    })
  },

  getProfile: ({ commit }, payload) => {
    return API.get('/rest-auth/user/', payload).then(result => {
      commit("SET_USER");
      return result;
    }).catch(e => {
      return e.data;
    })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
