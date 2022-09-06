import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    clients: null,
    allClients: [],
    client: null,
    posts: [],
  },
  actions: {
    getClients({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/clients`,
          params
        })
          .then(resp => {
            if (!!params && !!params.all) {
              commit('setAllClients', resp.data)
            } else {
              commit('setClients', resp.data)
            }
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getPosts({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/posts`,
          params
        })
          .then(resp => {
            commit('setPosts', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    getClient({commit}, client) {
      let url = `/clients/create`
      if (!!client) {
        url = `/clients/${client.id}/edit`
      }
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({method: 'GET', url})
          .then(resp => {
            let client = resp.data
            commit('setClient', client)
            commit('setRequestStatus', 'success')
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveClient({state, dispatch, commit}, client) {
      commit('setRequestStatus', 'loading')
      let url = '/clients';
      if (!!client.id) {
        url += '/' + client.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({url, method: 'POST', data: new Form(client).data})
          .then(resp => {
            // if (resp.data.error == 'duplicate email') {
            //   commit('setRequestStatus', 'success')
            //   console.log(resp.data)
            //   resolve(resp.data)
            //   return 0
            // }
            // if (resp.data) {
            //   commit('setRequestStatus', 'success')
            //   resolve(resp.data)
            //   return 0
            // }
            let clients = state.clients
            if (clients) {
              if (!!client.id) {
                Object.assign(clients.data.find(p => client.id === p.id), resp.data)
              } else {
                clients.data.unshift(resp.data)
              }
              commit('setClients', clients)
            }
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    savePost({state, dispatch, commit}, post) {
      commit('setRequestStatus', 'loading')
      let url = '/posts';
      if (!!post.id) {
        url += '/' + post.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({url, method: 'POST', data: new Form(post).data})
          .then(resp => {
            let posts = state.posts
            if (posts) {
              if (!!post.id) {
                Object.assign(posts.data.find(p => post.id === p.id), resp.data)
              } else {
                posts.data.push(resp.data)
              }
              commit('setPosts', posts)
            }
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    deleteClient({state, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/clients/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let clients = state.clients
            clients.data = clients.data.filter(client => client.id !== id)
            commit('setClients', clients)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    deletePost({state, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/posts/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let posts = state.posts
            posts.data = posts.data.filter(post => post.id !== id)
            commit('setPosts', posts)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    switchClient({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/clients/switch-client`,
          params
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

    getClientByEmail({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/clients/get-client/by-email`,
          params
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

    saveAllPosts ({commit}, posts) {
      commit('setRequestStatus', 'loading')
      let url = '/posts/all';
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({url, method: 'POST', data: posts})
          .then(resp => {
            commit('setPosts', posts)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    sendRestoreEmail ({commit}, clientId) {
      commit('setRequestStatus', 'loading')
      let url = '/clients/send-restore-email'
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({url, method: 'POST', data: {clientId}})
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
    setClients(state, clients) {
      state.clients = clients
    },
    setPosts(state, posts) {
      state.posts = posts
    },
    setAllClients(state, allClients) {
      state.allClients = allClients
    },
    setClient(state, client) {
      state.client = client
    },
  },
  getters: {
    clients: state => state.clients,
    posts: state => state.posts,
    allClients: state => state.allClients,
    client: state => state.client,
  }
}
