<template>
  <tr
    :class="{ 'first-assembly-product': item.pivot.sku_id && isFirstAssemblyProduct }"
    :draggable="!isNotNewStatus"
    :id="index"
    :key="item.id"
    @dragover.prevent
    @dragstart="dragstartOfferProduct"
    @drop.prevent="dropOfferProduct"
    class="offer-product-row offers-product-group-row"
  >
    <td v-if="headers.some(h => h.value == 'root_category')">
      <span v-if="item.root_category.name">{{ item.root_category.name[$i18n.locale] }}</span>
    </td>
    <td class="px-2">
      <div class="flex-column justify-center">
        <v-btn
          class="category-groups__items-count"
          v-if="item.pivot.sku_id && isFirstAssemblyProduct"
          x-small
        >
          <span class="white--text font-12">{{ assemblyProductsCount }}</span>
        </v-btn>
        <v-checkbox
        class="offers-product-group__header-checkbox"
        ></v-checkbox>
      </div>
    </td>
    <td v-if="headers.some(h => h.value == 'id')" class="selected-product px-0">
      <div 
      class="text-center d-flex flex-column justify-space-around bordered-left font-12" 
      style="height: 90%;"
      >
        {{ item.id }}
        <a class="font-12 text-blue" @click.prevent="showOfferProducts = true">{{ item.group_id }}</a>
      </div>
      <div
        class="list-products"
        v-click-outside="closeOfferProducts"
        v-if="showOfferProducts"
      >
        <table>
          <tr v-for="product in item.groupProducts">
            <td class="font-12">{{ product.id }}</td>
            <td dir="rtl" class="font-12">{{ manufacturerNames[product.manufacturer_id] }}</td>
            <td class="font-12"><span class="font-12" v-if="product.root_category.name">{{ product.root_category.name[$i18n.locale] }}</span></td>
            <td class="font-12">{{ product.name[$i18n.locale] }}</td>
            <td class="font-12">{{ product.sku_original }}</td>
            <td class="font-12">{{ product.warranty }}</td>
            <td class="font-12">{{ product.var_price }}</td>
            <td class="font-12">{{ product.marginal_price }}</td>
            <td class="font-12" :style="{'color': product.status_color}" v-if="product">
              {{ product.status }}<br/>
              <span class="font-12" style="font-size: 10px" dir="rtl">{{ product.status_text }}</span>
            </td>
            <td class="font-12">
              <input type="radio" name="product" :value="product.id" v-model="item.id" @change="changeProduct(product)">
            </td>
          </tr>
        </table>
      </div>
    </td>
    <td
      class="white"
      v-if="headers.some(h => h.value == 'image')"
    >
      <light-box 
      class="light-box"
      @click.stop.prevent v-if="!!item.images && item.images.length" 
      :key="item.id" 
      :images="item.images"
      style="height: 57px !important;"
      />
    </td>
    <td dir="rtl" v-if="headers.some(h => h.value == 'name')">
      <div 
      class="d-flex flex-column justify-space-around px-3"
      style="height: 100%;"
      >
        <div dir="rtl" class="align-start d-flex justify-space-between">
          <div class="ml-2">
            <a
              @click.prevent.stop="openCategoryProductDialog(item.id)"
              class="font-weight-black font-12 line-break-two"
              draggable="true"
            >
              <span class="text-blue font-12" v-if="typeof item.name === 'object'" v-html="item.name[$i18n.locale]"></span>
              <span class="text-blue font-12" v-else v-html="item.name"></span>
            </a>
          </div>
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
          class="align-center d-flex justify-space-between mt-1"
          dir="rtl"
        >
          <div>
            <span class="text-gray font-12 line-break-one" v-if="item.root_category.name">{{ item.root_category.name[$i18n.locale] }}</span>
          </div>
          <div class="d-flex align-center">
            <span
              @click.stop
              class="text-blue font-12 line-break-one"
              v-html="item.sku_original"
            ></span>
            <div class="mr-3">
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
      </div>
    </td>
    <td class="text-right px-0"
      v-if="headers.some(h => h.value == 'manufacturer')"
      >
      <div 
      class="d-flex flex-column justify-space-around pr-3 bordered-both" 
      style="height: 90%;">
        <a
          :href="item.url"
          class="text-decoration-none text-green-light font-12"
          target="_blank"
          v-if="!!item.url && !item.url.indexOf('http')"
        >{{ manufacturerNames[item.manufacturer_id] }}</a>
        <span
          v-else
          class="font-12"
        >{{ manufacturerNames[item.manufacturer_id] }}</span>
        <div class="d-flex justify-end">
          <span class="mr-2 font-12" v-if="!item.is_vendor_corrected" style="color: red"> *</span>
          <a
            :href="item.link_manufacturer"
            class="text-decoration-none text-blue font-12"
            target="_blank"
            v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')"
          >{{ item.vendor || (vendor && vendor.name) }}</a>
          <span class="font-12 color-blue" v-else>{{ item.vendor || (vendor && vendor.name) }}</span>
        </div>
      </div>
    </td>
    <td 
    class="pl-0 pr-0"
    v-if="headers.some(h => h.value == 'var_price')"
      >
      <div
      class="px-3 d-flex flex-column justify-space-between bordered-right"
      style="height: 90%;"
      >
        <div class="text-right font-12">
          {{ item.producer_price }}
        </div>
        <div class="text-center font-12">
          {{ item.price }}
        </div>
        <div class="text-left font-12 pb-01">
          {{ item.marginal_price }}
        </div>
      </div>
    </td>
    <td
      class="px-1 text-center"
      v-if="headers.some(h => h.value == 'status')"
    >
      <div
        :style="{'color': item.status_color}"
        dir="rtl"
        v-if="item"
        class="font-12"
      >
        {{ item.status }}<br/>
        <span class="font-12" dir="rtl">{{ item.status_text }}</span>
      </div>
    </td>
    <td v-if="headers.some(h => h.value == 'sku_original')">
      <a class="font-12"
      v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')" 
      :href="item.link_manufacturer" 
      target="_blank">
      {{ item.sku_original }}
      </a>
      <span class="font-12" v-else>{{ item.sku_original }}</span>
    </td>
    <td
      class="text-center"
      v-if="headers.some(h => h.value == 'qty')"
    >
      <div class="d-flex flex-column justify-space-around align-center">
        <div
          class="align-center d-inline-flex category-products__count-buttons bordered-bottom"
        >
          <v-icon
            :disabled="isNotNewStatus"
            @click="onMinus"
            @long-press-start="onMinusStart"
            @long-press-stop="onMinusStop"
            color="grey"
            large
            tag="a"
            v-long-press="300"
          >
            mdi-menu-left
          </v-icon>
          <span class="font-12">{{ value }}</span>
          <v-icon
            :disabled="isNotNewStatus"
            @click="onPlus"
            @long-press-start="onPlusStart"
            @long-press-stop="onPlusStop"
            color="grey"
            large
            tag="a"
            v-long-press="300"
          >
            mdi-menu-right
          </v-icon>
        </div>
        <div>
          <v-select
            :disabled="isNotNewStatus"
            :items="warranties"
            @input="updateProduct"
            class="warranty-select pt-0 mt-0 category-products__count-select"
            style="width: 46px;"
            item-text="value"
            item-value="value"
            v-model="warranty"
          ></v-select>
        </div>
      </div>
    </td>
    <td
      class="text-center"
      v-if="headers.some(h => h.value == 'pivot.position')"
    >
      <span class="font-12">
        {{ (index + 1) }}
      </span>
    </td>
    <td v-if="headers.some(h => h.value == 'actions')">
      <div class="product-actions">
        <v-icon tag="a" 
        small 
        @click="removeItem" 
        :disabled="isNotNewStatus"
        >mdi-close</v-icon>
      </div>
    </td>    
  </tr>
