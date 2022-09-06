import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    manufacturers: null,
    manufacturer: null,
    manufacturerNames: []
  },
  actions: {
    getManufacturers({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/manufacturers`,
          params
        })
          .then(resp => {
            if (!!params && !!params.all) {
              let manufacturerNames = {}
              for (let manufacturer of resp.data) {
                manufacturerNames[manufacturer.id] = manufacturer.name
              }
              commit('setManufacturerNames', manufacturerNames)
            }
            commit('setManufacturers', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getManufacturer({commit}, params) {
      commit('setRequestStatus', 'loading')
      let url = `/manufacturers/`
      if (!!params) {
        url += params.id
      } else {
        url += 'create'
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            commit('setManufacturer', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveManufacturer({state, dispatch, commit}, manufacturer) {
      commit('setRequestStatus', 'loading')
      let url = '/manufacturers'
      if (!!manufacturer.id) {
        url = '/manufacturers/' + manufacturer.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'POST',
          url,
          data: new Form(manufacturer).data
        })
          .then(resp => {
            let manufacturers = state.manufacturers
            if (!!manufacturer.id) {
              Object.assign(manufacturers.data.find(item => manufacturer.id === item.id), resp.data)
            } else {
              manufacturers.data.push(resp.data)
            }
            commit('setManufacturers', manufacturers)
            commit('setDialog', false)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    deleteManufacturer({state, dispatch, commit}, manufacturer) {
      return new Promise((resolve, reject) => {
        let url = `/manufacturers/${manufacturer.id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            commit('setRequestStatus', 'success')
            let manufacturers = state.manufacturers
            manufacturers.data = manufacturers.data.filter(m => m.id !== manufacturer.id)
            commit('setManufacturers', manufacturers)
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  },

  mutations: {
    setManufacturers(state, manufacturers) {
      state.manufacturers = manufacturers
    },
    setManufacturer(state, manufacturer) {
      state.manufacturer = manufacturer
    },
    setManufacturerNames(state, manufacturerNames) {
      state.manufacturerNames = manufacturerNames
    },
  },
  getters: {
    manufacturers: state => state.manufacturers,
    manufacturer: state => state.manufacturer,
    manufacturerNames: state => state.manufacturerNames,
  }
}
