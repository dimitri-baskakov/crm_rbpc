<template>
<transition name="slide-fade">
  <tr
    :class="{ 'odd-item': assemblyProductsCategoryNumber % 2, 'even-item': !(assemblyProductsCategoryNumber % 2), 'first-category-product': isFirstCategoryProduct }"
    :draggable="!isNotNewStatus && isFirstCategoryProduct"
    :id="index"
    :key="item.id"
    @dragover.prevent
    @dragstart="dragstartAssemblyProduct"
    @drop.prevent="dropAssemblyProduct"
    class="assembly-product-row"
    v-show="show"
  >
    <td v-if="headers.some(h => h.value == 'select')">
      <div class="flex-column justify-center">
        <v-btn
          @click="collapseCategoryProducts"
          class="category-groups__items-count"
          v-if="isFirstCategoryProduct"
          x-small
        >
          <span class="white--text font-12">{{ categoryProductsCount }}</span>
        </v-btn>
        <v-checkbox
          @click="changeMainProduct(item)"
          class="offers-product-group__header-checkbox"
          v-model="item.pivot.main"
        ></v-checkbox>
      </div>
    </td>

    <td v-if="headers.some(h => h.value == 'root_category')">
      <span v-if="item.root_category && item.root_category.name">{{ item.root_category.name[$i18n.locale] }}</span>
    </td>

    <td v-if="headers.some(h => h.value == 'id')" class="selected-product">
      <div 
      class="text-center d-flex flex-column justify-space-around bordered-left font-12" 
      style="height: 90%;"
      >
        {{ item.id }}
        <a class="font-12 text-blue" @click.prevent="showAssemblyProducts = true">{{ item.group_id }}</a>
      </div>
      <div
        class="list-products"
        v-click-outside="closeAssemblyProducts"
        v-if="showAssemblyProducts"
      >
        <table>
          <tr v-for="product in item.groupProducts">
            <td>{{ product.id }}</td>
            <td dir="rtl">{{ manufacturerNames[product.manufacturer_id] }}</td>
            <td><span v-if="product.root_category.name">{{ product.root_category.name[$i18n.locale] }}</span></td>
            <td>{{ product.name[$i18n.locale] }}</td>
            <td>{{ product.sku_original }}</td>
            <td>{{ product.warranty }}</td>
            <td>{{ product.var_price }}</td>
            <td>{{ product.marginal_price }}</td>
            <td :style="{'color': product.status_color}" v-if="product">
              {{ product.status }}<br/>
              <span style="font-size: 2px" dir="rtl">{{ product.status_text }}</span>
            </td>
            <td>
              <input type="radio" name="product" :value="product.id" v-model="item.id" @change="changeProduct(product)">
            </td>
          </tr>
        </table>
      </div>
    </td>

    <td
      class="white"
      v-if="headers.some(h => h.value == 'image')"
      style="position: relative;"
    >
      <div
        class="container"
      >
        <light-box
          class="light-box px-1"
          @click.stop.prevent 
          v-if="!!item.images && item.images.length" 
          :key="item.id" 
          :images="item.images" 
          style="height: 57px !important;"
        />
        <div
          @click="setMainImage(item.images.map(i => i.id).includes(item.image_id))"
          :class="{'active': item.images.map(i => i.id).includes(item.image_id)}"
          class="main-image-highlighter"
          v-if="!!item.images && item.images.length"
        ></div>
      </div>
    </td>

    <td dir="rtl" v-if="headers.some(h => h.value == 'name')">
      <div
      class="d-flex flex-column justify-space-around"
      style="height: 100%;"
      >
        <div dir="rtl" class="align-start d-flex justify-space-between"
        >
          <div class="mr-3">
            <a
              @click.prevent.stop="openCategoryProductDialog(item.id)"
              class="font-weight-black font-12 line-break-two"
              draggable="true"
            >
              <span class="text-blue font-12" v-if="typeof item.name === 'object'" v-html="item.name[$i18n.locale]"></span>
              <span class="text-blue font-12" v-else v-html="item.name"></span>
            </a>
          </div>
          <div class="ml-3">
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
        <div dir="rtl" class="align-center d-flex justify-space-between mt-1"
        >
          <span class="text-gray font-12 line-break-one mr-3" v-if="item.root_category && item.root_category.name">{{ item.root_category.name[$i18n.locale] }}</span>
          <div class="d-flex align-center ml-3">
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

    <td class="text-right px-0" v-if="headers.some(h => h.value == 'manufacturer')">
      <div 
      class="d-flex flex-column justify-space-around pr-3 bordered-both" 
      style="height: 90%;"
      >
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
      <div class="d-flex flex-column align-center">
        <div
          :style="{'color': item.status_color}"
          dir="rtl"
          v-if="item"
        >
          {{ item.status }}
          <span class="font-12" dir="rtl">{{ item.status_text }}</span>
        </div>
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
    </td>

    <td v-if="headers.some(h => h.value == 'sku_original')">
      <a v-if="!!item.link_manufacturer && !item.link_manufacturer.indexOf('http')" :href="item.link_manufacturer" target="_blank">{{ item.sku_original }}</a>
      <span v-else>{{ item.sku_original }}</span>
    </td>

    <td
      class="text-center"
      v-if="headers.some(h => h.value == 'qty')"
    >
      <div
      class="d-flex justify-center align-center bordered-both"
      style="height: 90%;"
      >
        <div
          class="align-center d-inline-flex category-products__count-buttons bordered-bottom"
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
          <span class="font-12">{{ item.pivot.qty }}</span>
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
    <td
      class="text-center"
      v-if="headers.some(h => h.value == 'max_selectable_qty')"
    >
      <div 
      class="d-flex flex-column align-center mb-2"
      >
        <v-select
          :disabled="isNotNewStatus"
          :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          @input="updateProduct"
          class="warranty-select pt-0 mt-0 category-products__count-select"
          style="width: 46px;"
          v-model="item.pivot.max_selectable_qty"
        ></v-select>
          <!-- v-model="maxSelectableQty" -->
      </div>
    </td>

    <td
      v-if="headers.some(h => h.value == 'pivot.position')"
    >
      <div class="flex-column justify-center bordered-both"
      style="height: 90%;">
        <div class="d-flex align-content-center justify-center">
          <v-btn
            @click="changeCheckboxMode()"
            icon
            fab
            x-small
            style="background: transparent;"
            class="bg-none bg-transparent"
          >
            <v-icon>{{ item.pivot.required ? 'mdi-check-circle-outline' : (item.pivot.checkbox ? 'mdi-checkbox-marked-outline' : 'mdi-radiobox-marked') }}</v-icon>
          </v-btn>
        </div>
        <div class="text-center d-flex justify-center">
          <div font="12">{{ assemblyProductsCategoryNumber || '-' }}</div>
        </div>
      </div>
    </td>

    <td v-if="headers.some(h => h.value == 'actions')">
      <div class="product-actions d-flex justify-center align-center">
        <v-icon tag="a" small @click="removeItem" :disabled="isNotNewStatus">mdi-close</v-icon>
      </div>
    </td>    
  </tr>
