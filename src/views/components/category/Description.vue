<template>
  <div class="ma-1 product-card__ckeditor" >
    <div v-for="image in product.description_images">
      <img width="300" :src="image" alt="">
    </div>
    <ckeditor
      dir="rtl"
      :config="editorConfig"
      :label="$t('form.description')"
      rows="7"
      v-model="product.description[$i18n.locale]"
      class="rounded"
      v-if="product.description"
    >
      <div class="rounded" v-html="product.description[$i18n.locale]"></div>
    </ckeditor>
  </div>
</template>

<script>
import Vue from 'vue';
import CKEditor from 'ckeditor4-vue';

Vue.use(CKEditor);

export default {
  name: "Description",
  props: ['product'],

  data () {
    return {
      editorConfig: {
        resize_enabled: false,
        toolbar: [
          ['Source', 'Table'],
        ]
      },
    }
  },

  methods: {
    addItem() {
      console.log(this.product.product_specifications)
    },
    deleteItem(i) {
      this.product.product_specifications.splice(i, 1)
    },
  }
}
</script>

<style lang="scss">
.product-card__ckeditor {
  .cke_chrome {
    border: none !important;
  }
  .cke_top {
    height: 26px !important;
    background: #CCE3FF !important;
    border-radius: 4px 4px 0 0 !important;
  }
  .cke_contents {
    border: 1px solid #d1d1d1 !important;
    border-top: none !important;
    box-sizing: border-box !important;
  }
  .cke_bottom {
    display: none !important;
  }
}

</style>
