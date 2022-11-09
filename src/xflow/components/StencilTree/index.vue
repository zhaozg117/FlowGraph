<template>
  <div class="page">
    <el-input
      v-model="searchValue"
      prefix-icon="el-icon-search"
      clearable
      class="search-input"
      placeholder="请输入要搜索的内容"
    ></el-input>
    <main id="stencil-container" class="list-box">
      <el-tree
        ref="treeRef"
        :data="list"
        :default-expanded-keys="defaultExpanded"
        :highlight-current="false"
        :filter-node-method="filterNode"
        :props="treeProp"
        :check-on-click-node="true"
        show-checkbox
        node-key="id"
      >
        <!-- @node-click="handleNodeClick" -->
        <div class="custom-tree-node" slot-scope="{ node }">
          <el-tooltip
            :content="node.label"
            :disabled="node.label.length < 13"
            :enterable="false"
            :open-delay="1000"
            effect="dark"
            placement="right-end"
          >
            <!-- @mouseup="handleDrag(node, $event)" -->
            <div
              class="text-ellipsis"
              @mouseup="handleChange(node)"
              draggable="true"
              @dragstart="drag(node, $event)"
              @dragend="dragEnd(node, $event)"
            >
              {{ node.label }}
            </div>
          </el-tooltip>
        </div>
      </el-tree>

      <div
        @drop="drop($event)"
        @dragenter="dragEnter($event)"
        @dragover="allowDrop($event)"
        style="height: 300px; background-color: green"
      >
        dd
      </div>
    </main>
  </div>
</template>

<script>
import { debounce } from "lodash";
import { FlowGraph } from "../../index.js";
export default {
  name: "TreeList",
  props: {
    treeList: {
      type: Array,
      default: () => []
    },
    currentEntityId: {
      type: Number,
      default: 0
    },
    flowGraph: {
      default: null,
      type: FlowGraph
    }
  },
  data() {
    return {
      list: [],
      searchValue: "",
      defaultExpanded: [],
      currentKey: null,
      treeProp: {
        disabled: function (data) {
          return data.disabled;
        }
      }
    };
  },
  watch: {
    searchValue(val) {
      this.$refs.treeRef.filter(val);
    },
    currentEntityId: {
      handler(val) {
        this.currentKey = val;
        this.$nextTick(() => {
          this.$refs.treeRef.setCurrentKey(val);
        });
      },
      immediate: true
    },
    treeList: {
      handler(val) {
        this.list = [];
        this.list.push(...val);
      },
      deep: true
    }
  },
  created() {
    this.list = [];
    this.list.push(...this.treeList);
    this.defaultExpanded[0] = this.list[0].children[0].id;
  },
  mounted() {
    // this.flowGraph.initStencilTree("#stencil-container");
  },
  methods: {
    handleNodeClick: debounce(function (data) {
      if (data.disabled) {
        this.$refs.treeRef.setCurrentKey(this.currentKey);
        return;
      } else {
        if (!data.children) {
          this.$emit("changeEntity", data.id);
        }
        if (data.id !== this.currentKey) {
          this.$refs.treeRef.setCurrentKey(this.currentKey);
        }
      }
    }, 1000),
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 拖拽事件
    handleDrag(value, event) {
      console.log("handleDrag", value);
      // this.flowGraph.DragStencil(value, event);
    },
    // 点击事件
    handleChange(value) {
      console.log("handleChange", value);
    },
    drag(value, event) {
      console.log("handleChange", value, event);
      event.dataTransfer.setData("Text", event.target.id);
    },
    dragEnd(value, event) {
      console.log("dragEnd", value, event);
      event.dataTransfer.setData("Text", event.target.id);
    },
    allowDrop(event) {
      console.log("allowDrop", event);
    },
    dragEnter(event) {
      console.log("dragEnter", event);
      event.preventDefault();
    },
    drop(event) {
      event.preventDefault();
      console.log("drop", event);
      var data = event.dataTransfer.getData("Text");
      console.log("data", data);
      // var data=ev.dataTransfer.getData("Text");
      // ev.target.appendChild(document.getElementById(data));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
