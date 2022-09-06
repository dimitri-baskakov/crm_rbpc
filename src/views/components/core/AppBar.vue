<template>
  <div>
    <v-btn
      @click="setDrawer(!drawer)"
      absolute
      class="mx-2"
      color="primary"
      dark
      fab
      left
      style="left: -36px;"
      top
    >
      <v-icon dark>
        mdi-star
      </v-icon>
    </v-btn>
    <v-app-bar
      id="app-bar"
      absolute
      app
      color="transparent"
      flat
      height="75"
      v-if="!['/categories', '/offers', '/filters', '/purchases', '/purchased-products', '/store', '/sales', '/clients'].includes($route.path)"
    >
      <v-btn
        class="mr-3"
        elevation="1"
        fab
        small
        @click="setDrawer(!drawer)"
      >
        <v-icon v-if="value">
          mdi-view-quilt
        </v-icon>

        <v-icon v-else>
          mdi-dots-vertical
        </v-icon>
      </v-btn>

      <v-toolbar-title
        class="hidden-sm-and-down font-weight-light"
        v-text="$t($route.name)"
      />

      <v-spacer/>

      <v-spacer></v-spacer>
      <v-text-field
        @keyup.enter="$eventHandle.$emit('search', search)"
        append-icon="mdi-magnify"
        @click:append="$eventHandle.$emit('search', search)"
        :label="$t('search')"
        single-line
        hide-details
        v-model="search"
      />
      <v-spacer></v-spacer>
      <div class="mx-3"/>

      <!--    <v-menu-->
      <!--      bottom-->
      <!--      left-->
      <!--      offset-y-->
      <!--      origin="top right"-->
      <!--      transition="scale-transition"-->
      <!--    >-->
      <!--      <template v-slot:activator="{ attrs, on }">-->
      <!--        <v-btn-->
      <!--          class="ml-2"-->
      <!--          min-width="0"-->
      <!--          text-->
      <!--          v-bind="attrs"-->
      <!--          v-on="on"-->
      <!--        >-->
      <!--          <v-badge-->
      <!--            color="red"-->
      <!--            overlap-->
      <!--            bordered-->
      <!--          >-->
      <!--            <template v-slot:badge>-->
      <!--              <span>5</span>-->
      <!--            </template>-->

      <!--            <v-icon>mdi-bell</v-icon>-->
      <!--          </v-badge>-->
      <!--        </v-btn>-->
      <!--      </template>-->

      <!--      <v-list-->
      <!--        :tile="false"-->
      <!--        nav-->
      <!--      >-->
      <!--        <div>-->
      <!--          <app-bar-item-->
      <!--            v-for="(n, i) in notifications"-->
      <!--            :key="`item-${i}`"-->
      <!--          >-->
      <!--            <v-list-item-title v-text="n"/>-->
      <!--          </app-bar-item>-->
      <!--        </div>-->
      <!--      </v-list>-->
      <!--    </v-menu>-->
      <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            class="ml-2"
            min-width="0"
            text
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-flag</v-icon>
          </v-btn>
        </template>

        <v-list
          :tile="false"
          nav
        >
          <div>
            <div @click="$store.commit('setLocale', 'ru')">
              <app-bar-item>
                <v-list-item-title v-text="'ru'"/>
              </app-bar-item>
            </div>
            <div @click="$store.commit('setLocale', 'he')">
              <app-bar-item>
                <v-list-item-title v-text="'he'"/>
              </app-bar-item>
            </div>
            <div @click="$store.commit('setLocale', 'en')">
              <app-bar-item>
                <v-list-item-title v-text="'en'"/>
              </app-bar-item>
            </div>
          </div>
        </v-list>
      </v-menu>

      <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            class="ml-2"
            min-width="0"
            text
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list
          :tile="false"
          nav
        >
          <div>
            <app-bar-item to="/user">
              <v-list-item-title v-text="'Profile'"/>
            </app-bar-item>
            <div @click="logout">
              <app-bar-item>
                <v-list-item-title v-text="'Logout'"/>
              </app-bar-item>
            </div>
          </div>
        </v-list>
      </v-menu>

      <v-dialog v-model="dialog" persistent max-width="600px"></v-dialog>
    </v-app-bar>
  </div>
</template>

<script>
  // Components
  import {VHover, VListItem} from 'vuetify/lib'

  // Utilities
  import {mapState, mapMutations, mapGetters} from 'vuex'

  export default {
    name: 'DashboardCoreAppBar',
    components: {
      AppBarItem: {
        render(h) {
          return h(VHover, {
            scopedSlots: {
              default: ({hover}) => {
                return h(VListItem, {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                }, this.$slots.default)
              },
            },
          })
        },
      },
    },

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      notifications: [
        'Mike John Responded to your email',
        'You have 5 new tasks',
        'You\'re now friends with Andrew',
        'Another Notification',
        'Another one',
      ],

      dialog: false,
      search: ''
    }),

    computed: {
      ...mapState(['drawer']),
      ...mapGetters(['user', 'requestStatus'])
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      logout: function () {
        this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/login')
          })
      },
    },
  }
</script>
