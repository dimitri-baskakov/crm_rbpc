<template>
  <div :style="{marginLeft:'20px', borderLeft: '0.1px dotted #ababab'}">
    <div v-for="item in items">
      <div
        :data-drag-id="item.id"
        :draggable="true"
        @dragstart="$eventHandle.$emit('drag-start', $event)"
        @dragenter="$eventHandle.$emit('drag-enter', $event)"
        @dragend="$eventHandle.$emit('drag-end', $event)"
      >
        <div @dblclick="item.open = !item.open">{{item.name['ru']}} {{item.id}}</div>
        <tree
          class="tree"
          v-show="item.open"
          :items="item.children"
        />
      </div>
      <div
        :data-drop-id="item.id"
        @dragover.prevent
        @dragleave="$eventHandle.$emit('drag-leave', $event)"
        @drop="$eventHandle.$emit('drag-drop', $event)"
      >
        ---
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Tree",
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },

    data() {
      return {
        show: false
      }
    }
  }
</script>

<style scoped>
</style>
