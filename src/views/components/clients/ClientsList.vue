<template>
  <div class="client-list">
    <div class="client-list__content">
      <div class="client-list__header d-flex">
        <div class="client-list__header-items" dir="rtl">
          <div @contextmenu="showSort" class="client-list__header-item">
            <div class="d-flex justify-start align-center">
              <span class="font-12">
                ID
              </span>
              <div
              class="d-flex justify-center align-center category-products__sorting-indicator"
              >
              </div>
            </div>
            <span class="font-12 mt-1">
              Статус
            </span>
          </div>
          <v-menu
            :position-x="x"
            :position-y="y"
            class="client-list__header-id"
            offset-y
            v-if="showMenu == 'sort'"
            v-model="showMenu"
          >
            <v-btn-toggle class="client-modify-list d-flex flex-column">
              <v-btn @click="options.status = null" depressed elevation="0" class="client-modify-btn">
                Отображать все
              </v-btn>
              <v-btn @click="options.status = true" depressed elevation="0" class="client-modify-btn">
                Отображать вкл
              </v-btn>
              <v-btn @click="options.status = false" depressed elevation="0" class="client-modify-btn">
                Отображать выкл
              </v-btn>
            </v-btn-toggle>
          </v-menu>
        </div>
        <div class="client-list__header-items" dir="rtl">
          <div class="client-list__header-item" @contextmenu="showStatus">
            <div class="font-12">Имя (ru)</div>
            <div class="d-flex justify-start align-center mt-1">
              <div class="font-12">Имя Фамилия (he)</div>
              <div
              class="d-flex justify-center align-center category-products__sorting-indicator"
              >
              </div>
            </div>
          </div>
          <v-menu
            :position-x="x"
            :position-y="y"
            class="client-list__header-id"
            offset-y
            v-if="showMenu === 'status'"
            v-model="showMenu"
          >
            <v-btn-toggle class="client-modify-list d-flex flex-column">
              <span class="client-list__sticks">Сортировка</span>
              <v-btn @click="options.sortDir = 'desc'" depressed elevation="0" class="client-modify-btn">
                по новым
              </v-btn>
              <v-btn @click="options.sortDir = 'asc'" depressed elevation="0" class="client-modify-btn">
                по старым
              </v-btn>
            </v-btn-toggle>
          </v-menu>
        </div>
        <div
          class="client-list__header-items client-list__header-descr"
          dir="rtl"
        >
          <div class="font-12">Фирма (he)</div>
        </div>
      </div>
      <div class="client-list__inner">
        <div
          :key="idx"
          @click="$emit('editClient', item)"
          class="client-list__item"
          ref="cleintListItems"
          v-for="(item, idx) in items"
        >
          <div class="client-list__checkbox">
            <div>{{ item.id }}</div>
            <div class="cl-checkbox">
              <v-switch
                :disabled="item.readonly"
                @change="$emit('saveClient', item)"
                color="grey"
                v-model="item.status"
              ></v-switch>
              <v-input></v-input>
            </div>
          </div>
          <div class="client-list__name">
            <div
              @click="toggleCL(idx)"
              @contextmenu="(e) => show(e, item)"
              class="client-list__item-inner d-flex"
            >
              <div class="cl-items" dir="rtl">
                <div class="cl-item">{{ item.person && item.person.name || '' }}</div>
                <div class="cl-item">
                  {{ item.person && item.person.he_name || '' }}
                  {{ item.person && item.person.surname || '' }}
                </div>
              </div>
              <div class="cl-items" dir="rtl">
                <div class="cl-item">{{ item.company_name }}</div>
              </div>
            </div>
            <v-menu
              :elevation="0"
              :position-x="x"
              :position-y="y"
              absolute
              min-width="auto"
              offset-y
              v-if="showMenu === 'clients'"
              v-model="showMenu"
            >
              <v-list class="client-modify-list d-flex flex-column">
                <v-btn @click="createClient" depressed elevation="0" class="client-modify-btn">
                  Добавить клиента
                </v-btn>
                <v-btn @click="hideClient" depressed elevation="0" class="client-modify-btn">
                  Скрыть клиента
                </v-btn>
                <v-btn @click="changeStatusClient(false)" depressed elevation="0" class="client-modify-btn">
                  Выключить клиента
                </v-btn>
                <v-btn @click="changeStatusClient(true)" depressed elevation="0" class="client-modify-btn">
                  Включить клиента
                </v-btn>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
    <div class="client-list__footer">
      <div class="custom-input">
        <div>Количество</div>
        <input
          :value="paginationMeta.perPage"
          @keyup.enter="$emit('changePerPage', $event)"
          min="1"
          type="number"
        />
      </div>
      <v-pagination
        :length="paginationMeta.pageCount"
        @input="$emit('selectedPage', $event)"
        class="custom-pag"
        v-model="paginationMeta.page"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "ClientsList",
  props: {
    items: Array,
    paginationMeta: Object,
  },
  data () {
    return {
      client: {},
      options: {
        sortBy: 'id',
        sortDir: 'desc',
        status: null,
      },
      showMenu: '',
      x: 0,
      y: 0,
    }
  },
  methods: {
    toggleCL (idx) {
      let clientLists = this.$refs.cleintListItems;
      clientLists.forEach((e) => {
        e.classList.remove("clicked");
      });
      clientLists[idx].classList.add("clicked");
    },

    show (e, client) {
      this.client = client
      e.preventDefault()
      this.showMenu = ''
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = 'clients'
      })
    },

    showSort (e) {
      e.preventDefault()
      this.showMenu = ''
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = 'sort'
      })
    },

    showStatus (e) {
      e.preventDefault()
      this.showMenu = ''
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.showMenu = 'status'
      })
    },

    createClient () {
      this.$emit('createClient', {})
      let clientLists = this.$refs.cleintListItems
      clientLists.forEach((e) => {
        e.classList.remove("clicked")
      })
    },

    changeStatusClient(status) {
      this.client.status = status
      this.$emit('saveClient', this.client)
    },

    hideClient () {
      this.$emit('deleteClient', this.client)
    },
  },

  watch: {
    options: {
      deep: true,
      handler () {
        this.$emit('getClients', this.options)
        let clientLists = this.$refs.cleintListItems
        clientLists.forEach((e) => {
          e.classList.remove("clicked")
        })
        this.$store.commit('setClient', {})
      }
    },
  },
};
</script>

