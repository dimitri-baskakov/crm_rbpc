import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    products: [],
    product: null,
  },
  actions: {
    getProducts({commit}) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/products`,
        })
          .then(resp => {
            commit('setProducts', resp.data.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },


    getNewProduct({commit}, payload) {
      commit('setRequestStatus', 'loading')
      let url = `/products/create`
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
            commit('setProduct', product)
            commit('setRequestStatus', 'success')
            resolve(product)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getEditProduct({commit}, product) {
      commit('setRequestStatus', 'loading')
      let url = `/products/${product.id}/edit`
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            let respProduct = resp.data.data
            if (!!product.hasOwnProperty('var_price')){
              respProduct.var_price = product.var_price
            }
            commit('setProduct', respProduct)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveProduct({state, dispatch, commit}, product) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: !!product.id ? '/products/' + product.id : '/products',
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

    deleteProduct({dispatch, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/products/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
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


    addImageToProduct({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/products/${params.productId}/add-image`,
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

    saveSpecificationToManyProducts({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/products/save-specification-products`,
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

    deleteSpecificationToManyProducts({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/products/delete-specification-products`,
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

    deleteSelectedProducts({dispatch, commit}, productsIds) {
      return new Promise((resolve, reject) => {
        let url = `/products/delete-selected-products`
        let method = 'POST'
        let data = new Form({productsIds}).data
        Vue.prototype.$http({url, method, data})
          .then(resp => {
            commit('setRequestStatus', 'success')
            // dispatch('resetCategoryCache')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    
    restoreSelectedProducts({dispatch, commit}, productsIds) {
      return new Promise((resolve, reject) => {
        let url = `/products/restore-selected-products`
        let method = 'POST'
        let data = new Form({productsIds}).data
        Vue.prototype.$http({url, method, data})
          .then(resp => {
            commit('setRequestStatus', 'success')
            // dispatch('resetCategoryCache')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  },

  mutations: {
    setProducts(state, products) {
      state.products = products
    },
    setProduct(state, product) {
      state.product = product
    },
  },
  getters: {
    products: state => state.products,
    product: state => state.product,
  }
}
