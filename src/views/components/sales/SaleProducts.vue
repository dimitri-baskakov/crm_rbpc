<template>
  <div>
    <v-data-table
      :headers="showHeaders"
      :items-per-page="-1"
      :items="saleProducts"
      class="category-products-table offer-products-table offers-products__group"
      disable-sort
      fixed-header
      height="100%"
      hide-default-footer
      sort-by="pivot.position"
      style="height: 100%;"
    >
      <template #header.productId="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column justify-center align-end pr-2"
        >
          <div class="font-8">{{ $t('productId') }}</div>
          <div class="font-8 mt-1">{{ $t('date') }}</div>
          <div class="font-8 mt-1">{{ $t('purchaseNum') }}</div>
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
          class="d-flex justify-space-between align-center pl-5 pr-2"
          style="box-sizing:border-box;"
        >
          <div
            class="d-flex justify-end font-8"
          >
            {{ $t('name') }}
          </div>
          <div class="d-flex flex-column align-end">
            <div
              class="d-flex justify-start font-8" 
            >
              {{ $t('sku_original') }}
            </div>
            <div
              class="d-flex justify-end mt-1 font-8"
            >
              {{ $t('category') }}
            </div>
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
      <template #header.price="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column justify-space-between"
          style="height: 100%;"
        >
          <div 
          class="d-flex justify-end pt-1"
          style="width: 100%; padding-right: 20px;"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small">
              <!-- <sort-indicator></sort-indicator> -->
            </div>
            <span class="font-8">
              {{ $t('with_var_price') }}
            </span>
          </div>
          <div 
          class="d-flex justify-start pb-1"
          style="width: 100%;"
          >
            <div class="d-flex justify-center align-center category-products__sorting-indicator category-products__sorting-indicator_small"
            >
              <!-- <sort-indicator></sort-indicator> -->
            </div>
              <span class="font-8">
                {{ $t('margin') }}
              </span>
          </div>
        </div>
      </template>
      <template #header.status="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="flex-column justify-center align-center"
        >
          <span class="font-8">{{ $t('status') }}</span>
          <span class="font-8 mt-1">{{ $t('warranty') }}</span>
        </div>
      </template>
      <template #header.serial_number="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column justify-center align-center"
        >
          <span class="font-8">{{ $t('serial_number') }}</span>
          <span class="font-8 mt-1">{{ $t('balance_warranty_term_manufacturer') }}</span>
          <span class="font-8 mt-1">{{ $t('warranty_manufacturer_residue') }}</span>
        </div>
      </template>
      <template #header.warranty_client="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          class="d-flex flex-column justify-center align-center"
        >
          <span class="font-8">{{ $t('warrantyClient') }}</span>
          <span class="font-8 mt-1">{{ $t('balance_warranty_term_client') }}</span>
          <span class="font-8 mt-1">{{ $t('warranty_client_residue') }}</span>
        </div>
      </template>
      <template #header.actions="{ header }">
        <div
          @contextmenu="showSelectedHeaders"
          style="height: 100%;"
        >
        </div>
      </template>
      <template #body="{ items, headers }">
        <tbody>
        <sale-product
          :headers="headers"
          :index="index"
          :isNotNewStatus="isNotNewStatus"
          :item="item"
          :key="item.id"
          :manufacturerNames="manufacturerNames"
          :sale="sale"
          :warranties="warranties"
          @copyToClipboard="copyToClipboard"
          v-for="(item, index) in items"
        ></sale-product>
        </tbody>
      </template>
    </v-data-table>

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
export default {
  name: 'SaleProducts',
  components: {
    SaleProduct: () => import("./SaleProduct"),
  },

  computed: {
    showHeaders () {
      return this.headers.filter(s => this.selectedHeaders.includes(s))
    },
  },

  props: ['saleProducts', 'manufacturerNames', 'sale', 'isNotNewStatus'],

  data () {
    return {
      headers: [],
      headersMap: [],
      sales: [],
      selectedCategory: {},
      selectedHeaders: [],
      snackbar: false,
      sortBy: 'position',
      sortDesc: false,
      warranties: [],
    }
  },

  created() {
    this.initialize()

    this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'}).then((data) => {
      this.warranties = data
      this.saleProducts.map(pr => {
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
    this.selectedHeaders = this.headers
  },

  methods: {
    initialize() {
      this.headersMap = [
        {text: this.$t('productId'), value: 'productId', align: 'right', sortable: false, class: 'caption', width: 114},
        {text: this.$t('image'), value: 'image', align: 'center', sortable: false, class: 'caption px-0', cellClass: 'px-0 white', width: 85},
        {text: this.$t('name'), value: 'name', align: 'end', sortable: false, class: 'caption', width: '35%'},
        {text: this.$t('manufacturer'), value: 'manufacturer', align: 'end', sortable: true, class: 'caption', width: 98},
        {text: this.$t('with_var_price'), value: 'price', align: 'center', sortable: true, class: 'caption', width: 87},
        {text: this.$t('status'), sortable: true, align: 'center', value: 'status', width: 80},
        {text: this.$t('serial_number'), value: 'serial_number', align: 'center', sortable: true, class: 'caption', width: 120},
        {text: this.$t('warrantyClient'), sortable: false, align: 'center', value: 'warranty_client', class: 'px-0', width: 124},
        {text: '№', value: 'position', align: 'center', sortable: false, class: 'caption', width: 37},
        {text: this.$t('actions'), value: 'actions', align: 'center', sortable: false, class: 'caption', width: 32},
      ]
    },

    sortRows: function(sortKey) {
      return
      this.sortDesc = !this.sortDesc
      this.sortBy = sortKey
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
        // Avoid scrolling to bottom
        textArea.style.top = "0"
        textArea.style.left = "0"
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          let successful = document.execCommand('copy')
          // let msg = successful ? 'successful' : 'unsuccessful'
          // console.log('Fallback: Copying text command was ' + msg)
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

<style>
/* .v-data-table__wrapper {
  overflow-x: unset !important;
  overflow-y: unset !important;
} */
.group_id-th {
  max-width: 120px;
}
</style>