<style lang="scss">
.client-inner__info {
  width: 72%;
  padding-right: 3px;
  height: calc(100vh - 47px);
}
.client-modify-btn {
  justify-content: left !important;
  padding: 3px !important;
  margin: 2px 4px;
  background-color: #fff !important;
  height: 26px !important;
  border: 0 !important;
  font-size: 14px;
  border-radius: 3px !important;
  .v-btn__content {
    padding: 0 8px;
    text-transform: none;
  }
  color: black !important;
}
.client-list__sticks {
  font-size: 10px;
  color: #999999;
  padding-left: 2px;
}
.client-list__header {
  margin: 0 -2px;
  align-items: stretch;
}
.client-list__header-item {
  user-select: none;
  padding: 6px 6px 6px 16px;
}
.client-list__header-descr {
  padding: 6px 5px 6px 16px;
}
.client-list__header-items {
  height: 56px;
  background-color: #cce3ff;
  border-radius: 3px;
  color: #666666;
  line-height: 1.4;
  font-size: 13px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 0 auto;
  margin: 0 2px;
  &:first-child {
    width: 17%;
  }
  &:nth-child(2) {
    width: 44%;
  }
  &:nth-child(3) {
    width: 36%;
  }
}

.cl-checkbox {
  .v-input__slot {
    margin: 0;
  }
  .v-messages {
    display: none;
  }
  .v-input--switch .v-input--selection-controls__input {
    width: 30px;
    margin: 0;
    height: 14px;
  }
  .v-input--switch__thumb {
    height: 8px;
    width: 8px;
    top: calc(50% - 4px);
    left: 5px;
    box-shadow: none !important;
    color: #9e9e9e !important;
  }
  .v-input--is-dirty {
    .v-input--switch__thumb,
    .v-input--switch__track {
      color: #2979ff !important;
      border-color: #2979ff !important;
    }
  }

  .v-input--is-dirty .v-input--switch__thumb {
    transform: translate(15px, 0) !important;
  }
  .v-input--selection-controls__ripple {
    display: none;
  }
  .theme--light.v-input--switch .v-input--switch__track {
    width: 30px;
    background-color: transparent;
    border: 2px solid #9e9e9e;
  }
  .v-input--selection-controls {
    margin: 0;
    padding: 0;
  }
}
.client-list__item {
  height: 56px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  margin-top: 3px;
  background-color: #e3f2fd;
  transition: background-color 0.2s linear;
  border: 1px solid #e3f2fd;
  &:nth-child(odd) {
    background-color: #E3F2FD;
    &:hover {
      background-color: #D7F2FF;
    }
  }
  &:nth-child(even) {
    background-color: #eeeeee;
    &:hover {
      background-color: #d8d8d8;
    }
  }
  &.clicked {
    border-color: #2979ff;
    background-color: #82b1ff;
  }
}
.client-list__item-inner,
.client-list__name {
  flex: 1 0 auto;
}
.client-list__name .cl-items {
  flex: 1 0 auto;
  padding: 6px 5px;
  &:nth-child(1) {
    max-width: 176px;
  }
  &:nth-child(2) {
    max-width: 126px;
    display: flex;
    align-items: center;
  }
}
.client-list__checkbox {
  flex: 1 0 auto;
  text-align: center;
  max-width: 68px;
  margin-top: 4px;
}
.cl-checkbox {
  max-width: 30px;
  display: inline-block;
  margin-left: -3px;
}
.client-list {
  width: 27%;
  height: calc(100vh - 51px);
  flex-shrink: 0;
  padding: 3px 2px 0;
  margin: 3px 5px 3px 3px;
  border-radius: 3px;
  background-color: #fff;
  overflow: hidden;
  &__footer {
    border-top: 1px solid #e6e6e6;
    height: 39px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1px;
    margin-top: 3px;
  }
}
.client-list__content {
  overflow-x: hidden;
  overflow-y: scroll;
  height: calc(100% - 45px);
  padding: 0 1px;
}
.custom-pag {
  display: flex;
  align-items: center;
  .v-pagination__item {
    font-size: 13px;
    height: 23px;
    width: 23px;
    min-width: 23px;
    margin: 2px;
    padding: 0;
  }
  .v-pagination__navigation {
    margin: 2px;
    width: 20px;
    height: 20px;
  }
}
.custom-input {
  color: #666666;
  font-size: 12px;
  input {
    height: 20px;
    font-size: 14px;
    max-width: 80px;
    outline: 0;
    border-radius: 0;
    border-bottom: 1px solid #000;
    &:focus {
      outline: 0;
    }
  }
}
.client-info{
  .ci-block{
    padding: 3px 6px 4px 6px;
  }
}
@media (min-width: 1600px) {
  .md-block {
    max-width: 150px !important;
  }
  .client-info {
    &__main,
    &__item {
      .ci-block {
        height: 36px;
        .v-input__append-inner {
          margin: 0 !important;
          padding: 0 !important;
        }
        .v-input,
        .v-input__control,
        .v-input__slot,
        .v-text-field__slot {
          min-height: auto !important;
          max-height: auto !important;
          height: 100% !important;
        }
        input {
          margin: 0 !important;
          padding: 0 !important;
          padding-top: 8px !important;
        }
        .v-select__selections {
          padding-top: 8px !important;
        }
      }
    }
    &__main {
      .ci-block:nth-child(2){
        width: calc(11% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(3),
      .ci-block:nth-child(4),
      .ci-block:nth-child(5),
      .ci-block:nth-child(6) {
        width: calc(20% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(7) {
        width: calc(12% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(8) {
        width: calc(15% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(9),
      .ci-block:nth-child(10),
      .ci-block:nth-child(11) {
        width: calc(5% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(12) {
        width: calc(18.2% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(13) {
        width: calc(18% - 2.25px) !important;
        max-width: 100% !important;
      }
    }
    &__item {
      .ci-block:first-child {
        width: 35px;
      }
      .ci-block:nth-child(2) {
        width: calc(19% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(3),
      .ci-block:nth-child(4),
      .ci-block:nth-child(5),
      .ci-block:nth-child(6) {
        width: calc(11% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(7) {
        width: calc(13% - 2.25px) !important;
        max-width: 100% !important;
      }
      .ci-block:nth-child(8) {
        width: calc(22% - 2.25px) !important;
        max-width: 100% !important;
      }
    }
  }
  .client-list__name .cl-items {
    padding: 6px 5px;
    &:nth-child(1) {
      max-width: 221px;
      padding-right: 8px;
    }
    &:nth-child(2) {
      max-width: 177px;
      padding-right: 6px;
    }
  }
  .client-list__checkbox {
    max-width: 85px;
  }
}
</style>

<style>
.v-menu__content {
  box-shadow: none;
}
</style>