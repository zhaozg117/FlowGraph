import { Graph, Addon, Shape, Vector } from "@antv/x6";
import { GridLayout, DagreLayout } from "@antv/layout";
import dagre from "dagre";
import "./graphCell.js";
import { cloneDeep, debounce, merge } from "lodash";
import { cellController, eventController } from "./controller";
export class TreeGraph {
  graph = null;
  constructor(options) {
    const defautOptions = this.getDefaultOptions();
    const _options = merge({}, options, defautOptions);
    this.graph = new Graph(options);
    this.initEvent();
  }

  getDefaultOptions() {
    const noSelect = ["start"];
    const defaultConfig = {
      // 网格
      grid: {
        size: 10,
        visible: false,
        args: {
          color: "#a0a0a0",
          thickness: 1,
        },
      },

      // 画布调整
      scroller: {
        enabled: true,
        pageVisible: false, // false 画布缩小后仍可拖动
        pageBreak: true,
        pannable: true,
        // modifiers: "ctrl",
        autoResize: true,
      },
      // 配置全局连线规则
      connecting: {
        anchor: "center",
        connectionPoint: "anchor",
        allowBlank: false,
        allowMulti: "withPort", //true,
        allowLoop: false,
        highlight: false,
        snap: {
          radius: 40,
        },
        createEdge({ sourceCell }) {
          let id = uuid();
          // let bol = sourceCell.shape === "start";
          // let edge =  bol ? cloneDeep(startEdge) : cloneDeep(stateEdge);
          let type = sourceCell.shape + "Edge";
          let curEdge = edgeList[type] || edgeList["defaultEdge"];
          let edge = cloneDeep(curEdge);
          edge.id = id;
          edge.data = initformData["edge"];
          let newEdge = new Shape.Edge(edge);
          return newEdge;
        },
        validateMagnet({ e, magnet }) {
          // 只能输出连接桩才能新增边
          if (magnet && magnet.getAttribute("port-group") !== "out") {
            return false;
          }
          return true;
        },
        validateConnection({
          // sourceView,
          // targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          // if (sourceView === targetView) {
          //   return false;
          // }
          if (!sourceMagnet) {
            return false;
          }
          // 只能连接到输入链接桩
          if (
            targetMagnet &&
            targetMagnet.getAttribute("port-group") !== "in"
          ) {
            return false;
          }
          return true;
        },
        highlighting: {
          magnetAvailable: {
            name: "stroke",
            args: {
              padding: 4,
              attrs: {
                strokeWidth: 4,
                stroke: "#31a3ff",
              },
            },
          },
        },
      },
      // 设置滚轮缩放画布
      mousewheel: true,
      // async: true,
      snapline: true,
      // 历史
      history: true,
      // 复制
      clipboard: true,
      keyboard: true,
      // 按ctrl框选节点
      selecting: {
        multiple: true,
        enabled: true,
        className: "my-selected",
        rubberband: true,
        modifiers: "ctrl",
        strict: true,
        movable: true,
        filter(node) {
          return !noSelect.includes(node.shape);
        },
        rubberEdge: true, // 框选可以选中edge
        rubberNode: true, // 框选可以选中node
        showNodeSelectionBox: false,
        showEdgeSelectionBox: false,
      },
    };
    return defaultConfig;
  }

  initEvent() {
    // this.initEvent();
    this.cellController = new cellController(this);
    this.eventController = new eventController(this);
  }

  /**
   * 注册监听事件
   * @param {EventArg[]} events
   */
  registerEvent(events) {
    this.eventController.registerEvent(events);
  }

  initGraph({ nodes, edges }) {
    // this.graph.resetCells([...nodes, ...edges]);
    // layout();
    // this.graph.zoomTo(0.8);
    // this.graph.centerContent();
    // setup();

    this.graph.resetCells([...nodes, ...edges]);
    this.layoutGraph();
    this.graph.zoomTo(0.8);
    this.graph.centerContent();

    // this.graph.unfreeze({
    //   progress({ done }) {
    //     if (done) {
    //       const time = new Date().getTime() - start;
    //       console.log(time);
    //       this.graph.unfreeze({
    //         batchSize: 50,
    //       });
    //       // this.layoutGraph();
    //       // this.graph.zoomTo(0.8);
    //       // this.graph.centerContent();
    //     }
    //   },
    // });
  }

  layoutGraph(dir = "TB") {
    const nodes = this.graph.getNodes();
    const edges = this.graph.getEdges();
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 16 });
    g.setDefaultEdgeLabel(() => ({}));

    const width = 260;
    const height = 90;
    nodes.forEach((node) => {
      g.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
      const source = edge.getSource();
      const target = edge.getTarget();
      g.setEdge(source.cell, target.cell);
    });

    dagre.layout(g);

    this.graph.freeze();

    g.nodes().forEach((id) => {
      const node = this.graph.getCell(id);
      if (node) {
        const pos = g.node(id);
        node.position(pos.x, pos.y);
      }
    });

    edges.forEach((edge) => {
      const source = edge.getSourceNode();
      const target = edge.getTargetNode();
      const sourceBBox = source.getBBox();
      const targetBBox = target.getBBox();

      console.log(sourceBBox, targetBBox);

      if ((dir === "LR" || dir === "RL") && sourceBBox.y !== targetBBox.y) {
        const gap =
          dir === "LR"
            ? targetBBox.x - sourceBBox.x - sourceBBox.width
            : -sourceBBox.x + targetBBox.x + targetBBox.width;
        const fix = dir === "LR" ? sourceBBox.width : 0;
        const x = sourceBBox.x + fix + gap / 2;
        edge.setVertices([
          { x, y: sourceBBox.center.y },
          { x, y: targetBBox.center.y },
        ]);
      } else if (
        (dir === "TB" || dir === "BT") &&
        sourceBBox.x !== targetBBox.x
      ) {
        const gap =
          dir === "TB"
            ? targetBBox.y - sourceBBox.y - sourceBBox.height
            : -sourceBBox.y + targetBBox.y + targetBBox.height;
        const fix = dir === "TB" ? sourceBBox.height : 0;
        const y = sourceBBox.y + fix + gap / 2;
        edge.setVertices([
          { x: sourceBBox.center.x, y },
          { x: targetBBox.center.x, y },
        ]);
      } else {
        edge.setVertices([]);
      }
    });

    this.graph.unfreeze();
  }
  /**
   * 获取graph数据
   */
  getGraphData() {
    return this.graph.toJSON();
  }

  getGraph() {
    return this.graph;
  }
}
