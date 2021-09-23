import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import app from './modules/app'
import plan from './modules/plan'
import subscription from './modules/subscription'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        Sidebar_drawer: null,
    },
    mutations: {
        SET_SIDEBAR_DRAWER(state, payload) {
            state.Sidebar_drawer = payload
        },
    },
    actions: {
    },
    getters: {
    },
    namespace: true,
    modules: {
        auth,
        app,
        plan,
        subscription
    }
})