<template>
  <div class="bar">
    <div class="bar-item icon-list">
      <el-tooltip
        v-for="item in toolList"
        :key="item.key"
        v-show="!item.hidden"
        class="item"
        popper-class="organ-toolbar"
        effect="dark"
        :content="item.tooltip"
        placement="bottom"
      >
        <el-button
          :name="item.name"
          class=""
          size="small"
          :icon="item.icon"
          :disabled="item.disabled"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { FlowGraph } from "../../index.js";
import { DataUri } from "@antv/x6";
import { uuid } from "@/utils";
import { memory } from "../../memory";
import { toolList } from "./const.js";
let graph = null;

export default {
  name: "ToolBar",
  components: {},
  props: {
    currentSelect: {
      type: String,
      default: "none"
    },
    flowGraph: {
      default: null,
      type: FlowGraph
    },
    showList: {
      default() {
        return [];
      },
      type: Array
    },
    tools: {
      default() {
        return [];
      },
      type: Array
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
      isShow: {}
    };
  },
  computed: {
    toolList() {
      if (this.tools.length > 0) {
        return this.tools;
      } else {
        return toolList;
      }
    }
  },
  watch: {
    currentSelect(val) {
      let bol = !["none", "start"].includes(val);
      this.isCanUse.canCopy = bol;
      this.isCanUse.canCut = bol;
      if (!bol) {
        this.isCanUse.canPaste = bol;
      }
    }
  },
  created() {
    this.isShow = memory.state.isCanEdit;
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
    paste() {
      if (!graph.isClipboardEmpty()) {
        let cells = graph.getCellsInClipboard();
        graph.cleanSelection();
        // const cells = graph.paste({ offset: { dx: 60, dy: 150 } });
        cells.forEach((cell) => {
          if (cell.isNode()) {
            this.flowGraph.customPaste(cell);
            // this.flowGraph.resetPasteNode(cell);
          } else {
            graph.removeEdge(cell);
          }
        });
      }
      return false;
    },
    handleClick(event) {
      const name = event.currentTarget.name;
      switch (name) {
        case "clear":
          this.clearGraph();
          break;
        case "reset":
          this.resetGraph();
          break;
        case "flex":
          this.flexGraph();
          break;
        case "undo":
          graph.history.undo();
          break;
        case "redo":
          graph.history.redo();
          break;
        case "delete":
          this.deleteCells();
          break;
        case "savePNG":
          graph.toPNG(
            (dataUri) => {
              // 下载
              DataUri.downloadDataUri(dataUri, "chartx.png");
            },
            {
              backgroundColor: "white",
              padding: {
                top: 20,
                right: 30,
                bottom: 40,
                left: 50
              },
              quality: 1
            }
          );
          break;
        case "print":
          graph.printPreview();
          break;
        case "copy":
          this.copy();
          break;
        case "cut":
          this.cut();
          break;
        case "paste":
          this.paste();
          break;
        case "zoomIn":
          this.changeZoom(true);
          break;
        case "zoomOut":
          this.changeZoom(false);
          break;
        default:
          break;
      }
      this.$emit(name);
    },
    deleteCells() {
      let cell = graph.getSelectedCells();
      graph.removeCells(cell);
    },
    clearGraph() {
      graph.clearCells();
      graph.center(); // 内容居中
      graph.zoomTo(1); // 缩放比例
      // let id = uuid();
      this.addStartNode();
    },
    // 添加开始节点
    addStartNode() {
      let portId = uuid();
      let portsItems = [{ id: portId, group: "out" }];
      let position = { x: 500, y: 50 };
      this.flowGraph.addNode("start", portsItems, position);
      this.flowGraph.setNodeOrder(0);
    },
    // true 放大
    changeZoom(bol) {
      let zoom = graph.zoom();
      zoom = bol ? zoom + 0.1 : zoom - 0.1;
      graph.zoomTo(zoom);
    },
    resetGraph() {
      graph.center(); // 内容居中
      graph.zoomTo(1); // 缩放比例
    },
    flexGraph() {
      graph.zoomToFit(); // 使画布充满视口
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
.organ-toolbar .popper__arrow,
.organ-toolbar .popper__arrow::after {
  border-bottom-color: #1a6467 !important;
}
</style>
