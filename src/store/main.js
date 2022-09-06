import Vue from 'vue'

export default {
  state: {
    dialog: false,
    dialogMain: false,
    dialogNote: false,
    errors: null,
    locale: '',
    openedDialogs: [],
    requestMessage: '',
    requestStatus: '',
  },
  mutations: {
    setRequestMessage(state, requestMessage) {
      state.requestMessage = requestMessage
    },
    setRequestStatus(state, requestStatus) {
      state.requestStatus = requestStatus
    },
    setErrors(state, errors) {
      state.errors = errors
      if (state.errors) {
        setTimeout(() => {
          state.errors = null
        }, 5000)
      }
    },
    setDialog(state, dialog) {
      state.dialog = dialog
    },
    setDialogMain(state, dialogMain) {
      state.dialogMain = dialogMain
    },
    setDialogNote(state, dialogNote) {
      state.dialogNote = dialogNote
    },
    setLocale(state, locale) {
      state.locale = locale
      window.location.reload()
    },
    setOpenedDialogs(state, payload) {
      if (payload.value) {
        !state.openedDialogs.includes(payload.name) && state.openedDialogs.push(payload.name)
      } else {
        state.openedDialogs = state.openedDialogs.filter(od => od != payload.name)
      }
    },
  },

  actions: {
    setOpenedDialogs({ commit }, payload) {
      commit('setOpenedDialogs', payload)
    }
  },
  getters: {
    requestStatus: state => state.requestStatus,
    requestMessage: state => state.requestMessage,
    locales: state => state.locales,
    locale: state => state.locale,
    errors: state => state.errors,
    dialog: state => state.dialog,
    dialogMain: state => state.dialogMain,
    dialogNote: state => state.dialogNote,
    openedDialogs: state => state.openedDialogs,
  },
}
