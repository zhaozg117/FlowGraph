<!-- eslint-disable prefer-const -->
<template>
  <div class="wrap">
    <div class="toolbar">
      <el-button @click="addNode">新增节点</el-button>
    </div>

    <!-- <div id="container"></div> -->
    <div class="x6-graph-box">
      <div id="x6-graph-container" class="x6-graph-container"></div>
    </div>
  </div>
</template>

<script>
import { Graph } from "@antv/x6";
import { x6Option, compileData } from "./x6Data";
import { FlowGraph, memory, parse, eventBus } from "../xflow";
import { uuid, deepFilter, treeToArray } from "@/utils";

const interacting = {
  nodeMovable: true,
  magnetConnectable: true,
};
export default {
  data() {
    return {
      nodes: [],
      curGraphData: { cells: [] },
    };
  },

  mounted() {
    // this.init();
    this.initFlowGraph();
    this.getGraphData();
    this.drawGraph();
  },

  methods: {
    init() {
      const graph = new Graph({
        container: document.getElementById("container"),
        snapline: {
          enabled: true,
          className: "my-snapline",
        },
        connecting: {
          router: {
            name: "orth", // oneSide | manhattan | metro | er | orth | normal

            args: {
              step: 20, // 画布的网格大小
            },
          },
          anchor: {
            name: "midSide",
            args: {
              dx: 10,
            },
          },
        },
        width: 800,
        height: 600,
      });

      window.graph = graph;

      // graph.fromJSON(x6Option);
    },

    addNode() {
      window.graph.addNode({
        x: 60,
        y: 60,
        width: 120,
        height: 40,
        label: "Rect With Ports",
        ports: {
          groups: {
            in: {
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff",
                },
              },
              position: {
                name: "top",
                args: {},
              },
            },
            out: {
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff",
                },
              },
              position: {
                name: "bottom",
                args: {},
              },
            },
          },

          items: [
            { id: "prot-in", group: "in" },
            { id: "prot-out", group: "out" },
          ],
        },
      });
    },

    createParentNode(name) {
      const node = {
        size: { width: 240, height: 66 },
        view: "vue-shape-view",
        shape: "all",
        component: "all-node",
        zIndex: 99,
        ports: {
          groups: {
            in: {
              position: { name: "top" },
              attrs: {
                circle: {
                  r: 5,
                  magnet: true,
                  fill: "#79B8E8",
                  fillOpacity: "1",
                  stroke: "#79B8E8",
                  strokeOpacity: "1",
                  strokeWidth: 1,
                  style: { visibility: "visible" },
                },
              },
              zIndex: 99,
            },
            out: {
              position: { name: "bottom" },
              attrs: {
                circle: {
                  r: 5,
                  magnet: true,
                  fill: "#79B8E8",
                  fillOpacity: "1",
                  stroke: "#79B8E8",
                  strokeOpacity: "1",
                  strokeWidth: 1,
                  style: { visibility: "visible" },
                },
              },
              zIndex: 99,
            },
          },
          items: [],
        },
        id: "",
        data: {
          mark: { isValid: true, isCreate: true, isUpdate: true },
          name: "",
          uuid: "",
        },
      };
      const ID = uuid();
      const nodeId = "node-" + ID;
      node.id = nodeId;
      node.data.id = -1;
      node.data.name = name;
      node.data.originId = -1;
      node.data.uuid = nodeId;
      node.ports.items.push({
        group: "out",
        id: nodeId + "-out",
      });
      return node;
    },

    generateGraph(list, parent) {
      if (!parent) {
        parent = this.createParentNode("red" || "");
        this.curGraphData.cells.push(parent);
      }
      list.forEach((i) => {
        const { name, id, children = [], originId } = i;
        const node = {
          size: { width: 240, height: 66 },
          view: "vue-shape-view",
          shape: "all",
          component: "all-node",
          zIndex: 99,
          ports: {
            groups: {
              in: {
                position: { name: "top" },
                attrs: {
                  circle: {
                    r: 5,
                    magnet: true,
                    fill: "#79B8E8",
                    fillOpacity: "1",
                    stroke: "#79B8E8",
                    strokeOpacity: "1",
                    strokeWidth: 1,
                    style: { visibility: "visible" },
                  },
                },
                zIndex: 99,
              },
              out: {
                position: { name: "bottom" },
                attrs: {
                  circle: {
                    r: 5,
                    magnet: true,
                    fill: "#79B8E8",
                    fillOpacity: "1",
                    stroke: "#79B8E8",
                    strokeOpacity: "1",
                    strokeWidth: 1,
                    style: { visibility: "visible" },
                  },
                },
                zIndex: 99,
              },
            },
            items: [],
          },
          id: "",
          data: {
            mark: { isValid: true, isCreate: true, isUpdate: true },
            name: "",
            uuid: "",
            ...i,
          },
        };
        const ID = uuid();
        const nodeId = "node-" + ID;
        node.id = nodeId;
        node.data.id = id;
        node.data.name = name;
        node.data.uuid = nodeId;
        node.data.originId = originId;
        node.ports.items.push({
          group: "out",
          id: nodeId + "-out",
        });
        if (!parent) {
          node.shape = "all";
          node.component = "all-node";
        } else {
          // node.shape = "flowGroupNode";
          node.shape = "formation";
          node.component = "formation-node";
          node.size = { width: 40, height: 200 };
          node.ports.items.push({
            group: "in",
            id: nodeId + "-in",
          });
          node.data.lead = [];
          node.data.army = [];
          node.data.weapon = [];
          const edge = {
            shape: "edge",
            attrs: {
              line: {
                stroke: "#2f8b8b",
                strokeWidth: 1.5,
                sourceMarker: null,
              },
            },
            id: "",
            zIndex: 1,
            router: {
              name: "orth", // // oneSide | manhattan | metro | er | orth | normal
              args: { startDirections: ["bottom"], endDirections: ["top"] },
            },
            data: {
              mark: { isValid: true, isCreate: true, isUpdate: false },
            },
            source: {
              cell: "",
              port: "",
            },
            target: { cell: "", port: "" },
          };
          edge.id = "edge-" + ID;
          edge.source.cell = parent.id;
          const s = parent.ports.items.find((p) => p.group === "out");
          edge.source.port = s.id;
          edge.target.cell = node.id;
          const t = node.ports.items.find((p) => p.group === "in");
          edge.target.port = t.id;
          this.curGraphData.cells.push(edge);
        }
        this.curGraphData.cells.push(node);
        if (Array.isArray(children) && children.length) {
          this.generateGraph(children, node);
        }
      });
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
    // 初始化x6图编辑引擎
    initFlowGraph() {
      const el = document.querySelector("#x6-graph-container");
      const options = {
        container: el,
        interacting: function () {
          if (interacting) {
            return interacting;
          }
          return true;
        },
      };
      this.flowGraph = new FlowGraph(options);
      this.flowGraph.resize(".x6-graph-box");
      this.graph = this.flowGraph.getGraph();
      this.enabled = true;
    },

    drawGraph() {
      const graphData = this.curGraphData;
      if (graphData.cells && graphData.cells.length >= 0) {
        this.flowGraph.initGrahp(graphData, this.isAuto);
        // this.flowGraph.layoutDagre(graphData);
        this.flowGraph.layoutDagreRender();
        // this.graphCenter();
        // this.disableTreeList();
        // console.log('draw graph', this.existIds, this.treeList)
      }
      // else {
      //   this.addStartNode();
      // }
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
