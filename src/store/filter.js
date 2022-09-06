import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    filters: [],
    specifications: [],
    categorySpecifications: [],
  },
  actions: {
    getFilters({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/filters`,
          params
        })
          .then(resp => {
            commit('setFilters', resp.data.filters)
            commit('setSpecifications', resp.data.specifications)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getCategoryFilters({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/filters/category-filters/`+params.category_id,
        })
          .then(resp => {
            commit('setFilters', resp.data.filters)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getSpecificationsByName({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/filters/specifications-by-name`,
          params,
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

    saveFilter({state, dispatch, commit}, filter) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: !!filter.id ? '/filters/' + filter.id : '/filters',
          method: 'POST',
          data: new Form(filter).data
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

    saveProperty({state, dispatch, commit}, property) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: !!property.id ? '/filters/properties/' + property.id : '/filters/properties',
          method: 'POST',
          data: new Form(property).data
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

    deleteProperty({commit}, payload) {
      return new Promise((resolve, reject) => {
        let url = `/filters/properties/${payload.propertyId}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getProperty({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/filters/properties/`+params.propertyId,
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

    specificationRefresh({commit}, filter) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: '/filters/specification-refresh',
          method: 'POST',
          data: new Form(filter).data
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

    propertyRefresh({commit}, filter) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: '/filters/property-refresh',
          method: 'POST',
          data: new Form(filter).data
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

    saveFilterParams({commit}, filters) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: '/filters/save-params',
          method: 'POST',
          data: new Form(filters).data
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

    saveFilterProperties({commit}, properties) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: '/filters/save-properties',
          method: 'POST',
          data: new Form(properties).data
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

    saveSpecification({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/filters/specifications/${params.id}/update`,
          method: 'POST',
          data: new Form(params).data
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

    deleteFilter({commit}, payload) {
      return new Promise((resolve, reject) => {
        let url = `/filters/${payload.filterId}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    unsetSpecifications({commit}, specification) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: '/filters/specifications/properties/unset',
          method: 'POST',
          data: new Form(specification).data
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

    deleteSpecificationByCategory({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/filters/delete-specifications-by-category`,
          method: 'POST',
          data: new Form(params).data
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
  },

  mutations: {
    setFilters(state, filters) {
      state.filters = filters
    },
    setSpecifications(state, specifications) {
      state.specifications = specifications
    },
  },
  getters: {
    filters: state => state.filters,
    specifications: state => state.specifications,
  }
}
