<!-- eslint-disable prefer-const -->
<template>
  <div class="wrap">
    <div class="x6-graph-box">
      <div id="x6-graph-container" class="x6-graph-container"></div>
    </div>
  </div>
</template>

<script>
import { Graph } from "@antv/x6";
import { x6Option, compileData } from "./x6Data";
import { TreeGraph } from "../xflow/graph/TreeGraph.js";
import { TreeNode, TreeEdge } from "../xflow/graph/graphCell";

import { uuid, deepFilter, treeToArray } from "@/utils";

export default {
  data() {
    return {
      nodes: [],
      curGraphData: { edges: [], nodes: [] },
    };
  },
  mounted() {
    // this.init();
    this.initFlowGraph();
    this.getGraphData();
    this.drawGraph();
    this.registerEvent();
  },

  methods: {
    // 注册监听事件
    registerEvent() {
      const that = this;
      that.flowGraph.registerEvent([
        {
          eventName: "blank:click",
          handler: () => {
            // that.clearData();
          },
        },
        {
          eventName: "cell:click",
          handler: ({ cell }) => {
            // const bol = cell.isNode() && cell.shape == "formation";
            console.log("click cell", cell);
          },
        },
        {
          eventName: "node:collapse",
          handler: ({ node }) => {
            console.log("node:collapse", node);
            node.toggleCollapse();
            const collapsed = node.isCollapsed();
            const run = (pre) => {
              const succ = this.graph.getSuccessors(pre, { distance: 1 });
              if (succ) {
                succ.forEach((node) => {
                  node.toggleVisible(!collapsed);
                  if (!node.isCollapsed()) {
                    run(node);
                  }
                });
              }
            };
            run(node);
          },
        },
        { eventName: "node:change:position" },
        { eventName: "cell:selected" },
        { eventName: "cell:unselected" },
        {
          eventName: "cell:removed",
          handler: (cell) => {
            // that.addDeleted(cell);
          },
        },
        {
          eventName: "edge:connected",
          handler: (args) => {
            // // this.findEdgeNode(args.edge, "add");
            // // console.log("edge:connected", args)
            // const ret = this.checkEdgeType(args.edge);
            // if (!ret) {
            //   this.graph.removeCell(args.edge);
            // }
          },
        },
      ]);
    },
    getGraphData() {
      const arr = treeToArray(compileData);

      for (const e of arr) {
        const { level, children } = e;
        if (level === 2) {
          for (let i = 0; i < 3; i++) {
            const id = uuid();
            const obj = {
              id,
              name: "排" + id,
              originId: `o-${id}`,
              nodeType: "compile",
              level: 3,
              children: [],
            };

            for (let j = 0; j < 3; j++) {
              const lvId = uuid();
              const item = {
                id: lvId,
                name: "单兵" + lvId,
                originId: `o-${lvId}`,
                nodeType: "platform",
                level: 4,
                children: [],
              };

              obj.children.push(item);
            }

            children.push(obj);
          }
        }
      }

      console.log("getGraphData", arr);
      // const list = compileData;
      this.generateGraph([arr[0]]);
    },

    createParentNode(name) {
      const ID = uuid();
      const nodeId = "node-" + ID;
      const nodeData = {
        id: nodeId,
        name,
        shape: "tree-node",
        width: 28,
        height: 26,
        data: {
          originId: -1,
          name: name,
          id: nodeId,
          uuid: nodeId,
        },
        attrs: {
          label: {
            textWrap: {
              text: 30,
            },
          },
        },
      };
      const node = this.createNode(nodeData);
      // node.attrs.label.textWrap.text = 30;
      node.ports.items.push({
        group: "out",
        id: nodeId + "-out",
      });
      return node;
    },

    generateGraph(list, parent) {
      if (!parent) {
        parent = this.createParentNode("red" || "");
        this.curGraphData.nodes.push(parent);
      }
      list.forEach((i) => {
        const { name, id, children = [], originId } = i;
        const ID = uuid();
        const nodeId = "node-" + ID;
        const nodeOpt = {
          size: { width: 200, height: 40 },
          shape: "tree-node",
          id: nodeId,
          data: {
            mark: { isValid: true, isCreate: true, isUpdate: true },
            name,
            uuid: nodeId,
            ...i,
            id: nodeId,
          },
        };
        const node = this.createNode(nodeOpt);
        node.attrs.label.textWrap.text = name;
        node.ports.items.push({
          group: "out",
          id: nodeId + "-out",
        });

        node.ports.items.push({
          group: "in",
          id: nodeId + "-in",
        });
        console.log("*************", parent.id, node.id);
        const edgeOpt = { source: parent.id, target: node.id };
        const edge = this.createEde(edgeOpt);
        // sdf
        this.curGraphData.edges.push(edge);
        this.curGraphData.nodes.push(node);
        if (Array.isArray(children) && children.length) {
          this.generateGraph(children, node);
        }
      });
    },

    createNode(meteData) {
      return new TreeNode(meteData);
    },

    createEde(edge) {
      return new TreeEdge({
        source: edge.source,
        target: edge.target,
      });
    },
    // 初始化x6图编辑引擎
    initFlowGraph() {
      const el = document.querySelector("#x6-graph-container");
      const options = {
        container: el,
      };
      this.flowGraph = new TreeGraph(options);
      // this.flowGraph.resize(".x6-graph-box");
      this.graph = this.flowGraph.getGraph({
        froze: true,
        async: true,
        router: {
          name: "orth",
          args: {
            offset: 24,
            direction: "H",
          },
        },
      });
      this.enabled = true;
    },

    drawGraph() {
      console.log("this.curGRaphDat", this.curGraphData);
      this.flowGraph.initGraph(this.curGraphData);
    },
  },
};
</script>

<style lang="scss">
// .x6-graph-scroller {
//   background: #0b1d54;
//   overflow: hidden;
// }

// 去除滚动条
// .x6-graph-scroller::-webkit-scrollbar {
//   width: 0px;
//   height: 0px;
// }

.x6-graph-box {
  width: 100%;
  height: 95vh;
  position: absolute;
  top: 32px;
  left: 0;
  // border-left: 1px solid $out-border-color;
  border-top: 1px solid #ccc;
  background: #111313;
}

.x6-graph-container {
  width: 100%;
  height: 100%;
}

::v-deep {
  /*去除graph中的线条*/
  .x6-graph {
    box-shadow: none !important;
  }
  .x6-graph-pagebreak-vertical,
  .x6-graph-pagebreak-horizontal {
    border: none;
  }
  // 小视图
  .x6-widget-minimap {
    background-color: #0f1216;
  }
}
</style>
