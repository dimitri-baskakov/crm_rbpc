<template>
  <v-navigation-drawer
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    permanent
    :right="$vuetify.rtl"
    :src="barImage"
    expand-on-hover
    app
    id="core-navigation-drawer"
    class="core-navigation__drawer"
    mobile-breakpoint="960"
    v-bind="$attrs"
    v-model="drawer"
    width="270"
  >

    <template v-slot:img="props">
      <v-img
        class="core-navigation__background"
        v-bind="props"
      />
    </template>

    <v-list
      dense
      nav
    >
      <v-list-item class="pa-0">
        <v-list-item-avatar
          class="pa-0"
          color="white"
          height="45"
          min-width="45"
          width="45"
        >
          <v-img
            height="45"
            src="@/assets/logo.png"
            width="45"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="display-2"
            v-text="profile.title"
          />
        </v-list-item-content>

        <v-list-item-content class="pt-0 core-navigation__language">
          <v-btn-toggle>
            <div 
            class="core-navigation__language-dropdown"
            :class="{open: isLanguageOpen}"
            >
              <template>
                <v-btn
                  class="ma-0 pa-0"
                  min-width="0"
                  x-small
                  @click="isProfileOpen = false, isLanguageOpen = !isLanguageOpen"
                >
                  <v-icon>mdi-earth</v-icon>
                </v-btn>
              </template>

              <v-list
                :tile="false"
                nav
              >
                <v-list-item @click="$store.commit('setLocale', 'ru')">
                  <v-list-item-title v-text="'ru'"/>
                </v-list-item>
                <v-list-item @click="$store.commit('setLocale', 'he')">
                  <v-list-item-title v-text="'he'"/>
                </v-list-item>
                <v-list-item @click="$store.commit('setLocale', 'en')">
                  <v-list-item-title v-text="'en'"/>
                </v-list-item>
              </v-list>
            </div>

            <div 
            class="core-navigation__language-dropdown core-navigation__language-dropdown_profile"
            :class="{open: isProfileOpen}"
            >
              <template>
                <v-btn
                  class="ma-0 pa-0 ml-2"
                  min-width="0"
                  x-small
                  @click="isLanguageOpen = false, isProfileOpen = !isProfileOpen"
                >
                  <v-icon>mdi-account</v-icon>
                </v-btn>
              </template>

              <v-list
                :tile="false"
                nav
                class="core-navigation__language-dropdown"
              >
                <div>
                  <v-list-item to="/user">
                    <v-list-item-title v-text="'Profile'"/>
                  </v-list-item>
                  <v-list-item @click="logout">
                    <v-list-item-title v-text="'Logout'"/>
                  </v-list-item>
                </div>
              </v-list>
            </div>
          </v-btn-toggle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list
      dense
      expand
    >
      <template v-for="(item, i) in computedItems">
          <v-list-group
            :active-class="`primary--text`"
            :color="'white'"
            :key="`group-${i}`"
            :sub-group="false"
            append-icon="mdi-menu-down"
            class="rounded mx-1"
            v-if="item.children"
          >
            <template v-slot:prependIcon>
              <v-list-item-avatar
                height="36"
                width="30"
                :tile="true"
              >
                <img
                  :src="`${require('@/assets/main-icons.svg')}#svgView(viewBox(${item.iconPosition}))`"
                  height="36"
                  width="30"
                />
              </v-list-item-avatar>
            </template>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title
                  class="pl-2"
                  v-text="item.title"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
            <template v-for="(child, i) in item.children">
              <v-list-item
                :active-class="`primary white--text`"
                :href="child.href"
                :key="`child-${i}`"
                :rel="child.href && child.href !== '#' ? 'noopener' : undefined"
                :target="child.href && child.href !== '#' ? '_blank' : undefined"
                :to="child.to"
                class="rounded mx-1"
              >
                <v-list-item-avatar
                  height="36"
                  width="30"
                  :tile="true"
                >
                  <img
                    :src="`${require('@/assets/main-icons.svg')}#svgView(viewBox(${child.iconPosition}))`"
                    height="36"
                    width="30"
                  />
                </v-list-item-avatar>
                <v-list-item-content
                  class="pl-4"
                  v-if="child.title || child.subtitle"
                >
                  <v-list-item-title v-text="child.title" />
                  <v-list-item-subtitle v-text="child.subtitle" />
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-group>
          <v-list-item
            :active-class="`primary white--text`"
            :href="item.href"
            :key="`item-${i}`"
            :rel="item.href && item.href !== '#' ? 'noopener' : undefined"
            :target="item.href && item.href !== '#' ? '_blank' : undefined"
            :to="item.to"
            class="rounded mx-1"
            v-else
          >
            <v-list-item-avatar
              height="36"
              width="30"
              :tile="true"
            >
              <img
                :src="`${require('@/assets/main-icons.svg')}#svgView(viewBox(${item.iconPosition}))`"
                :style="item.title == 'Сборки' ? 'transform: rotateZ(-90deg);' : ''"
                height="36"
                width="30"
              />
            </v-list-item-avatar>
            <v-list-item-content
              class="pl-2"
              v-if="item.title || item.subtitle"
            >
              <v-list-item-title v-text="item.title" />
              <v-list-item-subtitle v-text="item.subtitle" />
            </v-list-item-content>
          </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import {
    mapMutations,
    mapState,
  } from 'vuex'

  export default {
    name: 'DashboardCoreDrawer',

    props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      text: null,
      items: [
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 0, 32, 32',
          title: 'parser',
          to: '/parsers',
        },
        {
          icon: 'mdi-file-tree-outline',
          iconPosition: '0, 55, 32, 32',
          title: 'categories',
          to: '/categories',
        },
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 427, 32, 32',
          title: 'offers',
          to: '/offers',
        },
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 427, 32, 32',
          title: 'assemblies',
          to: '/assemblies',
        },
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 105, 32, 32',
          title: 'purchases',
          to: '/purchases',
        },
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 159, 32, 32',
          title: 'productsHistory',
          to: '/purchased-products',
        },
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 268, 32, 32',
          title: 'store',
          to: '/store',
        },
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 375, 32, 32',
          title: 'clients',
          to: '/clients',
        },
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 482, 32, 32',
          title: 'sales',
          to: '/sales',
        },
        {
          icon: 'mdi-card-text-outline',
          iconPosition: '0, 588, 32, 32',
          title: 'settings',
          children: [
            {
              icon: 'mdi-card-text-outline',
              iconPosition: '0, 218, 32, 32',
              title: 'manufacturers',
              to: '/manufacturers',
            },
            {
              icon: 'mdi-card-text-outline',
              iconPosition: '0, 322, 32, 32',
              title: 'vendors',
              to: '/vendors',
            },
            {
              icon: 'mdi-card-text-outline',
              iconPosition: '0, 533, 32, 32',
              title: 'filters',
              to: '/filters',
            },
            {
              icon: 'mdi-card-text-outline',
              iconPosition: '0, 588, 32, 32',
              title: 'systemSettings',
              to: '/system-settings',
            },
          ]
        },
      ],
      isLanguageOpen: false,
      isProfileOpen: false
    }),

    computed: {
      ...mapState(['barColor', 'barImage']),
      drawer: {
        get() {
          return this.$store.state.drawer
        },
        set(val) {
          this.$store.commit('SET_DRAWER', val)
        },
      },
      computedItems() {
        return this.items.map(this.mapItem)
      },
      profile() {
        return {
          avatar: true,
          title: this.$t('avatar'),
        }
      },
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),

      mapItem(item) {
        return {
          ...item,
          children: item.children ? item.children.map(this.mapItem) : undefined,
          title: this.$t(item.title),
        }
      },

      logout: function () {
        this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/login')
          })
      },
    },
  }
