import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    offers: null,
    templateOffers: null,
    offer: null,
    offerProducts: [],
  },
  actions: {
    getOffers({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/offers`,
          params
        })
          .then(resp => {
            commit('setOffers', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getOffer({commit}, offer) {
      commit('setRequestStatus', 'loading')
      let url = !!offer ? `/offers/${offer.id}` : 'offers/create'
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            commit('setOffer', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveOffer({state, dispatch, commit}, offer) {
      commit('setRequestStatus', 'loading')
      let url = '/offers';
      if (!!offer.id) {
        url += '/' + offer.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url,
          method: 'POST',
          data: new Form(offer).data
        })
          .then(resp => {
            let offers = state.offers
            if (offers) {
              if (!!offer.id) {
                Object.assign(offers.data.find(p => offer.id === p.id), resp.data)
              } else {
                offers.data.unshift(resp.data)
              }
              commit('setOffers', offers)
              commit('setOfferProducts', [])
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

    deleteOffer({state, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/offers/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let offers = state.offers
            if (offers && offers.data) {
              offers.data = offers.data.filter(offer => offer.id !== id)
            }
            commit('setOffers', offers)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveOfferProductsPositions({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/offers/save-offer-products-positions`,
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

    getTemplateOffers({commit}) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/offers/template-offers`,
          method: 'GET',
        })
          .then(resp => {
            commit('setTemplateOffers', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveOfferTemplate({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/offers/save-offer-products-template`,
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

    deleteOfferTemplate({state, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/offers/template-offers/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let templateOffers = state.templateOffers
            templateOffers = templateOffers.filter(templateOffer => templateOffer.id !== id)
            commit('setTemplateOffers', templateOffers)
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
    setOffers(state, offers) {
      state.offers = offers
    },
    setOffer(state, offer) {
      state.offer = offer
    },
    setOfferProducts(state, offerProducts) {
      state.offerProducts = offerProducts
    },
    setTemplateOffers(state, templateOffers) {
      state.templateOffers = templateOffers
    },

  },
  getters: {
    offers: state => state.offers,
    offersPaid: state => (state.offers && state.offers.data && state.offers.data.filter(offer => offer.status === 'paid')) || [],
    offer: state => state.offer,
    offerProducts: state => state.offerProducts,
    templateOffers: state => state.templateOffers,
  },
}
