import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import createMutationsSharer from 'vuex-shared-mutations';
import Auth from './auth'
import Category from './category'
import Product from './product'
import Main from './main'
import CategorySetting from './setting'
import Purchase from './purchase'
import StoreCategory from './storeCategory'
import PurchasedProducts from './purchasedProduct'
import Manufacturer from './manufacturer'
import Vendor from "./vendor";
import Parser from "./parser";
import Client from "./client";
import GroupProduct from "./groupProduct";
import Filter from "./filter";
import Offer from "./offer";
import Assemblies from "./assemblies";
import Sale from "./sale";
import Sections from "./sections";
import logo from '../assets/logo.png'
import bgDrawer from '../assets/bg-drawer.svg'
import bgDrawerCollapsed from '../assets/bg-drawer-collapsed.svg'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: bgDrawer,
    drawer: null,
  },
  mutations: {
    SET_BAR_IMAGE(state, payload) {
      state.barImage = payload
    },
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
  },

  modules: {
    Main,
    Auth,
    Category,
    Product,
    CategorySetting,
    Manufacturer,
    Vendor,
    Purchase,
    StoreCategory,
    PurchasedProducts,
    Parser,
    GroupProduct,
    Client,
    Filter,
    Offer,
    Assemblies,
    Sale,
    Sections,
  },
  plugins: [
    createPersistedState({
      paths: [
        'Auth.token',
        'Auth.expiredAt',
        'Main.locale',
      ],
    }),
    createMutationsSharer({
      predicate: [
        'Auth.token',
        'Auth.expiredAt',
        'Main.locale',
      ],
    }),
  ],
})
