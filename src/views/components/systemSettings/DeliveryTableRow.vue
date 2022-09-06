<template>
  <tr class="">
    <td class="text-start">{{ item.name }}</td>
    <td class="text-start pr-2">
      <v-text-field v-model="item.deliver_cost"/>
    </td>
    <td class="text-start pl-2">
      <v-text-field
        v-model="deliverCostWithVat"
      ></v-text-field>
    </td>
    <td class="text-start pl-2">
      <v-text-field v-model="item.payment_percent"/>
    </td>
    <td></td>
  </tr>
</template>

<script>
import {mapGetters} from "vuex"

export default {
  name: 'DeliveryTableRow',

  components: {
  },

  props: ['item'],

  data () {
    return {
      _timerId: 0,
    }
  },

  computed: {
    ...mapGetters([
    ]),
    // deliverCost: {
    //   get: function () {
    //     return Math.round(((this.item.deliver_cost || 0) * 117 / 100) * 100) / 100
    //   },
    //   set: function (newValue) {
    //     this.item.deliver_cost = Math.round(((newValue || 0) * 100) / 100)
    //   },
    // },
    deliverCostWithVat: {
      get: function () {
        return Math.round(((this.item.deliver_cost || 0) * 117 / 100) * 100) / 100
      },
      set: function (newValue) {
        clearTimeout(this.$data._timerId)
        this.$data._timerId = setTimeout(async () => {
          this.item.deliver_cost = Math.round(((newValue || 0) * 100 / 117) * 100) / 100
        }, 1500)
      },
    },
  },

  async created() {
  },

  methods: {
    closeSaleProducts() {
      this.showSaleProducts = false
    },
  },

  watch: {
    // 'item': function(newValue, oldValue) {
    //   this.updateWarrantyClient()
    // },
  },
}
</script>

<style scoped lang="scss">
</style>
