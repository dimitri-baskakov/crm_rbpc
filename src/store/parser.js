import Vue from "vue";

export default {
  state: {
    scheduleParsers: [],
    statusParsers: {
      Cdlog: {},
      Grandadvance: {},
      Morlevi: {},
    },
    cronSwitchManufacturers: [],
  },
  actions: {
    getScheduleParsers({commit}) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/parsers`,
        })
          .then(resp => {
            commit('setManufacturers', resp.data.manufacturers)
            commit('setScheduleParsers', resp.data.scheduleParsers)
            commit('setCronSwitchManufacturers', resp.data.cronSwitchManufacturers)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    setTimeParser({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/parsers/set-time`,
          params
        })
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    cronSwitchManufacturer({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/parsers/cron-switch-manufacturer`,
          params
        })
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    updateGoods({commit}, manufacturer) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/update-goods?manufacturer=${manufacturer}`,
        })
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
          .finally(() => {
            commit('setRequestStatus', 'success')
          })
      })
    },

    startParser({commit}, manufacturer) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/start-parser?manufacturer=${manufacturer}`,
        })
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
          .finally(() => {
            commit('setRequestStatus', 'success')
          })
      })
    },

    updateStatusParser({commit}, manufacturer) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/status-parser?manufacturer=${manufacturer}`,
        })
          .then(resp => {
            commit('setRequestStatus', 'success')
            commit('setStatusParsers', {manufacturer, data: resp.data})
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
          .finally(() => {
            commit('setRequestStatus', 'success')
          })
      })
    },
  },

  mutations: {
    setScheduleParsers(state, scheduleParsers) {
      state.scheduleParsers = scheduleParsers
    },
    setCronSwitchManufacturers(state, cronSwitchManufacturers) {
      state.cronSwitchManufacturers = cronSwitchManufacturers
    },
    setStatusParsers(state, statusParsers) {
      state.statusParsers[statusParsers.manufacturer] = statusParsers.data
    },
  },
  getters: {
    scheduleParsers: state => state.scheduleParsers,
    cronSwitchManufacturers: state => state.cronSwitchManufacturers,
    statusParsers: state => state.statusParsers,
  }
}
