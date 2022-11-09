<template>
  <div class="bar">
    <div class="bar-item icon-list">
      <el-tooltip
        v-if="isShow"
        class="item"
        effect="dark"
        content="清空 (Cmd + D)"
        placement="bottom"
      >
        <el-button
          name="clear"
          class=""
          size="small"
          icon="el-icon-document-delete"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        v-if="isShow"
        class="item"
        effect="dark"
        content="实际尺寸 (Cmd + R)"
        placement="bottom"
      >
        <el-button
          name="reset"
          class="el-icon-view"
          size="small"
          icon="undo"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="适应画布 (Cmd + Q)"
        placement="bottom"
      >
        <el-button
          name="flex"
          class="el-icon-full-screen"
          size="small"
          icon="undo"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="清除 (Cmd + D)"
        placement="bottom"
      >
        <el-button
          name="delete"
          class="el-icon-delete"
          size="small"
          icon="delete"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip> -->
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="撤销 (Cmd + Z)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canUndo"
          name="undo"
          class="el-icon-refresh-left"
          size="small"
          icon="undo"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        class="item"
        effect="dark"
        content="重做 (Cmd + Shift + Z)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canRedo"
          name="redo"
          class="el-icon-refresh-right"
          size="small"
          icon="redo"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip> -->

      <el-tooltip
        v-if="isShow"
        class="item"
        effect="dark"
        content="复制 (Cmd + C)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canCopy"
          name="copy"
          class="el-icon-document-copy"
          size="small"
          icon="copy"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        v-if="isShow"
        class="item"
        effect="dark"
        content="剪切 (Cmd + X)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canCut"
          name="cut"
          class="el-icon-scissors"
          size="small"
          icon="scissor"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        v-if="isShow"
        class="item"
        effect="dark"
        content="粘贴 (Cmd + V)"
        placement="bottom"
      >
        <el-button
          :disabled="!isCanUse.canPaste"
          name="paste"
          class="el-icon-copy-document"
          size="small"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip
        v-if="isShowDownload"
        class="item"
        effect="dark"
        content="保存PNG (Cmd + S)"
        placement="bottom"
      >
        <el-button
          name="savePNG"
          class="el-icon-download"
          size="small"
          icon="download"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="放大" placement="bottom">
        <el-button
          name="zoomIn"
          class="el-icon-zoom-in"
          size="small"
          @click="handleClick"
        >
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩小" placement="bottom">
        <el-button
          name="zoomOut"
          class="el-icon-zoom-out"
          size="small"
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
let graph = null;
let toolList=[{
  key:1,
  name:'',
  label:'',
  icon:'',
  class:'',
  isShow:false,
  isCan:true,
}];
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
      default(){return []},
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
      isShow: {
      
      }
    };
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
          graph.clearCells();
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
    },
    handleBack() {
      this.$emit("backTo");
    },
    handleSave() {
      this.$emit("saveStrategy");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
