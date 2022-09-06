<template>
  <v-form
    ref="form"
    style="min-height: 100%;"
  >
    <v-alert
      border="left"
      outlined
      prominent
      type="warning"
      v-if="!!errors"
    >
      <span v-for="(error, field) in errors">
        {{ field }} : {{ error['0'] }} <br>
      </span>
    </v-alert>
    <v-tabs
      :vertical="vertical"
      active-class="primary lighten-5 rounded active-tab"
      class="tabs-dense black--text"
      v-model="tab"
    >
      <v-tab
        :href="`#tab-${locale}`"
        :key="locale"
        class="px-0 mx-0 black--text"
        color="black"
        style="height: 30px; min-width: 40px !important;"
        v-for="locale in $locales"
      >
        {{ locale }}
      </v-tab>
      <v-tab-item
        :key="locale"
        :value="'tab-' + locale"
        v-for="locale in $locales"
      >
        <v-text-field
          :dir="locale === 'he' ? 'rtl' : 'ltr'"
          :label="`${$t('form.name')} (${locale})`"
          v-model="category.name[locale]"
        ></v-text-field>
      </v-tab-item>
    </v-tabs>
    <v-select
      :disabled="false"
      :items="categorySelect"
      :label="$t('form.categories')"
      clearable
      dense
      item-text="name"
      item-value="id"
      v-model="category.parent_id"
    ></v-select>

    <v-text-field
      :label="$t('marginal_percent')"
      v-model="category.marginal_percent"
    ></v-text-field>

    <div class="d-flex flex-column">
      <v-checkbox
        :label="$t('form.commercialOffer')"
        class="mt-0 black-text-checkbox"
        v-model="category.commercial_offer"
      ></v-checkbox>

      <v-checkbox
        :label="$t('form.peripheralSingleProducts')"
        class="mt-0 black-text-checkbox"
        v-model="category.peripheral_single_products"
      ></v-checkbox>

      <!-- <v-checkbox
        :label="'Унификация характеристик для (Процессоры)'"
        class="mt-0 black-text-checkbox"
        v-model="category.unification"
      ></v-checkbox> -->

      <!-- <v-checkbox
        :label="'Подставлять товары в категории документов'"
        class="mt-0 black-text-checkbox"
        v-model="category.substituteProductsInDocumentCategories"
      ></v-checkbox> -->

      <v-checkbox
        :label="$t('form.hideForSite')"
        class="mt-0 black-text-checkbox"
        v-model="category.hide_for_site"
      ></v-checkbox>

      <v-checkbox
        :label="$t('form.hideForOffers')"
        class="mt-0 black-text-checkbox"
        v-model="category.hide_for_offers"
      ></v-checkbox>
    </div>
  </v-form>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "CategoryForm",
  props: ['category', 'categorySelect'],

  data: () => ({
    tab: null,
    vertical: false,
  }),

  computed: {
    ...mapGetters(['errors', 'requestStatus'])
  },

  methods: {
    saveCategory() {
      this.setLocaleData('ru');
      this.$eventHandle.$emit('save-category', this.category)
    },

    reset() {
      this.$refs.form.reset()
    },

    setLocaleData(loc) {
      for (let locale of this.$locales) {
        this.category.name[locale] = !!this.category.name[locale] ? this.category.name[locale] : this.category.name[loc]
      }
    },
  }
}
</script>

<style>
.tabs-dense .v-tabs-bar {
  height: 30px;
}

.black-text-checkbox label {
  color: black !important;
}
</style>
