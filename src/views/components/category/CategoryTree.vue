<template>
  <div>
    <tree
      :data="categoryTree || [{children: [], active: false}]"
      :draggable="true"
      :indent="40"
      :space="0"
      @change="changeTree"
      @nodeOpenChanged="setOpenedIds"
      @targets-info="targetsInfo"
    >
      <div
        :style="data && data.children && data.children.length ? 'border: 2px solid #D6D6D6; border-radius: 6px;' : ''"
        class="category-tree-container"
        slot-scope="{data, store, vm}"
      >
        <v-list-item
          :class="{'selected': data && data.active}"
          :style="requestStatus === 'loading' && 'pointer-events: none;'"
          @dblclick.stop="store.toggleOpen(data)"
          @dragenter="onDragEnter($event, data, store)"
          @dragleave="removeDragClass($event, data)"
          @dragover.prevent="addDragClass($event)"
          @drop="onDrop($event, data)"
          class="category-tree-item pa-0 rounded white d-flex"
          dense
          ripple
        >
          <v-list-item-avatar
            class="primary my-0 py-0 rounded-l"
            height="40px"
            tile
          >
            <v-icon
              color="white"
              @click="store.toggleOpen(data)"
              v-if="data && data.children && data.children.length"
              v-text="!!data.open && 'mdi-minus' || 'mdi-plus'"
            ></v-icon>
          </v-list-item-avatar>
          <v-list-item-content
            class="py-0 my-0 d-flex align-self-stretch"
          >
            <v-list-item-title
              :class="{'white--text': data.active}"
              class="py-0 my-0 d-flex align-stretch"
            >
              <div @click="getSelectedCategory(data)" style="height: 40px;" class="d-flex">
                <div class="align-self-center">
                  {{ data.name && data.name[$i18n.locale] }}
                </div>
              </div>
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="my-0">
            <div class="text-h6">
              <span v-if="mode === 'products'">
                {{ data.products_count && data.products_count.productCount }}
                &ensp;
                ({{ data.all_products_count && data.all_products_count.productCount }})
              </span>
              <span v-else-if="mode === 'store'">
                {{ data.products_count }}
                &ensp;
                ({{ data.all_products_count }})
              </span>
              <span v-else>
                {{ data.products_count && data.products_count.groupCount}}
                &ensp;
                ({{ data.all_products_count && data.all_products_count.groupCount }})
              </span>
            </div>
          </v-list-item-action>
        </v-list-item>
      </div>
    </tree>

  </div>
</template>

<script>
import {DraggableTree} from '../../../helpers/draggable-nested-tree'
import {breadthFirstSearch} from 'tree-helper';
import {mapGetters} from 'vuex'


