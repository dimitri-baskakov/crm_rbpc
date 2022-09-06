<template>
  <div class="client-info" ref="info">
    <div class="client-info__main">
      <div class="sm-block ci-block">
        <span class="ci-block-title">ID</span>
        <span class="ci-block-bold">{{ client.id }}</span>
      </div>
      <div class="md-block ci-block ci-block--status">
        <v-select
          :items="status"
          :menu-props="{ contentClass: 'client-select-list' }"
          :readonly="client.readonly"
          color="blue-grey lighten-2"
          dense
          filled
          hide-details
          label="Статус"
          offset-y
          v-model="client.status"
        ></v-select>
      </div>
      <div class="lg-block ci-block special-rtl">
        <v-text-field
          :readonly="client.readonly"
          @click:append="copyToClipboard(client.company_name)"
          append-icon="mdi-content-copy"
          color="blue-grey lighten-2"
          dir="rtl"
          filled
          hide-details="auto"
          label="Название фирмы"
          v-model="client.company_name"
        ></v-text-field>
      </div>
      <div class="lg-block ci-block special-rtl">
        <v-text-field
          v-model="client.passport"
          :readonly="client.readonly"
          color="blue-grey lighten-2"
          filled
          hide-details="auto"
          label="Хет пей фирмы / Паспорт / № Фирмы"
          dir="rtl"
        ></v-text-field>
      </div>
      <div class="lg-block ci-block">
        <v-text-field
          v-model="client.created_at"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          color="blue-grey lighten-2"
          label="Дата регистрации"
        ></v-text-field>
      </div>
      <div class="lg-block ci-block">
        <v-text-field
          v-model="client.ip_address"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          color="blue-grey lighten-2"
          label="IP адрес регистрации"
        ></v-text-field>
      </div>
      <div class="lg-block ci-block special-rtl">
        <v-text-field
          v-model="client.city"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          color="blue-grey lighten-2"
          label="Город"
          dir="rtl"
        ></v-text-field>
      </div>
      <div class="lg-block ci-block special-rtl">
        <v-text-field
          v-model="client.street"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          color="blue-grey lighten-2"
          label="Улица"
          dir="rtl"
        ></v-text-field>
      </div>
      <div class="md-block ci-block">
        <v-text-field
          color="blue-grey lighten-2"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          label="Номер дома"
          v-model="client.house_number"
        ></v-text-field>
      </div>
      <div class="md-block ci-block">
        <v-text-field
          v-model="client.floor"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          color="blue-grey lighten-2"
          label="Этаж"
        ></v-text-field>
      </div>
      <div class="md-block ci-block">
        <v-text-field
          v-model="client.flat"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          color="blue-grey lighten-2"
          label="Квартира"
        ></v-text-field>
      </div>
      <div class="lg-block ci-block">
        <v-text-field
          v-model="client.login"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          color="blue-grey lighten-2"
          label="Логин"
        ></v-text-field>
      </div>
      <div class="lg-block ci-block ci-block--password">
        <v-btn
          :disabled="client.readonly"
          :loading="requestStatus === 'loading'"
          @click="sendRestoreEmail"
          class="black--text"
          color="transparent"
          dark
        >
          <span>{{ 'Восстановить пароль' }}</span>
          <v-icon right dark>mdi-key</v-icon>
        </v-btn>
        <!-- <v-text-field
          v-model="client.password"
          :readonly="client.readonly"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          name="input-10-1"
          color="blue-grey lighten-2"
          label="Пароль"
          hide-details="auto"
          counter
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-icon class="reload-password">mdi-reload</v-icon> -->
      </div>
      <div class="lg-block ci-block">
        <v-text-field
          v-model="client.post_address"
          :readonly="client.readonly"
          filled
          hide-details="auto"
          color="blue-grey lighten-2"
          label="Почтовый адрес"
        ></v-text-field>
      </div>
    </div>
    <div
      v-if="client.persons && !client.persons.length"
      style="position: absolute; top: 0; right: 0;"
    >
      <v-btn
        :disabled="client.readonly"
        @click="addPerson"
        icon
        small
        style="background: transparent; outline: 1px solid red;"
      >
        <v-icon dense color="grey">mdi-plus-circle-outline</v-icon>
      </v-btn>
    </div>
    <div class="client-info__list" v-for="(item, idx) in client.persons" :key="item.id">
      <div class="client-info__item d-flex flex-nowrap">
        <button @click="reorderPersons(item)" class="sm-block ci-block v-btn">
          <span class="ci-block-title">№</span>
          <span class="ci-block-bold">{{ item.position }}</span>
        </button>
        <div class="md-block ci-block">
          <v-text-field
            :readonly="client.readonly"
            color="blue-grey lighten-2"
            filled
            hide-details="auto"
            label="Описание (ru)"
            v-model="item.name"
          ></v-text-field>
        </div>
        <div class="lg-block ci-block" v-if="client.persons.length - 1 === idx">
          <v-select
            :readonly="client.readonly"
            class="last-ci-block"
            color="blue-grey lighten-2"
            filled
            hide-details
            label="Должность"
            v-model="item.post_id"
            :items="posts"
            item-text="name"
            item-value="id"
            append-icon="mdi-plus-circle-outline"
            @click:append="openDialog"
          ></v-select>
        </div>
        <div class="lg-block ci-block" v-else>
          <v-select
            :readonly="client.readonly"
            color="blue-grey lighten-2"
            filled
            hide-details="auto"
            label="Должность"
            v-model="item.post_id"
            :items="posts"
            item-text="name"
            item-value="id"
          ></v-select>
        </div>
        <div class="md-block ci-block special-rtl">
          <v-text-field
            :readonly="client.readonly"
            color="blue-grey lighten-2"
            dir="rtl"
            filled
            hide-details="auto"
            label="Имя (he)"
            v-model="item.he_name"
          ></v-text-field>
        </div>
        <div class="md-block ci-block special-rtl">
          <v-text-field
            :readonly="client.readonly"
            color="blue-grey lighten-2"
            dir="rtl"
            filled
            hide-details="auto"
            label="Фамилия (he)"
            v-model="item.surname"
          ></v-text-field>
        </div>
        <div class="lg-block ci-block">
          <v-text-field
            :readonly="client.readonly"
            @click:append="copyToClipboard(item.mobile_phone)"
            append-icon="mdi-content-copy"
            color="blue-grey lighten-2"
            filled
            hide-details="auto"
            label="Мобильный"
            v-model="item.mobile_phone"
          ></v-text-field>
        </div>
        <div class="lg-block ci-block">
          <v-text-field
            :readonly="client.readonly"
            v-model="item.landline_phone"
            filled
            hide-details="auto"
            color="blue-grey lighten-2"
            label="Стационарный"
          ></v-text-field>
        </div>
        <div class="lg-block ci-block">
          <v-text-field
            :readonly="client.readonly"
            @click:append="copyToClipboard(item.email)"
            append-icon="mdi-content-copy"
            color="blue-grey lighten-2"
            filled
            hide-details="auto"
            label="Электронная почта"
            v-model="item.email"
          ></v-text-field>
        </div>
        <div class="ci-block ci-block--icon">
          <v-icon :disabled="client.readonly" :color="item.mailable ? '#2979ff' : 'grey'" :readonly="client.readonly" @click="toggleMailable(item)"> mdi-email-outline </v-icon>
        </div>
        <div class="ci-block ci-block--icon">
          <v-icon :disabled="client.readonly || (client.persons && client.persons.length === 1)" @click="removePerson(item.id)"> mdi-close </v-icon>
        </div>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="85%" content-class="vdialognew">
      <div class="dialog__close-save">
        <v-icon @click="saveAllPosts">mdi-content-save-outline</v-icon>
        <v-icon @click="dialog = false">mdi-close</v-icon>
      </div>
      <v-card class="dialog-custom">
        <div class="dialog__inner">
          <div class="dialog__header d-flex">
            <span class="dialog-block-md">Должность</span>
            <span class="dialog-block-sd">Имя (he)</span>
            <span class="dialog-block-sd">Фамилия (he)</span>
            <span class="dialog-block-lg">Мобильный телефон</span>
            <span class="dialog-block-lg">Электронная почта</span>
            <span @click="addPerson" class="dialog-block-icon">
              <v-icon dense color="grey">mdi-plus-circle-outline</v-icon>
            </span>
          </div>
          <div
            :key="person.id"
            class="dialog__body d-flex align-stretch"
            v-for="person in client.persons"
          >
            <div class="dialog-block-md">
              <v-menu bottom left v-model="person.menu" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark icon v-bind="attrs" v-on="on" color="black">
                    <span>{{ person.post && person.post.name }}</span>
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list
                  class="client-modify-list d-flex flex-column dialog__items"
                >
                  <v-btn
                    @click="posts.unshift({})"
                    class="client-modify-btn"
                    depressed
                    elevation="0"
                  >
                    Добавить должность
                    <v-icon color="grey">mdi-plus-circle-outline</v-icon>
                  </v-btn>
                  <div
                    :key="post.id"
                    class="add-new-work"
                    v-for="post in posts"
                  >
                    <v-text-field
                      @click:append-outer="deletePost(post)"
                      @click:prepend="() => {person.post_id = post.id; person.post = post; person.menu = false;}"
                      append-outer-icon="mdi-close-circle-outline"
                      class="client-modify-btn"
                      clearable
                      color="blue-grey lighten-2"
                      hide-details="auto"
                      prepend-icon="mdi-checkbox-marked-circle"
                      v-model="post.name"
                    ></v-text-field>
                  </div>
                </v-list>
              </v-menu>
            </div>
            <div class="dialog-block-sd ci-block">
              <v-text-field
                v-model="person.he_name"
                color="blue-grey lighten-2"
                dir="rtl"
                filled
                hide-details="auto"
              ></v-text-field>
            </div>
            <div class="dialog-block-sd ci-block">
              <v-text-field
                v-model="person.surname"
                filled
                hide-details="auto"
                color="blue-grey lighten-2"
                dir="rtl"
              ></v-text-field>
            </div>
            <div class="dialog-block-lg ci-block special-rtl">
              <v-text-field
                @click:append="copyToClipboard(person.mobile_phone)"
                v-model="person.mobile_phone"
                append-icon="mdi-content-copy"
                color="blue-grey lighten-2"
                filled
                hide-details="auto"
                dir="rtl"
              ></v-text-field>
            </div>
            <div class="dialog-block-lg ci-block">
              <v-text-field
                @click:append-outer="copyToClipboard(person.email)"
                v-model="person.email"
                append-outer-icon="mdi-content-copy"
                color="blue-grey lighten-2"
                filled
                hide-details="auto"
              ></v-text-field>
            </div>
            <span class="dialog-block-icon">
              <v-icon @click="removePerson(person.id)" dense color="grey">mdi-close</v-icon>
            </span>
          </div>
        </div>
      </v-card>
    </v-dialog>
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

