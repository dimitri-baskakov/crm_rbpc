import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    assemblies: null,
    assembly: null,
    assemblyProducts: [],
    collapsedCategories: [],
  },
  actions: {
    getAssemblies({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/assemblies`,
          params
        })
          .then(resp => {
            commit('setAssemblies', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getAssembly({commit}, assembly) {
      commit('setRequestStatus', 'loading')
      let url = !!assembly ? `/assemblies/${assembly.id}` : 'assemblies/create'
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            commit('setAssembly', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveAssembly({state, dispatch, commit}, assembly) {
      commit('setRequestStatus', 'loading')
      let url = '/assemblies';
      if (!!assembly.id) {
        url += '/' + assembly.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url,
          method: 'POST',
          data: new Form(assembly).data
        })
          .then(resp => {
            let assemblies = state.assemblies
            if (assemblies) {
              if (!!assembly.id) {
                Object.assign(assemblies.data.find(p => assembly.id === p.id), resp.data)
              } else {
                assemblies.data.unshift(resp.data)
              }
              commit('setAssemblies', assemblies)
              commit('setAssemblyProducts', [])
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

    deleteAssembly({state, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/assemblies/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let assemblies = state.assemblies
            if (assemblies && assemblies.data) {
              assemblies.data = assemblies.data.filter(assembly => assembly.id !== id)
            }
            commit('setAssemblies', assemblies)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveAssemblyProductsPositions({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url: `/assemblies/save-assembly-products-positions`,
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

    saveCollapsedCategories({state, commit}, id) {
      if (!id) {
        return
      }
      let collapsedCategories = state.collapsedCategories
      let index = collapsedCategories.indexOf(id)
      if (index > -1) {
        collapsedCategories.splice(index, 1)
      } else {
        collapsedCategories.push(id)
      }
      commit('setCollapsedCategories', collapsedCategories)
    },
  },

  mutations: {
    setAssemblies(state, assemblies) {
      assemblies.data = assemblies.data.map(a => {
        let categories = []
        a.products.forEach(p => {
          if (!categories[p.root_category.id]) {
            categories[p.root_category.id] = []
          }
          if (p.status == 'available' || p.status.includes('order')) {
            categories[p.root_category.id].push(p.id)
          }
        })
        a.detectStatus = a.status === 'enabled' && !categories.find(c => c && c.length == 0)
        return a
      })
      state.assemblies = assemblies
    },
    setAssembly(state, assembly) {
      if (assembly.products) {
        let categories = []
        assembly.products.forEach(p => {
          if (!categories[p.root_category.id]) {
            categories[p.root_category.id] = []
          }
          if (p.status == 'available' || p.status.includes('order')) {
            categories[p.root_category.id].push(p.id)
          }
        })
        assembly.detectStatus = assembly.status === 'enabled' && !categories.find(c => c && c.length == 0)
      }
      state.assembly = assembly
    },
    setAssemblyProducts(state, assemblyProducts) {
      state.assemblyProducts = assemblyProducts
    },
    setCollapsedCategories(state, collapsedCategories) {
      state.collapsedCategories = collapsedCategories
    },
  },

  getters: {
    assemblies: state => state.assemblies,
    assembliesPaid: state => (state.assemblies && state.assemblies.data && state.assemblies.data.filter(assembly => assembly.status === 'paid')) || [],
    assembly: state => state.assembly,
    assemblyProducts: state => state.assemblyProducts,
    collapsedCategories: state => state.collapsedCategories,
  },
}
