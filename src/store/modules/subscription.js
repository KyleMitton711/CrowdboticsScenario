import http from "@/http.js";
const API = new http();

const state = {
  subscriptions: []
};

const getters = {
  subscriptions: state => state.subscriptions
};

const mutations = {
  SET_SUBSCRIPTION_LIST: (state, payload) => {
    state.subscriptions = Object.assign([], payload);
  },

  ADD_SUBSCRIPTION: (state, payload) => {
    state.subscriptions = [ ...state.subscriptions, payload ];
  }
};

const actions = {
  getSubscriptionList: ({ commit }) => {
    return API.get('/api/v1/subscriptions/').then(result => {
      commit("SET_SUBSCRIPTION_LIST", result.data);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  addSubscription: ({ commit }, payload) => {
    return API.post('/api/v1/subscriptions/', payload).then(result => {
      commit("ADD_SUBSCRIPTION", result.data);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  getSubscriptionDetail: ({ commit }, id) => {
    return API.get(`/api/v1/subscriptions/${id}/`).then(result => {
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  updateSubscription: ({ commit }, payload) => {
    return API.put(`/api/v1/subscriptions/${payload.id}/`, payload).then(result => {
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
