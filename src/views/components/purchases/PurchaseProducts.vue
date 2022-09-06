<template>
  <div>
    <v-data-table
      :headers="showHeaders"
      :item-class="itemClass"
      :items-per-page="-1"
      :items="purchaseProducts"
      class="category-products-table offer-products-table offers-products__group"
      disable-pagination
      disable-sort
      fixed-header
      height="100%"
      hide-default-footer
      sort-by="id"
      style="height: 100%;"
      v-if="purchaseProducts.length"
    >
      <template #header.select="{ header }">
        <div class="column">
          <div>
            <v-checkbox
            class="offers-product-group__header-checkbox"
            ></v-checkbox>
          </div>
        </div>
      </template>
      <template #header.id="{ header }">
        <div @contextmenu="showSelectedHeaders">
          <div class="font-8">{{ 'ID тов.' }}</div>
        </div>
      </template>
      <template #header.name="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex justify-space-between align-center"
        >
          <span class="justify-end font-8 ml-5 d-block">{{ $t('sku_original') }}</span>
          <span class="justify-end font-8 mr-5 d-block">{{ $t('name') }}</span>
        </div>
      </template>
      <template #header.manufacturer="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right">
          <div class="column">
            <span class="justify-end text-gray font-8 d-block">{{ $t('manufacturer') }}</span>
            <span class="justify-end text-gray font-8 d-block mt-1">{{ $t('vendor') }}</span>
          </div>
        </div>
      </template>
      <template #header.var_price="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-center"
        >
          <div 
          class="column justify-center" 
          style="height: 100% !important;"
          >
            <span 
            class="justify-end font-8 line-break-one d-block" 
            style="line-height: 8px !important;"
            >{{ $t('price') }}</span>
            <span 
            class="justify-center font-8 line-break-one d-block" 
            style="line-height: 8px !important;"
            >{{ $t('var_price') }}</span>
            <span 
            class="justify-start font-8 line-break-one d-block" 
            style="line-height: 8px !important;"
            >{{ $t('marginal_price') }}</span>
          </div>
        </div>
      </template>
      <template #header.status="{ header }">
        <span class="font-8">
          Статус
        </span>
      </template>
      <template #header.serial_numbers="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-right">
          <div class="column">
            <span class="justify-end text-gray font-8 d-block">{{ $t('serial_number') }}</span>
            <span class="justify-end text-gray font-8 d-block mt-1">{{ $t('qty') }}</span>
          </div>
        </div>
      </template>
      <template #header.warranty="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column justify-center align-center"
        >
          <div class="font-8">{{ $t('warranty') }}</div>
          <div class="font-8 mt-1">{{ $t('balance_warranty_term') }}</div>
        </div>
      </template>
      <template #header.n="{ header }">
        <span class="font-8">
          №
        </span>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
        <purchase-product
          class="pb-2"
          :dateNumber="dateNumber"
          :headers="headers"
          :index="key"
          :isNotNewStatus="isNotNewStatus"
          :item="item"
          :key="key"
          :manufacturerNames="manufacturerNames"
          :n="key + 1"
          :purchaseDate="purchaseDate"
          :vendor="allVendors.find(v => v.id == item.vendor_id)"
          :warranties="warranties"
          @copyToClipboard="copyToClipboard"
          @removeItem="removeItem"
          v-for="(item, key) in items"
        />
        </tbody>
      </template>
    </v-data-table>

    <v-menu
      :close-on-content-click="false"
      :nudge-width="200"
      :position-x="selectedHeadersMenuX"
      :position-y="selectedHeadersMenuY"
      absolute
      max-height="35vh"
      max-width="70vw"
      v-model="showSelectedHeadersMenu"
    >
      <v-list
        flat
      >
        <v-list-item-group
          multiple
          v-model="selectedHeadersData"
        >
          <v-list-item
            :key="`item-${i}`"
            :value="header.value"
            v-for="(header, i) in headersMap"
          >
            <template #default="{ active }">
              <v-list-item-action>
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{ header.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>

    <v-snackbar
      :transition="'slide-x-reverse-transition'"
      color="rgba(0, 0, 0, 0.6)"
      right
      timeout="3000"
      top
      v-model="snackbar"
    >
      {{ 'текст скопирован' }}
    </v-snackbar>
  </div>
</template>

<script>
import PurchaseProduct from "./PurchaseProduct"
import {mapGetters} from "vuex"

export default {
  name: 'PurchaseProducts',
  components: {
    PurchaseProduct,
  },

  props: ['dateNumber', 'purchaseDate', 'isNotNewStatus', 'warranties', 'purchaseProducts', 'manufacturerNames'],

  computed: {
    ...mapGetters([
      'allVendors',
      'settings',
    ]),

    showHeaders () {
      return this.selectedHeadersData && this.headers.filter(h => this.selectedHeadersData.includes(h.value)) || this.headers
    },

    selectedHeadersData: {
      get: function () {
        return this.selectedHeaders || this.headers.map(h => h.value)
      },
      set: async function (newValue) {
        await this.$store.dispatch('saveSetting', {
          selectedHeadersPurchaseProducts: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersPurchaseProducts'})
      }
    },

    selectedHeaders () {
      let selectedHeadersPurchaseProducts = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersPurchaseProducts')
      selectedHeadersPurchaseProducts = selectedHeadersPurchaseProducts && JSON.parse(selectedHeadersPurchaseProducts.value)
      return selectedHeadersPurchaseProducts
    },
  },

  data () {
    return {
      purchases: [],
      selectedCategory: {},
      headers: [],
      headersMap: [],
      selectedHeadersMenuX: 0,
      selectedHeadersMenuY: 0,
      showSelectedHeadersMenu: false,
      snackbar: false,
    }
  },

  created() {
    this.initialize()
    this.headers = Object.values(this.headersMap)
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: this.$t('select'), value: 'select', align: 'center', sortable: false, class: 'caption', width: 26},
        {text: 'ID товара', value: 'id', align: 'center', sortable: true, class: 'caption px-1', cellClass: 'text-h4', width: 60},
        {text: `${this.$t('name')} / ${this.$t('code_vendor')}`, sortable: false, value: 'name'},
        {text: `${this.$t('manufacturer')} / ${this.$t('vendor')}`, value: 'manufacturer', align: 'end', sortable: true, class: 'caption', cellClass: 'text-h4', width: 110},
        {text: this.$t('with_var_price'), sortable: false, align: 'center', value: 'var_price', width: 96},
        {text: this.$t('status'), sortable: true, align: 'center', value: 'status', width: 90},
        {text: `${this.$t('serial_number')} / ${this.$t('qty')}`, sortable: false, align: 'end', value: 'serial_numbers', width: 139},
        {text: `${this.$t('warranty')} / ${this.$t('balance_warranty_term')}`, sortable: false, align: 'start', value: 'warranty', width: 88},
        {text: '№', value: 'n', align: 'center', sortable: false, class: 'caption', width: 39},
        {text: '', value: 'actions', align: 'center', sortable: false, class: 'caption pa-0', width: 31},
      ]
    },

    removeItem(id) {
      let purchaseProducts = this.purchaseProducts.filter(purchaseProduct => {
        return id !== purchaseProduct.id
      })
      this.$store.commit('setPurchaseProducts', purchaseProducts)
      this.$eventHandle.$emit('sync-selected-products', purchaseProducts);
    },

    itemClass (item) {
      let cssClass = []
      if (item.deleted_at) {
        cssClass.push('deleted-product')
      }
      if (item.id == this.contextMenuSelectedId && this.showMenu) {
        cssClass.push('context-menu-selected')
      }
      return cssClass
    },

    showSelectedHeaders (e) {
      e.preventDefault()
      this.showSelectedHeadersMenu = false
      this.selectedHeadersMenuX = e.clientX
      this.selectedHeadersMenuY = e.clientY
      this.$nextTick(() => {
        this.showSelectedHeadersMenu = true
      })
    },

    async copyToClipboard (text) {
      this.snackbar = true
      if (!navigator.clipboard) {
        let textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.top = "0"
        textArea.style.left = "0"
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          let successful = document.execCommand('copy')
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err)
        }
        document.body.removeChild(textArea)
        return
      }
      try {
        await navigator.clipboard.writeText(text)
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    },
  },
}
</script>
