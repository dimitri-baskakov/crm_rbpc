<template>
  <div>
    <v-alert
      border="left"
      class=""
      dense
      dismissible
      prominent
      style="position: fixed; z-index: 5;"
      type="warning"
      v-if="!!errors"
    >
      <span
        :key="field"
        v-for="(error, field) in errors"
      >
        {{ field }} : {{ error['0'] }} <br>
      </span>
    </v-alert>
    <v-row
      class="flex-nowrap ma-0 rounded white"
      style="height: 35px;"
    >
      <v-col
        class="ma-1 pa-1 rounded product-card__header-field"
        cols="4"
        style="background: #CCE3FF;position: relative;"
      >
        <div style="position: absolute; z-index: 99; top: 3px;">
          <v-tooltip
            open-delay="400"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                @click.stop="copyToClipboard(product.sku_original)"
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
        <v-text-field
          :label="$t('sku_original')"
          dense
          dir="rtl"
          class="dir-rtl"
          hide-details
          v-model="product.sku_original"
        />
      </v-col>
      <v-col
        class="ma-1 ml-0 pa-1 rounded product-card__header-field"
        style="background: #CCE3FF;position: relative;"
      >
        <div style="position: absolute; z-index: 99; top: 3px;">
          <v-tooltip
            open-delay="400"
            top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                @click.stop="copyToClipboard(product.name[$i18n.locale])"
                class="copy-icon pa-0 ma-0"
                small
                tag="a"
                v-bind="attrs"
                v-if="product.name"
                v-on="on"
              >mdi-content-copy</v-icon>
            </template>
            <span>{{ 'копировать' }}</span>
          </v-tooltip>
        </div>
        <v-text-field
          :label="$t('form.name')"
          dense
          dir="rtl"
          hide-details
          v-model="product.name[$i18n.locale]"
          class="dir-rtl"
          v-if="product.name"
        />
      </v-col>
    </v-row>
    <v-row
      class="ma-0 mt-1 flex-nowrap product-card__top-row"
    >
      <v-col
        class="pa-0 rounded white product-card__specifications"
        cols="8"
        style="margin-top: 0px;"
      >
        <specifications :product="product"/>
      </v-col>
      <v-col
        class="pa-0 ml-1 rounded white product-card__specifications product-card__slider"
      >
        <div style="position: relative">
          <VueFullScreenFileDrop @drop='onDrop'/>
          <slider :product="product"/>
        </div>
      </v-col>
    </v-row>
    <v-row class="ma-0 mt-1 flex-nowrap product-card__bottom-row">
      <v-col
        class="pa-0 rounded white"
        cols="8"
        style="overflow: hidden;"
      >
        <description :product="product"/>
      </v-col>
      <v-col
        class="pa-0 ml-1 pr-1 rounded white"
        style="overflow-y: auto;"
      >
        <v-row
          class="flex-nowrap ma-0 pa-0 white"
        >
          <v-col
            class="ma-1 pa-1 mb-0 rounded product-card__specifications-select"
            cols="6"
            style="background: #eeeeee;"
          >
            <v-select
              :items="manufacturers || []"
              :label="$t('manufacturer')"
              dense
              hide-details
              item-text="name"
              item-value="id"
              required
              v-model="product.manufacturer_id"
            ></v-select>
          </v-col>
          <v-col
            class="ma-1 mx-0 pa-1 mb-0 rounded product-card__specifications-input"
            style="background: #eeeeee;"
          >
            <v-text-field
              label="Стоимость поставщика"
              dense
              hide-details
              dir="rtl"
              ref="producer_price"
              v-model="product.producer_price"
            />
          </v-col>
        </v-row>
        <v-row
          class="flex-nowrap ma-0 pa-0 white"
        >
          <v-col
            class="ma-1 pa-1 pb-0 mb-0 rounded product-card__specifications-select"
            cols="6"
            style="background: #CCE3FF;"
          >
            <v-autocomplete
              :hide-selected="false"
              :items="allVendors"
              :label="$t('vendors')"
              :loading="isLoading"
              :return-object="false"
              :search-input.sync="search"
              clearable
              color="primary"
              dense
              hide-no-data
              item-text="name"
              item-value="id"
              v-model="product.vendor_id"
            ></v-autocomplete>
          </v-col>
          <v-col
            class="ma-1 mx-0 pa-1 mb-0 rounded product-card__specifications-input"
            style="background: #CCE3FF;"
          >
            <v-text-field
                label="Цена с НДС"
              dense
              dir="rtl"
              hide-details
              ref="var_price"
              v-model="product.var_price"
            />
          </v-col>
        </v-row>
        <v-row
          class="flex-nowrap ma-0 pa-0 white"
        >
          <v-col
            class="ma-1 pa-1 mb-0 rounded product-card__specifications-select"
            cols="6"
            style="background: #eeeeee;"
          >
            <v-select
              :items="statuses || []"
              :label="$t('status')"
              dense
              hide-details
              item-text="label"
              item-value="value"
              v-model="product.status"
            />
          </v-col>
          <v-col
            class="ma-1 mx-0 mb-0 pa-1 rounded product-card__specifications-input"
            style="background: #eeeeee;"
          >
            <v-text-field
              label="Цена с НДС и Маржей"
              dense
              dir="rtl"
              hide-details
              v-model="product.marginal_price"
            />
          </v-col>
        </v-row>
        <v-row
          class="flex-nowrap ma-0 pa-0 white"
        >
          <v-col
            class="ma-1 pa-1 mb-0 rounded product-card__specifications-select"
            cols="6"
            style="background: #CCE3FF;"
          >
            <v-select
              :disabled="false"
              :items="categorySelect || []"
              :label="$t('form.categories')"
              deletable-chips
              dense
              hide-details
              item-text="name"
              item-value="id"
              v-model="categoryId"
            />
          </v-col>
          <v-col
            class="ma-1 mx-0 pa-1 mb-0 rounded product-card__specifications-select _left-label"
            style="background: #CCE3FF;"
          >
            <v-select
              :items="warranties"
              :label="$t('warranty')"
              class="warranty-select"
              clearable
              dense
              hide-details
              item-text="value"
              item-value="value"
              v-model="product.warranty"
            ></v-select>
          </v-col>
        </v-row>
        <v-row
          class="flex-nowrap ma-0 pa-0 white"
        >
          <v-col
            class="ma-1 pa-1 mr-0  mb-0 rounded product-card__specifications-input"
            style="background: #eeeeee;"
          >
            <v-text-field
              label="Сайт Поставщика"
              @click:append="copyToClipboard(product.url)"
              append-icon="mdi-content-copy"
              dense
              hide-details
              v-model="product.url"
            />
          </v-col>
        </v-row>
        <v-row
          class="flex-nowrap ma-0 pa-0 white"
        >
          <v-col
            class="ma-1 pa-1 mr-0 rounded product-card__specifications-input"
            style="background: #cce3ff;"
          >
            <v-text-field
              label="Сайт Вендора"
              @click:append="copyToClipboard(product.link_manufacturer)"
              append-icon="mdi-content-copy"
              dense
              hide-details
              v-model="product.link_manufacturer"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

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
import {mapGetters} from 'vuex'
import Slider from "../core/Slider";
import Specifications from "./Specifications";
import Description from "./Description";
import UploadFile from "../core/UploadFile";
import VueFullScreenFileDrop from '../../../helpers/vue-full-screen-file-drop'

