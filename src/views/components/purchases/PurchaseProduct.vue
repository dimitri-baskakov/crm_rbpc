<template>
  <tr class="offer-product-row ">
    <td>
      <div class="column">
        <div>
          <v-checkbox
          class="offers-product-group__header-checkbox"
          ></v-checkbox>
        </div>
      </div>
    </td>
    <td class="pa-0" v-if="headers.some(h => h.value == 'id')">
      <div
        class="d-flex justify-center align-center font-12 bordered-both"
        style="height: 90%;"
        >
          {{ item.id }}
      </div>
    </td>
    <td v-if="headers.some(h => h.value == 'name')">
      <div 
      class="d-flex flex-column justify-space-around px-4"
      style="height: 100%;"
      >
        <div dir="rtl" class="d-flex justify-space-between align-start">
          <a
            @click.prevent.stop="openCategoryProductDialog(item.id)"
            draggable="true"
                class="font-weight-black font-12 line-break-two"
          >
            <div class="d-inline">
              <span class="text-blue font-12" v-if="typeof item.name === 'object'" v-html="item.name[$i18n.locale]"></span>
              <span class="text-blue font-12" v-else v-html="item.name"></span>
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
          class="align-center d-flex justify-end"
          dir="rtl"
        >
          <span
            @click.stop
            class="text-blue font-12 line-break-one text-blue ml-3"
            v-html="item.sku_original"
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
    <td class="text-right" v-if="headers.some(h => h.value == 'manufacturer')">
      <div 
      class="d-flex flex-column justify-space-around px-3 bordered-left" 
      style="height: 90%;">
        <a
          :href="item.url"
          class="text-decoration-none text-green-vendor font-12"
          target="_blank"
          v-if="!!item.url && !item.url.indexOf('http')"
        >{{ manufacturerNames[item.manufacturer_id] || item.manufacturer }}</a>
        <span
          class="font-12"
          v-else
        >{{ manufacturerNames[item.manufacturer_id] || item.manufacturer }}</span>
        <div class="d-flex justify-end">
          <span class="mr-2 font-12" v-if="!item.is_vendor_corrected" style="color: red"> *</span>
          <a
            :href="item.link_manufacturer"
            class="text-decoration-none text-blue font-12"
            target="_blank"
            v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')"
          >{{ item.vendor || (vendor && vendor.name) }}</a>
          <span v-else>{{ item.vendor || (vendor && vendor.name) }}</span>
        </div>
      </div>
    </td>
    <td v-if="headers.some(h => h.value == 'var_price')"
    >
      <div
      class="px-3 d-flex flex-column justify-space-between bordered-both"
      style="height: 90%;"
      >
        <div class="text-right font-12">
          {{ item.purchase_producer_price }}
        </div>
        <div class="text-center font-12">
          {{ item.price }}
        </div>
        <div class="text-left font-12 pb-01">
          {{ item.purchase_marginal_price }}
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
    <td
      class="pa-0"
      v-if="headers.some(h => h.value == 'serial_numbers')"
    >
      <div 
      class="bordered-both px-2 purchase-product__sn"
      style="height: 90%;"
      >
        <div class="wrap-serial-numbers" 
        v-if="showSerialNumbers" 
        v-click-outside="nameOfCustomEventToCall"
        >
          <div class="serial-numbers">
            <div class="p-2 purchase-product__sn-item" v-for="(s, i) in item.serial_numbers" :key="i">
              <v-row 
              no-gutters 
              class="row-wrap purchase-product__sn-dropdown" 
              >
                <v-col cols="9" style="height: 100%;">
                  <v-textarea 
                    :disabled="isNotNewStatus"
                    @change="onChangeSerialNumbers"
                    class="pl-1"
                    no-details
                    no-resize
                    rows="1"
                    v-model="item.serial_numbers[i].serial_number"
                  ></v-textarea>
                </v-col>
                <v-col cols="2" class="number-wrap" style="height: 100%;">
                  <span class="font-8">{{ i + 1 }}</span>
                </v-col>
                <v-col cols="1" class="number-wrap" style="height: 100%;">
                  <v-tooltip bottom open-delay="400">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        :disabled="isNotNewStatus"
                        tag="a" small
                        @click="removeSerialNumber(item.serial_numbers[i].number)"
                        v-bind="attrs" v-on="on">
                        mdi-close
                      </v-icon>
                    </template>
                    <span>удалить</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
        <div 
        class="ma-0 pa-0 v-input theme--light v-text-field v-text-field--is-booted v-select"
        style="height: 26px;"
        >
          <div class="v-input__control">
            <div class="v-input__slot">
              <div class="v-select__slot" @click="showSerialNumbers = !showSerialNumbers">
                <label class="v-label theme--light" style="left: 0; right: auto; position: absolute;"></label>
                <span v-if="first_serial_number" class="break">{{ first_serial_number }}</span>
                <span v-else class="break">SN</span>
                <div class="v-input__append-inner">
                  <div class="v-input__icon v-input__icon--append">
                    <i v-if="showSerialNumbers" aria-hidden="true"
                      class="v-icon notranslate mdi mdi-menu-down theme--light primary--text"></i>
                    <i v-else aria-hidden="true" class="v-icon notranslate mdi mdi-menu-down theme--light"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-row
          align="center"
          class="ma-0 pa-0 flex-nowrap justify-between"
          style="width: 100%; height: 26px;"
        >
          <v-col
          class="align-center d-inline-flex category-products__count-buttons bordered-bottom pa-0"
          style="width: 46px;"
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
          </v-col>
          <v-col class="ma-0 pa-0 text-center purchase-product__qr">
            <v-tooltip top open-delay="400">
              <template #activator="{ on, attrs }">
                <v-btn
                  :color="serialNumberActiveProductId == item.id ? 'primary' : 'black'"
                  :style="isNotNewStatus ? 'pointer-events: none;' : ''"
                  @click="serialNumberActiveProductId = item.id"
                  class="ma-0 pa-0"
                  icon
                  plain
                  style="background: transparent;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon large>mdi-qrcode</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('serialNumberBlock') }}</span>
            </v-tooltip>
          </v-col>
          <v-col class="ma-0 pa-0 text-center purchase-product__qr-generator">
            <div
              :style="{ color: generatedColor}"
              @click="generateSerialNumber"
              class="font-12 bordered-bottom"
              style="cursor: pointer;"
            >
              GEN
            </div>
          </v-col>
        </v-row>
      </div>
    </td>
    <td>
      <div class="purchase-product__waranty d-flex flex-column align-center px-1 bordered-right"
      >
        <v-select
          :disabled="isNotNewStatus"
          :items="warranties"
          class="warranty-select pt-0 mt-0 category-products__count-select"
          style="width: 46px;"
          dense
          item-text="value"
          item-value="value"
          no-details
          v-model="warranty"
        ></v-select>
        <v-text-field
          :disabled="isNotNewStatus"
          :value="balance_warranty_term"
          dense
          class="purchase-product__waranty-input"
          no-details
        />
      </div>
    </td>
    <td class="px-1 text-center">
      <div 
      class="font-12 d-flex justify-center align-center"
      style="height: 90%;"
      >
        {{ n }}
      </div>
    </td>
    <td class="pa-0">
      <div 
      class="purchase-product__delete bordered-left d-flex justify-center align-center"
      style="height: 90%;"
      >
        <v-tooltip bottom open-delay="400">
          <template v-slot:activator="{ on, attrs }">
            <v-icon tag="a" small class="mr-2" @click="removeItem" :disabled="isNotNewStatus" v-bind="attrs" v-on="on">
              mdi-close
            </v-icon>
          </template>
          <span>удалить</span>
        </v-tooltip>
      </div>
    </td>
  </tr>

