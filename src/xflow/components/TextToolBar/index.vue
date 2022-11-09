<template>
  <div class="bar">
    <div class="bar-item icon-list">
      <el-button
        name="delete"
        class="btn-red"
        type="text"
        size="small"
        @click="handleClick"
        >删除节点
      </el-button>

      <el-button
        name="clear"
        class="btn-red"
        type="text"
        size="small"
        @click="handleClick"
        >清空
      </el-button>

      <el-button
        name="cancel"
        class="btn-green"
        type="text"
        size="small"
        @click="handleClick"
      >
        取消
      </el-button>

      <el-button
        name="save"
        class="btn-green"
        type="text"
        size="small"
        @click="handleClick"
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { FlowGraph } from "../../index.js";
import { DataUri } from "@antv/x6";

import { memory } from "../../memory";
let graph = null;
export default {
  name: "TextToolBar",
  components: {},
  props: {
    // currentSelect: {
    //   type: String,
    //   default: "none"
    // },
    flowGraph: {
      default: null,
      type: FlowGraph
    },
    isShowDownload: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      isCanUse: {
        canUndo: "",
        canRedo: "",
        canCopy: "",
        canCut: "",
        canPaste: ""
      },
      isShow: true,
      graph: null
    };
  },
  // watch: {
  //   currentSelect(val) {
  //     let bol = !["none", "start"].includes(val);
  //     this.isCanUse.canCopy = bol;
  //     this.isCanUse.canCut = bol;
  //     if (!bol) {
  //       this.isCanUse.canPaste = bol;
  //     }
  //   }
  // },
  created() {
    this.isShow = memory.state.isCanEdit;
    this.graph = this.flowGraph.getGraph();
  },
  mounted() {
    this.$nextTick(() => {
      graph = this.flowGraph.getGraph();
      this.initEvent();
    });
  },
  methods: {
    initEvent() {
      const { history } = graph;
      history.on("change", () => {
        this.isCanUse.canUndo = history.canUndo();
        this.isCanUse.canRedo = history.canRedo();
      });
      graph.bindKey("ctrl+z", () => {
        if (history.canUndo()) {
          history.undo();
        }
        return false;
      });
      graph.bindKey("ctrl+shift+z", () => {
        if (history.canRedo()) {
          history.redo();
        }
        return false;
      });
      graph.bindKey("ctrl+d", () => {
        this.clearGraph();
        return false;
      });
      graph.bindKey("ctrl+s", () => {
        graph.toPNG((datauri) => {
          DataUri.downloadDataUri(datauri, "chart.png");
        });
        return false;
      });
      graph.bindKey("ctrl+p", () => {
        graph.printPreview();
        return false;
      });
      graph.bindKey("ctrl+c", this.copy);
      graph.bindKey("ctrl+v", this.paste);
      graph.bindKey("ctrl+x", this.cut);
      graph.bindKey("ctrl+r", this.resetGraph);
      graph.bindKey("ctrl+q", this.flexGraph);
    },
    copy() {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells, { deep: false });
        this.isCanUse.canPaste = true;
      }
      return false;
    },
    cut() {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.cut(cells, { deep: false });
        this.isCanUse.canPaste = true;
      }
      return false;
    },
    handleClick(event) {
      const name = event.currentTarget.name;
      switch (name) {
        case "delete":
          this.$emit("delete");
          break;
        case "clear":
          this.$emit("clear");
          break;
        case "cancel":
          this.$emit("cancel");
          break;
        case "save":
          this.$emit("save");
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