export default {
  name: "CategoryProductForm",
  components: {UploadFile, Specifications, Slider, VueFullScreenFileDrop, Description},
  data () {
    return {
      categoryId: null,
      date: null,
      files: [],
      isLoading: false,
      modal: false,
      search: null,
      showVendors: false,
      snackbar: false,
      statuses: [],
      tab: null,
      vertical: false,
      warranties: [],
    }
  },

  computed: {
    ...mapGetters([
      'allVendors',
      'errors',
      'manufacturers',
      'requestStatus',
    ]),
  },

  props: ['product', 'category', 'categorySelect'],

  async created() {
    await this.$store.dispatch('getVendors', {all: true})
    await this.$store.dispatch('getManufacturers', {all: true})

    this.categoryId = !!this.product.categories && this.product.categories.length ? this.product.categories[0].id : this.category.id
    this.statuses = [
      {
        value: 'available',
        label: this.$t('available')
      },
      {
        value: 'unavailable',
        label: this.$t('unavailable')
      },
    ]

    this.setVendor(this.allVendors.find(v => v.id == this.product.vendor_id))

    this.$eventHandle.$on('save-product-from-categories', () => {
      this.saveProduct()
    })

    this.warranties = await this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'})
    this.product.warranty = parseInt(this.product.warranty)
  },

  destroyed () {
    this.$eventHandle.$off('save-product-from-categories')
  },

  methods: {
    saveProduct() {
      this.product.files = this.files
      this.product.categories = [this.categoryId]
      this.$eventHandle.$emit('save-product', this.product)
      this.files = []
    },
    reset() {
      this.$refs.form.reset()
    },

    onDrop(formData, files) {
      this.files = files
      console.log(formData);
    },

    removeFile(file) {
      let files = []
      for (let f of this.files) {
        if (f.name !== file.name) {
          files.push(f)
        }
      }
      this.files = files
    },

    closeVendors() {
      this.showVendors = false
    },

    findVendors() {
      let name = this.product.vendor
      let all = 'all'
      if (!!name) {
        this.$store.dispatch('getVendors', {name, all}).then(() => {
          this.showVendors = true
        })
      } else {
        this.$store.commit('setAllVendors', [])
      }
    },

    setVendor(vendor) {
      if (vendor) {
        this.productVendor = vendor.id
      }
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

  watch: {
    async search (val) {
      if (this.isLoading) return
      this.isLoading = true
      let name = val
      let all = 'all'
      if (!!name) {
        await this.$store.dispatch('getVendors', {name, all})
      } else {
        await this.$store.commit('setAllVendors', [])
      }
      this.isLoading = false
    },
    'product.producer_price': function (val, oldVal) {
      if (this.$refs.producer_price.isFocused) {
        this.product.var_price = Math.round((this.product.producer_price * 117 / 100) * 100) / 100
      }
    },
    'product.var_price': function (val, oldVal) {
      if (this.$refs.var_price.isFocused) {
        this.product.producer_price = Math.round((this.product.var_price * 100 / 117) * 100) / 100
      }
    },
  },
}
</script>

<style lang="scss">
.product-card {
  &__top-row {
    height: 300px;
    .specification-value {
      min-width: auto !important;
      width: 277px !important;
    }
  }
  &__bottom-row {
    .cke_contents {
      height: 195px !important;
    }
  }
  &__specifications {
    height: 300px;
    overflow: hidden;
    overflow-y: scroll !important;
    &-input,
    &-select {
      height: 36px !important;
      display: flex !important;
      justify-content: center !important;
      align-items: flex-end !important;
        .v-input__icon--clear {
          display: none !important;
        }
        .v-select__selections,
        .v-select__selection,
        input {
          font-size: 14px !important;
          padding-bottom: 0 !important;
          line-height: 14px !important;
          margin: 0 !important;
          margin-bottom: -1px !important;
        }
        .v-label {
          font-size: 12px !important;
          top: 0 !important;
          &--active {
            top: 6px !important;
          }
        }
        .v-input {
          margin: 0 !important;
        }
        .v-input,
        .v-input__control,
        .v-input__slot,
        .v-select__slot {
          height: 20px !important;
        }
        .v-select__slot {
          .v-label--active {
            left: auto !important;
            right: -5px !important;
          }
        }
        &._left-label {
          .v-select__slot {
          .v-label--active {
            left: 0 !important;
            right: auto !important;
          }
        }
      }
    }
  }
  &__slider {
    overflow: hidden !important;
  }
  &__header-field {
    .v-input {
      font-size: 14px !important;
      margin: 0 !important;
    }
    .v-input,
    .v-input__control,
    .v-input__slot {
      position: relative !important;
      height: 20px !important;
    }
    .v-label {
      top: 2px !important;
      &--active {
        top: 12px !important;
        font-size: 12px !important;
      }
    }
    input {
      margin-bottom: -4px !important;
    }
  }
}
.flex-container {
  display: flex;
}

.vendor-list {
  width: 15%;
  position: absolute;
  top: 660px;
  background: white;
  z-index: 1;
  padding: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.vendor_names:hover {
  cursor: default;
  background: #f6f6f6;
}
</style>
