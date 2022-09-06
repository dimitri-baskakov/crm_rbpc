<template>
  <div class="flex-container">
    <div class="image-wrap mr-1">
      <light-box 
      v-if="images && images.length && selectedImage" 
      :key="selectedImage.id" 
      :images="images" 
      width="100%"
      height="100%"
      />
      <v-row 
      class="slide-actions center flex-nowrap"  
      v-if="selectedImage"
      >
        <v-checkbox v-model="selectedImage.main" class="slide-check slide-icon"></v-checkbox>
        <v-icon class="slide-remove slide-icon" @click="deleteImage">mdi-delete</v-icon>
      </v-row>
    </div>
    <div class="slider_box">
      <div v-if="product.images && product.images.length > 3" class="slide-swipe up-wrap" style="height: 20px;">
        <v-icon class="font-18" @click="up">mdi-chevron-up</v-icon>
      </div>
      <swiper 
      class="swiper"
      ref="mySwiper" 
      v-if="product.images" 
      :options="swiperOptions"
      :style="product.images && product.images.length > 3 ? 'height: calc(100% - 43px)' : 'height: 100%;'"
      >
        <swiper-slide 
        v-for="image in product.images" 
        :key="image.id" 
        :class="{active: selectedImage == image}"
        >
          <div class="item-slide">
            <img 
            width="100" 
            :src="image.src"
            @click="selectImage(image)" 
            >
          </div>
        </swiper-slide>
      </swiper>
      <div v-if="product.images && product.images.length > 3" class="slide-swipe down-wrap" style="height: 20px;">
        <v-icon class="font-18" @click="down">mdi-chevron-down</v-icon>
      </div>
    </div>
  </div>
</template>

<script>
  import {directive, Swiper, SwiperSlide} from "vue-awesome-swiper";
  import 'swiper/swiper-bundle.css'
  import LightBox from "@/views/components/core/LightBox";

  export default {
    name: "Slider",
    props: ['product'],
    components: {
      LightBox,
      Swiper,
      SwiperSlide
    },
    directives: {
      swiper: directive
    },
    data() {
      return {
        swiperOptions: {
          direction: 'vertical',
          slidesPerView: 3,
          mousewheel: true
        },
        selectedImage: '',
        // mySwiper: null,
        images: []
      }
    },
    computed: {
      mySwiper: function () {
        return document.querySelector('.swiper-container') && document.querySelector('.swiper-container').swiper || {}
      },
    },
    updated() {
      this.images = this.product.images
    },
    mounted() {
      if (this.product && this.product.images && this.product.images.length) {
        this.selectedImage = this.product.images[0]
      }
      // this.mySwiper = document.querySelector('.swiper-container').swiper
    },

    methods: {
      selectImage(image) {
        this.images = this.images.filter(i => i.id !== image.id)
        this.images.unshift(image);
        this.selectedImage = image
      },
      down() {
        this.mySwiper.slideNext();
      },
      up() {
        this.mySwiper.slidePrev();
      },
      deleteImage() {
        this.product.images = this.images.filter(image => image.id !== this.selectedImage.id)
        this.images = this.product.images
        this.selectedImage = null
      },
    },

    watch: {
      'selectedImage.main'(val) {
        if (val) {
          this.product.images = this.product.images.map(image => {
            if (this.selectedImage.id === image.id) {
              image.main = 1
            } else {
              image.main = 0
            }
            return image
          });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 4px;
    position: relative;
  }

  .slide-swipe {
    background: #CCE3FF;
  }

  .slide-actions {
    width: 100%;
    position: absolute !important; 
    top: 13px;
    padding: 2px 4px 0 4px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .slide-icon {
    width: 24px !important;
    height: 24px !important;
    margin: 0 !important;
    padding: 0 !important;
    background-color: #fff !important;
    border-radius: 4px !important;
    box-shadow: 0 0 15px -3px rgba(0, 0, 0, 0.5);

    .slide-check {

    }

    .slide-remove {

    }
  }

  .swiper {
    background-color: #fff;
    padding-right: 2px;
    .swiper-slide {
      width: calc(100% - 6px) !important;
      height: calc((100% / 3) - 8px) !important;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-weight: bold;
      margin: 4px;
      padding: 2px;
      box-sizing: border-box;
      background-color: #fff !important;
      border: 2px solid #E0E0E0;
      border-radius: 4px;

      &.active {
        border-color: #2979FF;
      }

      .item-slide {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
        }
      }
    }
  }

  .flex-container {
    display: flex;
    align-items: center;
    height: 300px;
    background-color: #B9D2EA;
    position: relative;

    .image-wrap {
      width: 80%;
      height: 300px; 
      position: relative;
    }

    .slider_box {
      width: 20%;
      height: 300px;
      background-color: #cce3ff !important;
    }

    .swiper-button-next {
      position: fixed;
    }
  }

  .down-wrap, .up-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide-active .item-slide {
  }

  img[tabindex="0"] {
    cursor: zoom-in;
  }

  img[tabindex="0"]:focus {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: auto;
    height: auto;
    max-width: 99%;
    max-height: 99%;
    margin: auto;
    box-shadow: 0 0 20px #000, 0 0 0 1000px rgba(210, 210, 210, .4);
  }

  img[tabindex="0"]:focus, /* убрать строку, если не нужно, чтобы при клике на увеличенное фото, оно возвращалось в исходное состояние */
  img[tabindex="0"]:focus ~ * {
    pointer-events: none;
    cursor: zoom-out;
  }
</style>
