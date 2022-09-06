import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    vendors: null,
    allVendors: [],
    vendor: null
  },
  actions: {
    getVendors({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/vendors`,
          params
        })
          .then(resp => {
            if (!!params && !!params.all) {
              commit('setAllVendors', resp.data)
            } else {
              commit('setVendors', resp.data)
            }
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getVendor({commit}, params) {
      commit('setRequestStatus', 'loading')
      let url = `/vendors/`
      if (!!params) {
        url += params.id
      } else {
        url += 'create'
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            commit('setVendor', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveVendor({state, dispatch, commit}, vendor) {
      commit('setRequestStatus', 'loading')
      let url = '/vendors'
      if (!!vendor.id) {
        url = '/vendors/' + vendor.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'POST',
          url,
          data: new Form(vendor).data
        })
          .then(resp => {
            let vendors = state.vendors
            if (!!vendor.id) {
              Object.assign(vendors.data.find(v => vendor.id === v.id), resp.data)
              vendors.data = vendors.data.filter(item => resp.data.removedVendorIds.indexOf(item.id))
            } else {
              vendors.data.push(resp.data)
            }
            commit('setVendor', null)
            commit('setVendors', vendors)
            commit('setDialog', false)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    deleteVendor({state, dispatch, commit}, vendor) {
      return new Promise((resolve, reject) => {
        let url = `/vendors/${vendor.id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let vendors = state.vendors
            vendors.data = vendors.data.filter(item => item.id !== vendor.id)
            commit('setVendor', null)
            commit('setVendors', vendors)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  },

  mutations: {
    setVendors(state, vendors) {
      state.vendors = vendors
    },
    setAllVendors(state, allVendors) {
      state.allVendors = allVendors
    },
    setVendor(state, vendor) {
      state.vendor = vendor
    },
  },
  getters: {
    vendors: state => state.vendors,
    allVendors: state => state.allVendors,
    vendor: state => state.vendor,
  }
}
