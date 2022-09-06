import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    sales: null,
    sale: null,
    saleProducts: [],
  },
  actions: {
    deleteSale({state, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/sales/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let sales = state.sales
            sales.data = sales.data.filter(sale => sale.id !== id)
            commit('setSales', sales)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    
    getSales({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/sales`,
          params
        })
          .then(resp => {
            commit('setSales', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getSale({commit}, sale) {
      commit('setRequestStatus', 'loading')
      let url = !!sale ? `/sales/${sale.id}` : 'sales/create'
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            commit('setSale', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveSale({state, dispatch, commit}, sale) {
      commit('setRequestStatus', 'loading')
      let url = '/sales';
      if (!!sale.id) {
        url += '/' + sale.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url,
          method: 'POST',
          data: new Form(sale).data
        })
          .then(resp => {
            let sales = state.sales
            if (sales) {
              if (!!sale.id) {
                Object.assign(sales.data.find(p => sale.id === p.id), resp.data)
              } else {
                sales.data.unshift(resp.data)
              }
              commit('setSales', sales)
              commit('setSaleProducts', [])
              commit('setDialog', false)
            }
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveSaleProductsPositions({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/sales/save-sale-products-positions`,
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

    buildSale({state, dispatch, commit}, offer) {
      commit('setRequestStatus', 'loading')
      let url = '/offers/build-sale/' + offer.id
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url,
          method: 'POST',
          // data: new Form(offer).data
        })
          .then(resp => {
            let sales = state.sales
            if (sales) {
              // if (!!sale.id) {
              //   Object.assign(sales.data.find(p => sale.id === p.id), resp.data)
              // } else {
              //   sales.data.unshift(resp.data)
              // }
              // commit('setSales', sales)
              // commit('setSaleProducts', [])
            }
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
    setSales(state, sales) {
      state.sales = sales
    },
    setSale(state, sale) {
      state.sale = sale
    },
    setSaleProducts(state, saleProducts) {
      state.saleProducts = saleProducts
      // if (state.sale.calculate_mode === 'auto') {
      //   state.sale.expenses = saleProducts.reduce((total, product) => {
      //     return total + parseFloat(product.var_price)
      //   }, 0)
      //   state.sale.margin = parseFloat(state.sale.amount) - parseFloat(state.sale.expenses)
      // }
    },
  },
  getters: {
    sales: state => state.sales,
    sale: state => state.sale,
    saleProducts: state => state.saleProducts,
  }
}
