export default {
  data: () => ({
    paginationMeta: {
      page: 1,
      perPage: 10,
      pageCount: 0
    },
    perPage: null,
    page: null,
  }),

  destroyed() {
    this.page = 1
  },

  methods:{
    changePerPage(e, emitName){
      // console.log(emitName)
      let perPage = parseInt(e.target.value, 10);
      if (perPage > 0) {
        this.page = 1
        this.$eventHandle.$emit(emitName, perPage);
      }
    },

    selectedPage(page, emitName){
      // console.log(emitName)
      this.$eventHandle.$emit(emitName, page);
    },

    changeParams(params, emitName){
      console.log(params)
      this.$eventHandle.$emit(emitName, params);
    },
  },
}
