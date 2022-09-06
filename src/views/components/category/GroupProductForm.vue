<template>
  <div class="pa-0" style="overflow: hidden; overflow-y: auto;">
    <v-row
      class="flex-nowrap pr-1 rounded products-group__top-row"
      no-gutters
    >
      <v-col
        class="rounded white pa-1"
        cols="7"
      >
        <v-data-table
          :headers="headers"
          :items="products"
          class="group-products-table products-group__table"
          hide-default-footer
        >
          <template #header.id="{header}">
            <span class="font-10 justify-start pl-2">
              {{$t('productId')}}
            </span>
          </template>
          <template #header.manufacturer="{header}">
            <span class="font-10 justify-start pl-2">
              {{$t('manufacturer')}}
            </span>
          </template>
          <template #header.vendor="{header}">
            <span class="font-10 justify-start pl-2">
              {{$t('vendor')}}
            </span>
          </template>
          <template #header.name="{header}">
            <div class="flex-column align-end">
              <span class="font-10 justify-end pr-2">{{ $t('name') }}</span>
              <span class="font-10 justify-end pr-2">{{ $t('sku_original') }}</span>
            </div>
          </template>
          <template #header.warranty="{header}">
            <span class="font-10">
              {{$t('warrTerm')}}
            </span>
          </template>
          <template #header.producer_price="{header}">
            <div class="d-block">
              <div class="text-right font-10 pr-1 pt-1">
                {{ $t('price') }}
              </div>
              <div class="text-center font-10">
                {{ $t('with_var_price') }}
              </div>
              <div class="text-left font-10 pl-1 pb-1">
                {{ $t('margin') }}
              </div>
            </div>
          </template>
          <template #header.status="{header}">
            <span class="font-10">
              {{$t('status')}}
            </span>
          </template>
          <template #header.description="{header}">
            <span class="font-10">
              {{$t('description')}}
            </span>
          </template>
          <template #header.main="{header}">
            <span class="font-10">
              {{$t('main')}}
            </span>
          </template>
          <template #item.id="{item}">
            <div class="bordered-right-white px-2 justify-start" style="height: 90%;">
              <a
                @click.prevent.stop="$eventHandle.$emit('edit-product', item)"
                class="text-blue font-12"
              >
                {{ item.id }}
              </a>
            </div>
          </template>
          <template #item.manufacturer="{item}">
            <div class="bordered-right-white px-2 d-flex justify-start align-center" style="height: 90%;">
              <a
                :href="item.url"
                class="text-decoration-none font-12 text-green-light"
                target="_blank"
                v-if="!!item.url && !item.url.indexOf('http')"
              >{{ item.manufacturer }}</a>
              <span
                class="font-12 text-green-light"
                v-else
              >{{ item.manufacturer }}</span>
            </div>
            
          </template>
          <template #item.vendor="{item}">
            <div style="height: 90%;">
              <div
                style="width: 85%; height: 100%; margin: 0 auto;"
                :style="(group.vendor == item.vendor) && 'background: #CCE3FF'"
                @click.stop="group.vendor = item.vendor"
                class="d-flex align-center rounded px-1"
              >
                <span v-if="!item.is_vendor_corrected" style="color: red"> *</span>
                <a
                  :href="item.link_manufacturer"
                  class="text-decoration-none font-12 text-blue"
                  target="_blank"
                  v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')"
                >{{ item.vendor }}</a>
                <span class="font-12" v-else>{{ item.vendor }}</span>
              </div>
            </div>
          </template>
          <template #item.name="{item}">
            <div
              style="height: 90%; margin: 0 auto;"
              class="align-content-stretch d-flex justify-center bordered-both-white rounded"
            >
              <div class="rounded" style="width: 97%;">
                <div
                  style="height: 50%"
                  :style="group.name == item.name && 'background: #CCE3FF;'"
                  @click.stop="group.name = item.name"
                  class="ma-0 pa-0 line-break-two"
                  dir="rtl"
                >
                  <span class="font-12 text-blue line-break-two pr-1" v-if="typeof item.name === 'object'" v-html="item.name[$i18n.locale]"></span>
                  <span class="font-12 text-blue line-break-two pr-1" v-else v-html="item.name"></span>
                </div>
                <div
                  style="height: 50%"
                  :style="group.sku_original == item.sku_original && 'background: #CCE3FF;'"
                  @click.stop="group.sku_original = item.sku_original"
                  class="ma-0 pa-0 d-flex align-center"
                  dir="rtl"
                >
                  <span
                    class="font-12 pr-1"
                    v-html="item.sku_original"
                  ></span>
                </div>
              </div>
            </div>
          </template>
          <template #item.warranty="{item}">
            <div
              style="width: 90%; height: 90%; margin: 0 auto;"
              :style="(group.warranty == item.warranty) && 'background: #CCE3FF;'"
              @click.stop="group.warranty = item.warranty"
              class="d-flex justify-center align-center rounded font-12"
            >
              {{ item.warranty }}
            </div>
          </template>
          <template #item.producer_price="{item}">
            <div
              style="height: 90%;"
              class="bordered-both-white"
            >
              <div 
              style="width: 90%; height: 100%; margin: 0 auto;"
              :style="(group.producer_price == item.producer_price) && 'background: #CCE3FF;'"
              @click.stop="group.producer_price = item.producer_price"
              class="d-flex flex-column justify-center rounded"
              >
                <div class="text-end font-12 pa-0 pr-1">
                  {{ item.producer_price }}
                </div>
                <div class="text-center font-12 pa-0">
                  {{ item.var_price }}
                </div>
                <div class="text-start font-12 pa-0 pl-1">
                  {{ item.marginal_price }}
                </div>
              </div>
            </div>
          </template>
          <template #item.status="{ item }">
            <div style="height: 90%;">
              <div
              style="width: 90%; height: 100%; margin: 0 auto;"
              :style="(group.status == item.status) && 'background: #CCE3FF;'"
              @click.stop="group.status = item.status"
              class="d-flex justify-center align-center rounded"
              >
                <div
                  class="font-12"
                  :style="{'color': item.status_color}"
                >
                  {{ item.status }}<br/>
                  <span class="font-10" dir="rtl">{{ item.status_text }}</span>
                </div>
              </div>
            </div>
          </template>
          <template #item.description="{ item }">
            <div class="products-group__desc-checkbox bordered-both-white" style="height: 90%;">
              <div
                style="width: 90%; height: 100%; margin: 0 auto;"
                :style="(group.description == item.description) && 'background: #CCE3FF;'"
                @click.stop="group.status = item.status"
                class="d-flex justify-center align-center rounded"
                >
                <v-radio-group
                  v-model="group.description"
                >
                  <v-radio
                    :value="item.description"
                  ></v-radio>
                </v-radio-group>
              </div>
            </div>
          </template>
          <template #item.main="{ item }">
            <div class="d-flex justify-center products-group__desc-checkbox">
                <v-radio-group
                  @change="changeGroupProduct"
                  v-model="group.main"
                >
                  <v-radio
                    :value="item.id"
                  ></v-radio>
                </v-radio-group>
            </div>
          </template>
        </v-data-table>
      </v-col>
      <v-col
        class="ml-1 rounded white"
        cols="12"
        md="5"
        style="height: 100%; overflow-x: hidden; overflow-y: auto;"
      >
        <v-row class="ma-0 pa-0" style="height: 100%;">
          <v-col
            :key="product.id"
            v-for="product in products"
            cols="4"
            class="ma-0 pa-1 mb-3"
            style="border-right: 1px solid #CCE3FF;"
          >
            <v-row no-gutters>
              <v-col
                class="rounded text-center"
                cols="12"
                style="background: #CCE3FF;"
              >
                <v-menu
                  v-model="imageSortShow"
                  offset-y
                  absolute
                  open-delay="500"
                  style="background-color: white;">
                  <template #activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-btn class="products-group__img-sort" @contextmenu="showImageSort">
                        {{ product.manufacturer }}
                      </v-btn>
                    </div>
                  </template>
                  <v-list class="assemblies-category-list products-group__img-sort-list">
                      <v-list-item v-for="(item, index) in imageSort" :key="index">
                          <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
              <v-col
                class="products-group__images"
                cols="3"
                v-for="(image,i) in product.images"
                :key="i"
              >
                <div
                  @click="setActiveImage(image)"
                  class="products-group__images-block rounded text-center d-flex flex-column justify-space-between"
                  :class="{active: image.main}"
                  style="cursor: pointer;"
                >
                  <light-box 
                  :key="image.id" 
                  :images="[image]"
                  class="white rounded"
                  />
                  <div class="font-10 py-1">{{ formatBytes(image.size, 0) }}</div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      class="flex-nowrap mt-1 pr-1 rounded"
      no-gutters
    >
      <v-col
        class="align-start d-flex justify-space-between pa-0 rounded white products-group__card"
        cols="12"
        md="7"
      >
        <category-product-form
          style="width:100%; background-color: #cce3ff;"
          :category="{}"
          :categorySelect="[]"
          :product="group"
        />
      </v-col>
      <v-col
        class="ml-1 rounded white"
        cols="12"
        md="5"
        style="
        max-height: 428px;
        overflow: hidden;
        overflow-y: scroll;
        border-bottom: 4px solid #fff;
        "
      >
        <div
          :key="specificationTableKey"
          v-if="filters"
          class="products-group__filters white"
        >
          <table class="white" style="width: 100%;">
            <thead>
              <tr>
                <th style="width: 16%;">
                  <div class="d-flex justify-start align-center pl-2">
                    <span>
                      Поставщик
                    </span>
                    <v-menu
                      v-model="isShowCategoryMenu"
                      offset-y
                      absolute
                      class="products-group__filters-vendor"
                      open-delay="500"
                      >
                      <template #activator="{ on, attrs }">
                        <div v-bind="attrs" v-on="on">
                          <v-btn class="assemblies-menu-btn" @contextmenu="showCategoryMenu" icon>
                              <v-icon>mdi-menu-down</v-icon>
                          </v-btn>
                        </div>
                      </template>
                      <v-list class="assemblies-category-list products-group__filters-vendor-list">
                          <v-list-item v-for="(item, index) in categoryGroups" :key="index">
                              <v-list-item-title>{{ item.title }}</v-list-item-title>
                          </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </th>
                <th>
                  <span class="d-flex justify-end pr-2">
                    Значения
                  </span>
                </th>
                <th>
                  <span class="d-flex justify-end pr-2">
                    Наименование
                  </span>
                </th>
                <th style="width: 29px;"></th>
              </tr>
            </thead>
              <!-- v-for="(filter, index) in filters" -->
            <tbody style="width: 100%;" v-for="i in 5" :key="i">
              <!-- specification in filter -->
              <tr style="width: 100%;" v-for="j in 5"
                :key="j"
                >
                <td align="left">
                  <!-- {{ specification.manufacturer }} -->
                 <span class="font-12 d-flex justify-start pl-2">
                    GTX 3060 super
                 </span>
                </td>
                <td>
                  <!-- {{ specification.value }} -->
                 <span class="font-12 d-flex justify-end pr-2">
                    GTX 3060 super
                 </span>
                </td>
                <td>
                  <!-- {{ specification.name }} -->
                 <span class="font-12 d-flex justify-end pr-2">
                    GTX 3060 super
                 </span>
                  </td>
                <td align="center">
                  <v-radio-group>
                    <v-radio></v-radio>
                  </v-radio-group>
                  <!-- <input
                    v-model="selectedSpecifications[specification.filter_id]"
                    :value="specification.id"
                    type="radio"
                    :name="specification.filter_id"
                    @click="changeGroupSpecification(specification)"
                  > -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>
    </v-row>

    <div style="max-height: 200px; overflow-y: auto">
      <!-- <table>
        <tr>
          <th>Поставщик</th>
          <th>Наименовение</th>
          <th>Код производителя</th>
          <th>Вендор</th>
          <th style="width: 100px">Ссылка на производителя</th>
          <th>Гарантийный срок</th>
          <th>Цена с НДС</th>
          <th>Главная</th>
        </tr>
        <tr v-for="product in products">
          <td>
            <br>
            <div class="center">{{ product.manufacturer }}</div>
          </td>
          <td>
            <div class="center">
              <input
                :id="`name-${product.id}`"
                v-model="group.name"
                type="radio" name="name"
                :value="typeof product.name === 'object' ? product.name[$i18n.locale] : product.name">
            </div>
            <label :for="`name-${product.id}`">
              <div dir="rtl" class="break"> {{ product.name }}</div>
            </label>
          </td>
          <td>
            <div class="center">
              <input :id="`sku-${product.id}`" v-model="group.sku_original" type="radio"
                     name="sku_original" :value="product.sku_original">
            </div>
            <label :for="`sku-${product.id}`">
              <div class="center">{{ product.sku_original }}</div>
            </label>
          </td>
          <td>
            <div class="center">
              <input :id="`vendor-${product.id}`" v-model="group.vendor" type="radio"
                     name="vendor" :value="product.vendor">
            </div>
            <label :for="`vendor-${product.id}`" class="center">
              <div class="center">{{ product.vendor }}</div>
            </label>
          </td>
          <td>
            <div v-if="product.link_manufacturer">
              <div class="center">
                <input :id="`link-${product.id}`" v-model="group.vendor_link" type="radio"
                       name="link_manufacturer" :value="product.link_manufacturer">
              </div>
              <label>
                <a v-if="!!product.link_manufacturer" :href="product.link_manufacturer" target="_blank">
                  {{
                    product.link_manufacturer.length > 25 ?
                      product.link_manufacturer.replace(/(.{20})..+/, "$1&hellip;") :
                      product.link_manufacturer
                  }}
                </a>
              </label>
            </div>
          </td>
          <td>
            <div class="center">
              <input :id="`warranty-${product.id}`" v-model="group.warranty" type="radio"
                     name="warranty" :value="product.warranty">
            </div>
            <label :for="`warranty-${product.id}`">
              <div class="center">{{ product.warranty }}</div>
            </label>
          </td>
          <td>
            <br>
            <div class="center">{{ product.var_price }}</div>
          </td>
          <td>
            <div class="center">
              <input @change="changeGroupProduct" v-model="group.main" type="radio" name="main" :value="product.id">
            </div>
          </td>
        </tr>
      </table> -->
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "GroupProductForm",
  components: {
    CategoryProductForm: () => import("@/views/components/category/CategoryProductForm"),
    LightBox: () => import("@/views/components/core/LightBox"),
    VueFullScreenFileDrop: () => import('../../../helpers/vue-full-screen-file-drop'),
  },
  data: () => ({
    background: 'red',
    filters: [],
    group: {
      status: '',
    },
    groupImages: [],
    headers: [],
    imageIds: [],
    productDescriptionId: null,
    products: [],
    selectedSpecifications: {},
    specificationIds: [],
    specificationTableKey: 0,
    vendors: [],
    warranties: [],
    isShowCategoryMenu: false,
    imageSortShow: false,
    categoryGroups: [
      {title: 'Custon'},
      {title: 'Grandandvance'},
      {title: 'Morlevi'},
      {title: 'Grandandvance'},
    ],
    imageSort: [
      {title: 'по убыванию'},
      {title: 'по возрастанию'},
    ],
    activeImage: 0,
  }),

  computed: {
    ...mapGetters([
      'manufacturers',
      'errors',
      'requestStatus',
      'groupProductData',
    ]),
  },

  created() {
    this.initialize()
    this.$store.dispatch('getSettings', {settingsName: 'settingsWarranties'}).then((data) => {
      this.warranties = data
    })
    this.$store.dispatch('getVendors').then((data) => {
      this.vendors = data.data
    })
  },

  mounted() {
    this.group = this.groupProductData.group
    this.filters = this.groupProductData.filters
    this.products = this.groupProductData.products

    if (!!this.group.id) {
      this.group.product_id = this.group.main
      this.imageIds = this.group.images.map(img => img.id)
      this.groupImages = this.group.images.map(img => {
        return {
          id: img.id,
          src: img.src,
          main: img.pivot.main,
          position: img.pivot.position,
          product_id: img.pivot.product_id
        }
      });

      for (let filter of this.filters) {
        for (let productSpecification of filter) {
          let specification = this.group.specifications.find(specification => specification.id === productSpecification.specification_id)
          if (!!specification) {
            this.selectedSpecifications[filter[0].filter_id] = productSpecification.id
          }
        }
      }
    } else {
      let mainProduct = {};
      let maxPrice = 0;
      for (let product of this.products) {
        if (maxPrice < product.var_price) {
          maxPrice = product.var_price
          mainProduct = product
        }
      }
      this.setGroupProduct(mainProduct)
    }

    this.groupImagesSort()
  },

  methods: {
    setGroupProduct(product) {
      this.group.product_id = product.id
      this.group.name = product.name
      this.group.sku_original = product.sku_original
      this.group.vendor = product.vendor
      this.group.vendor_link = product.link_manufacturer
      this.group.warranty = product.warranty
      this.group.description = product.description
      this.group.producer_price = product.producer_price
      this.group.status = product.status
      this.productDescriptionId = product.id
      this.group.main = product.id
      this.groupImages = product.images.map(img => {
        img.product_id = product.id
        return img
      })
      this.imageIds = product.images.map(img => img.id) ?? []
      this.selectedSpecifications = {}
      for (let filter of this.filters) {
        for (let productSpecification of filter) {
          if (productSpecification.product_id === product.id) {
            this.selectedSpecifications[productSpecification.filter_id] = productSpecification.id
          }
        }
      }
    },

    onDrop(formData, files) {
      this.saveImage(files)
    },

    addImage(event) {
      this.saveImage(event.target.files)
    },

    saveImage(files) {
      this.$store.dispatch('addImageToProduct', {
        files: files,
        productId: this.group.main
      }).then(response => {
        for (let i in this.products) {
          if (this.products[i].id === this.group.main) {
            let newImages = response.images.map(img => {
              this.imageIds.push(img.id)
              img.product_id = this.group.main;
              return img
            })
            this.products[i].images = [...this.products[i].images, ...newImages]
            this.groupImages = [...this.groupImages, ...newImages]
            break;
          }
        }
      })
    },

    saveGroupProduct() {
      this.group.images = this.groupImages
      this.group.specificationIds = []
      for (let filter of this.filters) {
        let item = filter.find(item => {
          return this.selectedSpecifications[filter[0].filter_id] === item.id
        })
        if (!!item) {
          this.group.specificationIds.push(item.specification_id)
        }
      }

      this.group.productIds = this.products.map(product => product.id)
      this.$store.dispatch('saveGroupProduct', this.group).then(group => {
        group.productIds = this.group.productIds
        this.$emit('saved', group)
      })
    },

    removeFile(image) {
      this.groupImages = this.groupImages.filter(img => {
        this.imageIds = this.imageIds.filter(id => id !== image.id)
        return img.id !== image.id
      })
    },

    changeGroupProduct() {
      let mainProduct = this.products.find(product => product.id === this.group.main)
      this.setGroupProduct(mainProduct)
    },

    setMainImage(image) {
      for (let img of this.groupImages) {
        img.main = image.id === img.id
      }
    },

    groupImagesSort() {
      this.groupImages = this.groupImages.sort((a, b) => {
        return a.position - b.position;
      });
    },

    changeGroupSpecification(specification) {
      if (this.selectedSpecifications[specification.filter_id] !== specification.id) {
        this.selectedSpecifications[specification.filter_id] = specification.id
      } else {
        this.selectedSpecifications[specification.filter_id] = false
      }
      this.specificationTableKey++
    },

    initialize() {
      this.headers = [
        {text: this.$t('productId'), value: 'id', sortable: false, class: 'caption pl-2', cellClass: 'text-h4 pa-0', width: 64},
        {text: this.$t('manufacturer'), value: 'manufacturer', sortable: false, class: 'caption', cellClass: 'text-h4 pa-0', width: 110},
        {text: this.$t('vendor'), value: 'vendor', sortable: false, class: 'caption', cellClass: 'ma-0 pa-0', width: 100},
        {text: this.$t('name'), value: 'name', sortable: false, class: 'caption', cellClass: 'ma-0 pa-0'},
        {text: this.$t('warrTerm'), value: 'warranty', align: 'center', sortable: false, class: 'caption px-0', cellClass: 'ma-0 pa-0', width: 64},
        {text: this.$t('price'), value: 'producer_price', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4', width: 88},
        {text: this.$t('status'), value: 'status', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4 font-12', width: 103},
        {text: this.$t('description'), value: 'description', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4', width: 63},
        {text: this.$t('main'), value: 'main', align: 'center', sortable: false, class: 'caption', cellClass: 'text-h4', width: 63},
      ]
    },

    showCategoryMenu() {
      this.isShowCategoryMenu = true
    },

    showImageSort() {
      this.imageSortShow = true
    },
    
    formatBytes (a, b = 2, k = 1024) {
      let d = Math.floor(Math.log(a) / Math.log(k));
      return 0 == a ? "0 B" : parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b))) + " " + ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
    },
  },

  watch: {
    imageIds() {
      if (this.imageIds.length > this.groupImages.length) {
        let images = []
        for (let product of this.products) {
          for (let productImage of product.images) {
            if (this.imageIds.indexOf(productImage.id) !== -1) {
              productImage.product_id = product.id
              images.push(productImage)
            }
          }
        }
        this.groupImages = images;
      } else {
        this.groupImages = this.groupImages.filter(img => this.imageIds.indexOf(img.id) !== -1)
      }
    }
  }
}
</script>

