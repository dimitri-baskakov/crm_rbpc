import Vue from "vue";

let refreshTimeout = null;
let refreshPeriodMs = 3 * (24 * 60 * 60 * 1000); // 3дня

export default {
  state: {
    user: {},
    token: '',
    expiredAt: ''
  },
  actions: {
    login({commit}, data) {
      return new Promise((resolve, reject) => {
        commit('setRequestStatus', 'loading')
        Vue.prototype.$http({
          method: 'POST',
          url: `/auth/login`,
          data
        }).then(resp => {
          commit('setAuthData', resp)
          commit('setRequestStatus', 'success')
          resolve(resp)
        }).catch(err => {
          reject(err)
        })
      })
    },

    me({commit, getters}) {
      if (!getters.isLogged) {
        return;
      }
      return new Promise((resolve, reject) => {
        commit('setRequestStatus', 'loading')
        Vue.prototype.$http({
          method: 'POST',
          url: `/auth/me`,
        })
          .then(res => {
            const user = res.data
            commit('setUser', user)
            commit('setRequestStatus', 'success')
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })

      })
    },

    refresh({commit, getters}) {
      if (!getters.isLogged) {
        return;
      }
      return new Promise((resolve, reject) => {
        commit('setRequestStatus', 'loading')
        Vue.prototype.$http({
          method: 'POST',
          url: `/api/auth/refresh`,
        })
          .then(resp => {
            commit('setAuthData', resp)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    refreshDelayed({dispatch}) {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(() => {
        refreshTimeout = null;
        return dispatch('refresh');
      }, refreshPeriodMs);
    },

    logout({commit}) {
      return new Promise((resolve, reject) => {
        commit('resetAuthData')
        resolve()
      })
    },
  },

  mutations: {
    setAuthData(state, resp) {
      Vue.prototype.$http.defaults.headers.common['Authorization'] = 'bearer ' + resp.data.access_token
      state.token = resp.data.access_token
      state.expiredAt = (Date.now() / 1000) + resp.data.expires_in
    },

    resetAuthData(state) {
      delete Vue.prototype.$http.defaults.headers.common['Authorization']
      state.user = ''
      state.token = ''
      state.expiredAt = ''
    },

    setUser(state, user) {
      state.user = user
    },
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    isLogged: state => !!state.token,
  }
}
