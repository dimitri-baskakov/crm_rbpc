<template>
  <div>
    <v-data-table
      :headers="headers"
      :items-per-page="-1"
      :items="offerProducts"
      class="category-products-table category-goods__added-group"
      dense
      disable-sort
      fixed-header
      height="40vh"
      hide-default-footer
      ref="table"
      sort-by="pivot.position"
    >
      <template #header.root_category="{ header }">
        <div class="d-flex justify-center align-center">
          <span class="font-12">{{ $t('root_category') }}</span>
        </div>
      </template>
      <template #header.id="{ header }">
        <div class="d-flex flex-column justify-center align-center">
          <span class="font-12">ID</span>
          <span class="font-weight-black font-12">ID гр.</span>
        </div>
      </template>
      <template #header.name="{ header }">
        <div class="d-flex flex-column justify-center align-end">
          <span class="font-12 mr-2">{{ $t('name') }}</span>
          <span class="font-12 mr-2">{{ $t('sku_original') }}</span>
        </div>
      </template>
      <template #header.manufacturer="{ header }">
        <div class="d-flex flex-column justify-center align-end">
          <span class="font-12 mr-2">{{ $t('manufacturer') }}</span>
          <span class="font-12 mr-2">{{ $t('vendor') }}</span>
        </div>
      </template>
      <template #header.producer_price="{ header }">
        <div class="d-flex flex-column justify-center align-center">
          <div class="w-100 d-flex justify-end font-12 mr-3" style="width: 100%;">{{ $t('price') }}</div>
          <div class="w-100 d-flex justify-center font-12" style="width: 100%;">{{ $t('vendor') }}</div>
          <div class="w-100 d-flex justify-start font-12 ml-3" style="width: 100%;">{{ $t('marginal_price') }}</div>
        </div>
      </template>
      <template #header.qty="{ header }">
        <div class="d-flex justify-center align-center">
          <span class="font-12">{{ $t('qty') }}</span>
        </div>
      </template>
      <template #header.status="{ header }">
        <div class="d-flex justify-center align-center">
          <span class="font-12">{{ $t('status') }}</span>
        </div>
      </template>
      <template #header.pivot.position="{ header }">
        <div class="d-flex justify-center align-center">
          <span class="font-12">№</span>
        </div>
      </template>
      <template v-slot:body="{ items, headers }">
        <tbody>
        <offer-product
          :headers="headers"
          :index="index"
          :isNotNewStatus="isNotNewStatus"
          :item="item"
          :key="item.id"
          :manufacturerNames="manufacturerNames"
          :offer="offer"
          :offerManufacturers="offerManufacturers"
          :vendor="allVendors.find(v => v.id == item.vendor_id)"
          v-for="(item, index) in items"
        />
        </tbody>
      </template>
      <template #item.root_category="{ item }">
        <div
          class="text-h6"
          dir="rtl"
          style="line-height: 1rem;"
        >
          <div dir="rtl" class="d-inline">
            <span v-if="item.root_category && typeof item.root_category.name === 'object'" v-html="item.root_category.name[$i18n.locale]"></span>
            <span v-else v-html="item.root_category.name"></span>
          </div>
        </div>
      </template>
      <template #item.id="{item}">
        <div>
          <span style="color: #2979FF;">{{ item.group_id }}</span>
          <br>
          {{ item.id }}
        </div>
      </template>
      <template #item.name="{ item }">
        <div class="text-h4 font-weight-black" dir="rtl">
          <div dir="rtl" class="d-inline" style="color: #2979FF;">
            <span v-if="typeof item.name === 'object'" v-html="item.name[$i18n.locale]"></span>
            <span v-else v-html="item.name"></span>
          </div>
        </div>
        <div
          class="mt-1 text-h5"
          dir="rtl"
        >
          <span
            @click.stop
            v-html="item.sku_original"
          ></span>
        </div>
      </template>
      <template #item.producer_price="{ item }">
        <div class="text-right">
          {{ item.producer_price }}
        </div>
        <div class="text-center">
          {{ item.var_price }}
        </div>
        <div class="text-left">
          {{ item.marginal_price }}
        </div>
      </template>
      <template #item.actions="{ item }">
        <div class="product-actions">
          <v-icon
            class="m-0"
            @click="$emit('remove', item)"
          >mdi-close
          </v-icon>
        </div>
      </template>
    </v-data-table>

    <v-container style="box-sizing: border-box !important;">
      <v-row class="category__offer-products p-0 flex-nowrap white" v-if="offerProducts.length">
        <v-col
          class="ma-1 ml-0 pa-1 d-flex justify-center align-end rounded"
          style="background: #E3F2FD;"
        >
          <v-text-field
            :readonly="true"
            :value="offer.offer_number"
            dense
            hide-details
            label="Номер предложения"
          />
        </v-col>
        <v-col
          class="ma-1 ml-0 pa-1 d-flex justify-center align-end rounded"
          style="background: #E3F2FD;"
        >
          <v-text-field
            :readonly="true"
            :value="productsPrice | toFix"
            dense
            hide-details
            label="Цена товаров"
          />
        </v-col>
        <v-col
          class="ma-1 ml-0 pa-1 d-flex justify-center align-end rounded"
          style="background: #E3F2FD;"
        >
          <v-text-field
            :disabled="calculateMode === 'auto' || isNotNewStatus"
            :value="manufacturerDeliverCost"
            dense
            hide-details
            label="Доставка"
            readonly
          />
        </v-col>
        <v-col
          class="ma-1 mx-0 pa-1 d-flex justify-center align-end rounded"
          style="background: #E3F2FD;"
        >
          <v-text-field
            :disabled="calculateMode === 'auto' || isNotNewStatus"
            :max="99999"
            :min="0"
            dense
            hide-details
            label="Маржа с НДС"
            type="number"
            v-model="offer.manual_margin"
          />
        </v-col>
        <v-spacer></v-spacer>
        <v-col
          class="ma-1 ml-0 pa-1 d-flex justify-center align-center rounded"
          cols="auto"
          style="background: #E3F2FD;"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn-toggle
                borderless
                color="white"
                style="background: #E3F2FD;"
                tile
                dense
                v-model="offer.visa"
                class="mt-1"
              >
                <v-btn
                  :value="true"
                  class="rounded"
                  dark
                  icon
                  tile
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon
                    large
                    :color="offer.visa ? 'primary' : 'grey'"
                    :class="{ 'visa-icon': !offer.visa }"
                  >mdi-credit-card-outline</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
            <span>Виза {{ visa }}%</span>
          </v-tooltip>
        </v-col>
        <v-col
          class="ma-1 ml-0 pa-1 d-flex justify-center align-end rounded"
          style="background: #E3F2FD;"
        >
          <v-text-field
            :disabled="isNotNewStatus"
            :label="$t('amount')"
            :value="offer.amount | toFix"
            hide-details
            prefix="₪"
            readonly
          />
        </v-col>
        <v-col
          class="ma-0 pa-1 d-flex justify-center align-end pa-0"
          cols="auto"
        >
          <v-btn
            @click="deleteCartOffer"
            class="ma-0 mr-1 regular-button"
            color="grey lighten-1"
          >{{ $t('form.delete') }}</v-btn>
        </v-col>
        <v-col
          class="ma-0 pa-1 d-flex justify-center align-end pa-0"
          cols="auto"
        >
          <v-btn
            @click="clearCartOffer"
            class="regular-button ma-0"
            color="grey lighten-1"
          >{{ $t('form.clear') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      v-if="showForm"
      v-model="showForm"
      persistent>
      <v-card>
        <div class="d-flex justify-end pa-2">
          <v-icon class="" large @click="showForm = false">mdi-close</v-icon>
        </div>
        <div class="pr-5 pl-5 pb-6">
          <group-product-form @saved="savedGroup"/>
        </div>
      </v-card>
    </v-dialog>

    <v-menu
      :position-x="menuX"
      :position-y="menuY"
      absolute
      offset-y
      v-model="showMenu"
    >
      <template>
        <v-list dense v-if="selected.length">
          <v-list-item-group color="primary">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  @click="$emit('remove', {id:0, groupIds: selected.map(group => group.id).join(',')})">
                  Удалить
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  @click="mergeGroups">
                  Объединить группу
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-menu>
  </div>
</template>

<script>
import toFix from "../../../filters/toFix"
import {mapGetters} from "vuex"

export default {
  name: 'CategoryOfferProducts',
  components: {
    GroupProductForm: () => import("../../components/category/GroupProductForm"),
    OfferProduct: () => import("../../components/category/OfferProduct"),
    LightBox: () => import("@/views/components/core/LightBox"),
    SortIndicator: () => import("@/views/components/core/SortIndicator"),
  },

  data() {
    return {
      _timerId: 0,
      headers: [],
      menuX: 0,
      menuY: 0,
      selectedHeadersMenuX: 0,
      selectedHeadersMenuY: 0,
      oldSortBy: [],
      oldSortDesc: [],
      options: {
        groupBy: [],
        groupDesc: [],
        itemsPerPage: 11,
        multiSort: true,
        mustSort: false,
        page: 1,
        sortBy: [],
        sortDesc: [],
        sortLocale: this.$i18n.locale,
      },
      calculateMode: 'manual',
      manufacturerDelivers: [],
      productsPrice: 0,
      selected: [],
      showForm: false,
      showMenu: false,
      showOfferProducts: false,
      showSelectedHeadersMenu: false,
      visa: 0,
    }
  },

  props: ['groupData', 'category_id', 'searchText', 'offerProducts', 'manufacturerNames', 'offer', 'isNotNewStatus'],
  
  filters: {
    toFix,
  },

  computed: {
    ...mapGetters([
      'allVendors',
      'manufacturers',
      'settings',
    ]),

    groupProducts() {
      if (this.groupData) {
        this.paginationMeta.page = +this.groupData.meta.current_page
        this.paginationMeta.perPage = +this.groupData.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.groupData.meta.total / this.groupData.meta.per_page)
        this.$nextTick(() => {
          this.options.itemsPerPage = this.groupData.meta.per_page
          this.groupData.meta.sortBy && (this.options.sortBy = this.groupData.meta.sortBy)
          this.groupData.meta.sortDesc && (this.options.sortDesc = this.groupData.meta.sortDesc)
        })
        return this.groupData.data
      }
      return []
    },

    showHeaders () {
      return this.selectedHeadersData && this.headers.filter(h => this.selectedHeadersData.includes(h.value)) || this.headers
    },

    totalProducts () {
      if (!!this.groupData && !!this.groupData.meta) {
        return parseInt(this.groupData.meta.total, 10)
      }
      return 0
    },

    pageCount () {
      if (!!this.groupData && !!this.groupData.meta) {
        return Math.ceil(this.totalProducts / parseInt(this.options.itemsPerPage, 10)) || 1
      }
      return 1
    },

    selectedHeadersData: {
      get: function () {
        return this.selectedHeaders || this.headers.map(h => h.value)
      },
      set: async function (newValue) {
        await this.$store.dispatch('saveSetting', {
          selectedHeadersGroupProducts: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersGroupProducts'})
      }
    },

    selectedHeaders () {
      let selectedHeadersGroupProducts = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersGroupProducts')
      selectedHeadersGroupProducts = selectedHeadersGroupProducts && JSON.parse(selectedHeadersGroupProducts.value)
      return selectedHeadersGroupProducts
    },

    manufacturerDeliverCost() {
      let deliverCost = this.manufacturerDelivers.reduce((total, manufacturer) => {
        return total + Number.parseFloat(manufacturer.deliver_cost || 0)
      }, 0)
      return Math.round((deliverCost * 117 / 100) * 100) / 100
    },

    offerManufacturers() {
      this.manufacturerDelivers = []
      let offerManufacturers = []
      if (this.offerProducts.length && this.manufacturers) {
        let offerManufacturerIds = this.offerProducts.map(p => p.manufacturer_id)
        offerManufacturers = this.manufacturers.filter(manufacturer => !!offerManufacturerIds.find(id => id === manufacturer.id))
        this.manufacturerDelivers = offerManufacturers.map(manufacturer => manufacturer)
      }
      return offerManufacturers
    },
  },

  async created() {
    this.initialize()
    let data = await this.$store.dispatch('getSettings', {settingsName: 'settingsVisa'})
    this.visa = data.value
    await this.$store.dispatch('getManufacturers', {all: true})
    await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersGroupProducts'})
    this.calculatePrice()
  },

  methods: {
    initialize() {
      this.headers = [
        {text: this.$t('category'), value: 'root_category', align: 'center', class: '', width: 93},
        {text: 'ID', value: 'id', align: 'center', class: '', cellClass: 'text-h4', width: 50},
        {text: this.$t('name'), value: 'name', align: 'start', class: ''},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'end', sortable: false, class: 'caption', cellClass: 'text-h4', width: 88},
        {text: this.$t('price'), value: 'producer_price', align: 'center', class: '', cellClass: 'text-h4', width: 98},
        {text: this.$t('quantity'), value: 'qty', align: 'center', class: '', width: 70},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4', width: 100},
        {text: '№', value: 'pivot.position', align: 'center', class: '', cellClass: 'text-h5', width: 50},
        {text: '', value: 'actions', align: 'center', class: '', width: 50},
      ];
    },

    viaEditGroup(e, data) {
      this.editGroup(data.item)
    },

    editGroup(group) {
      this.$store.dispatch('getGroupProduct', {
        id: group.id,
        category_id: this.category_id
      }).then(() => {
        this.showForm = 'groupProduct'
      })
    },

    getMenu(e, { item }) {
      if (!this.selected.length || !this.selected.some(s => s.id == item.id)) {
        this.selected.push(item)
      }
      this.showMenu = false
      this.menuX = e.clientX
      this.menuY = e.clientY
      this.$nextTick(() => {
        this.showMenu = true
      })
      e.preventDefault()
    },

    savedGroup() {
      this.showForm = false
    },

    isFullSearch(item, arrt) {
      return item[arrt].toLowerCase().includes(item.search.toLowerCase())
    },

    mergeGroups() {
      let groupWithManyProducts = this.selected.filter(group => group.products.length > 1)

      if (groupWithManyProducts.length > 1) {
        return this.$swal({
          title: 'У выбранных групп имеются много товаров!',
          icon: "warning",
          value: true,
          button: 'OK',
        })
      } else {
        this.$store.dispatch('mergeGroupProduct', {
          groupIds: this.selected.map(group => group.id).join(','),
        }).then(() => {
          this.$emit('fetch')
        })
      }
    },

    sortRows: function(sortKey) {
      clearTimeout(this._timerId)
      let sortIndex = this.options.sortBy.indexOf(sortKey)
      if (sortIndex == -1) {
        this.options.sortDesc.push('false')
        this.options.sortBy.push(sortKey)
      } else if (sortIndex > -1 && this.options.sortDesc[sortIndex] == 'false') {
        this.options.sortDesc.splice(sortIndex, 1, 'true')
      } else if (sortIndex > -1 && this.options.sortDesc[sortIndex] == 'true' && this.options.sortBy.length == 1) {
        this.options.sortDesc.splice(sortIndex, 1, 'false')
      } else {
        this.options.sortBy.splice(sortIndex, 1)
        this.options.sortDesc.splice(sortIndex, 1)
      }
      this._timerId = setTimeout(async () => {
        if (JSON.stringify([...this.options.sortBy]) != this.oldSortBy || JSON.stringify([...this.options.sortDesc]) != this.oldSortDesc) {
          this.changeParams(this.options, 'change-params')
          this.oldSortBy = JSON.stringify([...this.options.sortBy])
          this.oldSortDesc = JSON.stringify([...this.options.sortDesc])
        }
      }, 3500)
    },

    highlightSearch(text) {
      return this.searchText && text.replace(new RegExp(this.searchText, "gi"), match => {
        return '<span class="full-highlight-result">' + match + '</span>';
      }) || text
    },

    showSelectedHeaders (e) {
      this.showSelectedHeadersMenu = false
      this.selectedHeadersMenuX = e.clientX
      this.selectedHeadersMenuY = e.clientY
      this.$nextTick(() => {
        this.showSelectedHeadersMenu = true
      })
      e.preventDefault()
    },

    closeOfferProducts() {
      this.showOfferProducts = false
    },

    calculatePrice () {
      if (this.offer.manual_margin > 99999) {
        this.offer.manual_margin = 99999
      }
      if (this.offerProducts && this.offerProducts.length) {
        this.productsPrice = this.offerProducts.reduce((total, product) => total + parseFloat(product.var_price) * parseFloat(product.qty), 0)
      }
      if (this.calculateMode === 'manual') {
        this.offer.amount = Number.parseFloat(this.productsPrice) + Number.parseFloat(this.offer.manual_margin || 0) + Number.parseFloat(this.manufacturerDeliverCost || 0)
      } else {
        this.offer.amount = Number.parseFloat(this.productsPrice) + Number.parseFloat(this.autoMargin) + Number.parseFloat(this.manufacturerDeliverCost || 0)
      }
      if (this.offer.visa) {
        this.offer.amount = this.offer.amount * (100 + Number.parseFloat(this.visa)) / 100
      }
      this.offer.amount = Math.round(this.offer.amount * 100) / 100
    },

    async clearCartOffer () {
      await this.$store.dispatch('saveSetting', {
        cartOfferId: null,
      })
      await this.$store.commit('setOfferProducts', [])
      await this.$store.dispatch('getOffer', null)
    },

    async deleteCartOffer () {
      let res = await this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      })
      if (res) {
        await this.$store.dispatch('deleteOffer', this.offer.id)
        await this.clearCartOffer()
      }
    },
  },

  watch: {
    'offer.auto_margin': function (val, oldVal) {
      this.calculatePrice()
    },
    'offer.products': function (val, oldVal) {
      this.calculatePrice()
    },
    'offerProducts': function (val, oldVal) {
      this.calculatePrice()
    },
    'offer.manual_margin': function (val, oldVal) {
      this.calculatePrice()
    },
    'offer.marginal_price': function (val, oldVal) {
      this.calculatePrice()
    },
    'offer.vat_price': function (val, oldVal) {
      this.calculatePrice()
    },
    'offer.visa': function (val, oldVal) {
      this.calculatePrice()
    },
    'offer.amount': async function (val, oldVal) {
      clearTimeout(this._timerId)
      this._timerId = setTimeout(async () => {
        if (val > 0 || oldVal > 0) {
          if (this.offerProducts.length != this.offer.products.length) {
            this.offer.products = this.offerProducts.map(pr => ({
              group_id: pr.group_id,
              id: pr.id,
              percent: pr.percent || null,
              price: pr.var_price,
              qty: pr.qty || (pr.pivot && pr.pivot.qty) || 1,
              warranty: pr.warranty,
            }))
            let savedOffer = await this.$store.dispatch('saveOffer', this.offer)
            savedOffer && Object.assign(this.offer, savedOffer)
            if (this.offer.products) {
              await this.$store.commit('setOfferProducts', this.offer.products.map(product => {
                product.qty = product.pivot.qty
                product.price = product.pivot.price
                product.warranty = product.pivot.warranty
                product.percent = product.pivot.percent
                product.groupProducts = (product.group && product.group.products) || []
                
                return product
              }))
            }
            let offerProductIds = this.offerProducts.map(offerProduct => offerProduct.id)
            await this.$store.dispatch('saveOfferProductsPositions', {offer_id: this.offer.id, offerProductIds})
          } else {
            this.$store.dispatch('saveOffer', this.offer)
          }
        }
      }, 500)
    },
    manufacturerDeliverCost: function (val, oldVal) {
      this.calculatePrice()
    },
  },
}
</script>

<style lang="scss">
.category__offer-products {
  .v-label--active {
    top: 0 !important;
  }
  .v-text-field__prefix {
    margin-bottom: -5px !important;
  }
  input {
    margin: 0 !important;
    margin-bottom: -4px !important;
    padding: 0 !important;
    padding-top: 4px !important;
  }
}
.category-goods {
  &__added-group {
    th {
      height: 40px !important;
    }
    .v-label {
      &--active {
        top: 6px !important;
      }
    }
    .product-actions {
      .v-icon {
        margin: 0 !important;
      }
    }
  }
}
#dragged-image {
  position: fixed;
  left: -300px;
  top: -300px;
}

.highlightResult em {
  font-weight: bold;
}

.full-highlight-result {
  font-weight: bold;
  background: yellow;
}

.visa-icon:hover {
  color: black !important;
}
.regular-button {
  width: 75p ipo !important;
}
.regular-button:hover {
  background: #9E9E9E !important;
}
.regular-button:active {
  background: #2979FF !important;
}
</style>
