<template>
  <div v-show="isShow" id="x6-menu-wrap" class="x6-menu-wrap">
    <div class="x6-menu">
      <div class="x6-menu-item">
        <el-button
          :disabled="!isCanUse.canCopy"
          icon="el-icon-document-copy"
          @click="copyNode"
          >复制</el-button
        >
      </div>
      <div class="x6-menu-item">
        <el-button
          :disabled="!isCanUse.canPaste"
          icon="el-icon-copy-document"
          @click="pasteNode"
          >粘贴</el-button
        >
      </div>
      <div class="x6-menu-item">
        <el-button
          :disabled="!isCanUse.canDelete"
          icon="el-icon-delete"
          @click="deleteCell"
          >删除</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { FlowGraph } from "../../index.js";
import { memory } from "../../memory";
export default {
  name: "ContextMenu",
  props: {
    flowGraph: {
      default: null,
      type: FlowGraph
    }
  },
  data() {
    return {
      graph: null,
      type: "blank",
      isCanEdit: false,
      isShow: false,
      isCanUse: {
        canCopy: false,
        canPaste: false,
        canDelete: false
      },
      clickPosition: {
        x: 0,
        y: 0
      }
    };
  },
  watch: {
    type(val) {
      if (val === "node") {
        this.isCanUse.canCopy = true;
        this.isCanUse.canPaste = false;
        this.isCanUse.canDelete = true;
      } else if (val === "edge") {
        this.isCanUse.canCopy = false;
        this.isCanUse.canPaste = false;
        this.isCanUse.canDelete = true;
      } else {
        this.isCanUse.canCopy = false;
        this.isCanUse.canDelete = false;
      }
    }
  },
  created() {
    this.isCanEdit = memory.state.isCanEdit;
    this.graph = this.flowGraph.getGraph();
  },
  mounted() {
    this.isCanEdit && this.initEvent();
  },
  methods: {
    initEvent() {
      this.graph.on("cell:contextmenu", ({ e, x, y, cell }) => {
        this.clickPosition = { x, y };
        let shape = cell.shape;
        if (shape == "start") return;
        this.isShow = true;
        this.graph.resetSelection(cell);
        const elem = document.querySelector(".x6-menu-wrap");
        elem.style.top = e.clientY - 70 + "px";
        elem.style.left = e.clientX + 10 + "px";
        this.type = cell.isNode() ? "node" : "edge";
      });
      this.graph.on("blank:contextmenu", ({ e, x, y }) => {
        this.clickPosition = { x, y };
        this.isShow = true;
        this.type = "blabk";
        const elem = document.querySelector(".x6-menu-wrap");
        elem.style.top = e.clientY - 70 + "px";
        elem.style.left = e.clientX + 10 + "px";
      });
      this.graph.on("blank:click", () => {
        this.isShow = false;
        this.type = "blabk";
      });
    },
    copyNode() {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        this.graph.copy(cells);
        this.isCanUse.canPaste = true;
      }
      this.cancelShow();
    },
    pasteNode() {
      if (!this.graph.isClipboardEmpty()) {
        let cells = this.graph.getCellsInClipboard();
        this.graph.cleanSelection();
        // const cells = this.graph.paste();
        cells.forEach((cell) => {
          //   this.flowGraph.resetPasteNode(cell, this.clickPosition);
          this.flowGraph.customPaste(cell, this.clickPosition);
        });
      } else {
        this.isCanUse.canPaste = false;
      }
      this.cancelShow();
    },
    // 删除边或节点和边
    deleteCell() {
      let cell = this.graph.getSelectedCells();
      this.graph.removeCells(cell);
      this.cancelShow();
    },
    cancelShow() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
$back-ground-color: #194449;
$border-color: #517377;
$font-color: #1ca7a7;
$hove-font-color: #2cfeff;
.x6-menu-wrap {
  position: absolute;
  z-index: 999;
  border: 1px solid $border-color;
  .x6-menu {
    position: relative;
    display: inline-block;
    min-width: 82px;
    min-height: 32px;
    margin: 0;
    padding: 4px 0;
    background-color: $back-ground-color;
    outline: 0;
    cursor: pointer;
    .x6-mune-item {
      width: 100%;
      padding: 0 10px;
    }
  }
}
::v-deep .x6-menu {
  .el-button {
    width: 100%;
    border: none;
    text-align: left;
    color: $font-color;
    background-color: $back-ground-color;
    &:hover {
      color: $hove-font-color;
    }
    &.is-disabled {
      opacity: 0.4;
    }
  }
}
</style>