<style lang="scss">
  .products-group {
    &__top-row {
      height: 257px;
      .v-data-table .v-data-table__wrapper {
        overflow-y: scroll !important;
      }
      .images-wrapper img {
        width: 100% !important;
      }
    }
    &__img-sort {
      height: 40px !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      color: rgba(0, 0, 0, 0.6) !important;
      font-size: 12px !important;
    }
    &__table {
      height: 100%;
      overflow: hidden;
      th {
        height: 44px !important;
        box-sizing: border-box !important;
      }
    }
    &__images {
      height: 70px !important;
      padding: 2.5px !important;
      &-block {
        height: 100%;
        padding: 2.5px !important;
        padding-bottom: 0 !important;
        background-color: #E0E0E0;
        bottom: 4px !important;
        box-sizing: border-box;
          &.active {
            background-color: #CCE3FF !important;
            border: 1px solid #448AFF;
          }
      }
    }
    &__desc-checkbox {
      .v-input--selection-controls__input {
        margin: 0 !important;
      }
    }
    &__card {
      .product-card {
        &__top-row {
          height: 200px !important;
          .flex-container {
            height: 200px !important;
          }
          .image-wrap,
          .flex-container .slider_box {
            height: 100% !important;
          }
        }
        &__ckeditor {
          .cke_top {
            height: 30px !important;
          }
          .cke_toolgroup {
            margin: 0 !important;
          }
          .cke_button {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .cke_contents {
            height: 137px !important;
          }
        }
        &__specifications {
          height: 200px !important;
          margin-left: 0 !important;
          margin-right: 4px !important;
          &-wrapper {
            padding-top: 0 !important;
          }
          &-input,
          &-select {
            height: 26px !important;
          }
          &-input .v-label, 
          &-select .v-label {
            font-size: 9px !important;
            top: -3px !important;
          }
          &-select .v-input__icon,
          &-input .v-input__icon {
            min-width: auto !important;
            width: 15px !important;
            height: 15px !important;
          }
          &-input .v-icon {
            font-size: 12px !important;
          }
          &-input .v-label--active, 
          &-select .v-label--active {
            top: 9px !important;
          }
          &-input .v-input,
          &-input .v-input__control, 
          &-input .v-input__slot, 
          &-input .v-select__slot, 
          &-select .v-input, 
          &-select .v-input__control, 
          &-select .v-input__slot, 
          &-select .v-select__slot {
            height: 14px !important;
          }
          &-input, 
          .v-select__selections, 
          &-input .v-select__selection, 
          &-input input, 
          &-select .v-select__selections, 
          &-select .v-select__selection, 
          &-select input {
            font-size: 12px !important;
            line-height: 9px !important;
          }
        }
        &__slider {
          overflow: hidden !important;
        }
      }
    }
    &__filters {
      // &-vendor {
      //   .v-menu__content,
      //   &-list {
      //     background: #CCE3FF !important;
      //     .v-list-item__title:hover {
      //       background-color:#BDBDBD !important;
      //     }
      //   }
      // }
      table {
        border: 2px solid #fff !important;
        border-right: none !important;
      }
      th {
        height: 29px !important;
        background-color: #cce3ff !important;
        border: 1px solid #fff;
        border-radius: 3px;
        font-size: 12px !important;
        font-weight: 400 !important;
        margin: 4px !important;
      }
      td {
        height: 25px !important;
        background-color: #E3F2FD !important;
        border-radius: 3px;
        border: 1px solid #fff !important;
      }
      tr {
        &:hover {
          td {
            background-color: #BBDEFB !important;
          }
        }
        &.active {
          td {
            background-color: #CCE3FF !important;
          }
          &:hover {
            td {
              background-color: #B9D2EA !important;
            }
          }
        }
      }
      .assemblies-menu-btn {
        width: 20px !important;
        height: 20px !important;
        margin: 0 !important;
      }
      .v-radio {
        display: flex !important;
        justify-content: center !important;
      }
      .v-input,
      .v-input__slot {
        margin: 0 !important;
        padding: 0 !important;
      }
      .v-messages {
        display: none !important;
      }
      .v-input--selection-controls__input {
        width: 15px !important;
        height: 15px !important;
        margin: 0 !important;
      }
      .v-input--selection-controls__ripple {
        width: 15px !important;
        height: 15px !important;
        top: calc(50% - 14.5px) !important;
        left: -7.5px !important;
      }
    }
  }
</style>
