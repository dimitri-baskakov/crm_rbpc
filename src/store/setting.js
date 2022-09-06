import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    settings: [],
  },
  actions: {
    getSettings({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/settings`,
          params
        })
          .then(resp => {
            commit('setSettings', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveSetting({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url:`/settings`,
          method: 'POST',
          data: params
        })
          .then(resp => {
            commit('setSettings', [])
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    deleteSetting({commit}, setting) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url:`/settings/${setting.id}`,
          method: 'DELETE',
        })
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  },

  mutations: {
    setSettings(state, settings) {
      state.settings = settings
    }
  },
  getters: {
    settings: state => state.settings,
  }
}
