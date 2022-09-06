<template>
  <div>
    <CoolLightBox
      :items="images"
      :index="index"
      loop
      @close="index = null">
    </CoolLightBox>

    <div class="images-wrapper">

        <img class="image" v-if="!!images && images.length" :src="images[0].src" :width="width" @click="setIndex(0)">

    </div>
  </div>
</template>

<script>
import CoolLightBox from "vue-cool-lightbox";
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
export default {
  name: "LightBox",
  props: {
    images: {
      type: Array,
      default: () => []
    },
    width: {
      type: [String, Number],
      default: 50
    }
  },
  components: {
    CoolLightBox,
  },
  data(){
    return {
      index: null
    }
  },
  methods: {
    setIndex(index) {
      this.index = index
    },
  }
}
</script>

<style scoped>

</style>
