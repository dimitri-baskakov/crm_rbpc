<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  created() {
    const Store = this.$store;
    this.$vuetify.rtl = Store.getters.locale === 'he'
    this.$i18n.locale = Store.getters.locale

    const Router = this.$router;
    this.$http.interceptors.response.use(undefined, function (e) {
      const err = e.response
      return new Promise((resolve, reject) => {
        Store.commit('setRequestStatus', 'error')
        Store.commit('setRequestMessage', err.data.message)
        switch (err.status) {
          case 401:
            Store.dispatch('logout');
            Router.push('/login')
            break;
          case 422:
            Store.commit('setErrors', err.data.errors)
            break;
        }
        throw err;
      });
    });

    Store.dispatch('getSettings', {settingsName: 'colorThemeSettings'}).then((response) => {
      let theme = JSON.parse(response.value);
      Object.keys(theme).forEach(i => {
        this.$vuetify.theme.themes.dark[i] = theme[i];
      });
      Object.keys(theme).forEach(i => {
        this.$vuetify.theme.themes.light[i] = theme[i];
      });
    });
  },
  beforeMount() {
    this.$store.dispatch('refreshDelayed');
    this.$store.dispatch('me');
  },
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
  },
  watch: {
    isLogged: {
      immediate: true,
      handler() {
        if (!this.isLogged && (this.$route.path !== '/login')) {
          this.$router.push(`/login`);
        }
      },
    },
  },
}
</script>

<style lang="scss">
.items-table{
  height: 80vh;
  overflow: hidden;
  overflow-y: scroll;
}
html {
  overflow-y: auto;
}
</style>
