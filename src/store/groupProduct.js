import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    groupProducts: [],
    groupProductData: null,
  },
  actions: {
    getNewGroupProduct({commit}, params) {
      commit('setRequestStatus', 'loading')
      let url = `/group-products/create`
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url, params})
          .then(resp => {
            commit('setGroupData', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    createGroups({commit}, params) {
      commit('setRequestStatus', 'loading')
      let url = `/group-products/create/groups`
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url, params})
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getGroupProduct({commit}, params) {
      commit('setRequestStatus', 'loading')
      let url = `/group-products/${params.id}`
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url, params})
          .then(resp => {
            commit('setGroupData', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    addProductToGroup({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/group-products/${params.id}/add-product`,
          params
        })
          .then(resp => {
            commit('setGroupData', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveGroupProduct({state, dispatch, commit}, groupProduct) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: !!groupProduct.id ? '/group-products/' + groupProduct.id : '/group-products',
          method: 'POST',
          data: new Form(groupProduct).data
        })
          .then(resp => {
            commit('setRequestStatus', 'success')
            dispatch('resetCategoryCache')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    mergeGroupProduct({state, commit}, params) {
      commit('setRequestStatus', 'loading')
      // console.log(params, 234234)
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: '/group-products/merge/groups',
          method: 'PUT',
          data: params
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

    deleteGroupProduct({state, commit}, params) {
      return new Promise((resolve, reject) => {
        let url = `/group-products/${params.id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method, params})
          .then(resp => {
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
    setGroupProducts(state, groupProducts) {
      state.groupProducts = groupProducts
    },
    setGroupData(state, groupProductData) {
      state.groupProductData = groupProductData
    },
  },
  getters: {
    groupProducts: state => state.groupProducts,
    groupProductData: state => state.groupProductData,
  }
}