</template>

<script>
import {mapGetters} from 'vuex'
import LongPress from 'vue-directive-long-press'
import dateMixin from "@/mixins/date";

export default {
  name: 'PurchaseProduct',
  props: ['item', 'warranties', 'dateNumber', 'purchaseDate', 'isNotNewStatus', 'n', 'headers', 'manufacturerNames', 'vendor'],
  mixins: [dateMixin],
  data: () => ({
    balance_warranty_term: '',
    first_serial_number: '',
    generatedColor: 'red',
    minusInterval: null,
    plusInterval: null,
    showSerialNumbers: false,
    value: 1,
    warranty: 0,
  }),
  directives: {
    'long-press': LongPress
  },
  created() {
    this.first_serial_number = this.item.serial_numbers[0].serial_number
    this.warranty = this.item.warranty
    this.value = this.item.qty
    this.setColorGenSN()
  },

  computed: {
    ...mapGetters([
      'purchaseProducts'
    ]),
    serialNumberActiveProductId: {
      get: function () {
        return this.$store.getters.serialNumberActiveProductId
      },
      set: async function (newValue) {
        await this.$store.dispatch('changeSerialNumberActiveProductId', newValue)
      }
    },
  },

  methods: {
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
      this.item.serial_numbers.push({
        serial_number: '',
        number: this.value,
        id: 0
      })
      this.updateProduct()
    },
    onMinus() {
      if (this.value > 1) {
        this.value -= 1
        this.item.serial_numbers.pop()
        this.updateProduct()
      }
    },

    updateProduct() {
      this.item.qty = this.value
      let purchaseCost = 0
      let purchaseProducts = this.purchaseProducts.map(product => {
        if (product.id === this.item.id) {
          product.serial_numbers = this.item.serial_numbers
          purchaseCost += product.price * this.item.qty
        } else {
          purchaseCost += product.price * product.qty
        }
        return product
      })
      this.$store.commit('setPurchaseProducts', purchaseProducts)
      this.$eventHandle.$emit('updateCost', purchaseCost)
      this.setColorGenSN()
    },

    generateSerialNumber() {
      this.item.serial_numbers = this.item.serial_numbers.map(s => {
        if (s.serial_number === '') {
          s.serial_number = this.dateNumber + this.item.id + 'r' + s.number
        }
        return s
      })
      this.first_serial_number = this.item.serial_numbers[0].serial_number
      this.setColorGenSN()
    },

    removeSerialNumber(number) {
      if (this.item.serial_numbers.length === 1) {
        this.removeItem()
      } else {
        this.item.serial_numbers = this.item.serial_numbers.filter(sn => sn.number !== number)
        this.value -= 1
        this.item.qty = this.item.serial_numbers.length
      }
      this.setColorGenSN()
    },

    nameOfCustomEventToCall() {
      this.showSerialNumbers = false
    },

    removeItem() {
      this.$emit('removeItem', this.item.id)
      this.updateProduct()
    },

    onChangeSerialNumbers() {
      this.first_serial_number = this.item.serial_numbers[0].serial_number
      this.setColorGenSN()
    },

    setColorGenSN() {
      if (!this.item.serial_numbers.find(s => s.serial_number === '')) {
        this.generatedColor = 'green'
      } else {
        this.generatedColor = 'red'
      }
      this.$eventHandle.$emit('disable-status')
    },

    copyToClipboard (text) {
      this.$emit('copyToClipboard', text)
    },

    async openCategoryProductDialog(id) {
      await this.$store.dispatch('getEditProduct', {id})
      this.$store.commit('setDialog', true)
    },
  },

  watch: {
    warranty(value) {
      this.item.warranty = this.warranty
      this.balance_warranty_term = this.balanceDate(this.purchaseDate, value)
    },

    purchaseDate(value) {
      this.balance_warranty_term = this.balanceDate(value, this.warranty)
    }
  }
}
</script>

