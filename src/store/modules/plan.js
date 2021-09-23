import http from "@/http.js";
const API = new http();

const state = {
  plans: [],
  selectedPlan: null
};

const getters = {
  plans: state => state.plans,
  selectedPlan: state => state.selectedPlan
};

const mutations = {
  SET_PLAN_LIST: (state, payload) => {
    state.plans = Object.assign([], payload);
  },

  SELECT_PLAN: (state, payload) => {
    state.selectedPlan = Object.assign({}, payload);
  }
};

const actions = {
  getPlanList: ({ commit }) => {
    return API.get('/api/v1/plans/').then(result => {
      commit("SET_PLAN_LIST", result.data);
      return result.data;
    }).catch(e => {
      return e.data;
    })
  },

  getPlanDetail: ({ commit }, id) => {
    return API.get(`/api/v1/plans/${id}/`).then(result => {
      commit("SELECT_PLAN", result.data);
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