</script>

<style lang="sass">
  .core-navigation__background 
    .v-image__image
      background-position: -7px -9px !important
    .v-image__image
      width: 110% !important
      height: 110% !important
  .core-navigation__language
    width: auto !important
    height: auto !important
    transform: translateY(3px) !important
    overflow: visible !important
    z-index: 999 !important
    .v-item-group
      background: transparent !important
    button
      height: auto !important
    .theme--dark.v-btn.v-btn--has-bg
      background: transparent !important
      border: none !important
      box-shadow: none !important
  .core-navigation__language-dropdown
    position: relative
    display: flex
    justify-content: center
    align-items: center
    &_profile
      margin-left: 10px !important
      .v-icon
        font-size: 27px !important
    .v-list
      width: 85px !important
      position: absolute
      top: calc(100% - 2px) !important
      left: calc(50% - 42.5px) !important
      padding: 4px !important
      margin-top: 5px !important
      border-radius: 4px !important
      background-color: #7f7a7a !important
      transform: scale(0)
      transform-origin: top center
      transition: .2s ease
    div,
    .v-list-item
      width: 100% !important
    .v-list-item__title
      display: flex !important
      justify-content: center !important
      align-items: center !important
    &:hover
      .v-list
        transform: scale(1) 
  .v-list-item__icon--text,
  .v-list-item__icon:first-child
    margin-right: 18px
  .v-navigation-drawer--mini-variant
    width: 70px !important
  .v-list-item--link
    padding-left: 13px !important
  .v-list-group__header__prepend-icon
    margin-right: 0 !important
</style>
