import http from "@/http.js";
const API = new http();

const state = {
  apps: []
};

const getters = {
  apps: state => state.apps
};

const mutations = {
  SET_APP_LIST: (state, payload) => {
    state.apps = Object.assign([], payload);
  }
};

const actions = {
  getAppList: ({ commit }) => {
    return API.get('/api/v1/apps/').then(result => {
      commit("SET_APP_LIST", result.data);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  addApp: ({ commit }, payload) => {
    return API.post('/api/v1/apps/', payload).then(result => {
      commit("ADD_APP", result.data);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  getAppDetail: ({ commit }, id) => {
    return API.get(`/api/v1/apps/${id}/`).then(result => {
      commit("ADD_APP", null);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  deleteApp: ({ commit }, id) => {
    return API.delete(`/api/v1/apps/${id}/`).then(result => {
      commit("ADD_APP", null);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  updateApp: ({ commit }, payload) => {
    return API.put(`/api/v1/apps/${payload.id}/`, payload).then(result => {
      commit("ADD_APP", null);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
