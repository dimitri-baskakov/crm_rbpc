<template>
  <tr
    :draggable="!isNotNewStatus"
    :id="index"
    :key="item.id"
    @dragover.prevent
    @dragstart="dragstartOfferProduct"
    @drop.prevent="dropOfferProduct"
    class="offer-product-row"
  >
    <td>
      <div>
        <span class="font-12" v-if="item.root_category && typeof item.root_category.name === 'object'" v-html="item.root_category.name[$i18n.locale]"></span>
        <span class="font-12" v-else v-html="item.root_category.name"></span>
      </div>
    </td>

    <td class="selected-product">
      <div class="d-flex flex-column justify-center align-center"
      style="height: 90%;border-left: 1px solid #fff; border-right: 1px solid #fff;"
      >
        <span class="text-blue font-12 d-block">{{ item.id }}</span>
        <span class="font-12 d-block mt-1">{{ item.group_id }}</span>
      </div>
    </td>

    <td>
      <div dir="rtl">
        <a class="text-start line-break-two pr-2" @click="$eventHandle.$emit('edit-product', item)">
          <span class="font-12 text-blue line-break-two" v-if="typeof item.name === 'object'" v-html="item.name[$i18n.locale]"></span>
          <span class="font-12 text-blue line-break-two" v-else v-html="item.name"></span>
        </a>
      </div>
      <div class="d-flex justify-end mt-1 pr-2" >
        <span
          class="font-12"
          @click.stop
          v-html="item.sku_original"
        ></span>
      </div>
    </td>

    <td class="text-right">
      <a
        :href="item.url"
        class="text-decoration-none font-12 text-end"
        style="color: #64DD17;"
        target="_blank"
        v-if="!!item.url && !item.url.indexOf('http')"
      >{{ item.manufacturer && item.manufacturer.name }}</a>
      <span
        v-else
        class="font-12"
      >{{ item.manufacturer && item.manufacturer.name }}</span>
      <br>
      <div class="font-12 text-end">
        <span v-if="!item.is_vendor_corrected" style="color: red"> *</span>
        <a
          :href="item.link_manufacturer"
          class="text-decoration-none font-12 text-blue"
          target="_blank"
          v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')"
        >{{ item.vendor || (vendor && vendor.name) }}</a>
        <span v-else>{{ item.vendor || (vendor && vendor.name) }}</span>
      </div>
    </td>

    <td>
        <div 
        class="d-flex flex-column justify-center align-center bordered-both"
        style="height: 90%;">
          <div class="w-100 d-flex justify-end font-12 mr-3" style="width: 100%;">{{item.producer_price}}</div>
          <div class="w-100 d-flex justify-center font-12" style="width: 100%;">{{ item.var_price }}</div>
          <div class="w-100 d-flex justify-start font-12 ml-3" style="width: 100%;">{{ item.marginal_price }}</div>
        </div>
    </td>

    <td>
      <div
        class="d-flex justify-center align-center category-products__count-buttons"
      >
        <div class="bordered-bottom" style="width: 46px;">
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
      </div>
    </td>

    <td class="text-start">
      <div
        :style="{'color': item.status_color}"
        dir="rtl"
        v-if="item"
        class="font-12 text-center"
      >
        {{ item.status }}<br/>
        <span class="font-12" dir="rtl">{{ item.status_text }}</span>
      </div>
    </td>

    <td class="text-center">
     <span class="font-12">
        {{ (index + 1) }}
     </span>
    </td>

    <td>
      <div class="product-actions text-center">
        <v-icon tag="a" small class="mr-2" @click="removeItem" :disabled="isNotNewStatus">mdi-close</v-icon>
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
      style="z-index: 99;"
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
  </tr>

</template>

<script>
import LongPress from 'vue-directive-long-press'
import dateMixin from "@/mixins/date";
import LightBox from "@/views/components/core/LightBox";
import {mapGetters} from "vuex";

export default {
  name: 'CategoryOfferProduct',
  components: {
    LightBox,
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
      'offerProducts',
      'categorySelect',
      'dialog',
    ]),
  },

  mounted () {
    if (this.item) {
      this.warranty = parseInt(this.item.warranty)
      this.value = this.item.qty || 1
    }
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

    async dropOfferProduct(e) {
      let fromIndex = e.dataTransfer.getData('row_index');
      let toIndex = e.target.closest('.offer-product-row').id;
      let offerProducts = this.offerProducts
      offerProducts = this.arrayMove(offerProducts, fromIndex, toIndex)
      let offerProductIds = offerProducts.map(offerProduct => offerProduct.id)
      await this.$store.dispatch('saveOfferProductsPositions', {offer_id: this.offer.id, offerProductIds})
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
  min-width: 450px;
  width: 100%;
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