export default {
  name: "CategoryTree",

  components: {
    Tree: DraggableTree
  },

  computed: {
    ...mapGetters(['requestStatus'])
  },

  data () {
    return {
      targetNodeId: null,
      parentId: null,
      type: null,
      timers: [],
      activeId: null,
      openedIds: [],
      selectedCategories: []
    }
  },

  props: ['categoryTree', 'activeCategories', 'activeCategoryId', 'mode'],

  created() {
    this.$eventHandle.$on('open-tree', () => {
      this.expandAll()
    })
    this.$eventHandle.$on('close-tree', () => {
      this.collapseAll()
    })
    this.$eventHandle.$on('change-node', (changedNode) => {
      breadthFirstSearch(this.categoryTree, node => {
        if (changedNode.id === node.id) {
          let arr = Object.keys(changedNode)
          for (let i of arr) {
            node[i] = changedNode[i]
          }
        }
      })
    })
    this.$eventHandle.$on('add-node', (addedNode) => {
      if (!!addedNode.parent_id) {
        breadthFirstSearch(this.categoryTree, node => {
          if (!!addedNode.parent_id && addedNode.parent_id === node.id) {
            node.children.push(addedNode)
          }
        })
      } else {
        this.categoryTree.push(addedNode)
      }

    })
    this.$eventHandle.$on('delete-node', (deletedNode) => {
      if (!!deletedNode.parent_id) {
        breadthFirstSearch(this.categoryTree, node => {
          if (deletedNode.parent_id === node.id) {
            node.children = node.children.filter(c => c.id !== deletedNode.id)
          }
        })
      } else {
        for (let i = 0; i < this.categoryTree.length; i++) {
          if (this.categoryTree[i].id === deletedNode.id) {
            this.categoryTree.splice(i, 1);
          }
        }
      }
    })
    this.$nextTick(() => {
      setTimeout(() => {
        this.activeId = this.activeCategoryId
        let activeCategoriesIds = this.activeCategories.map(ac => ac.id)
        this.openedIds = this.openedIds.concat(activeCategoriesIds)
        this.expandActive()
      }, 700)
    })
  },

  updated() {
    this.expandActive()
  },

  destroyed() {
    this.$eventHandle.$off('open-tree');
    this.$eventHandle.$off('close-tree');
    this.$eventHandle.$off('change-node');
    this.$eventHandle.$off('add-node');
    this.$eventHandle.$off('delete-node');
  },

  methods: {
    expandActive() {
      breadthFirstSearch(this.categoryTree, node => {
        if (node) {
          node.open = this.openedIds.includes(node.id)
          node.active = node.id === this.activeId
        }
      })
    },

    setActiveClass() {
      breadthFirstSearch(this.categoryTree, node => {
        if (node) {
          node.active = node.id === this.activeId
        }
      })
    },

    expandAll() {
      breadthFirstSearch(this.categoryTree, node => node.open = true)
    },

    collapseAll() {
      breadthFirstSearch(this.categoryTree, node => {
        node.open = false
      })
    },

    changeTree(node, targetTree) {
      let data = {
        id: node.id,
        parent_id: !!this.parentId ? this.parentId : null,
        target_id: !!this.targetNodeId ? this.targetNodeId : null,
        type: this.type
      }
      this.$emit('move', data)
      this.$emit('input', {category: node, selectedCategories: this.selectedCategories})
    },

    getSelectedCategory(category) {
      this.makePath(category);
      this.$emit('input', {category, selectedCategories: this.selectedCategories})
      this.activeId = category.id
      this.setActiveClass()
    },
    setOpenedIds(node) {
      if (node.open) {
        this.openedIds.push(node.id)
      } else {
        this.openedIds = this.openedIds.filter(openedId => openedId !== node.id)
      }
    },

    makePath(data) {
      this.selectedCategories = []
      this.addNames(data)
    },

    addNames(category) {
      if (!!category && category.hasOwnProperty('id')) {
        this.selectedCategories.push({id: category.id, name: category.name});
        this.addNames(category.parent)
      }
    },

    targetsInfo(targetNode) {
      if (!!targetNode.parent_id) {
        this.parentId = targetNode.parent_id
      }
      this.targetNodeId = targetNode.id
      this.type = targetNode.type
    },
    onDragEnter(e, data, store) {
      e.preventDefault();
      this.addDragClass(e);
      this.timers[data.id] = setTimeout(() => {
        store.openNode(data);
      }, 800)
    },
    addDragClass(e) {
      e.target.closest('.category-tree-item').classList.add('category-tree-item--dragenter');
    },
    removeDragClass(e, data) {
      e.target.closest('.category-tree-item').classList.remove('category-tree-item--dragenter');
      if (data && this.timers[data.id]) {
        clearTimeout(this.timers[data.id])
      }
    },
    onDrop(e, data) {
      const categoryId = data.id;
      let productIds = e.dataTransfer.getData('text/plain');
      productIds = !!productIds &&
        productIds
          .split(',')
          .map(item => parseInt(item)) ||
        []

      this.$emit('attach-product', {categoryId, productIds})
      this.removeDragClass(e);
    },
  },
}
</script>


<style lang="scss">
.he-tree {
  padding: 0;
}

.tree-node-children:first-child > .tree-node {
  margin-bottom: 5px;
}

.tree-node {
  border-radius: 4px;

  .active {
    background: #B9D2EA !important;
  }

  .open {
    background : #D6D6D6;
  }
}

.tree-node-inner {
  padding: 3px;
  cursor: pointer;
}

.category-tree-item {
  max-height: 40px;

  &:hover {
    background: #EEEEEE !important;
  }
  &.selected {
    background: #82B1FF !important;
    color: white !important;
  }
  &.category-tree-item--dragenter {
    background: #2979FF !important;
  }
}

.draggable-placeholder-inner {
  border: 1px dashed #0088F8;
  box-sizing: border-box;
  background: rgba(0, 136, 249, 0.09);
  color: #0088f9;
  text-align: center;
  padding: 0;
  display: flex;
  align-items: center;
}
</style>
