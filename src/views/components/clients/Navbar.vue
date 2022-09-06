<template>
  <v-card color="grey" flat tile class="navbar-client">
    <v-sheet elevation="0">
      <v-toolbar dense tag="div">
        <v-toolbar-title>Клиенты</v-toolbar-title>
        <div class="navbar-btns">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="createClient" icon small v-bind="attrs" v-on="on">
                <v-icon dense color="grey"
                  >mdi-plus-circle-outline</v-icon
                ></v-btn
              >
            </template>
            <span>Добавить клиента</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="addNoteDialog = true" icon small v-bind="attrs" v-on="on" :disabled="!client || (client && !client.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 25.74451 23.85653"
                  fill="#9e9e9e"
                  height="18px"
                >
                  <path
                    class="cls-1"
                    d="M23.82078,6.5832l-4.7536-1.82078a.31915.31915,0,0,0-.425.12962l-5.56,14.51566.00658.00252,1.16589,4.18068a.40573.40573,0,0,0,.567.21718l3.66081-2.33192.008.00308,5.56-14.51567A.31915.31915,0,0,0,23.82078,6.5832Z"
                  />
                  <path
                    class="cls-1"
                    d="M20.79228.6255h3.79154a1,1,0,0,1,1,1V4.22376a0,0,0,0,1,0,0H19.79228a0,0,0,0,1,0,0V1.6255A1,1,0,0,1,20.79228.6255Z"
                    transform="translate(2.36831 -7.95489) rotate(20.95845)"
                  />
                  <rect
                    class="cls-1"
                    y="0.22155"
                    width="16.92459"
                    height="2.89577"
                    rx="0.76806"
                  />
                  <rect
                    class="cls-1"
                    y="19.37286"
                    width="7.93244"
                    height="2.89577"
                    rx="0.76806"
                  />
                  <rect
                    class="cls-1"
                    y="12.98909"
                    width="11.13049"
                    height="2.89577"
                    rx="0.76806"
                  />
                  <rect
                    class="cls-1"
                    y="6.60532"
                    width="14.32855"
                    height="2.89577"
                    rx="0.76806"
                  />
                </svg>
              </v-btn>
            </template>
            <span>Заметка</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
                @click.stop="dialog = true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23.0897 27.36918"
                  fill="#9e9e9e"
                  height="22px"
                >
                  <path
                    d="M3.99169,5.04a1.1638,1.1638,0,0,1-.72186.30354c-.46349.01855-.9331.01593-1.38917.01418-.15057-.00087-.30071-.00153-.45128-.00153-.158,0-.31641.00088-.4744.00328a.87415.87415,0,0,0-.94314.91084C-.0043,6.95764-.00387,7.6579.01272,8.3514A.82859.82859,0,0,0,.7983,9.238a.60889.60889,0,0,1,.61843.59377q.80521,4.90924,1.62353,9.81608c.0742.4456.144.8925.21429,1.3392.17894,1.14149.364,2.32183.62018,3.46332A3.54922,3.54922,0,0,0,7.577,27.36577c.91433-.03928,1.84394-.02946,2.74212-.01986.4072.00437.814.00873,1.22071.00873l.96409.00065c.77423.00022,1.54934.00153,2.32445-.00218.14053-.00022.27757.00218.41592.0048a5.87153,5.87153,0,0,0,1.10811-.04735,3.39574,3.39574,0,0,0,2.86607-2.875c.28411-1.34641.50844-2.73078.72579-4.06954.08947-.55209.17893-1.104.27233-1.655l.103-.60359q.70768-4.16424,1.40532-8.33a.55388.55388,0,0,1,.55776-.53638.83944.83944,0,0,0,.79432-.886c.01658-.68433.017-1.38438.00087-2.08093a.87191.87191,0,0,0-.94139-.91542c-.15188-.00327-.30463-.00065-.45739.00175A6.32783,6.32783,0,0,1,20.88,5.342a1.12,1.12,0,0,1-.69655-.33976c-.60446-.72536-1.19452-1.46206-1.785-2.199q-.39344-.491-.78863-.98132c-.53551-.6636-.721-.69437-1.41754-.2239q-.35482.239-.711.47528c-.55383.36879-1.12643.75-1.6746,1.14324a.60108.60108,0,0,1-.91476-.09929c-.628-.65094-1.28094-1.29992-1.91246-1.92751l-.68782-.685C9.62214-.16345,9.218-.16825,8.55811.49055L7.36446,1.68464Q5.68332,3.36709,3.99169,5.04Zm7.50188,11.751,2.25506,2.30743L11.4927,21.34057,9.177,19.02725Zm-2.86214,1.5991L6.39557,16.13717l2.23586-2.233,2.245,2.24087ZM12.136,16.1507l2.25768-2.238,2.187,2.29215-2.24851,2.2424Zm-.60577-.59093L9.19967,13.27722l2.30394-2.3238,2.187,2.32031ZM8.58255,12.64744l-1.96527-1.9633.06852-.1126A2.69019,2.69019,0,0,1,8.91293,9.18761l.021-.00022a2.193,2.193,0,0,1,1.86838,1.06948l.072.11369ZM6.01369,10.21388l-.79387-.89644h1.6698Zm-2.901-.8685.15843-.03295a1.47673,1.47673,0,0,1,1.5524.68651,1.90421,1.90421,0,0,0,.47833.453l.19072.1054L3.65084,12.47767Zm.68695,4.1793,2.238-2.20531,1.95261,1.96374-2.238,2.22473Zm.23568,1.47776,1.16178,1.1858-.7882.83555ZM4.882,20.14365a15.56129,15.56129,0,0,0-.28543-1.73374.88891.88891,0,0,1,.30027-.94445,4.00463,4.00463,0,0,0,.43643-.46938c.05936-.07114.1174-.14053.175-.20534l.11828-.13246,2.38729,2.38555L5.675,21.28361,5.562,21.202A1.40968,1.40968,0,0,1,4.882,20.14365Zm3.107,4.7244c-.34871.4528-.666.66382-.999.66426H6.98869a1.27553,1.27553,0,0,1-.95928-.62542,3.68781,3.68781,0,0,1-.63851-1.8555.47013.47013,0,0,1,.19116-.41963.436.436,0,0,1,.45869.091c.52023.5091,1.03435,1.02409,1.54673,1.53668l.49142.49187Zm.61886-.74128L6.39514,21.8896l2.30394-2.15031,2.20268,2.206Zm5.06657.85083a1.2976,1.2976,0,0,1-1.34378.59464,11.33137,11.33137,0,0,0-1.78982.00109c-.04626.00393-.09165.00589-.13486.00589a1.28883,1.28883,0,0,1-1.11421-.64788l-.07551-.11217,2.22538-2.31376,2.29565,2.36264Zm.65553-.84472-2.1992-2.216,2.2843-2.28823,2.204,2.22167Zm3.35487-.98569c-.16671.59006-.37664,1.1727-.57827,1.71432a.82866.82866,0,0,1-.32777.371,1.51981,1.51981,0,0,1-.81.33889c-.295,0-.57391-.18527-.89556-.64265l-.08074-.115,2.37246-2.388.10692.20033a1.11427,1.11427,0,0,0,.07027.10671A.51023.51023,0,0,1,17.68483,23.14719Zm.82268-4.82959-.05586.37534a10.68229,10.68229,0,0,1-.30856,1.56483,2.10169,2.10169,0,0,1-.44647.70179c-.07856.094-.15843.18963-.23175.29067l-.11522.16-2.37071-2.37639,2.41392-2.35565.33038.35984c.20862.22476.44516.47964.66163.74521A.73257.73257,0,0,1,18.50751,18.3176Zm.18287-1.19365-.92-.97521.88248-.85214.33038.12591Zm-1.46555-1.69358-2.30219-2.14661,2.05168-2.02745,2.259,2.26509ZM16.15513,9.305H17.7695l-.78078.85737Zm3.68918.04429.15188.03579-.522,3.22678-1.88628-1.91224.06983-.11216C18.31723,9.52977,18.99108,9.14767,19.84431,9.3493Zm-3.1109-6.42148L18.68383,5.354h-.34958c-.30463,0-.59835.00306-.88465.00611-.27059.00306-.53551.00589-.7965.00589-.43992,0-.86938-.00807-1.29621-.03753A1.17012,1.17012,0,0,1,14.721,4.9579c-.09034-.07965-.18548-.1641-.28979-.23917l-.19683-.14206ZM13.99609,9.19241a2.74419,2.74419,0,0,1,2.3035,1.3357l.07812.11522-1.97618,1.96178-2.30306-2.20924.06808-.11434A2.20081,2.20081,0,0,1,13.99609,9.19241ZM9.46677,2.3502,12.411,5.31905H6.482Z"
                  />
                </svg>
              </v-btn>
            </template>
            <span>Корзина клиента</span>
          </v-tooltip>
        </div>
        <div class="navbar-actions">
          <div class="navbar-search d-flex align-center">
            <v-text-field
              color="grey"
              class="search-cust"
              solo
              hide-details="auto"
              prepend-inner-icon="mdi-close"
              @click:prepend-inner="resetFilter"
              v-model="searchText"
            ></v-text-field>
            <v-btn @click="search" color="blue accent-3" class="ml-1 mr-4 mt-1"> Поиск </v-btn>
          </div>
          <div class="navbar-actions__btn">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="toggleReadonly"
                  class="lock-btn"
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon dense color="grey">
                    {{ client && client.readonly ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline' }}
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t('editAvailability') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="$emit('saveClient', client)"
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon dense color="grey">mdi-content-save-outline</v-icon>
                </v-btn>
              </template>
              <span>Сохранить</span>
            </v-tooltip>
          </div>
        </div>
      </v-toolbar>
    </v-sheet>
    
    <v-dialog
      :retain-focus="false"
      max-height="90vh"
      max-width="800px"
      persistent
      v-model="addNoteDialog"
      width="45vw"
    >
      <v-card
        class="rounded"
        style="border: 4.5px solid #B9D2EA;"
      >
        <div
          color="transparent"
          dark
          class="align-center d-flex flex-nowrap"
          style="position: absolute; top: -45px; right: -65px; width: calc(45vw + 60px); max-width: 860px;"
          dir="rtl"
        >
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                @click="addNoteDialog = false"
                class="dialog-action-button"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('close') }}</span>
          </v-tooltip>
          <v-tooltip top open-delay="400">
            <template #activator="{ on, attrs }">
              <v-btn
                :loading="requestStatus === 'loading'"
                @click="$emit('saveClient', client)"
                class="dialog-action-button mr-3"
                color="black"
                fab
                icon
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('form.save') }}</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-btn
            class="black--text pa-4 my-0"
            color="#B9D2EA"
            small
          >
            <div class="py-3">{{ $t('note') }}</div>
          </v-btn>
        </div>
        <v-card-text>
          <v-container>
            <v-textarea
              dir="rtl"
              rows="7"
              v-if="client"
              v-model="client.note"
            ></v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "Navbar",
  data: () => ({
    addNoteDialog: false,
    isToggled: false,
    searchText: null,
  }),
  computed: {
    ...mapGetters([
      'client',
      'requestStatus',
    ]),
  },
  methods: {
    toggleReadonly () {
      this.client.readonly = this.client.readonly ? false : true
      this.$emit('saveClient', this.client)
    },
    createClient () {
      this.$emit('createClient')
      this.$store.commit('setClient', {})
    },
    search () {
      this.$emit('getClients', {search: this.searchText})
      this.$store.commit('setClient', {})
    },
    resetFilter () {
      this.$emit('getClients', {})
      this.searchText = null
      this.$store.commit('setClient', {})
    },
  },
};
</script>

