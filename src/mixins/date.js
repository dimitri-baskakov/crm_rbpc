export default {

  methods: {
    balanceDate(date, value) {
      let endDate = new Date(date);
      endDate.setMonth(endDate.getMonth() + value)
      let now = new Date();
      let months, days;
      months = (endDate.getFullYear() - now.getFullYear()) * 12;
      months -= now.getMonth();
      months += endDate.getMonth();
      days = endDate.getDate() - now.getDate()
      if (months > 0){
        if (days > 0){
          return months + 'м.' + days + 'д.'
        }
        if (days < 0){
          months -= 1;
          days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate()
          if (months > 0){
            return months + 'м.' + days + 'д.'
          } else {
            return days + 'д.'
          }
        }
        if (days === 0){
          return months + 'м.'
        }
      }
    },

  }
}
