<template>
  <tr
    :class="{'pink lighten-5': item.status == 'sold' && sale.status == 'new'}"
    :draggable="!isNotNewStatus"
    :id="index"
    :key="item.id"
    @dragover.prevent
    @dragstart="dragstartSaleProduct"
    @drop.prevent="dropSaleProduct"
    class="sale-product-row offers-product-group-row"
  >

    <td v-if="headers.some(h => h.value == 'productId')">
      <div class="d-flex flex-column justify-center align-end pr-2" 
      style="height: 90%;"
      >
        <span class="font-12">{{ item.productId }}</span>
        <span class="mt-1 font-12">{{ item.date | dateFormat }}</span>
        <a class="mt-1 text-blue font-12" @click.stop="editPurchase(item.purchase)">
          {{ item.number }}
        </a>
      </div>
    </td>
    <td
      class="white"
      v-if="headers.some(h => h.value == 'image')"
    >
      <light-box  
      class="light-box"
      @click.stop.prevent 
      v-if="!!item.images && item.images.length" 
      :key="item.id" 
      :images="item.images" 
      style="height: 57px !important;"
      />
    </td>
    <td dir="rtl" v-if="headers.some(h => h.value == 'name')">
      <div dir="rtl" class="align-start d-flex justify-space-between mx-2">
        <a
          @click="editProduct(item)"
          class="font-weight-black"
          draggable="true"
        >
          <div
            class="text-blue font-12 line-break-two"
            :class="{'full-highlight-result': isFullSearch(item, 'name')}"
            v-html="item.highlightResult._highlightResult.name.value"
            v-if="!!item.highlightResult"
          ></div>
          <div v-else class="d-inline">
            <span class="text-blue font-12 line-break-two" v-if="typeof item.name === 'object'" v-html="(item.name[$i18n.locale])"></span>
            <span class="text-blue font-12 line-break-two" v-else v-html="(item.name)"></span>
          </div>
        </a>
        <div>
          <v-tooltip
            open-delay="400"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                @click.stop="copyToClipboard(typeof item.name === 'object' ? item.name[$i18n.locale] : item.name)"
                class="copy-icon pa-0 ma-0"
                small
                tag="a"
                v-bind="attrs"
                v-on="on"
              >mdi-content-copy</v-icon>
            </template>
            <span>{{ 'копировать' }}</span>
          </v-tooltip>
        </div>
      </div>
      <div
        :class="{'full-highlight-result': isFullSearch(item, 'sku_original')}"
          class="highlightResult font-12"
        dir="rtl"
        v-html="item.highlightResult._highlightResult.sku_original.value"
        v-if="!!item.highlightResult"
      ></div>
      <div
        class="align-center d-flex justify-space-between mt-1 font-12 mx-2"
        dir="rtl"
        v-else
      >
        <div class="fon-12">
          {{ typeof item.category_name == 'string' ? JSON.parse(item.category_name)[$i18n.locale] : item.category_name[$i18n.locale] }}
        </div>
        <div class="d-flex align-start">
          <span
            @click.stop
              class="font-12 ml-2 text-blue"
            v-html="(item.sku_original)"
          ></span>
          <div>
            <v-tooltip
              open-delay="400"
              top
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click.stop="copyToClipboard(item.sku_original)"
                  class="copy-icon pa-0 ma-0"
                  small
                  tag="a"
                  v-bind="attrs"
                  v-on="on"
                >mdi-content-copy</v-icon>
              </template>
              <span>{{ 'копировать' }}</span>
            </v-tooltip>
          </div>
        </div>
      </div>
    </td>
    <td v-if="headers.some(h => h.value == 'manufacturer')">
      <div 
      class="d-flex flex-column justify-space-between align-end pr-3 bordered-both" 
      style="height: 90%;">
        <a
          :href="item.url"
          class="text-decoration-none text-green-light font-12"
          target="_blank"
          v-if="!!item.url && !item.url.indexOf('http')"
        >{{ item.manufacturer }}</a>
        <span
          v-else
          class="font-12"
        >{{ item.manufacturer }}</span>
        <div class="d-flex justify-end">
          <span class="mr-2 font-12" v-if="!item.is_vendor_corrected" style="color: red"> *</span>
          <a
            :href="item.vendor_link"
            class="text-decoration-none text-blue font-12"
            target="_blank"
            v-if="!!item.vendor_link && !item.vendor_link.indexOf('http')"
          >{{ item.vendor }}</a>
          <span class="font-12 color-blue" v-else>{{ item.vendor }}</span>
        </div>
      </div>
    </td>
    <td v-if="headers.some(h => h.value == 'price')">
      <div 
      class="d-flex flex-column justify-space-between align-center"
      style="height: 90%;"
      >
        <div 
        class="d-flex justify-end font-12"
        style="width: 100%; margin-right: 20px;"
        >
          {{ item.price }}
        </div>
        <div 
        class="d-flex justify-start font-12"
        style="width: 100%; margin-left: 20px;"
        >
          {{ item.purchase_marginal_price }}
        </div>
      </div>
    </td>
    <td class="text-center" v-if="headers.some(h => h.value == 'status')">
      <div 
      class="d-flex flex-column justify-space-between align-center bordered-both"
      style="height: 90%;"
      >
        <div 
        class="font-12"
        :style="item.status == 'sold' && 'color: #69D169;'"
        >
          {{ $t(item.status) }}
        </div>
        <div 
        class="font-12"
        style="color: #FBB03B;"
        >
          {{ item.warranty }} мес.
        </div>
      </div>
    </td>
    <td class="text-center" v-if="headers.some(h => h.value == 'serial_number')">
      <div 
      class="d-flex flex-column justify-space-between align-start px-1"
      style="height: 90%;"
      >
        <span class="font-12">{{ item.serial_number }}</span>
        <div 
        class="d-flex justify-space-between" 
        style="width: 100%;"
        >
          <span
          class="font-12" 
          style="color: #3EC4FF;"
          >{{ item.warranty_residue }}</span>
          <span 
          class="font-12" 
          style="color: #3EC4FF;"
          >{{ item.warranty_expiration_date | dateFormat }}</span>
        </div>
      </div>
    </td>
    <td class="text-center" v-if="headers.some(h => h.value == 'warranty_client')">
      <div 
      class="d-flex flex-column justify-space-between align-center bordered-both"
      style="height: 90%;"
      >
        <v-select
        :disabled="isNotNewStatus"
        :items="warranties"
        class="warranty-select pt-0 mt-0 category-products__count-select"
        style="width: 46px; height: 15px !important;"
        dense
        hide-details
        item-text="value"
        item-value="value"
        v-model="item.warranty_client"
        ></v-select>
        <span class="font-12 mt-1" style="color: #3EC4FF;">
          {{ item.warranty_residue }}
        </span>
        <span class="font-12 my-1" style="color: #3EC4FF;">
          {{ item.warranty_expiration_date | dateFormat }}
        </span>
      </div>
    </td>
    <td v-if="headers.some(h => h.value == 'position')">
      <span 
      class="d-flex justify-center align-center font-12 bordered-right"
      style="height: 90%;"
      >
        {{ item.pivot && item.pivot.position || (index + 1) }}
      </span>
    </td>
    <td class="px-0 text-center" v-if="headers.some(h => h.value == 'actions')">
      <div class="product-actions">
        <v-icon 
        tag="a" 
        small @click="removeItem" 
        :disabled="isNotNewStatus"
        >
          mdi-close
          </v-icon>
      </div>
    </td>
    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      max-width="95%"
      persistent
      scrollable
      v-if="dialog && activeItemId == item.id"
      v-model="dialog"
    >
      <v-card>
        <v-card-text>
          <category-product-form
            :category="item.root_category"
            :categorySelect="categorySelect"
            :product="item"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      :retain-focus="false"
      max-height="100vh"
      max-width="95%"
      persistent
      scrollable
      v-model="dialog"
      v-if="dialog && showForm === 'purchase'"
    >
      <v-card>
        <div class="d-flex justify-end pa-2">
        </div>
        <div class="pr-5 pl-5 pb-6">
          <purchase-form
            :purchase="purchase"
            v-if="showForm === 'purchase'"
          ></purchase-form>
        </div>
      </v-card>
    </v-dialog>
  </tr>