<style lang="scss">
.navbar-client {
  margin: 0;
  flex: 0 0 100%;
  .blue.accent-3 {
    color: #fff;
  }
  .v-toolbar__title {
    font-size: 16px;
  }
  .v-sheet,
  .v-input__slot {
    box-shadow: none !important;
  }
  .v-toolbar.v-toolbar--dense {
    max-height: 45px !important;
    .v-toolbar__content {
      display: flex;
      align-items: center;
      max-height: 45px !important;
    }
  }
  .v-input__slot {
    border: 1px solid #9e9e9e;
    padding: 0 6px !important;
  }
  .v-input__append-inner {
    position: absolute;
    top: 0px;
    left: 6px;
    .mdi-set {
      color: #9e9e9e;
    }
  }
  .navbar-btns {
    margin-left: 17.5%;
    padding: 0 10px;
  }
  .v-input__prepend-inner,
  .v-input__append-inner {
    padding: 0 !important;
    margin: 0 !important;

    i {
      color: #9e9e9e !important;
    }
  }
  .v-input__prepend-inner {
    order: -1;
  }
  .navbar-actions {
    display: flex;
    align-items: center;
    height: 26px;
    margin-left: auto;
    .v-btn__content {
      text-transform: none;
    }
    .v-btn {
      margin: 0 4px;
    }
  }
  .v-text-field.v-text-field--solo .v-input__control {
    min-height: 26px !important;
    min-width: 500px;
  }
  .v-btn {
    margin: 0 8px;
    min-height: 26px !important;
    max-height: 26px !important;
    &--icon {
      width: 34px;
      height: 34px;
    }
  }
  .search-cust {
    max-height: 26px;
    .v-text-field__slot {
      input {
        max-height: 20px !important;
      }
    }
  }
}
.navbar-actions__btn {
  margin-right: -10px;
}
@media (max-width: 1200px) {
  .navbar-client .v-text-field.v-text-field--solo .v-input__control {
    min-height: 26px !important;
    min-width: 200px;
  }
}
</style>
