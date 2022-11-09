<template>
  <div
    class="el-tree-node"
    @click.stop="handleClick"
    @contextmenu="($event) => this.handleContextMenu($event)"
    v-if="source.visible"
    :class="{
      'is-expanded': expanded,
      'is-current': source.isCurrent,
      'is-hidden': !source.visible,
      'is-focusable': !source.disabled,
      'is-checked': !source.disabled && source.checked,
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="source.disabled"
    :aria-checked="source.checked"
    :draggable="tree.draggable"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
    ref="node"
  >
    <div class="el-tree-node__content">
      <span
        aria-hidden="true"
        :style="{ 'padding-left': (source.level - 1) * tree.indent + 'px' }"
      ></span>
      <span
        :class="[
          { 'is-leaf': source.isLeaf, expanded: !source.isLeaf && expanded },
          'el-tree-node__expand-icon',
          tree.iconClass ? tree.iconClass : 'el-icon-caret-right',
        ]"
      >
      </span>
      <el-checkbox
        v-if="showCheckbox"
        :indeterminate="source.indeterminate"
        :disabled="!!source.disabled"
        @click.native.stop
        @change="handleCheckChange"
      >
      </el-checkbox>
      <span
        v-if="source.loading"
        class="el-tree-node__loading-icon el-icon-loading"
      >
      </span>
      <node-content :node="source"></node-content>
    </div>
  </div>
</template>

<script type="text/jsx">
import ElCheckbox from 'element-ui/packages/checkbox/src/checkbox.vue';

import emitter from 'element-ui/src/mixins/emitter';
import { getNodeKey } from './model/util';

export default {
  name: 'ElTreeVirtualNode',
  componentName: 'ElTreeVirtualNode',

  mixins: [emitter],

  props: {
    source: {
      default() {
        return {};
      }
    },
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    props: Object
  },

  components: {
    ElCheckbox,
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        const parent = this.$parent;
        const tree = parent.tree;
        const node = this.node;
        const { data, store } = node;
        const props = this.$parent.props
        return parent.renderContent
          ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
          : tree.$scopedSlots.default
            ? tree.$scopedSlots.default({ node, data })
            : h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            }
          }, [
            h('span', {
              class: 'el-tree-node__label',

            }, [data[ props.treeLabel || props.label]])
          ],  node[props.treeLabel || props.label] )
      }
    }
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      oldChecked: null,
      oldIndeterminate: null
    };
  },


  watch: {
    'source.indeterminate'(val) {
      this.handleSelectChange(this.source.checked, val);
    },

    'source.checked'(val) {
      this.handleSelectChange(val, this.source.indeterminate);
    },

    'source.expanded'(val) {
      this.$nextTick(() => this.expanded = val);
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },


    methods: {
    creator(parent, nodeTag) {
      const node = this[nodeTag];

      if (parent.isTree) {
        this.tree = parent;
      } else {
        this.tree = parent.tree;
      }

      const tree = this.tree;
      if (!tree) {
        console.warn("Can not find node's tree.");
      }

      const props = tree.props || {};
      const childrenKey = props["children"] || "children";

      this.$watch(`${nodeTag}.data.${childrenKey}`, () => {
        node.updateChildren();
      });

      if (node.expanded) {
        this.expanded = true;
        this.childNodeRendered = true;
      }

      if (this.tree.accordion) {
        this.$on("tree-node-expand", (currentNode) => {
          if (node !== currentNode) {
            node.collapse();
          }
        });
      }
    },

    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data);
    },

    handleSelectChange(checked, indeterminate) {
      const node = this.node || this.source;

      if (
        this.oldChecked !== checked &&
        this.oldIndeterminate !== indeterminate
      ) {
        this.tree.$emit("check-change", node.data, checked, indeterminate);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },

    handleClick() {
      const node = this.node || this.source;
      const store = this.tree.store;

      store.setCurrentNode(node);
      this.tree.$emit(
        "current-change",
        store.currentNode ? store.currentNode.data : null,
        store.currentNode
      );
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      if (this.tree.checkOnClickNode && !node.disabled) {
        this.handleCheckChange(null, {
          target: { checked: !node.checked },
        });
      }

      this.tree.$emit("node-click", node.data, node, this);
    },

    handleContextMenu(event) {
      const node = this.node || this.source;

      if (
        this.tree._events["node-contextmenu"] &&
        this.tree._events["node-contextmenu"].length > 0
      ) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.tree.$emit("node-contextmenu", event, node.data, node, this);
    },

    handleExpandIconClick() {
      const node = this.node || this.source;

      if (node.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit("node-collapse", node.data, node, this);
        node.collapse();
      } else {
        node.expand();
        this.$emit("node-expand", node.data, node, this);
      }
    },

    handleCheckChange(_, ev) {
      const node = this.node || this.source;

      node.setChecked(ev.target.checked, !this.tree.checkStrictly);
      this.$nextTick(() => {
        const store = this.tree.store;
        this.tree.$emit("check", node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys(),
        });
      });
    },

    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast("ElTreeNode", "tree-node-expand", node);
      this.tree.$emit("node-expand", nodeData, node, instance);
    },

    handleDragStart(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-start', event, this);
      },

      handleDragOver(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-over', event, this);
        event.preventDefault();
      },

      handleDrop(event) {
        event.preventDefault();
      },

      handleDragEnd(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-end', event, this);
      }
  },

  created() {
    const parent = this.$parent.$parent.$parent;
    this.creator(parent, 'source');
  }
};
</script>
