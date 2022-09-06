<template>
  <div class="" style="background: #B9D2EA; max-height: 100vh; overflow: hidden;">
    <Navbar
      @createClient="(event) => createClient(client)"
      @saveClient="(client) => saveClient(client)"
      @getClients="(params) => getClients(params)"
    />
    <div class="client-inner">
      <ClientsList
        :items="items"
        :paginationMeta="paginationMeta"
        @changePerPage="(event) => changePerPage(event, 'change-per-page-client')"
        @createClient="(event) => createClient(client)"
        @deleteClient="(client) => deleteClient(client)"
        @editClient="(client) => editClient(client)"
        @getClients="(params) => getClients(params)"
        @saveClient="(client) => saveClient(client)"
        @selectedPage="(event) => selectedPage(event, 'change-page-client')"
      />
      <div class="client-inner__info">
        <ClientInfoHeader
          :Itemidx="1"
          :client="client || {}"
          :items="items"
          :itemsMore="itemsMore"
          :posts="posts"
          v-if="client"
        />
        <ClientTable
          :items="itemsTable"
          :sales="sales"
          :offers="offers"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/clients/Sidebar";
import Navbar from "../components/clients/Navbar";
import ClientsList from "../components/clients/ClientsList";
import ClientInfoHeader from "../components/clients/ClientInfoHeader";
import ClientTable from "../components/clients/ClientTable";
import {mapGetters} from 'vuex'
import paginationMixin from "@/mixins/paginations";

export default {
  name: "Clients",
  components: {
    ClientForm: () => import("../components/clients/ClientForm"),
    Sidebar,
    Navbar,
    ClientsList,
    ClientInfoHeader,
    ClientTable,
  },
  mixins: [paginationMixin],
  data: () => ({
    showForm: false,
    headers: [],
    date: null,
    // items: [],
    itemsMore: [],
    itemsTable: [],
    offers: [],
    sales: [],
  }),

  computed: {
    ...mapGetters([
      'client',
      'clients',
      'dialog',
      'posts',
    ]),
    items() {
      if (this.clients) {
        this.paginationMeta.page = this.clients.meta.current_page
        this.paginationMeta.perPage = this.clients.meta.per_page
        this.paginationMeta.pageCount = Math.ceil(this.clients.meta.total / this.clients.meta.per_page)
        return this.clients.data
      }
      return []
    },
    clientOffers () {
      return this.client && this.client.offers || []
    },
    clientSales () {
      return this.client && this.client.sales || []
    },
  },

  created() {
    this.$store.dispatch('getOffers')
    this.$store.dispatch('getPosts')
    this.$store.dispatch('getClients')
    this.initialize()

    this.$eventHandle.$on('change-page-client', (page) => {
      this.page = page
      this.$store.dispatch('getClients', {
        page, perPage: this.perPage
      })
    })

    this.$eventHandle.$on('change-per-page-client', (perPage) => {
      this.perPage = perPage
      this.$store.dispatch('getClients', {
        page: this.page, perPage
      })
    })
  },

  destroyed() {
    this.$eventHandle.$off('change-page-client')
    this.$eventHandle.$off('change-per-page-client')
    this.$eventHandle.$off('set-dialog')
    this.$store.commit('setClients', null)
    this.$store.commit('setDialog', false)
    this.$store.commit('setClient', {})
  },

  methods: {
    createClient() {
      this.$store.dispatch('getClient').then(() => {
        this.client.readonly = false
        this.client.persons.push({
          position: 1,
          mailable: true,
        })
      })
    },

    initialize() {
      this.headers = [
        {text: 'ID', value: 'id', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('status'), value: 'status', align: 'start', sortable: true, class: 'caption'},
        {text: "Имя на русском", value: 'name', align: 'start', sortable: true, class: 'caption'},
        {text: "Имя клиента", value: 'he_name', align: 'end', sortable: true, class: 'caption'},
        {text: this.$t('company_name'), value: 'company_name', align: 'end', sortable: true, class: 'caption'},
        {text: this.$t('passport'), value: 'passport', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('mobile_phone'), value: 'mobile_phone', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('landline_phone'), value: 'landline_phone', align: 'start', sortable: true, class: 'caption'},
        {text: this.$t('actions'), value: 'actions', align: 'center', class: 'caption'},
      ]
    },

    viaEditClient(e, data) {
      this.editClient(data.item)
    },

    editClient(client) {
      this.$store.dispatch('getClient', client).then(() => {
      })
    },

    clientSwitch(client) {
      this.$store.dispatch('switchClient', {id: client.id}).then(res => {
        client.status = res.switch
      })
    },

    deleteClient(client) {
      this.$swal({
        title: this.$t('are-you-sure') + "!",
        icon: "warning",
        value: true,
        buttons: [this.$t('cancel'), this.$t('continue')],
      }).then((res) => {
        if (res) {
          this.$store.dispatch('deleteClient', client.id)
        }
      })
    },

    async saveClient(client = null) {
      let response = await this.$store.dispatch('saveClient', client || this.client)
      this.$eventHandle.$emit('save-client', response)
    },

    getClients (params) {
      this.$store.dispatch('getClients', params)
    },
  },

  watch: {
    client: function (val, oldVal) {
      this.sales = []
      this.offers = []
      this.clientOffers.forEach(co => {
        let saleOffer = this.clientSales.find(cs => cs.offer_id == co.id)
        this.offers.push(co)
        this.sales.push(saleOffer || {})
      })
      this.clientSales.forEach(cs => {
        if (!this.sales.some(s => s.id == cs.id)) {
          if (this.sales[0].id > cs.id) {
            this.sales.push(cs)
            this.offers.push({})
          } else {
            this.sales.unshift(cs)
            this.offers.unshift({})
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "MyriadPro";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: local("MyriadPro Regular"), local("MyriadPro-Regular"),
    url("../../assets/fonts/MyriadPro-Regular.otf") format("truetype");
}
@font-face {
  font-family: "Rubik";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: local("Rubik Regular"), local("Rubik-Regular"),
    url("../../assets/fonts/Rubik-Regular.ttf") format("truetype");
}

#app {
  margin: 0;
  font-family: "Rubik", sans-serif, -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Apple Color Emoji";
  font-weight: 400;
  font-size: 16px;
  color: #424242;
  backface-visibility: hidden;
}
.client-block {
  width: 100%;
  background-color: #b9d2ea;
  min-height: 100vh;
}
.client-inner {
  display: flex;
}
</style>
