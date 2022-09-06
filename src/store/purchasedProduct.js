import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    purchasedProducts: null,
    purchasedProduct: null,
  },
  actions: {
    getPurchasedProducts({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/purchased-products`,
          params
        })
          .then(resp => {
            // console.log(resp)
            commit('setPurchasedProducts', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getPurchaseProduct({commit}, payload) {
      commit('setRequestStatus', 'loading')
      let url = `/purchased-products/create`
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            let product = resp.data.data
            for (let locale of Vue.prototype.$locales) {
              product.name[locale] = ''
              product.description[locale] = ''
            }
            if (payload.hasOwnProperty('category_id')) {
              product.category_id = payload.category_id
            }
            commit('setPurchasedProduct', product)
            commit('setRequestStatus', 'success')
            resolve(product)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getEditPurchaseProduct({commit}, product) {
      commit('setRequestStatus', 'loading')
      let url = `/purchase-products/${product.id}/edit`
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            let product = resp.data.data
            commit('setPurchaseProduct', product)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    savePurchaseProduct({state, dispatch, commit}, product) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: !!product.id ? '/purchase-products/' + product.id : '/products',
          method: 'POST',
          data: new Form(product).data
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

    deletePurchaseProduct({dispatch, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/purchase-products/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
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
    setPurchasedProducts(state, purchasedProducts) {
      state.purchasedProducts = purchasedProducts
    },
    setPurchasedProduct(state, purchasedProduct) {
      state.purchasedProduct = purchasedProduct
    },
  },
  getters: {
    purchasedProducts: state => state.purchasedProducts,
    purchasedProduct: state => state.purchasedProduct,
  }
}
