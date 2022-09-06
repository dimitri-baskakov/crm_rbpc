<template>
  <div>
    <v-data-table
      :headers="showHeaders"
      :item-class="itemClass"
      :items-per-page="-1"
      :items="offerProducts"
      class="category-products-table offer-products-table offers-products__group"
      disable-sort
      fixed-header
      height="100%"
      hide-default-footer
      sort-by="pivot.position"
      style="height: 100%;"
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
          <div class="offers-product-group__header-id mr-2">
            <span class="text-end font-8 d-block">{{ 'ID тов.' }}</span>
            <span class="text-end font-8 d-block mt-1">{{ 'ID гр.' }}</span>
          </div>
        </div>
      </template>
      <template #header.image="{ header }">
        <span class="text-center font-8">
          Изображения
        </span>
      </template>
      <template #header.name="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex justify-space-between align-center"
        >
          <span class="justify-end font-8 ml-5 d-block">{{ $t('sku_original') }}</span>
          <div class="column">
            <span class="justify-end font-8 d-block">{{ $t('name') }}</span>
            <span class="justify-end font-8 d-block mt-1">Категория</span>
          </div>
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
      <template #header.qty="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="text-center"
        >
          <div class="column">
            <span class="font-8">{{ $t('qty') }}</span>
            <span class="font-8 mt-1">{{ $t('warranty') }}</span>
          </div>
        </div>
      </template>
      <template #header.pivot.position="{ header }">
        <span class="font-8">
          №
        </span>
      </template>
      <template #body="{ items, headers }">
        <tbody>
        <offer-product
          :headers="headers"
          :index="index"
          :isNotNewStatus="isNotNewStatus"
          :item="item"
          :key="offer.type === 'preorder' ? `${item.id}-${item.pivot.sku_id}` : item.id"
          :manufacturerNames="manufacturerNames"
          :offer="offer"
          :vendor="allVendors.find(v => v.id == item.vendor_id)"
          :warranties="warranties"
          @copyToClipboard="copyToClipboard"
          v-for="(item, index) in items"
          class="offer-products__wrapper"
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
import OfferProduct from "./OfferProduct"
import {mapGetters} from "vuex"

export default {
  name: 'OfferProducts',
  components: {
    OfferProduct,
  },

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
          selectedHeadersOfferProducts: JSON.stringify(newValue),
        })
        await this.$store.dispatch('getSettings', {settingsName: 'selectedHeadersOfferProducts'})
      }
    },

    selectedHeaders () {
      let selectedHeadersOfferProducts = this.settings && this.settings.length && this.settings.find(s => s.name == 'selectedHeadersOfferProducts')
      selectedHeadersOfferProducts = selectedHeadersOfferProducts && JSON.parse(selectedHeadersOfferProducts.value)
      return selectedHeadersOfferProducts
    },
  },

  props: ['offerProducts', 'manufacturerNames', 'offer', 'isNotNewStatus'],

  data () {
    return {
      headers: [],
      headersMap: [],
      offers: [],
      selectedCategory: {},
      selectedHeadersMenuX: 0,
      selectedHeadersMenuY: 0,
      showSelectedHeadersMenu: false,
      snackbar: false,
      warranties: [],
    }
  },

  created() {
    this.initialize()
    this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'}).then((data) => {
      this.warranties = data
      this.offerProducts.map(pr => {
        let war = parseInt(pr.warranty)
        if (!!war) {
          if (!this.warranties.find(w => w.value === war)) {
            this.warranties.push({name: pr.warranty, value: war})
          }
          pr.warranty = war
        }
        return pr
      })
    })
    this.headers = Object.values(this.headersMap)
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: this.$t('select'), value: 'select', align: 'center', sortable: false, class: 'caption'},
        {text: 'ID тов. / ID гр.', value: 'id', align: 'center', sortable: true, class: 'caption px-1', cellClass: 'text-h4 font-12', width: 60},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption ', cellClass: 'px-0 white font-12', width: 105},
        {text: this.$t('name'), sortable: false, align: 'start', value: 'name', cellClass: 'font-12', width: "36%"},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'end', sortable: true, class: 'caption', cellClass: 'text-h4 font-12', width: 115},
        {text: this.$t('with_var_price'), sortable: false, align: 'center', value: 'var_price', cellClass: 'font-12', width: 100},
        {text: this.$t('status'), sortable: true, align: 'center', value: 'status', cellClass: 'font-12', width: 90},
        {text: this.$t('qty'), sortable: false, align: 'center', value: 'qty', cellClass: 'font-12', width: 96},
        {text: '№', value: 'pivot.position', align: 'center', sortable: false, class: 'caption', cellClass: 'font-12', width: 36},
        {text: '', value: 'actions', align: 'center', sortable: false, class: 'caption', cellClass: 'font-12', width: 32},
      ]
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

<style lang="scss">

.group_id-th {
  max-width: 120px;
}
</style>
