import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    purchases: null,
    purchase: null,
    purchaseProducts: [],
    serialNumberActiveProductId: null,
  },
  actions: {
    getPurchases({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/purchases`,
          params
        })
          .then(resp => {
            commit('setPurchases', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getPurchase({commit}, purchase) {
      commit('setRequestStatus', 'loading')
      let url = !!purchase ? `/purchases/${purchase.id}` : 'purchases/create'
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            commit('setPurchase', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    savePurchase({state, dispatch, commit}, purchase) {
      commit('setRequestStatus', 'loading')
      let url = '/purchases';
      if (!!purchase.id) {
        url += '/' + purchase.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url,
          method: 'POST',
          data: new Form(purchase).data
        })
          .then(resp => {
            let purchases = state.purchases
            if (purchases) {
              if (!!purchase.id) {
                Object.assign(purchases.data.find(p => purchase.id === p.id), resp.data)
              } else {
                purchases.data.unshift(resp.data)
              }
              commit('setPurchases', purchases)
              // commit('setPurchase', resp.data)
              // commit('setPurchaseProducts', [])
            }
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    deletePurchase({state, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/purchases/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let purchases = state.purchases
            purchases.data = purchases.data.filter(purchase => purchase.id !== id)
            commit('setPurchases', purchases)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    changeSerialNumberActiveProductId({state, commit}, id) {
      commit('setSerialNumberActiveProductId', state.serialNumberActiveProductId != id ? id : null)
    },
  },

  mutations: {
    setPurchases(state, purchases) {
      state.purchases = purchases
    },
    setPurchase(state, purchase) {
      state.purchase = purchase
    },
    setPurchaseProducts(state, purchaseProducts) {
      state.purchaseProducts = purchaseProducts
    },
    setSerialNumberActiveProductId(state, id) {
      state.serialNumberActiveProductId = id
    },
  },
  getters: {
    purchases: state => state.purchases,
    purchase: state => state.purchase,
    purchaseProducts: state => state.purchaseProducts,
    serialNumberActiveProductId: state => state.serialNumberActiveProductId,
  }
}
