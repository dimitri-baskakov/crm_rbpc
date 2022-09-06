<template>
  <div class="ma-1 mr-0 product-card__specifications-wrapper">
    <div>
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="product.product_specifications"
        class="products-specifications-table product-card__specifications-table"
        dense
        fixed-header
      >
        <template #header.actions="{ header }">
          <div class="text-center">
            <v-tooltip bottom open-delay="400">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="addItem"
                  class="product-card__specifications-table--remove"
                  color="black"
                  icon
                  style="background: transparent;"
                  v-bind="attrs"
                  v-on="on"
                  height="22px"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>создать характеристику</span>
            </v-tooltip>
          </div>
        </template>

        <template #header.value="{ header }">
          <div class="text-end font-12">
            Значения
          </div>
        </template>

        <template #header.name="{ header }">
          <div class="text-end font-12">
            Характеристики
          </div>
        </template>

        <template #item.actions="{ item }">
          {{item.index}}
          <v-btn
            @click="deleteItem(item)"
            class="product-card__specifications-table--remove"
            color="black"
            icon
            style="background: transparent;"
            height="20px"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </template>

        <template #item.value="{ item }">
          <v-text-field
          class="product-card__specifications-field"
            dense
            dir="rtl"
            hide-details
            v-model="item.value"
          ></v-text-field>
        </template>

        <template #item.name="{ item }">
          <v-text-field
            dense
            dir="rtl"
            hide-details
            v-model="item.name"
          ></v-text-field>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: "Specifications",
  props: ['product'],

  data() {
    return {
      tab: null,
      vertical: false,
      date: null,
      modal: false,
      editorConfig: {
        toolbar: [
          ['Source', 'Table'],
        ]
      },
      headers: [],
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize() {
      this.headers = [
        {text: 'ID', value: 'actions', align: 'center', sortable: false, class: 'pa-0 border-none', width: '36px'},
        {text: this.$t('values'), value: 'value', align: 'center', sortable: false, class: 'font-12 text-end specification-value', width: 358},
        {text: this.$t('specifications'), value: 'name', align: 'center', sortable: false, class: 'font-12 text-end'},
      ]
    },

    addItem() {
      this.product.product_specifications.push({'id': null, 'name': '', 'value': '', 'product_id': this.product.id, 'specification_id': null, 'property_id': null})
    },

    deleteItem(i) {
      this.product.product_specifications.splice(i, 1)
    },
  }
}
</script>

<style lang="scss">
.product-card {
  &__specifications {
    &-table {
      .v-data-table__wrapper {
        height: 100% !important;
        overflow: hidden;
      }
      &--remove {
        width: 16px !important;
        margin: 0 !important;
      }
    }
    th,
    td {
      border-radius: 4px;
      border: 2px solid white !important;
      box-sizing: border-box !important;
    }
    th {
      height: 42px !important;
    }
    td {
      height: 22px !important;
      padding: 0 10px !important;
      padding-bottom: 2px !important;
      box-sizing: border-box !important;
      &:first-child {
        padding: 0 !important;
      }
      .v-input {
        margin: 0 !important;
      }
      input {
        padding: 0 !important;
        font-size: 14px !important;
        line-height: 14px !important;
      }
    }
  }
}

.products-specifications-table table tbody tr:nth-child(odd) {
  background-color: #EEEEEE;
}

.products-specifications-table table tbody tr:nth-child(even) {
  background-color: #E3F2FD;
}

.products-specifications-table table tbody tr:nth-child(odd):hover {
  background-color: #E0E0E0 !important;
}

.products-specifications-table table tbody tr:nth-child(even):hover {
  background-color: #BBDEFB !important;
}

.products-specifications-table table thead tr th {
  color: #263238 !important;
  background-color: #CCE3FF !important;
  border-radius: 3px;
  border: 1px solid white;
}
.products-specifications-table table thead tr th:hover {
  color: black !important;
}
</style>
