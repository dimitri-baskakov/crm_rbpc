import Vue from "vue";
import Form from "../helpers/form";

const defaultState = {
  storeCategoryTree: [],
  storeCategorySelect: [],
  storeProducts: null,
  storeCategory: null,
  activeStoreCategories: [],
  activeStoreCategoryId: null,
  showAllProductsStoreCategory: '',
  storeProductCount: '',
}

export default {
  state: defaultState,
  actions: {
    getStoreCategoryTree({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/store-categories`,
          params
        })
          .then(resp => {
            commit('setStoreProductCount', resp.data.storeProductCount)
            commit('setRequestStatus', 'success')
            commit('setStoreCategories', resp.data)
            commit('setShowAllProductsStoreCategory', resp.data.showAllProductsStoreCategory)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getStoreCategory({commit}, payload) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        let url = `/store-categories/create`
        if (!!payload.id) {
          url = `/store-categories/${payload.id}/edit`
        }
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            let category = resp.data.data
            if (!!!payload.id) {
              for (let locale of Vue.prototype.$locales) {
                category.name[locale] = ''
              }
            }
            category.parent_id = payload.parent_id
            commit('setStoreCategory', category)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getStoreProducts({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/store-categories/products`,
          params
        })
          .then(resp => {
            commit('setStoreCategoryProducts', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },

    saveStoreCategory({commit}, category) {
      commit('setRequestStatus', 'loading')
      let url = '/store-categories'
      if (!!category.id) {
        url += '/' + category.id;
      }
      let method = 'POST'
      const formData = new Form(category)
      const data = formData.data

      return new Promise((resolve, reject) => {
        Vue.prototype.$http({url, method, data})
          .then(resp => {
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    moveStoreCategory({commit, dispatch}, data) {
      return new Promise((resolve, reject) => {
        let url = `/store-categories/${data.id}/move`;
        let method = 'PUT'
        Vue.prototype.$http({url, method, data})
          .then(resp => {
            commit('setRequestStatus', 'success')
            if (resp.status === 208) {
              commit('setStoreCategories', resp.data)
            } else {
              dispatch('resetStoreCategoryCache')
            }
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    resetStoreCategoryCache({commit}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/store-categories/reset-cache`,
        })
          .then(resp => {
            commit('setRequestStatus', 'success')
            commit('setStoreCategories', resp.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    attachStoreProducts({commit, getters,dispatch}, {categoryId, productIds}) {
      return new Promise((resolve, reject) => {
        const url = `/store-categories/${categoryId}/attache-products`;
        const method = 'POST';
        const data = {
          productIds,
        };
        Vue.prototype.$http({url, method, data})
          .then(response => {
            let storeProductsData = getters.storeProducts
            storeProductsData.data = getters.storeProducts.data.filter(product => {
              return (productIds.indexOf(product.id) === -1)
            })
            commit('setStoreCategoryProducts', storeProductsData)
            commit('setRequestStatus', 'success')
            dispatch('resetStoreCategoryCache')
            resolve(response);
          })
          .catch(error => {
            reject(error);
          })
      })
    },

    deleteStoreCategory({commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/store-categories/${id}`;
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
  },

  mutations: {
    setStoreCategories(state, data) {
      if (!!data) {
        state.storeCategoryTree = data.storeCategoryTree
        state.storeCategorySelect = data.storeCategorySelect
      } else {
        state.storeCategoryTree = []
        state.storeCategorySelect = []
      }
    },
    setStoreCategoryProducts(state, storeProducts) {
      state.storeProducts = storeProducts
    },
    setStoreCategory(state, storeCategory) {
      state.storeCategory = storeCategory
    },
    setActiveStoreCategories(state, activeStoreCategories) {
      state.activeStoreCategories = activeStoreCategories
    },
    setActiveStoreCategoryId(state, activeStoreCategoryId) {
      state.activeStoreCategoryId = activeStoreCategoryId
    },
    setDefaultsState(state) {
      state = defaultState
    },
    setShowAllProductsStoreCategory(state, showAllProductsStoreCategory) {
      state.showAllProductsStoreCategory = showAllProductsStoreCategory
    },
    setStoreProductCount(state, productCount) {
      state.storeProductCount = productCount
    },
  },
  getters: {
    storeCategoryTree: state => state.storeCategoryTree,
    storeCategorySelect: state => state.storeCategorySelect,
    storeProducts: state => state.storeProducts,
    storeCategory: state => state.storeCategory,
    activeStoreCategories: state => state.activeStoreCategories,
    activeStoreCategoryId: state => state.activeStoreCategoryId,
    showAllProductsStoreCategory: state => state.showAllProductsStoreCategory,
    storeProductCount: state => state.storeProductCount,
  }
}
