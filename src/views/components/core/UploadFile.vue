<template>
  <div class="container">
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <input type="file" multiple :name="uploadFieldName" :disabled="isSaving"
               @change="filesChange($event.target.files)"
               accept="image/*" class="input-file">
        <p v-if="isSaving">
          Uploading {{ fileCount }} files...
        </p>
        <p v-else>
          Drag your file(s) here to begin<br> or click to browse
        </p>
      </div>
    </form>
  </div>
</template>

<script>

  export default {
    name: "UploadFile",
    props: ['isSaving'],
    data() {
      return {
        uploadedFiles: [],
        uploadFieldName: 'photos'
      }
    },

    methods: {
      reset() {
        this.uploadedFiles = [];
      },
      filesChange(fileList) {
        if (!fileList.length) return;
        this.fileCount = fileList.length
        const formData = new FormData();
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append('files[]', fileList[x], fileList[x].name);
          });
        this.$emit('input', formData)
      }
    },
    mounted() {
      this.reset();
    },
  }

</script>
<style scoped>
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 100px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 100px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