</transition>
</template>

<script>
import LongPress from 'vue-directive-long-press'
import dateMixin from "@/mixins/date";
import LightBox from "@/views/components/core/LightBox";
import {mapGetters} from "vuex";

export default {
  name: 'AssemblyProduct',
  components: {
    LightBox,
    CategoryProductForm: () => import("../../components/category/CategoryProductForm"),
  },
  props: ['item', 'warranties', 'manufacturerNames', 'index', 'assembly', 'isNotNewStatus', 'headers', 'vendor', 'collapsedCategories'],
  mixins: [dateMixin],
  data: () => ({
    activeItemId: null,
    minusInterval: null,
    plusInterval: null,
    showAssemblyProducts: false,
    value: 1,
    warranty: 0,
    maxSelectableQty: 1,
    // main: false,
    // checkbox: false,
    // required: false,
    mainImageMenu: false,
    x: 0,
    y: 0,
    image_id: 0,
  }),
  directives: {
    'long-press': LongPress
  },

  computed: {
    ...mapGetters([
      'categorySelect',
      'dialog',
      'assemblyProducts',
      'requestStatus',
    ]),

    assemblyProductsCategories () {
      return [...new Set(this.assemblyProducts.map(ap => ap && ap.root_category && ap.root_category.id) || [])]
    },
    
    assemblyProductsCategoryNumber () {
      return (this.item.root_category && this.assemblyProductsCategories.indexOf(this.item.root_category.id) + 1) || 0
    },

    isFirstCategoryProduct () {
      // let firstCategoryProduct = this.item.root_category && this.assemblyProducts.find(ap => ((this.hasCategoryMainProducts)
      // // || (ap.show && ap.root_category && ap.root_category.id === this.item.root_category.id)
      // ))
      let firstCategoryProduct = this.assemblyProducts.find(ap => ap && ((this.hasCategoryMainProducts && ap.pivot.main && this.collapsed) || !this.collapsed || !this.hasCategoryMainProducts) && ap.root_category && ap.root_category.id === this.item.root_category.id)
      return firstCategoryProduct && firstCategoryProduct.id === this.item.id
    },

    categoryProductsCount () {
      return this.assemblyProducts.filter(ap => ap && ap.root_category && this.item.root_category && ap.root_category.id === this.item.root_category.id).length
    },

    hasCategoryMainProducts () {
      return this.assemblyProducts.some(ap => ap.pivot.main && ap.root_category && ap.root_category.id === this.item.root_category.id)
    },

    show () {
      // let mainProductsCount = this.assemblyProducts.filter(ap => ap && ap.pivot.main && ap.root_category && this.item.root_category && ap.root_category.id === this.item.root_category.id).length
      return !this.collapsed || (this.collapsed && this.item.pivot.main && this.hasCategoryMainProducts) || (!this.hasCategoryMainProducts && this.isFirstCategoryProduct && this.collapsed)
    },

    collapsed () {
      let collapsedCategories = this.collapsedCategories
      return collapsedCategories.includes(this.item.root_category && this.item.root_category.id)
    },
  },

  created() {
    // console.log(this.item.pivot.max_selectable_qty)
    // console.log(this.item.max_selectable_qty)
    this.warranty = parseInt(this.item.warranty)
    // this.maxSelectableQty = (this.item.max_selectable_qty)
    // this.item.max_selectable_qty = this.item.pivot.max_selectable_qty
    // console.log(this.item.max_selectable_qty)
    // this.value = this.item.pivot.qty
    // this.main = this.item.main
    // this.checkbox = this.item.pivot.checkbox
    // this.required = this.item.pivot.required
    this.image_id = this.item.image_id
  },

  methods: {
    closeAssemblyProducts() {
      this.showAssemblyProducts = false
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
      this.item.pivot.qty += 1
      this.updateProduct()
    },

    onMinus() {
      if (this.item.pivot.qty > 1) {
        this.item.pivot.qty -= 1
        this.updateProduct()
      }
    },

    updateProduct() {
      // this.item.qty = this.value
      this.item.image_id = this.image_id
      this.item.warranty = this.warranty
      // this.item.max_selectable_qty = this.maxSelectableQty
      // this.item.main = this.main
      // this.item.checkbox = this.checkbox
      // this.item.required = this.required
      let assemblyVatPriceCost = 0
      let assemblyMarginalCost = 0
      let assemblyProducts = this.assemblyProducts.map(product => {
        if (this.item.pivot.main && product.id === this.item.id) {
          assemblyVatPriceCost += product.var_price * this.item.pivot.qty
          assemblyMarginalCost += product.marginal_price * this.item.pivot.qty
        } else if (this.item.pivot.main) {
          assemblyVatPriceCost += product.var_price * product.pivot.qty
          assemblyMarginalCost += product.marginal_price * product.pivot.qty
        }
        return product
      })
      this.$store.commit('setAssemblyProducts', assemblyProducts)
      this.$eventHandle.$emit('updateVatPriceCost', assemblyVatPriceCost)
      this.$eventHandle.$emit('updateMarginalCost', assemblyMarginalCost)
      this.$eventHandle.$emit('sync-selected-products', assemblyProducts.map(p => p.group_id));
    },

    removeItem() {
      let assemblyProducts = this.assemblyProducts.filter(p => p.id !== this.item.id)
      this.$store.commit('setAssemblyProducts', assemblyProducts)
      this.updateProduct()
    },

    changeProduct(product) {
      let assemblyProducts = this.assemblyProducts.map(assemblyProduct => {
        if (assemblyProduct.id === this.item.id) {
          assemblyProduct = product
          assemblyProduct.pivot.qty = this.item.pivot.qty
          assemblyProduct.image_id = this.item.image_id
          assemblyProduct.warranty = this.item.warranty
          assemblyProduct.pivot.max_selectable_qty = this.item.pivot.max_selectable_qty
          assemblyProduct.pivot.checkbox = this.item.pivot.checkbox
          assemblyProduct.pivot.required = this.item.pivot.required
          assemblyProduct.pivot.main = this.item.pivot.main
          assemblyProduct.price = this.item.var_price
          assemblyProduct.percent = this.item.percent
          assemblyProduct.images = this.item.images
          assemblyProduct.groupProducts = this.item.groupProducts
        }
        return assemblyProduct
      })
      this.$store.commit('setAssemblyProducts', assemblyProducts)
      this.updateProduct()
    },

    dropAssemblyProduct(e) {
      let fromIndex = e.dataTransfer.getData('row_index');
      let toIndex = e.target.closest('.assembly-product-row').id;
      let assemblyProducts = this.assemblyProducts.map(ap => {
        if (ap) {
          ap.position = null
        }
        return ap
      })
      assemblyProducts = this.arrayMove(assemblyProducts, fromIndex, toIndex)

      let sortByPrice = function(obj1, obj2) {
        return obj1.var_price - obj2.var_price
        // return obj1.price - obj2.price
      }

      // let grouped = {}
      // for (var i = 0; i < assemblyProducts.length; i += 1) {
      //   if (!grouped[assemblyProducts[i].root_category.id]) {
      //     grouped[assemblyProducts[i].root_category.id] = []
      //   }
      //   grouped[assemblyProducts[i].root_category.id].push(assemblyProducts[i])
      // }

      // for (var group in grouped) {
      //   grouped[group] = grouped[group].sort(sortByPrice)
      // }

      let categoryIds = ([...new Set(assemblyProducts.map(ap => ap && ap.root_category.id) || [])]).filter(apId => apId != undefined) || []

      let sortedAssemblyProducts = this.assemblyProducts.sort(sortByPrice)
      let groupedAssemblyProducts = []
      let groupIndex = 0
      sortedAssemblyProducts.map((ap, indx) => {
        groupIndex = ((ap && ap.root_category.id && (parseInt(categoryIds.indexOf(ap.root_category.id)) + 1)) || 1) * 10000
        if (ap) {
          groupedAssemblyProducts[(groupIndex + indx)] = ap
        }
      })
      groupedAssemblyProducts = groupedAssemblyProducts.filter(Boolean)
      // for (let i = 0; 1 < sortedAssemblyProducts; i += 1) {
      //   groupedAssemblyProducts[(i + 1) * 1000] = 
      // }

      let p = 0
      let positionedAssemblyProducts = groupedAssemblyProducts.map((gap, indx) => {
        if (gap) {
          gap.position = p
        }
        p++
        return gap
      })
      this.$store.commit('setAssemblyProducts', positionedAssemblyProducts)

      // let assemblyProductIds = assemblyProducts.map(assemblyProduct => assemblyProduct.id)
      let assemblyProductIds = groupedAssemblyProducts.map(assemblyProduct => assemblyProduct.id)
      this.$store.dispatch('saveAssemblyProductsPositions', {assembly_id: this.assembly.id, assemblyProductIds})
    },

    dragstartAssemblyProduct(e) {
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
      // this.activeItemId = id
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

    changeMainProduct (assemblyProduct) {
      let main = !this.item.pivot.main
      if (!assemblyProduct.pivot.checkbox && !assemblyProduct.pivot.required) {
        let assemblyProducts = this.assemblyProducts.map(ap => {
          if ((ap.root_category.id === assemblyProduct.root_category.id) && (ap.id != assemblyProduct.id)) {
            // ap.main = false
            this.$set(ap.pivot, 'main', false)
            // return ap
          }
          return ap
        })
        this.$store.commit('setAssemblyProducts', assemblyProducts)
      }
      // let assemblyVatPriceCost = 0
      // let assemblyMarginalCost = 0
      // this.assemblyProducts.map(product => {
      //   if (product.id === this.item.id) {
      //     assemblyVatPriceCost += product.var_price * this.item.qty
      //     assemblyMarginalCost += product.marginal_price * this.item.qty
      //   } else {
      //     assemblyVatPriceCost += product.var_price * product.qty
      //     assemblyMarginalCost += product.marginal_price * product.qty
      //   }
      //   return product
      // })
      // this.$eventHandle.$emit('updateVatPriceCost', assemblyVatPriceCost)
      // this.$eventHandle.$emit('updateMarginalCost', assemblyMarginalCost)
      this.updateProduct()
    },

    changeCheckboxMode () {
      this.item.pivot.main = false
      let checkbox = false
      let required = false
      if (this.item.pivot.checkbox && !this.item.pivot.required) {
        checkbox = false
        required = true
      } else if (!this.item.pivot.checkbox && this.item.pivot.required) {
        checkbox = false
        required = false
      } else {
        checkbox = true
        required = false
      }
      // checkbox = !this.checkbox
      this.item.pivot.checkbox = checkbox
      this.item.pivot.required = required
      // let checkbox = !this.item.pivot.checkbox
      let assemblyProducts = this.assemblyProducts.map(ap => {
        if (!!ap.root_category && this.item.root_category && ap.root_category.id === this.item.root_category.id) {
          ap.pivot.max_selectable_qty = 1
          this.$set(ap.pivot, 'max_selectable_qty', 1)
          ap.pivot.checkbox = checkbox
          ap.pivot.required = required
          this.$set(ap.pivot, 'checkbox', checkbox)
          this.$set(ap.pivot, 'required', required)
          // ap.main = false
          this.$set(ap.pivot, 'main', false)
        }
        return ap
      })
      // let assemblyVatPriceCost = 0
      // let assemblyMarginalCost = 0
      // this.assemblyProducts.map(product => {
      //   if (product.id === this.item.id) {
      //     assemblyVatPriceCost += product.var_price * this.item.qty
      //     assemblyMarginalCost += product.marginal_price * this.item.qty
      //   } else {
      //     assemblyVatPriceCost += product.var_price * product.qty
      //     assemblyMarginalCost += product.marginal_price * product.qty
      //   }
      //   return product
      // })

      this.$store.commit('setAssemblyProducts', assemblyProducts)
      // this.$eventHandle.$emit('updateVatPriceCost', assemblyVatPriceCost)
      // this.$eventHandle.$emit('updateMarginalCost', assemblyMarginalCost)
      this.updateProduct()
    },

    collapseCategoryProducts () {
      this.$store.dispatch('saveCollapsedCategories', (this.item.root_category && this.item.root_category.id) || null)
      // let sortByPrice = function (obj1, obj2) {
      //   return parseFloat(obj1.vat_price) - parseFloat(obj2.vat_price)
      // }
      // let grouped = {}

      // for (let i = 0; i < this.assemblyProducts.length; i += 1) {
      //   if(!grouped[this.assemblyProducts[i].root_category.id]) {
      //     grouped[this.assemblyProducts[i].root_category.id] = []
      //   }
      //   grouped[this.assemblyProducts[i].root_category.id].push(this.assemblyProducts[i])
      // }

      // for (var group in grouped) {
      //   grouped[group] = grouped[group].sort(sortByPrice)
      // }

      // this.assemblyProducts.map(ap => {
      //   if (!ap.main && ap.root_category && ap.root_category.id === this.item.root_category.id && this.hasCategoryMainProducts) {
      //     this.$set(ap, 'show', !ap.show)
      //   }
      // })
    },

    showMainImageMenu (e) {
      e.preventDefault()
      this.mainImageMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.mainImageMenu = true
      })
    },

    setMainImage (active) {
      let assemblyProducts = []
      if (active) {
        if (this.item.pivot.main) {
          this.image_id = this.item.images[0].id
        } else {
          this.image_id = null
        }
        assemblyProducts = this.assemblyProducts.map(ap => {
          if (ap.pivot.main) {
            ap.image_id = ap.images[0].id
            this.$set(ap, 'image_id', ap.images[0].id)
          } else {
            ap.image_id = null
            this.$set(ap, 'image_id', null)
          }
          return ap
        })
      } else {
        this.image_id = this.item.images[0].id
        assemblyProducts = this.assemblyProducts.map(ap => {
          ap.image_id = null
          this.$set(ap, 'image_id', null)
          return ap
        })
        assemblyProducts = this.assemblyProducts.map(ap => {
          if (ap.root_category && this.item.root_category && ap.root_category.id === this.item.root_category.id) {
            ap.image_id = this.item.images[0].id
            this.$set(ap, 'image_id', this.item.images[0].id)
          }
          return ap
        })
      }
      this.$store.commit('setAssemblyProducts', assemblyProducts)
      this.updateProduct()
    },
  },

  watch: {
    assemblyProducts: {
      handler: function (val, oldVal) {
        let assemblyProduct = this.assemblyProducts.find(ap => !!ap && ap.id === this.item.id)
        this.item.pivot.main = (assemblyProduct && assemblyProduct.pivot.main) || false
        this.item.pivot.checkbox = (assemblyProduct.pivot && assemblyProduct.pivot.checkbox) || false
        this.item.pivot.required = (assemblyProduct.pivot && assemblyProduct.pivot.required) || false
        // this.maxSelectableQty = (assemblyProduct && assemblyProduct.max_selectable_qty) || 1
        this.image_id = (assemblyProduct && assemblyProduct.image_id) || 0
      },
      deep: true
    },
    
    "item.pivot.max_selectable_qty": function (val, oldVal) {
      if (this.item.pivot.checkbox || this.item.pivot.required) {
        let assemblyProducts = this.assemblyProducts.map(ap => {
          if (!!ap.root_category && this.item.root_category && ap.root_category.id === this.item.root_category.id) {
            // ap.max_selectable_qty = val
            ap.pivot.max_selectable_qty = val
            // this.$set(ap, 'max_selectable_qty', val)
            this.$set(ap.pivot, 'max_selectable_qty', val)
            // console.log(val)
          }
          return ap
        })
        this.$store.commit('setAssemblyProducts', assemblyProducts)
        this.updateProduct()
      }
    },

    // maxSelectableQty: function (val, oldVal) {
    //   if (this.checkbox || this.required) {
    //     let assemblyProducts = this.assemblyProducts.map(ap => {
    //       if (!!ap.root_category && this.item.root_category && ap.root_category.id === this.item.root_category.id) {
    //         ap.max_selectable_qty = val
    //         this.$set(ap, 'max_selectable_qty', val)
    //         // console.log(val)
    //       }
    //       return ap
    //     })
    //     this.$store.commit('setAssemblyProducts', assemblyProducts)
    //     this.updateProduct()
    //     let assemblyProduct = this.assemblyProducts.find(ap => !!ap && ap.id === this.item.id)
    //     this.maxSelectableQty = (assemblyProduct && assemblyProduct.max_selectable_qty) || 5
    //   }
    // },

    // checkbox: function (val, oldVal) {
    //   let assemblyProducts = this.assemblyProducts.map(ap => {
    //     if (!!ap.root_category && this.item.root_category && ap.root_category.id === this.item.root_category.id) {
    //       ap.pivot.max_selectable_qty = 1
    //       this.$set(ap.pivot, 'max_selectable_qty', 1)
    //     }
    //     return ap
    //   })
    //   this.$store.commit('setAssemblyProducts', assemblyProducts)
    // },

    required: function (val, oldVal) {
      let assemblyProducts = this.assemblyProducts.map(ap => {
        if (!!ap.root_category && this.item.root_category && ap.root_category.id === this.item.root_category.id) {
          ap.pivot.max_selectable_qty = 1
          this.$set(ap.pivot, 'max_selectable_qty', 1)
        }
        return ap
      })
      this.$store.commit('setAssemblyProducts', assemblyProducts)
    },

    'item.pivot.main': function (val, oldVal) {
      this.image_id = null
      let assemblyProducts = this.assemblyProducts.map(ap => {
        ap.image_id = null
        this.$set(ap, 'image_id', null)
        return ap
      })
      this.$store.commit('setAssemblyProducts', assemblyProducts)
      this.updateProduct()
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
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .9s ease;
  // transition: all .9s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100px) scaleY(0.6);
  opacity: 0;
  max-height: 0;
}
// .main-image-highlight:after {
//   content: '';
//   position: absolute;
//   right: 0px;
//   bottom: 0px;
//   width: 0;
//   height: 0;
//   border-left: 20px solid transparent;
//   border-right: 20px solid transparent;
//   border-top: 20px solid #000;
//   clear: both;
//   transform: rotateZ(-45deg);
// }
.container {
  position: relative;
  width: 100%;
  // width: 300px;
  // height: 70px;
  // background: black;
  // border-radius: 12px;
  overflow: hidden;
  padding: 0;
}

.main-image-highlighter {
  width: 18px;
  height: 37px;
  transform: rotateZ(45deg);
  // border-style: solid;
  // border-width: 0 0 30px 30px;
  // border-color: transparent transparent #448AFF transparent;
  right: -2px;
  bottom: -12px;
  position: absolute;
  cursor: pointer;
}
.main-image-highlighter:hover {
  background: #E0E0E0BD;
  // background: #448AFFBD;
}
.main-image-highlighter.active {
  background: #448AFFBD;
}
tr:not(:first-child).first-category-product td {
  border-top: 13px solid white !important;
}
</style>
