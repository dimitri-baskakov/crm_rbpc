export default {
  methods: {
    forceDownload(url, fileName) {
      url = process.env.VUE_APP_API_URL + "/api/file-data?src=" + url
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
      xhr.setRequestHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
      xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
      xhr.responseType = "blob";
      xhr.onload = function () {
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(this.response);
        let tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
      }
      xhr.send();
    },
  },
}
