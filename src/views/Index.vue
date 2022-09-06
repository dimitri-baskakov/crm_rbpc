<template>
  <v-app>

    <dashboard-core-drawer expandOnHover />

    <dashboard-core-view />

    <v-overlay :value="!['/categories', '/offers', '/filters', '/purchases', '/purchased-products', '/store', '/sales', '/clients'].includes($route.path) && requestStatus === 'loading'">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

   <dashboard-core-settings />
  </v-app>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar: () => import('./components/core/AppBar'),
      DashboardCoreDrawer: () => import('./components/core/Drawer'),
      DashboardCoreSettings: () => import('./components/core/Settings'),
      DashboardCoreView: () => import('./components/core/View'),
    },

    data: () => ({
      expandOnHover: false,
    }),

    computed:{
      ...mapGetters(['requestStatus'])
    }
  }
</script>
