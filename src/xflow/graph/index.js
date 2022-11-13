import { Graph, Addon, Shape, Vector } from "@antv/x6";
import { GridLayout, DagreLayout } from "@antv/layout";
import dagre from "dagre";
import "./shape";
import { cloneDeep, debounce, merge } from "lodash";
import { uuid } from "@/utils";
import "@antv/x6-vue-shape";
import { cellController, eventController } from "./controller";
import { initformData, edgeList } from "./config";
export default class FlowGraph {
  nodeOrder = 0;
  graph = null;
  constructor(graphOptions) {
    const defaultConfig = this.getDefaultConfig();
    const options = Object.assign({}, defaultConfig, graphOptions);
    this.graph = new Graph(options);
    window.graph = this.graph;
    // const { container } = graphOptions;
    this.init();
  }
  init() {
    // this.initEvent();
    this.cellController = new cellController(this);
    this.eventController = new eventController(this);
  }
  /**
   * 获取画布默认配置项
   * @returns {Partial<GraphOptions>}
   */
  getDefaultConfig() {
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
  /** 初始化画布内容 */
  initGrahp(grahpData, isAuto = false) {
    if (!grahpData) {
      throw new Error("graphData must be defined first!");
    }
    if (isAuto) {
      this.layoutGraph(grahpData);
    } else {
      this.initGraphShape(grahpData);
    }
  }
  /* 自定义自适应窗口缩放,官方的自适应高度适应不了*/
  resize(el) {
    let that = this;
    window.onresize = debounce(function () {
      let box = el || ".x6-graph-box";
      let dom = document.querySelector(box);
      // console.log("resize", dom.clientWidth, dom.clientHeight);
      if (dom && that.graph) {
        that.graph.resize(dom.clientWidth, dom.clientHeight);
      }
    }, 300);
  }
  /*画布内容节点居中*/
  graphToCenter(len = 5, options = {}) {
    let defaultOptions = {
      padding: { left: 40, top: 20, right: 40, bottom: 40 },
    };
    Object.assign(defaultOptions, options);
    let nodes = this.graph.getNodes();
    if (nodes && nodes.length > len) {
      // console.log("zoomToFit", cloneDeep(defaultOptions));
      this.graph.zoomToFit(defaultOptions);
    } else if (nodes && nodes.length > 1) {
      this.graph.scrollToContent();
      this.graph.zoomTo(1);
    } else {
      this.graph.center();
      this.graph.zoomTo(1);
    }
  }
  /* 格子自动布局画布内容 */
  layoutGraph(grahpData) {
    let data = { nodes: [], edges: [] };
    grahpData.cells.forEach((item) => {
      if (item.shape === "edge") {
        data.edges.push(item);
      } else {
        data.nodes.push(item);
      }
    });
    const gridLayout = new GridLayout({
      type: "grid",
      preventOverlap: true,
      preventOverlapPadding: 80,
    });
    const model = gridLayout.layout(data);
    this.initGraphShape(model);
  }
  /*层次自动布局*/
  layoutDagre(grahpData) {
    console.log("layoutDagre start");
    let data = { nodes: [], edges: [] };
    grahpData.cells.forEach((item) => {
      if (item.shape === "edge") {
        data.edges.push(item);
      } else {
        data.nodes.push(item);
      }
    });
    const dagreLayout = new DagreLayout({
      bedin: [100, 400],
      type: "dagre",
      rankdir: "TB",
      ranksep: 30,
      nodesep: 30,
      // nodesepFunc: (d) => {
      //   return d.width / 3;
      // },
      // ranksepFunc: (d) => {
      //   if (d.id == "6" || d.id == "7") return 20;
      //   return 20;
      // },
      controlPoints: true,
    });
    const model = dagreLayout.layout(data);
    this.initGraphShape(model);
  }

  /**
   * 画布缩放
   * @param {number | 'fit' | 'real'} factor 缩放比例尺
   */
  zoomGraph(factor) {
    if (typeof factor === "number") {
      this.graph.zoom(factor);
    } else if (factor === "fit") {
      this.graph.zoomToFit({ padding: 12 });
    } else if (factor) {
      this.graph.scale(1);
      this.graph.centerContent();
    }
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
  /*
   *拖拽事件
   */
  DragStencil(shape, event, data = {}, portsItems = []) {
    // console.log("DragStencil", shape, event, data, portsItems);
    let id = uuid();
    let initData = cloneDeep(initformData[shape] || initformData["default"]);
    let obj = Object.assign({}, initData, data);
    obj.id = id;
    let node = this.graph.createNode({
      id: id,
      shape: shape,
      ports: {
        items: portsItems,
      },
      data: obj,
    });
    this.dnd.start(node, event);
    this.graph.resetSelection(id);
  }
  setNodeOrder(val) {
    val && (this.nodeOrder = val);
  }
  /*新增节点*/
  addNode(shape, portsItems, position = { x: 200, y: 100 }, data = {}) {
    let id = uuid();
    let initData = cloneDeep(initformData[shape] || initformData["default"]);
    let obj = Object.assign({}, initData, data);
    if (shape === "state") {
      obj.name += this.nodeOrder;
      this.nodeOrder++;
    }
    obj.uuid = id;
    let cell = this.graph.addNode({
      id: id,
      shape: shape,
      ports: {
        items: portsItems,
      },
      position: position,
      data: obj,
    });
    this.graph.resetSelection(id);
    return cell;
  }
  /*新增子节点*/
  addChildNode(cell, list, shape = "sub", isLayout = true) {
    // console.time("addChil");
    // this.graph.freeze();
    let source = {
      cell: cell.id,
      port: this.getPort(cell, "out"),
    };
    // this.graph.freeze();
    let options = {
      incoming: false,
      outgoing: true,
      deep: false,
    };
    let cel = this.graph.getCellById(cell?.id || cell?.uuid);
    let neighNodes = this.graph.getNeighbors(cel, options);
    let obj = {};
    neighNodes.forEach((item) => {
      let { id } = item.getData();
      obj[id] = item;
    });
    list.forEach((item) => {
      let { id, children } = item;
      if (obj[id]) {
        children &&
          children.length > 0 &&
          this.addChildNode(obj[id], children, shape, false);
      } else {
        let portId = uuid();
        let portId2 = uuid();
        let twoPorts = [
          { id: portId, group: "in" },
          { id: portId2, group: "out" },
        ];
        let portsItems =
          shape == "sub" ? [{ id: portId, group: "in" }] : twoPorts;

        let node = this.addNode(shape, portsItems, { x: 300, y: 300 }, item);
        let target = {
          cell: node.id,
          port: this.getPort(node, "in"),
        };
        this.addEdges(shape, source, target);
        if (children && children.length > 0) {
          this.addChildNode(node, children, shape, false);
        }
      }
    });
    // console.timeEnd("addChil");
    // console.log("isLayout", isLayout);
    isLayout && this.layoutDagreRender();
    // setTimeout(() => {
    //   console.time("layout");

    // }, 0);
  }
  /*新增边 */
  addEdges(type, source, target = { cell: "12", port: "1245" }) {
    this.graph;
    let edgeOptions = {
      shape: "edge" || type,
      data: { mark: { isValid: true, isCreate: true, isUpdate: false } },
      zIndex: 5,
      source: source,
      target: target,
    };
    let curEdge = edgeList["defaultEdge"] || edgeList["commonEdge"];
    let edge = Object.assign({}, curEdge, edgeOptions);
    window.graph = this.graph;
    this.graph.addEdge(edge);
  }
  /*移除子节点*/
  removeChildNode(cell, list = [], shape = "sub") {
    let options = {
      incoming: false,
      outgoing: true,
    };
    let cells = [];
    let arr = [];
    let loopFn = function (list) {
      list.forEach((item) => {
        arr.push(item.id);
        if (item?.children && item.children.length > 0) {
          loopFn(item.children);
        }
      });
    };
    loopFn(list);
    //  list.map((item) => item.id);
    let parendNode = this.graph.getCellById(cell.id);
    // let nodes = this.graph.getNeighbors(parendNode, options);
    let nodes = this.graph.getSuccessors(parendNode);
    nodes &&
      nodes.forEach((node) => {
        if (node.shape == shape) {
          const { id } = node.getData();
          let bol = arr.length > 0 ? arr.includes(id) : true;
          bol && cells.push(node);
        }
      });
    cells.length > 0 && this.graph.removeCells(cells);
  }
  /*获取连接桩 */
  getPort(cell, type = "out") {
    let ports = cell?.ports?.items;
    let port = ports && ports.find((item) => item.group == type);
    return port?.id;
  }
  layoutDagreRender(type, center) {
    // console.time("layout");
    const nodes = this.graph.getNodes();
    const edges = this.graph.getEdges();
    // console.log("layoutDagreRender", nodes, edges);
    // 布局方向
    let dir = type || "TB"; // LR RL TB BT
    // 布局配置
    let options = {
      rankdir: dir,
      nodesep: 66,
      ranksep: 96,
      ranker: "network-simplex",
    };
    const g = new dagre.graphlib.Graph();
    g.setGraph(options);
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      let { width, height } = node.getProp("size");
      g.setNode(node.id, { width: width, height: height });
    });

    edges.forEach((edge) => {
      const source = edge.getSource();
      const target = edge.getTarget();
      // edge.toBack();
      g.setEdge(source.cell, target.cell);
    });

    dagre.layout(g);

    // this.graph.freeze();
    let delX = 0,
      delY = 0;
    g.nodes().forEach((id) => {
      const node = this.graph.getCell(id);
      if (node) {
        const pos = g.node(id);
        if (node.data.position) {
          const { x, y } = node.data.position;
          delX = x - pos.x;
          delY = y - pos.y;
          node.position(x, y);
        } else {
          if (node.data.isPosition) {
            node.position(pos.x + delX, pos.y + delY);
          } else {
            node.position(pos.x, pos.y);
          }
        }
      }
    });

    edges.forEach((edge) => {
      const source = edge.getSourceNode();
      const target = edge.getTargetNode();
      const sourceBBox = source.getBBox();
      const targetBBox = target.getBBox();
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
    center && this.graphToCenter();
    // console.timeEnd("layout");
    // this.graph.unfreeze();
  }

  layoutDagreRender2() {
    const nodes = this.graph.getNodes();
    const edges = this.graph.getEdges();
    // console.log("layoutDagreRender2", nodes, edges);
    // 布局方向
    let dir = "TB"; // LR RL TB BT
    // 布局配置
    let options = {
      rankdir: dir,
      nodesep: 66,
      ranksep: 86,
      ranker: "network-simplex",
    };
    const g = new dagre.graphlib.Graph();
    g.setGraph(options);
    g.setDefaultEdgeLabel(() => ({}));
    window.g = g;
    nodes.forEach((node) => {
      let { width, height } = node.getProp("size");
      g.setNode(node.id, { width: width, height: height / 3 });
    });

    edges.forEach((edge) => {
      const source = edge.getSource();
      const target = edge.getTarget();
      // edge.toBack();
      g.setEdge(source.cell, target.cell);
    });

    dagre.layout(g);

    this.graph.freeze();

    const x = [];
    g.nodes().forEach((id) => {
      const node = this.graph.getCell(id);
      if (node) {
        const pos = g.node(id);
        node.position(pos.x, pos.y);
        if (!isNaN(+id)) {
          x.push(pos.x);
        }
      }
    });
    x.sort((a, b) => a - b);

    let actionNodeIds = g.nodes().filter((i) => !isNaN(+i));
    actionNodeIds.sort((a, b) => +a - +b);
    let y = undefined;
    actionNodeIds.forEach((id, index) => {
      const ids = g.nodes().filter((i) => i.indexOf(id + "action") === 0);
      if (ids.length > 1) {
        const taskPos = g.node(id);
        y === undefined && (y = taskPos.y);
        ids.forEach((i) => {
          const pos = g.node(i);
          const node = this.graph.getCell(i);
          node.position(x[index], pos.y);
        });
      }
    });
    if (y !== undefined) {
      actionNodeIds.forEach((id, index) => {
        const node = this.graph.getCell(id);
        // const { x } = node.getPosition();
        const taskPos = g.node(id);
        node.position(x[index], y);
      });
    }
    // window.e = edges;
    edges.forEach((edge) => {
      const source = edge.getSourceNode();
      const target = edge.getTargetNode();
      const sourceBBox = source.getBBox();
      const targetBBox = target.getBBox();
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
        // const gap =
        //   dir === "TB"
        //     ? targetBBox.y - sourceBBox.y - sourceBBox.height
        //     : -sourceBBox.y + targetBBox.y + targetBBox.height;
        const fix = dir === "TB" ? targetBBox.height : 0;
        const y = targetBBox.center.y - fix;
        edge.setVertices([
          { x: sourceBBox.center.x, y },
          { x: targetBBox.center.x, y: y },
        ]);
      } else {
        edge.setVertices([]);
      }
    });
    this.graphToCenter();
    this.graph.unfreeze();
  }

  /*重新自动层次布局*/
  resetLayoutDagre() {
    const nodes = this.graph.getNodes();
    const edges = this.graph.getEdges();
    let data = { nodes, edges };
    const dagreLayout = new DagreLayout({
      bedin: [100, 400],
      type: "dagre",
      rankdir: "TB",
      ranksep: 30,
      nodesep: 30,
      // nodesepFunc: (d) => {
      //   return d.width / 3;
      // },
      // ranksepFunc: (d) => {
      //   if (d.id == "6" || d.id == "7") return 20;
      //   return 20;
      // },
      controlPoints: true,
    });
    const model = dagreLayout.layout(data);
    const cells = [...model.nodes, ...model.edges];
    this.graph.resetCells(cells);
    this.graph.unfreeze();
  }
  /*重设置拷贝的节点属性*/
  resetPasteNode(cell, position = null) {
    let id = uuid();
    let obj = {
      id: id,
      name: "状态" + this.nodeOrder,
      mark: {
        isCreate: true,
        isUpdate: false,
      },
    };
    let options = {
      silent: false,
      overwrite: false,
      deep: true,
    };
    this.nodeOrder++;
    position && cell.setProp("position", position);
    cell.setProp("id", id); // 是一个bug
    cell.setData(obj, options);
    //  cell.id = id;
  }
  /**
   * 自定义粘贴功能，因为官方的粘贴功能，更改id后，连线的时候还是原来的id
   * bug:  新增的节点不能修改data了  ？？？
   */
  customPaste(cell, position = null) {
    let id = uuid();
    let obj = cell.toJSON();
    let data = {
      id: id,
      uuid: id,
      mark: {
        isCreate: true,
      },
    };
    obj.id = id;
    if (obj.shape === "state") {
      data["name"] = "状态" + this.nodeOrder;
      this.nodeOrder++;
    }
    if (position) {
      obj.position = position;
    } else {
      obj.position = {
        x: obj.position.x + 60,
        y: obj.position.y + 120,
      };
    }
    merge(obj.data, data);
    this.graph.addNode(obj);
    this.graph.resetSelection(id);
  }
  /**
   * 注册监听事件
   * @param {EventArg[]} events
   */
  registerEvent(events) {
    this.eventController.registerEvent(events);
  }

  // 销毁
  destroy() {
    this.graph.dispose();
  }
  //  初始化自定义模型树列表
  initStencilTree(id) {
    const stencilWrap = document.querySelector(id);
    this.dnd = new Addon.Dnd({
      target: this.graph,
      scaled: true,
      containerParent: stencilWrap,
    });

    // stencilWrap.appendChild(this.dnd.container);
  }

  initGraphShape(data) {
    this.graph.fromJSON(data);
  }
  showPorts(ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  }
  initEvent() {
    const { graph } = this;
    // 给相应的边添加标签；
    graph.on("edge:connected", ({ isNew, edge }) => {
      if (isNew) {
        const source = edge.getSourceCell();
        const rightPorts = source.getPortsByGroup("out");
        if (rightPorts.length === 2) {
          const sourcePortId = edge.getSourcePortId();
          const portIndex = source.getPortIndex(sourcePortId);
          const label = portIndex == 1 ? "是" : "否";
          edge.setLabels(label);
        }
      }
    });
  }
  initAnimate() {
    let { graph } = this;
    let flash = (cell) => {
      const cellView = graph.findViewByCell(cell);
      if (cellView) {
        cellView.highlight();
        setTimeout(() => cellView.unhighlight(), 350);
      }
    };
    graph.on("signal", (cell) => {
      if (cell.isEdge()) {
        const view = graph.findViewByCell(cell);
        if (view) {
          const token = Vector.create("circle", { r: 6, fill: "#feb662" });
          const target = cell.getTargetCell();
          setTimeout(() => {
            view.sendToken(token.node, 1200, () => {
              if (target) {
                graph.trigger("signal", target);
              }
            });
          }, 350);
        }
      } else {
        flash(cell);
        const edges = graph.model.getConnectedEdges(cell, {
          outgoing: true,
        });
        edges.forEach((edge) => graph.trigger("signal", edge));
      }
    });
    graph.on("node:mousedown", ({ cell }) => {
      graph.trigger("signal", cell);
    });
  }
}
