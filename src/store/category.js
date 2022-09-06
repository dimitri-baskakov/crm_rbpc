import Vue from "vue";
import Form from "../helpers/form";

const defaultState = {
  categoryTree: [{children: []}],
  categorySelect: [],
  categoryProducts: null,
  categoryGroups: null,
  category: null,
  activeCategories: [],
  activeCategoryId: null,
  purchaseActiveCategories: [],
  purchaseActiveCategoryId: null,
  storeActiveCategories: [],
  storeActiveCategoryId: null,
  showAllProductsCategory: '',
  showAllProductsPurchase: '',
  showAllProductsAssembly: '',
  showAllProductsOffer: '',
  productCount: ''
}

export default {
  state: defaultState,
  actions: {
    getCategoryTree({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/categories`,
          params
        })
          .then(resp => {
            commit('setCategories', resp.data)
            commit('setProductCount', resp.data.productCount)
            commit('setShowAllProductsCategory', resp.data.showAllProductsCategory)
            commit('setShowAllProductsPurchase', resp.data.showAllProductsPurchase)
            commit('setShowAllProductsAssembly', resp.data.showAllProductsAssemmbly)
            commit('setShowAllProductsOffer', resp.data.showAllProductsOffer)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getCategory({commit}, payload) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        let url = `/categories/create`
        if (!!payload.id) {
          url = `/categories/${payload.id}/edit`
        }
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            let category = resp.data.data
            if (!payload.id) {
              for (let locale of Vue.prototype.$locales) {
                category.name[locale] = ''
              }
            }
            category.parent_id = payload.parent_id
            commit('setCategory', category)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getCategoryProducts({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/categories/products`,
          params
        })
          .then(resp => {
            if (params.mode === 'groupProducts'){
              commit('setCategoryGroups', resp.data)
              commit('setCategoryProducts', null)
            } else {
              commit('setCategoryProducts', resp.data)
              commit('setCategoryGroups', null)
            }
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },

    getSearchProducts({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/search/products`,
          params
        })
          .then(resp => {
            resp.data.products.data = resp.data.products.data.map(item => {
              item.search = params.search
              item.highlightResult = resp.data.highlightResult.find(h => h.id === item.id)
              return item
            })
            commit('setCategoryProducts', resp.data.products)
            // if (params.mode === 'groupProducts'){
            //   commit('setCategoryGroups', resp.data.products.data)
            //   commit('setCategoryProducts', null)
            // } else {
            //   commit('setCategoryProducts', resp.data.products)
            //   commit('setCategoryGroups', null)
            // }
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },

    saveCategory({commit}, category) {
      commit('setRequestStatus', 'loading')
      let url = '/categories'
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

    moveCategory({commit, dispatch}, data) {
      return new Promise((resolve, reject) => {
        let url = `/categories/${data.id}/move`;
        let method = 'PUT'
        Vue.prototype.$http({url, method, data})
          .then(resp => {
            commit('setRequestStatus', 'success')
            if (resp.status === 208) {
              commit('setCategories', resp.data)
            } else {
              dispatch('resetCategoryCache')
            }
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    attachProducts({commit, getters, dispatch}, {categoryId, productIds}) {
      return new Promise((resolve, reject) => {
        const url = `/categories/${categoryId}/attache-products`;
        const method = 'POST';
        const data = {
          productIds,
        };
        Vue.prototype.$http({url, method, data})
          .then(response => {
            let categoryProductsData = getters.categoryProducts
            categoryProductsData.data = getters.categoryProducts.data.filter(product => {
              return (productIds.indexOf(product.id) === -1)
            })
            commit('setCategoryProducts', categoryProductsData)
            commit('setRequestStatus', 'success')
            dispatch('resetCategoryCache')
            resolve(response);
          })
          .catch(error => {
            reject(error);
          })
      })
    },

    deleteCategory({commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/categories/${id}`;
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


    resetCategoryCache({commit}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/categories/reset-cache`,
        })
          .then(resp => {
            commit('setCategories', resp.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },

  mutations: {
    setCategories(state, data) {
      if (!!data) {
        state.categoryTree = data.categoryTree
        state.categorySelect = data.categorySelect
      } else {
        state.categoryTree = []
        state.categorySelect = []
      }
    },
    setCategoryProducts(state, categoryProducts) {
      state.categoryProducts = categoryProducts
    },
    setCategoryGroups(state, categoryGroups) {
      state.categoryGroups = categoryGroups
    },
    setCategory(state, category) {
      state.category = category
    },
    setActiveCategories(state, activeCategories) {
      state.activeCategories = activeCategories
    },
    setActiveCategoryId(state, activeCategoryId) {
      state.activeCategoryId = activeCategoryId
    },
    setPurchaseActiveCategories(state, purchaseActiveCategories) {
      state.purchaseActiveCategories = purchaseActiveCategories
    },
    setPurchaseActiveCategoryId(state, purchaseActiveCategoryId) {
      state.purchaseActiveCategoryId = purchaseActiveCategoryId
    },
    setStoreActiveCategories(state, storeActiveCategories) {
      state.storeActiveCategories = storeActiveCategories
    },
    setStoreActiveCategoryId(state, storeActiveCategoryId) {
      state.storeActiveCategoryId = storeActiveCategoryId
    },
    setDefaultsState(state) {
      state = defaultState
    },
    setShowAllProductsCategory(state, showAllProductsCategory) {
      state.showAllProductsCategory = showAllProductsCategory
    },
    setShowAllProductsPurchase(state, showAllProductsPurchase) {
      state.showAllProductsPurchase = showAllProductsPurchase
    },
    setShowAllProductsAssembly(state, showAllProductsAssembly) {
      state.showAllProductsAssembly = showAllProductsAssembly
    },
    setShowAllProductsOffer(state, showAllProductsOffer) {
      state.showAllProductsOffer = showAllProductsOffer
    },
    setProductCount(state, productCount) {
      state.productCount = productCount
    }
  },
  getters: {
    categoryTree: state => state.categoryTree,
    categorySelect: state => state.categorySelect,
    categoryProducts: state => state.categoryProducts,
    categoryGroups: state => state.categoryGroups,
    category: state => state.category,
    activeCategories: state => state.activeCategories,
    activeCategoryId: state => state.activeCategoryId,
    purchaseActiveCategories: state => state.purchaseActiveCategories,
    purchaseActiveCategoryId: state => state.purchaseActiveCategoryId,
    storeActiveCategories: state => state.storeActiveCategories,
    storeActiveCategoryId: state => state.storeActiveCategoryId,
    showAllProductsCategory: state => state.showAllProductsCategory,
    showAllProductsPurchase: state => state.showAllProductsPurchase,
    showAllProductsAssembly: state => state.showAllProductsAssembly,
    showAllProductsOffer: state => state.showAllProductsOffer,
    productCount: state => state.productCount,
  }
}