</template>

<script>
import LongPress from 'vue-directive-long-press'
import dateMixin from "@/mixins/date";
import LightBox from "@/views/components/core/LightBox";
import {mapGetters} from "vuex";

export default {
  name: 'OfferProduct',
  components: {
    LightBox,
    CategoryProductForm: () => import("../../components/category/CategoryProductForm"),
  },
  props: ['item', 'warranties', 'manufacturerNames', 'index', 'offer', 'isNotNewStatus', 'headers', 'vendor'],
  mixins: [dateMixin],
  data: () => ({
    activeItemId: null,
    minusInterval: null,
    plusInterval: null,
    showOfferProducts: false,
    value: 1,
    warranty: 0,
  }),
  directives: {
    'long-press': LongPress
  },

  computed: {
    ...mapGetters([
      'categorySelect',
      'dialog',
      'offerProducts',
      'requestStatus',
    ]),

    assemblyProductsCount () {
      return this.offerProducts.filter(op => op && op.pivot.sku_id && this.item.pivot.sku_id && op.pivot.sku_id === this.item.pivot.sku_id).length
    },

    isFirstAssemblyProduct () {
      let firstAssemblyProduct = this.offerProducts.find(op => op && op.pivot.sku_id === this.item.pivot.sku_id)
      console.log(firstAssemblyProduct.sku_original)
      return firstAssemblyProduct && firstAssemblyProduct.id === this.item.id
    },
  },

  created() {
    this.warranty = parseInt(this.item.warranty)
    this.value = this.item.qty
  },

  methods: {
    closeOfferProducts() {
      this.showOfferProducts = false
    },

    onPlusStart() {
      this.plusInterval = setInterval(this.onPlus, 100)
    },

    onPlusStop() {
      clearInterval(this.plusInterval)
    },

    onMinusStart() {
      this.minusInterval = setInterval(this.onMinus, 100)
    },

    onMinusStop() {
      clearInterval(this.minusInterval)
    },

    onPlus() {
      this.value += 1
      this.updateProduct()
    },

    onMinus() {
      if (this.value > 1) {
        this.value -= 1
        this.updateProduct()
      }
    },
    updateProduct() {
      this.item.qty = this.value
      this.item.warranty = this.warranty
      let offerVatPriceCost = 0
      let offerMarginalCost = 0
      let offerProducts = this.offerProducts.map(product => {
        if (product.id === this.item.id) {
          offerVatPriceCost += product.var_price * this.item.qty
          offerMarginalCost += product.marginal_price * this.item.qty
        } else {
          offerVatPriceCost += product.var_price * product.qty
          offerMarginalCost += product.marginal_price * product.qty
        }
        return product
      })
      this.$store.commit('setOfferProducts', offerProducts)
      this.$eventHandle.$emit('updateVatPriceCost', offerVatPriceCost)
      this.$eventHandle.$emit('updateMarginalCost', offerMarginalCost)
      this.$eventHandle.$emit('sync-selected-products', offerProducts.map(p => p.group_id));
    },
    removeItem() {
      let offerProducts = this.offerProducts.filter(p => p.id !== this.item.id)
      this.$store.commit('setOfferProducts', offerProducts)
      this.updateProduct()
    },

    changeProduct(product) {
      let offerProducts = this.offerProducts.map(offerProduct => {
        if (offerProduct.id === this.item.id) {
          offerProduct = product
          offerProduct.qty = this.item.qty
          offerProduct.warranty = this.item.warranty
          offerProduct.price = this.item.var_price
          offerProduct.percent = this.item.percent
          offerProduct.images = this.item.images
          offerProduct.groupProducts = this.item.groupProducts
        }
        return offerProduct
      })
      this.$store.commit('setOfferProducts', offerProducts)
      this.updateProduct()
    },

    dropOfferProduct(e) {
      let fromIndex = e.dataTransfer.getData('row_index');
      let toIndex = e.target.closest('.offer-product-row').id;
      let offerProducts = this.offerProducts
      offerProducts = this.arrayMove(offerProducts, fromIndex, toIndex)
      let offerProductIds = offerProducts.map(offerProduct => offerProduct.id)
      this.$store.dispatch('saveOfferProductsPositions', {offer_id: this.offer.id, offerProductIds})
    },

    dragstartOfferProduct(e) {
      e.dataTransfer.setData('row_index', e.target.id)
    },

    arrayMove(arr, fromIndex, toIndex) {
      let element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      return arr
    },

    async openCategoryProductDialog(id) {
      await this.$store.dispatch('getEditProduct', {id})
      this.$store.commit('setDialog', true)
    },

    copyToClipboard (text) {
      this.$emit('copyToClipboard', text)
    },

    closeModal () {
      this.$store.commit('setDialog', false)
    },

    saveForm () {
      this.$eventHandle.$emit('save-product-from-categories')
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

<style lang="scss">
.offers-product-group-row {
  td {
    border-top: 4.5px solid transparent !important;
    border-bottom: 4.5px solid transparent !important;
  }
}
tr:not(:first-child).first-assembly-product td {
  border-top: 13px solid white !important;
}
</style>
