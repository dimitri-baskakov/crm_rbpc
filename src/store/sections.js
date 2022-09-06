import Vue from "vue";
import Form from "../helpers/form";

export default {
  state: {
    sections: [],
  },
  actions: {
    getSections({commit}, params) {
      commit('setRequestStatus', 'loading')
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          method: 'GET',
          url: `/sections`,
          params
        })
          .then(resp => {
            commit('setSections', resp.data)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    saveSection({state, dispatch, commit}, section) {
      commit('setRequestStatus', 'loading')
      let url = '/sections';
      if (!!section.id) {
        url += '/' + section.id
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url,
          method: 'POST',
          data: new Form(section).data
        })
          .then(resp => {
            let sections = state.sections
            if (sections) {
              if (!!section.id) {
                Object.assign(sections.data.find(p => section.id === p.id), resp.data)
              } else {
                sections.data.unshift(resp.data)
              }
              commit('setSections', sections)
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

    saveSections({state, dispatch, commit}, sections) {
      commit('setRequestStatus', 'loading')
      let url = '/sections/save-all';
      return new Promise((resolve, reject) => {
        Vue.prototype.$http({
          url,
          method: 'POST',
          data: new Form(sections).data
        })
          .then(resp => {
            // let sections = state.sections
            let sections = resp.data
            if (sections) {
              // if (!!section.id) {
              //   Object.assign(sections.data.find(p => section.id === p.id), resp.data)
              // } else {
              //   sections.data.unshift(resp.data)
              // }
              // commit('setSections', sections)
            }
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    deleteSection({state, commit}, id) {
      return new Promise((resolve, reject) => {
        let url = `/sections/${id}`;
        let method = 'DELETE'
        Vue.prototype.$http({url, method})
          .then(resp => {
            let sections = state.sections
            if (sections && sections.data) {
              sections.data = sections.data.filter(section => section.id !== id)
            }
            commit('setSections', sections)
            commit('setRequestStatus', 'success')
            resolve(resp.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    uploadSectionImage ({ state, commit }, sectionData) {
      commit('setRequestStatus', 'loading')
      let url = '/sections/save-img'
      return new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append('file', sectionData.file)
        formData.append('sectionId', sectionData.sectionId)
        Vue.prototype.$http({
          url,
          method: 'POST',
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          },
        })
          .then(resp => {
            let src = resp.data && resp.data.src
            if (src) {
              let sections = state.sections
              sections.data = sections.data.map(s => {
                if (s.id === sectionData.sectionId) {
                  s.image = src
                }
                return s
              })
              commit('setSections', sections)
            }
            commit('setRequestStatus', 'success')
            resolve(resp.data.src)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
  },

  mutations: {
    setSections(state, sections) {
      state.sections = sections
    },
    setSection(state, section) {
      state.section = section
    },
  },
  getters: {
    sections: state => state.sections,
    section: state => state.section,
  },
}