export default {
  name: "ClientInfoHeader",
  props: {
    Itemidx: Number,
    client: Object,
    items: Array,
    itemsMore: Array,
    posts: Array,
  },
  emits: [],
  data () {
    return {
      showPassword: false,
      dialog: false,
      status: [
        {
          text: 'Включен',
          value: true,
        },
        {
          text: 'Выключен',
          value: false,
        }
      ],
      infoHeightMin: 193,
      infoHeight: 193,
      snackbar: false,
    }
  },
  computed: {
    ...mapGetters([
      'requestStatus',
    ]),
    infoHeightMax () {
      return this.$refs.info.scrollHeight
    },
  },
  mounted() {},
  methods: {
    addPerson () {
      let position = (this.client.persons && this.client.persons.length + 1) || 1
      this.client.persons.push({
        position,
        mailable: false,
      })
    },

    removePerson (id) {
      this.client.persons = this.client.persons.filter(p => p.id != id)
    },

    openDialog () {
      this.$store.dispatch('getPosts', {})
      this.dialog = true
    },

    saveAllPosts () {
      this.$store.dispatch('saveAllPosts', this.posts)
    },

    deletePost (post) {
      this.posts = this.posts.filter(p => p.name != post.name)
    },

    toggleMailable (person) {
      person.mailable = person.mailable ? false : true
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

    reorderPersons (person) {
      this.client.persons.map(p => {if (p.id == person.id) { p.position = 0 }})
      this.client.persons.sort((a, b) => {
        return a.position - b.position
      })
      let k = 1
      this.client.persons.map(p => {p.position = k++})
    },

    async sendRestoreEmail () {
      await this.$store.dispatch('sendRestoreEmail', this.client.id)
    },
  },
};
</script>



<style lang="scss">
.special-rtl {
  .v-label {
    left: auto !important;
    right: 0 !important;
  }
  .v-input__append-inner {
    order: -1;
  }
}
.client-info {
  margin: 3px 0;
  background-color: #fff;
  border-radius: 6px;
  padding: 4px 3px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  &__list {
    margin: -1.5px;
  }
}
.client-info__main {
  margin: -1.5px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.ci-block {
  min-height: auto !important;
  background-color: #e3f2fd;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 3px 3px 4px 3px;
  line-height: 1.3;
  flex: 1 1 auto;
  margin: 2.25px;
  position: relative;
  &--status {
    .v-select__selection {
      color: #2979ff;
    }
  }
  .v-input__append-outer {
    margin-top: 9px;
  }
  .v-input__append-inner {
    margin-top: 9px;
  }
  .last-ci-block__btn {
    position: absolute;
    right: 0;
    right: 2px;
    top: 14px;
  }
  .last-ci-block {
    .v-text-field__slot input {
      margin-right: 26px;
    }
  }
  &--icon {
    cursor: pointer;
    max-width: 37px;
    min-height: 45px;
    justify-content: center;
  }
  &--password {
    .v-input__append-inner {
      position: absolute !important;
      top: -7px !important;
      right: 20px !important;
    }
    .reload-password {
      position: absolute;
      top: 8px;
      right: 3px;
    }
    .v-text-field {
      padding-top: 0;
      margin-top: 0;
      input {
        padding-right: 50px !important;
      }
      .v-input__append-inner {
        margin-top: 10px !important;
      }
    }
  }
  .v-input__slot {
    margin-bottom: 0;
    padding: 0 !important;
    background-color: transparent !important;
    min-height: 38px !important;
    max-height: 38px !important;
    &:before {
      border-color: #b3b3b3 !important;
      border-width: 1px 0 0 0 !important;
      bottom: 0 !important;
    }

    .v-label {
      color: #808080 !important;
      font-size: 9px !important;
      transform: scale(1) !important;
      height: auto !important;
      line-height: 1.3 !important;
      top: -1px !important;
    }
    input {
      color: #000;
    }
  }
  .v-text-field__details {
    display: none;
  }
}
.md-block {
  max-width: 130px;
}
.lg-block {
  max-width: 235px;
}
.ci-block-bold {
  color: #000;
  font-size: 17px;
  border-bottom: 1px solid #b3b3b3;
  line-height: 1;
}
.ci-block-title {
  color: #808080;
  padding-bottom: 1px;
  font-size: 9px;
  line-height: 9px;
}

.client-modify-btn {
  margin-top: 1px;
  margin-bottom: 0;
  .v-btn__content {
    justify-content: space-between;
    padding: 0 !important;
  }
}
.vdialognew {
  .dialog-block-sd {
    max-width: 16%;
  }
  .dialog-block-md {
    max-width: 19%;
  }
  .dialog-block-lg {
    max-width: 23%;
  }
  .dialog-block-icon {
    cursor: pointer;
    padding: 8px 5px !important;
    i {
      font-size: 27px !important;
    }
  }
  .dialog-block-sd,
  .dialog-block-md,
  .dialog-block-lg {
    display: block;
    flex: 1 0 auto;
    .v-btn {
      width: 100% !important;
      height: 100%;
      justify-content: space-between;
    }
  }
  .dialog__header {
    padding: 2px;
    span {
      background-color: #cce3ff;
      padding: 10px;
      margin: 1px;
      border-radius: 6px;
    }
  }
  .dialog__inner {
    .v-btn {
      text-transform: none !important;
      background-color: #e3f2fd;
      padding: 3px 3px 6px 3px !important;
      border-radius: 6px;
      .v-btn__content {
        border-bottom: 1px solid #b3b3b3;
        margin-top: auto;
      }
    }
  }
  .dialog__items {
    .v-icon {
      margin-left: 5px;
    }
  }
  .dialog__body {
    padding: 2px;
    .dialog-block-sd,
    .dialog-block-md,
    .dialog-block-lg {
      margin: 1px;
    }
    .v-input__append-outer {
      margin-top: 9px;
      cursor: pointer;
    }
    .dialog-block-icon {
      background-color: #e3f2fd;
      border-radius: 6px;
      margin: 1px;
      cursor: pointer;
    }
  }
  .dialog-custom {
    overflow-x: hidden;
  }
  .dialog__close-save {
    text-align: right;
  }
  &.v-dialog {
    box-shadow: none !important;
    overflow-x: hidden !important;
    padding-right: 28px;
  }
  .dialog__close-save {
    transform: translateX(28px);
    .v-icon {
      border-radius: 50%;
      background-color: #b9d2ea;
      font-size: 24px;
      margin: 5px 5px 10px;
      padding: 6px;
    }
  }
}
.add-new-work {
  position: relative;
  background: #eeeeee;
  border-radius: 3px;
  margin: 2px 5px;
  padding: 3px 5px;
  .v-icon {
    font-size: 20px !important;
  }
  .v-input__icon {
    height: 20px !important;
    min-width: 20px !important;
    width: 20px !important;
  }
  .v-input__control {
    padding-right: 20px;
    & > .v-input__slot:before,
    & > .v-input__slot:after {
      width: calc(100% - 20px) !important;
    }
  }
  .v-input {
    margin: 0;
    padding: 0 !important;
    background: transparent !important;
    input {
      max-height: 20px;
    }
  }
  .client-modify-btn {
    height: 22px !important;
    .v-input__append-inner {
      padding: 0 !important;
      position: absolute;
      right: -24px;

      .mdi-close {
        color: transparent !important;
      }
    }
  }
  .add-new-work-remove,
  .add-new-work-edit {
    cursor: pointer;
    pointer-events: none;
    position: absolute;
    top: 0;
    padding: 0;
    color: #b3b3b3;
  }
  .add-new-work-remove {
    right: 1px;
    top: 7px;
  }
  .add-new-work-edit {
    right: 21px;
    top: 7px;
  }
}
.client-select-list{
      margin-top: 38px;
  .v-select-list{
    padding: 4.5px;
    .v-list-item{
      min-height: 22.149px !important;
      max-height: 25px !important;
      color: #333333 !important;
      margin-bottom: 1px;
      &::before{
      border-radius: 3px;

      }
      &--active{
        background-color: #eeeeee;
      }
    }
  }
}
</style>
