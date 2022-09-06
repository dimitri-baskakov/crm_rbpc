<template>
  <v-menu
    :close-on-click="false"
    :close-on-content-click="false"
    bottom
    open-delay="500"
    open-on-hover
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <div>
        <v-fab-transition
          :leave-absolute="true"
          :hide-on-leave="false"
          origin="center center 0"
        >
          <div
            :disabled="!selectedCategory"
            :key="offerProducts.length"
            @click="editOffer"
            class="pa-0 px-1 counting-box"
            tag="a"
            v-bind="attrs"
            v-on="on"
          >
            <div
              class="heading"
              v-if="offerProducts"
            >
              {{ offerProducts.length || 0 }}
            </div>
          </div>
        </v-fab-transition>
      </div>
    </template>
    <div
      class="white rounded pa-0 ma-0"
      style="border: 3px solid #B9D2EA !important;"
    >
      <offer-products
        :isNotNewStatus="isNotNewStatus"
        :manufacturerNames="manufacturerNames"
        :offer="offer"
        :offerProducts="offerProducts"
        style="width: 60vw; max-width: 1600px;"
        class="white mt-1 mx-1"
      ></offer-products>
    </div>
  </v-menu>
</template>

<script>
export default {
  components: {
    OfferForm: () => import("../components/offers/OfferForm"),
    OfferProducts: () => import("../components/category/OfferProducts"),
  },
  data: () => ({
    cartOfferId: null,
    innerHeight: 900,
    isMobile: false,
    mode: 'products',
    page: 1,
    perPage: 0,
    propertyIds: {},
    search: '',
    searchText: '',
    selectedCategories: [],
    selectedCategory: null,
    selectedProducts: [],
    selectedProperty: null,
    selectedSpecification: null,
    showAvailableProducts: 'all',
    showCategoryDialog: false,
    showCategoryFilters: false,
    showDeletedProducts: 'active',
    showForm: '',
    specificationIds: [],
    vendorIds: [],
  }),

  async created() {
    let cartOfferId = await this.$store.dispatch('getSettings', {settingsName: 'cartOfferId'})
    this.cartOfferId = cartOfferId[0] && cartOfferId[0].value || null
    let res = await this.$store.dispatch('getOffer', this.cartOfferId ? {id: this.cartOfferId} : null)
    if (Object.keys(res).length == 0) {
      await this.$store.dispatch('saveSetting', {
        cartOfferId: null,
      })
      await this.$store.dispatch('getOffer', null)
    }
    if (this.offer.products) {
      this.$store.commit('setOfferProducts', this.offer.products.map(product => {
        product.qty = product.pivot.qty
        product.price = product.pivot.price
        product.warranty = product.pivot.warranty
        product.percent = product.pivot.percent
        product.groupProducts = (product.group && product.group.products) || []
        product.producer_price = product.pivot.producer_price
        product.marginal_price = product.pivot.marginal_price

        return product
      }))
    }

    await this.$store.dispatch('getVendors', {all: true})

    if (!!this.activeCategoryId) {
      this.selectedCategory = {id: this.activeCategoryId}
      this.getCategoryProducts()
    } else {
      let settings = await this.$store.dispatch('getSettings', {settingsName: 'activeCategories'})
      let json = settings && settings.length && settings.find(s => s.name == 'activeCategories')
      let settingsValue = json && JSON.parse(json.value)
      let activeCategoryId = settingsValue.activeCategoryId
      let activeCategories = settingsValue.activeCategories
      if (activeCategoryId && activeCategories) {
        await this.getSelectedCategory({
          category: {id: activeCategoryId},
          selectedCategories: activeCategories,
        })
      }
    }
    await this.$store.dispatch('getCategoryTree')
    this.setEventProduct();
    this.setEventCategory();
    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersCategoryProducts'})
  },

  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize, {passive: true})
    for (let [index, filter] of this.filters.entries()) {
      this.propertyIds[index] = []
    }
  },

  async beforeDestroy() {
    if (this.activeCategoryId && this.activeCategories.length) {
      await this.$store.dispatch('saveSetting', {
        activeCategories: JSON.stringify({
          activeCategoryId: this.activeCategoryId,
          activeCategories: this.activeCategories,
        })
      })
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, {passive: true})
    }
  },

  computed: {
    ...mapGetters([
      'activeCategories',
      'activeCategoryId',
      'category',
      'categoryGroups',
      'categoryProducts',
      'categorySelect',
      'categoryTree',
      'dialog',
      'dialogMain',
      'filters',
      'manufacturerNames',
      'offer',
      'offerProducts',
      'product',
      'productCount',
      'requestStatus',
      'showAllProductsCategory',
      'vendors',
    ]),

    openedCategories() {
      // let names = this.activeCategories.map(item => {
      //   return item.name[this.$i18n.locale]
      // })
      // return names.reverse().join(' <> ')
      let names = this.activeCategories.map(item => {
        return {
          // disabled: true,
          // href: '',
          text: item.name[this.$i18n.locale],
        }
      })
      return names.reverse()
    },

    distinctVendorIds () {
      return [...new Set(this.categoryProducts && this.categoryProducts.data.map(cp => cp.vendor_id) || [])]
    },

    isNotNewStatus () {
      return this.offer && this.offer.status !== 'new'
    },
  },

  destroyed() {
    this.$store.commit('setDialog', false)
    this.$store.commit('setDialogMain', false)
    this.$store.commit('setCategoryProducts', null)
    this.$store.commit('setCategories', null)

    // this.$eventHandle.$off('change-page')
    this.$eventHandle.$off('change-params')
    // this.$eventHandle.$off('change-per-page')
    this.$eventHandle.$off('create-category')
    this.$eventHandle.$off('delete-category')
    this.$eventHandle.$off('delete-product');
    this.$eventHandle.$off('edit-category')
    this.$eventHandle.$off('edit-product');
    this.$eventHandle.$off('reset-tree')
    this.$eventHandle.$off('save-category')
    this.$eventHandle.$off('save-product');
    this.$eventHandle.$off('search')
    this.$eventHandle.$off('delete-selected-products')
    this.$eventHandle.$off('restore-selected-products')
  },

  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 600
      this.innerHeight = window.innerHeight - 100
    },

    setEventCategory() {
      this.$eventHandle.$on('create-category', (category) => {
        const parent_id = category ? category.id : null
        this.$store.dispatch('getCategory', {id: null, parent_id}).then(() => {
          this.$store.commit('setDialog', true)
          this.showForm = 'category'
        })
      })

      this.$eventHandle.$on('edit-category', (category) => {
        this.$store.dispatch('getCategory', category).then(() => {
          this.$store.commit('setDialog', true)
          this.showForm = 'category'
        })
      })

      this.$eventHandle.$on('delete-category', (category) => {
        let productAllow = !(!!category.children.length || !!category.products_count.productCount)
        this.showSwal(productAllow).then((res) => {
          if (productAllow) {
            if (res) {
              this.$store.dispatch('deleteCategory', category.id)
                .then(() => {
                  this.$store.commit('setActiveCategories', this.activeCategories.filter(c => c.id !== category.id))
                  this.selectedCategory = null
                  this.$store.commit('setCategory', null)
                  this.$eventHandle.$emit('delete-node', category)
                })
            }
          }
        })
      })

      this.$eventHandle.$on('save-category', (category) => {
        this.$store.dispatch('saveCategory', category).then(resp => {
          if (!!category.id) {
            this.$eventHandle.$emit('change-node', resp)
            let activeCategories = this.activeCategories
            Object.assign(activeCategories.find(c => category.id === c.id), resp)
            this.$store.commit('setActiveCategories', activeCategories)
          } else {
            this.$eventHandle.$emit('add-node', resp)
          }
          // this.closeModal()
          this.$store.dispatch('resetCategoryCache')
        })
      })

      this.$eventHandle.$on('reset-tree', () => {
        this.$store.dispatch('resetCategoryCache')
      });
    },

    createProduct() {
      this.$store.dispatch('getNewProduct', {category_id: this.selectedCategory.id}).then(() => {
        this.$store.commit('setDialog', true)
        this.showForm = 'product'
      })
    },

    setEventProduct() {
      this.$eventHandle.$on('edit-product', (product) => {
        this.$store.dispatch('getEditProduct', product).then(() => {
          this.$store.commit('setDialog', true)
          this.showForm = 'product'
        })
      });

      this.$eventHandle.$on('save-product', (product) => {
        this.$store.dispatch('saveProduct', product).then((response) => {
          let products = this.categoryProducts
          let newProduct = response.data;
          newProduct.manufacturer = !!newProduct.manufacturer ? newProduct.manufacturer.name : ''
          if (products) {
            if (!!product.id) {
              Object.assign(products.data.find(p => product.id === p.id), newProduct)
            } else {
              products.data.unshift(newProduct)
            }
          }
          this.$store.commit('setCategoryProducts', products)
          // this.$store.commit('setDialog', false)
          this.$store.dispatch('resetCategoryCache')
        })
      });

      this.$eventHandle.$on('delete-product', (product) => {
        this.showSwal().then((res) => {
          if (res) {
            this.$store.dispatch('deleteProduct', product.id)
              .then(() => {
                let products = this.categoryProducts
                products.data = products.data.filter(p => p.id !== product.id)
                this.$store.commit('setCategoryProducts', products)
                this.$store.dispatch('resetCategoryCache')
              })
          }
        })
      });

      this.$eventHandle.$on('change-params', (params) => {
        const { page, itemsPerPage } = params
        this.page = page
        this.perPage = itemsPerPage
        this.getCategoryProducts(params)
      })

      // this.$eventHandle.$on('change-per-page', (perPage) => {
      //   this.perPage = perPage
      //   this.getCategoryProducts();
      // })

      // this.$eventHandle.$on('change-page', (page) => {
      //   this.page = page

      //   this.getCategoryProducts();
      // })

      this.$eventHandle.$on('search', (search) => {
        this.searchText = search
        this.getCategoryProducts({search: search, initPage: 1})
        // if (!!search) {
        //   this.$store.dispatch('getSearchProducts', {search})
        //     .then(() => {
        //       this.$store.commit('setActiveCategories', [])
        //       this.$store.commit('setActiveCategoryId', null)
        //     })
        // }
      })

      this.$eventHandle.$on('delete-selected-products', (productsIds) => {
        this.showSwal().then((res) => {
          if (res) {
            this.$store.dispatch('deleteSelectedProducts', productsIds)
              .then(async () => {
                // let products = this.categoryProducts
                // products.data = products.data.filter(p => p.id !== product.id)
                // this.$store.commit('setCategoryProducts', products)
                await this.getCategoryProducts()
                this.$store.dispatch('resetCategoryCache')
              })
          }
        })
      })

      this.$eventHandle.$on('restore-selected-products', (productsIds) => {
        this.showSwal().then((res) => {
          if (res) {
            this.$store.dispatch('restoreSelectedProducts', productsIds)
              .then(async () => {
                // let products = this.categoryProducts
                // products.data = products.data.filter(p => p.id !== product.id)
                // this.$store.commit('setCategoryProducts', products)
                await this.getCategoryProducts()
                this.$store.dispatch('resetCategoryCache')
              })
          }
        })
      })
    },

    showSwal(allow = true) {
      if (allow) {
        return this.$swal({
          title: this.$t('are-you-sure') + "!",
          icon: "warning",
          value: true,
          buttons: [this.$t('cancel'), this.$t('continue')],
        })
      } else {
        return this.$swal({
          title: this.$t("Невозможно удалить") + "!",
          icon: "warning",
          value: true,
          button: 'OK',
        })
      }
    },

    async getSelectedCategory(data) {
      this.search = null
      this.specificationIds = []
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      this.vendorIds = []
      this.selectedCategory = data.category
      this.selectedCategories = data.selectedCategories
      this.$store.commit('setActiveCategoryId', this.selectedCategory.id)
      this.$store.commit('setActiveCategories', this.selectedCategories)
      this.page = 1
      dFn(this.getCategoryProducts);
      await this.getCategoryFilters()
    },

    async getCategoryProducts(params = {}) {
      if (!!params.hasOwnProperty('show_all_products_in_category')) {
        this.$store.commit('setShowAllProductsCategory', params.show_all_products_in_category)
      }
      if (this.selectedCategory) {
        params.category_id = this.selectedCategory.id
      }
      params.show_all_products_in_category = this.showAllProductsCategory
      params.perPage = this.perPage
      params.page = this.page
      params.pageName = 'category'
      params.mode = this.mode
      if (this.specificationIds.length) {
        params.specificationIds = this.specificationIds.join()
      }
      // if (this.propertyIds.length) {
      //   params.propertyIds = this.propertyIds.join()
      // }
      if (Object.values(this.propertyIds).find(v => v.length)) {
        params.propertyIds = JSON.stringify(this.propertyIds)
      }
      if (this.vendorIds.length) {
        params.vendorIds = this.vendorIds.join()
      }
      if (params.search) {
        delete params.category_id
      }
      if (params.initPage) {
        params.page = 1
      }
      let result = await this.$store.dispatch('getCategoryProducts', params)
      if (result.data && result.data.meta) {
        this.showDeletedProducts = result.data.meta.showDeletedProducts
        this.showAvailableProducts = result.data.meta.showAvailableProducts
      }
    },

    closeModal() {
      this.$store.commit('setDialog', false)
      this.showForm = ''
    },

    changeMode() {
      this.specificationIds = []
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      if (this.mode === 'products') {
        this.mode = 'groupProducts'
      } else {
        this.mode = 'products'
      }
      this.getCategoryProducts()
    },
    removeGroup(params) {
      this.showSwal().then((res) => {
        if (res) {
          this.$store.dispatch('deleteGroupProduct', params).then(() => {
            this.getCategoryProducts()
            this.$store.dispatch('resetCategoryCache')
          })
        }
      })
    },

    async getCategoryFilters() {
      await this.$store.dispatch('getVendors', {
        categoryId: this.activeCategoryId,
      })
      await this.$store.dispatch('getCategoryFilters', {
        category_id: this.activeCategoryId,
      })
    },

    resetFilter() {
      this.specificationIds = []
      this.propertyIds = {}
      for (let [index, filter] of this.filters.entries()) {
        this.propertyIds[index] = []
      }
      this.vendorIds = []
      this.getCategoryProducts()
    },

    editSpecification(specification) {
      this.$store.commit('setDialog', true)
      this.showForm = 'specification'
      this.selectedSpecification = specification
    },

    editProperty(property) {
      this.$store.commit('setDialog', true)
      this.showForm = 'property'
      this.selectedProperty = property
    },

    saveSpecification() {
      this.$store.dispatch('saveSpecification', {
        id: this.selectedSpecification.id,
        specificationName: this.selectedSpecification.name,
        category_id: this.selectedCategory.id,
        allCategory: this.showAllProductsCategory
      }).then(() => {
        this.closeModal()
        this.$store.dispatch('getFilters', {
          category_id: this.selectedCategory.id
        })
      })
    },

    saveProperty() {
      this.$store.dispatch('saveProperty', {
        id: this.selectedProperty.id,
        name: this.selectedProperty.name,
        category_id: this.selectedCategory.id,
        allCategory: this.showAllProductsCategory
      }).then(() => {
        this.closeModal()
        this.$store.dispatch('getFilters', {
          category_id: this.selectedCategory.id
        })
      })
    },

    clearSearch () {
      this.search = null
      this.$eventHandle.$emit('change-params', {page: 1})
    },

    saveCategory () {
      this.setLocaleData('ru');
      this.$eventHandle.$emit('save-category', this.category)
    },

    setLocaleData (loc) {
      for (let locale of this.$locales) {
        this.category.name[locale] = !!this.category.name[locale] ? this.category.name[locale] : this.category.name[loc]
      }
    },

    saveForm () {
      if (this.showForm === 'category') {
        this.saveCategory()
      } else if (this.showForm === 'product') {
        this.$eventHandle.$emit('save-product-from-categories')
      }
    },

    editOffer () {
      this.$store.commit('setDialogMain', true)
    },
  },

  watch: {
    filters: function (val, oldVal) {
      this.propertyIds = {}
      for (let [index, filter] of val.entries()) {
        this.propertyIds[index] = []
      }
    },
  },
}
</script>


<style>
.list-wrapper {
  position: absolute;
  right: 100px;
  top: 0px;
  background: white;
  z-index: 3;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.list {
  background: white;
  padding: 0px 5px;
  max-height: calc(100vh - 55px);
  overflow-y: scroll;
}

.tr:hover {
  background: #f5f5f5;
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.v-data-table table th {
  background: #DFDFDF !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-button:hover {
  background-color: #1565C0 !important;
}
</style>