<style lang="scss">
.purchase-product {
  &__sn {
    &-item {
      box-shadow: 0 0 28px -8px rgb(0, 0, 0, .5)
    }
    .v-input__slot {
      height: 100%;
    }
    .v-text-field {
      padding: 0 !important;
    }
    .v-input__control {
      height: 100%;
    }
    .v-text-field > .v-input__control > .v-input__slot:before {
      display: none !important;
    }
    .v-input__append-inner {
      width: 8px;
      padding: 0 !important;
      .v-input__icon {
        min-width: auto !important;
        width: 8px !important;
      }
      .v-icon {
        font-size: 16px !important;
      }
    }
    .v-select__slot span {
      font-size: 12px !important;
      line-height: 14px !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .v-text-field__details {
      display: none !important;
    }
    &-dropdown {
      height: 14px !important;
      margin: 4.5px !important;
      border: none !important;
      background-color: #EEEEEE !important;
      transition: .3s ease;
      &:hover {
        background-color: #E0E0E0 !important;
      }
      .v-input {
        height: 100% !important;
      }
      .v-input__slot {
        margin-left: 4px !important;
      }
      textarea {
        height: 12px !important;
        min-height: auto !important;
        font-size: 10px !important;
        line-height: 10px !important;
      }
    }
  }
  &__qr {
    .v-icon {
      font-size: 23px !important;
    }
  }
  &__waranty-input {
    .v-text-field__details {
      min-height: auto !important;
      height: 0 !important;
      display: none !important;
    }
    input {
      font-size: 12px !important;
      text-align: center !important;
    }
  }
  &__delete {
    .v-icon {
      margin-right: 0 !important;
    }
  }
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
    background: #fff !important;
    z-index: 1;
    border-radius: 3px;
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