</template>

<script>
import LightBox from "@/views/components/core/LightBox"
import LongPress from 'vue-directive-long-press'
import dateFormat from "../../../filters/date"
import dateMixin from "@/mixins/date"
import {mapGetters} from "vuex"

export default {
  name: 'SaleProduct',

  components: {
    CategoryProductForm: () => import("../../components/category/CategoryProductForm"),
    LightBox,
    PurchaseForm: () => import("../purchases/PurchaseForm"),
  },

  props: ['item', 'warranties', 'manufacturerNames', 'index', 'isNotNewStatus', 'headers'],

  mixins: [dateMixin],

  data: () => ({
    activeItemId: null,
    minusInterval: null,
    plusInterval: null,
    selectedStoreCategory: null,
    showForm: '',
    showSaleProducts: false,
    value: 1,
  }),

  directives: {
    'long-press': LongPress
  },

  computed: {
    ...mapGetters([
      'categorySelect',
      'dialog',
      'product',
      'purchase',
      'sale',
      'saleProducts',
      'storeCategorySelect',
    ]),
  },

  async created() {
    this.updateWarrantyClient()
  },

  filters: {
    dateFormat,
  },

  methods: {
    closeSaleProducts() {
      this.showSaleProducts = false
    },

    updateProduct() {
      let saleVatPriceCost = 0
      let saleMarginalCost = 0
      let saleProducts = this.saleProducts.map(product => {
        if (product.id === this.item.id) {
          saleVatPriceCost += product.var_price
          saleMarginalCost += product.marginal_price
        } else {
          saleVatPriceCost += product.var_price
          saleMarginalCost += product.marginal_price
        }
        return product
      })
      this.$store.commit('setSaleProducts', saleProducts)
      this.$eventHandle.$emit('updateVatPriceCost', saleVatPriceCost)
      this.$eventHandle.$emit('updateMarginalCost', saleMarginalCost)
      this.$eventHandle.$emit('sync-selected-products', saleProducts.map(p => p.group_id));
    },

    removeItem() {
      let saleProducts = this.saleProducts.filter(p => p.id !== this.item.id)
      this.$store.commit('setSaleProducts', saleProducts)
      this.updateProduct()
    },

    changeProduct(product) {
      let saleProducts = this.saleProducts.map(saleProduct => {
        if (saleProduct.id === this.item.id) {
          saleProduct = product
          saleProduct.price = this.item.price
          saleProduct.percent = this.item.percent
          saleProduct.images = this.item.images
          saleProduct.groupProducts = this.item.groupProducts
        }
        return saleProduct
      })
      this.$store.commit('setSaleProducts', saleProducts)
      this.updateProduct()
    },

    async dropSaleProduct(e) {
      let fromIndex = e.dataTransfer.getData('row_index');
      let toIndex = e.target.closest('.sale-product-row').id;
      let saleProducts = this.saleProducts
      saleProducts = this.arrayMove(saleProducts, fromIndex, toIndex)
      let saleProductIds = saleProducts.map(saleProduct => saleProduct.id)
      await this.$store.dispatch('saveSaleProductsPositions', {sale_id: this.sale.id, saleProductIds})
      await this.$store.dispatch('getSale', this.sale)
      if (this.sale.products) {
        await this.$store.commit('setSaleProducts', this.sale.products)
      }
      if (!!this.sale.saleFiles) {
        this.sale.saleFiles = this.sale.saleFiles.map(file => {
          file.fileName = file.src.split('/').pop()
          return file
        })
      }
      this.files = []
    },

    dragstartSaleProduct(e) {
      e.dataTransfer.setData('row_index', e.target.id)
    },

    arrayMove(arr, fromIndex, toIndex) {
      let element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      return arr
    },

    openCategoryProductDialog(id) {
      this.activeItemId = id
      this.$store.commit('setDialog', true)
    },

    updateWarrantyClient() {
      if (this.warranties.length && !this.warranties.some(w => w.value === this.item.warranty_client)) {
        this.item.warranty_client = 0
      }
      this.item.warranty_client_residue = this.balanceDate(this.sale.date, this.item.warranty_client)
      let endDate = new Date(this.sale.date)
      endDate.setMonth(endDate.getMonth() + this.item.warranty_client)
      endDate = endDate.toISOString()
      this.item.warranty_client_expiration_date = endDate
    },

    closeModal() {
      this.$store.commit('setDialog', false)
      this.showForm = ''
    },
    
    async editPurchase(purchase) {
      this.showForm = 'purchase'
      let data = await this.$store.dispatch('getPurchase', purchase)
      await this.$store.commit('setPurchaseProducts', data.products);
      this.$store.commit('setDialog', true)
    },

    editProduct(item) {
      this.$store.dispatch('getEditProduct', {
        id: item.productId,
        var_price: item.price,
      }).then(() => {
        this.$store.commit('setDialog', true)
        this.showForm = 'product'
      })
    },

    copyToClipboard (text) {
      this.$emit('copyToClipboard', text)
    },
  },

  watch: {
    'item.warranty_client': function(newValue, oldValue) {
      this.updateWarrantyClient()
    },
    'item': function(newValue, oldValue) {
      this.updateWarrantyClient()
    },
  },
}
</script>

<style scoped lang="scss">
.selected-product {
  position: relative;
}

.list-products {
  background: white;
  top: -10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  left: 70px;
  min-width: 900px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
}

.break {
  word-break: break-all;
  font-size: 12px;
}

.wrap-serial-numbers {
  position: relative;

  .serial-numbers {
    position: absolute;
    top: 46px;
    right: 0;
    background: #dfdfdf !important;
    z-index: 1;
    border-radius: 3px;
    border: solid 1px #9d9d9d;
    width: 250px;
    max-height: 200px;
    overflow: auto;

    .row-wrap {
      border-bottom: solid 1px #bdbdbd;

      .serial-numbers-field {
        width: 100%;
        font-size: 12px;
      }

      textarea.serial-numbers-field {
        resize: none;
        outline: none;
        padding-top: 5px;
        padding-left: 5px;
        font-size: 15px;
        width: 100%;
      }

      .number-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
