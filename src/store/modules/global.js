import { GLOBAL } from '../mutation-types'

const state = {
    openSidebar: true,
};

const getters = {
    [GLOBAL.GET_OPEN_SIDEBAR]: (state) => {
        return state.openSidebar;
    },
};

const actions = {
    [GLOBAL.SET_OPEN_SIDEBAR]: ({ commit, state }, open) => {
        commit(GLOBAL.SET_OPEN_SIDEBAR, {open: open})
    },
};

const mutations = {
    [GLOBAL.SET_OPEN_SIDEBAR](state, payload) {
        state.openSidebar = payload.open;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}

