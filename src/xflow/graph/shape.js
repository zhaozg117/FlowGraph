import { Graph, Node, Path } from "@antv/x6";
import {
  commonPortsGroups,
  vuePortsGroups,
  startPortsGroups,
  disabledPortsGroups,
} from "./config";
import { graphTheme } from "./theme/index.js";
import { cloneDeep } from "lodash";
import "@antv/x6-vue-shape";
import ErNode from "./nodes/ErNode/index.vue";
import StateNode from "./nodes/StateNode/index.vue";
import StartNode from "./nodes/StartNode/index.vue";
// 转移节点
import TransferNode from "./nodes/TransferNode/index.vue";
// 部队节点
import TroopsNode from "./nodes/troopsNode/index.vue";
// 计算节点
import CountNode from "./nodes/CountNode/index.vue";
// 指标节点
import NormNode from "./nodes/NormNode/index.vue";
// 编组节点
import MarshalNode from "./nodes/MarshalNode/index.vue";
// 编组子节点
import SubNode from "./nodes/SubNode/index.vue";

// 所有编制节点
import AllNode from "./nodes/AllNode/index.vue";
// 编制节点
import FormationNode from "./nodes/FormationNode/index.vue";
//  兵力分配编组节点
import DistributeNode from "./nodes/DistributeNode/index.vue";

// 父节点
export class NodeGroup extends Node {
  // private collapsed: boolean = true

  // protected
  postprocess() {
    this.collapsed = true;
    // this.toggleCollapse(true);    // 可以展开/收缩子节点的method
  }

  isCollapsed() {
    return this.collapsed;
  }

  toggleCollapse(collapsed) {
    const target = collapsed == null ? !this.collapsed : collapsed;
    if (target) {
      this.attr("buttonSign", { d: "M 1 5 9 5 M 5 1 5 9" });
      this.resize(180, 50);
    } else {
      this.attr("buttonSign", { d: "M 2 5 8 5" });
      this.resize(200, 200);
    }
    this.collapsed = target;
  }
}

NodeGroup.config({
  shape: "rect",
  data: {},
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "image",
      selector: "image",
    },
    {
      tagName: "text",
      selector: "text",
    },
  ],
  attrs: {
    body: {
      refWidth: "100%",
      refHeight: "100%",
      strokeWidth: 1,
      fill: "rgba(95,149,255,0.05)",
      stroke: "#5F95FF",
    },
    image: {
      "xlink:href":
        "https://gw.alipayobjects.com/mdn/rms_0b51a4/afts/img/A*X4e0TrDsEiIAAAAAAAAAAAAAARQnAQ",
      width: 16,
      height: 16,
      x: 8,
      y: 12,
    },
    text: {
      fontSize: 12,
      fill: "rgba(0,0,0,0.85)",
      refX: 30,
      refY: 15,
    },
    //  父节点折叠/展开按钮
    buttonGroup: {
      refX: "100%",
      refX2: -25,
      refY: 13,
    },
    button: {
      height: 14,
      width: 16,
      rx: 2,
      ry: 2,
      fill: "#f5f5f5",
      stroke: "#ccc",
      cursor: "pointer",
      event: "node:collapse",
    },
    buttonSign: {
      refX: 3,
      refY: 2,
      stroke: "#808080",
    },
  },
});
// 自定义边
Graph.registerEdge(
  "org-edge",
  {
    zIndex: -1,
    attrs: {
      line: {
        sourceMarker: null,
        targetMarker: null,
        strokeWidth: 1,
        stroke: graphTheme.edgeStroke,
      },
    },
  },
  true
);
// 注册边Connector，
Graph.registerConnector(
  "curve",
  (sourcePoint, targetPoint) => {
    const path = new Path();
    path.appendSegment(Path.createSegment("M", sourcePoint));
    path.appendSegment(
      Path.createSegment(
        "C",
        sourcePoint.x + 100,
        sourcePoint.y,
        targetPoint.x - 100,
        targetPoint.y,
        targetPoint.x,
        targetPoint.y
      )
    );
    return path.serialize();
  },
  true
);
Graph.registerNode("flowGroupNode", NodeGroup);

// 左边树节点 tree-node
export const TreeCell = Graph.registerNode("tree-cell", {
  inherit: "rect",
  width: 135,
  height: 26,
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 4,
      ry: 4,
      stroke: "transparent",
      fill: "transparent",
    },
    label: {
      text: "Node Label",
      refX: 10,
      refY: 11,
      fill: "#000000",
      fontSize: 14,
      y: 4,
      "text-anchor": "start",
      textWrap: {
        width: 90,
        height: 20,
        ellipsis: true,
      },
    },
  },
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "image",
      selector: "image",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ],
  attrHooks: {
    cellType: "", // 自定义键值对
  },
});
// node基础节点样式
export const BaseCell = Graph.registerNode("base-cell", {
  inherit: "rect",
  attrs: {
    body: {
      strokeWidth: 1,
      rx: 4,
      ry: 4,
      fill: "#2cfeff",
      stroke: "#2cfeff",
      fillOpacity: "0.15",
      strokeOpacity: "0.6",
    },
    icon: {
      refX: 12,
      refY: 13,
    },
    path: {
      transform: "scale(0.013)",
      fill: "#2CFEFF",
    },
    path2: {
      transform: "scale(0.013)",
      fill: "#2CFEFF",
    },
    label: {
      text: "node text",
      refX: 32,
      refY: 14,
      fill: "#2CFEFF",
      fontSize: 16,
      "text-anchor": "start",
      y: 7,
      textWrap: {
        width: 80,
        height: 20,
        ellipsis: true,
      },
    },
  },
  markup: [
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "g",
      selector: "icon",
      children: [
        {
          tagName: "path",
          selector: "path",
        },
        {
          tagName: "path",
          selector: "path2",
        },
      ],
    },
    {
      tagName: "text",
      selector: "label",
    },
  ],
  ports: {
    groups: cloneDeep(commonPortsGroups),
  },
});
//  开始节点
export const dagStart = Graph.registerNode("dag-start", {
  inherit: "base-cell",
  size: {
    width: 82,
    height: 40,
  },
  attrs: {
    label: {
      text: "开始",
    },
    path: {
      d: "M895.72141 411.897028L239.333657 15.577782a106.557878 106.557878 0 0 0-110.653445 0 117.016201 117.016201 0 0 0-55.36329 100.121987v792.711628a117.016201 117.016201 0 0 0 55.36329 100.121987 106.557878 106.557878 0 0 0 110.653445 0l656.387753-396.319247a118.405769 118.405769 0 0 0 0-200.170839z",
    },
  },
  ports: {
    items: [
      {
        group: "out",
      },
    ],
  },
});
//  策略节点
export const Pipeline = Graph.registerNode("pipeline", {
  inherit: "base-cell",
  attrs: {
    label: {
      text: "算法组件",
    },
    path: {
      d: "M636.367648 1006.986642h-247.714495a29.194923 29.194923 0 0 1-31.304579-30.964312v-117.528278a674.885891 674.885891 0 0 1-68.053432-37.157174l-99.017745 61.86057a32.597594 32.597594 0 0 1-43.281983-12.385725L23.886755 654.333754a26.608892 26.608892 0 0 1 12.385725-43.281983l99.017744-61.86057V474.876853l-99.358012-61.860571a26.608892 26.608892 0 0 1-12.045457-43.350036L147.335682 153.120223a28.854655 28.854655 0 0 1 43.281983-6.192862l98.677477 61.86057a240.09251 240.09251 0 0 1 68.053432-37.157174V47.97767a29.194923 29.194923 0 0 1 31.304579-30.964312h247.714495a29.194923 29.194923 0 0 1 30.964312 30.964312v117.528278a674.885891 674.885891 0 0 1 68.053432 37.157174l99.017745-61.86057a32.597594 32.597594 0 0 1 43.009769 12.317671l123.721141 216.546023a26.608892 26.608892 0 0 1-12.385725 43.281983l-99.017744 61.86057v74.314348l99.017744 61.860571a35.523892 35.523892 0 0 1 12.385725 43.281983l-123.721141 216.546022a35.523892 35.523892 0 0 1-43.281983 12.385725l-99.017744-61.86057a240.09251 240.09251 0 0 1-68.053433 37.157174v117.528278a29.194923 29.194923 0 0 1-30.692098 30.964312z m-216.546022-61.86057h185.37755v-105.210607a34.026716 34.026716 0 0 1 18.578587-30.964312 394.709909 394.709909 0 0 0 86.63202-49.474845 39.470991 39.470991 0 0 1 37.157174 0l92.824882 55.667707 92.688775-160.810261-92.552668-55.735761c-12.385725-12.385725-18.578587-24.771449-12.385725-37.157174 0-18.578587 6.192862-30.964312 6.192862-49.474846a136.106865 136.106865 0 0 0-6.192862-49.474845 47.229082 47.229082 0 0 1 12.385725-30.964312l92.824882-55.667708-92.824882-160.878314-92.824882 55.667707a39.470991 39.470991 0 0 1-37.157174 0 394.709909 394.709909 0 0 0-86.83618-49.474845 53.489998 53.489998 0 0 1-18.578588-37.157174V78.873928H419.549412v105.210607a34.026716 34.026716 0 0 1-18.578587 30.964312 394.709909 394.709909 0 0 0-86.63202 49.474845 39.470991 39.470991 0 0 1-37.157174 0L184.424802 214.980794 91.940187 375.859108l92.824882 55.667708a22.59374 22.59374 0 0 1 12.385725 30.964312c0 18.578587-6.192862 30.964312-6.192862 49.474845a136.106865 136.106865 0 0 0 5.852595 49.474846 22.59374 22.59374 0 0 1-12.385725 30.964312l-92.484615 55.735761 92.824882 160.878314 92.824882-55.667707a39.470991 39.470991 0 0 1 37.157175 0 394.709909 394.709909 0 0 0 86.632019 49.474845 34.026716 34.026716 0 0 1 18.170267 30.828205z",
    },
    path2: {
      d: "M512.374294 697.615737a185.649764 185.649764 0 1 1 185.649764-185.649764 182.315146 182.315146 0 0 1-185.649764 185.649764z m0-309.370904a123.72114 123.72114 0 1 0 123.72114 123.72114 124.129461 124.129461 0 0 0-123.72114-123.72114z",
    },
  },
  size: {
    width: 116,
    height: 40,
  },
  ports: {
    items: [
      {
        group: "in",
      },
      {
        group: "out",
      },
    ],
  },
});
// 判断节点 节点
export const fork = Graph.registerNode("fork", {
  inherit: "base-cell",
  attrs: {
    label: {
      text: "判断节点",
    },
    path: {
      d: "M140.653714 73.142857A67.510857 67.510857 0 0 0 73.142857 140.653714v742.692572a67.510857 67.510857 0 0 0 67.510857 67.510857h742.692572a67.510857 67.510857 0 0 0 67.510857-67.510857V140.653714A67.510857 67.510857 0 0 0 883.346286 73.142857z m-4.096-73.142857h750.884572A136.557714 136.557714 0 0 1 1024 136.557714v750.884572a136.557714 136.557714 0 0 1-136.557714 136.484571H136.484571A136.557714 136.557714 0 0 1 0 887.442286V136.557714A136.630857 136.630857 0 0 1 136.484571 0z m18.578286 827.538286l672.256-672.256 51.712 51.638857-672.329143 672.256-51.638857-51.638857zM258.925714 279.917714l77.677715-77.458285a36.571429 36.571429 0 0 1 51.638857 51.638857L310.125714 331.629714l77.604572 77.604572a36.571429 36.571429 0 1 1-51.638857 51.638857L258.925714 383.341714 181.321143 460.946286a36.571429 36.571429 0 0 1-51.712-51.712l77.458286-77.604572-77.458286-77.604571a36.571429 36.571429 0 1 1 51.712-51.638857l77.604571 77.531428z m564.077715 340.918857a36.571429 36.571429 0 1 1 55.076571 48.201143l-191.926857 196.169143a36.571429 36.571429 0 0 1-53.394286 1.828572l-98.962286-83.821715a36.571429 36.571429 0 0 1 51.712-51.712l71.314286 56.173715 166.253714-166.765715z",
    },
  },
  size: {
    width: 116,
    height: 40,
  },
  ports: {
    items: [
      {
        group: "in",
      },
      {
        group: "out",
      },
      {
        group: "out",
      },
    ],
  },
});

// vue 渲染的节点

// er节点
export const vueER = Graph.registerVueComponent("er-node", {
  template: `<er-node></er-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    ErNode,
  },
});

export const er = Graph.registerNode("er", {
  inherit: "vue-shape",
  width: 278,
  height: 230,
  component: "er-node",
  ports: {
    groups: cloneDeep(vuePortsGroups),
    items: [
      {
        group: "in",
      },
      {
        group: "out",
        args: { y: 40 },
      },
      {
        group: "out",
        args: { y: 60 },
      },
    ],
  },
});

// 开始节点
export const vueStart = Graph.registerVueComponent("start-node", {
  template: `<start-node></start-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    StartNode,
  },
});

export const start = Graph.registerNode("start", {
  inherit: "vue-shape",
  width: 210,
  height: 38,
  component: "start-node",
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "out",
        zIndex: 99,
      },
    ],
  },
});

// 状态机节点
export const vueState = Graph.registerVueComponent("state-node", {
  template: `<state-node></state-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    StateNode,
  },
});

export const state = Graph.registerNode("state", {
  inherit: "vue-shape",
  width: 278,
  height: 68,
  component: "state-node",
  ports: {
    groups: cloneDeep(vuePortsGroups),
    items: [
      {
        group: "in",
      },
    ],
  },
});

// 转移节点
export const vueTransfer = Graph.registerVueComponent("transfer-node", {
  template: `<transfer-node></transfer-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    TransferNode,
  },
});

export const transfer = Graph.registerNode("transfer", {
  inherit: "vue-shape",
  width: 278,
  height: 198,
  component: "transfer-node",
  ports: {
    groups: cloneDeep(vuePortsGroups),
    items: [
      {
        group: "in",
      },
    ],
  },
});

// 部队节点
export const vueTroops = Graph.registerVueComponent("troops-node", {
  template: `<troops-node></troops-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    TroopsNode,
  },
});

export const troops = Graph.registerNode("troops", {
  inherit: "vue-shape",
  width: 250,
  height: 66,
  component: "troops-node",
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "in",
      },
      {
        group: "out",
      },
    ],
  },
});

// 编组子节点
export const vueSub = Graph.registerVueComponent("sub-node", {
  template: `<sub-node></sub-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    SubNode,
  },
});

export const sub = Graph.registerNode("sub", {
  inherit: "vue-shape",
  width: 40,
  height: 200,
  component: "sub-node",
  zIndex: 99,
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "in",
        zIndex: 99,
      },
    ],
  },
});

// 所有编组节点
export const vueAll = Graph.registerVueComponent("all-node", {
  template: `<all-node></all-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    AllNode,
  },
});

export const all = Graph.registerNode("all", {
  inherit: "vue-shape",
  width: 240,
  height: 66,
  component: "all-node",
  zIndex: 99,
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "out",
      },
    ],
  },
});
// 编制管理子节点
export const vueFormation = Graph.registerVueComponent("formation-node", {
  template: `<formation-node></formation-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    FormationNode,
  },
});

export const formation = Graph.registerNode("formation", {
  inherit: "vue-shape",
  width: 40,
  height: 200,
  component: "formation-node",
  zIndex: 99,
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "in",
        zIndex: 99,
      },
      {
        group: "out",
      },
    ],
  },
});

// 兵力分配子节点
export const disSub = Graph.registerNode("disSub", {
  inherit: "vue-shape",
  width: 40,
  height: 200,
  component: "formation-node",
  zIndex: 99,
  ports: {
    groups: cloneDeep(disabledPortsGroups),
    items: [
      {
        group: "in",
        zIndex: 99,
      },
      {
        group: "out",
      },
    ],
  },
});

// 兵力分配编组节点
export const vueDistribute = Graph.registerVueComponent("distribute-node", {
  template: `<distribute-node></distribute-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    DistributeNode,
  },
});

export const distribute = Graph.registerNode("distribute", {
  inherit: "vue-shape",
  width: 240,
  height: 66,
  component: "distribute-node",
  zIndex: 99,
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "in",
      },
      {
        group: "out",
      },
    ],
  },
});

// 编组节点
export const vueMarshal = Graph.registerVueComponent("marshal-node", {
  template: `<marshal-node></marshal-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    MarshalNode,
  },
});

export const marshal = Graph.registerNode("marshal", {
  inherit: "vue-shape",
  width: 240,
  height: 66,
  component: "marshal-node",
  zIndex: 99,
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "in",
      },
      {
        group: "out",
      },
    ],
  },
});

//  体系节点
export const vueCount = Graph.registerVueComponent("count-node", {
  template: `<count-node></count-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    CountNode,
  },
});

export const count = Graph.registerNode("count", {
  inherit: "vue-shape",
  width: 46,
  height: 200,
  component: "count-node",
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "in",
        zIndex: 99,
      },
      {
        group: "out",
        zIndex: 99,
      },
    ],
  },
});

// 指标节点
export const vueNorm = Graph.registerVueComponent("norm-node", {
  template: `<norm-node></norm-node>`,
  data() {
    return {};
  },
  methods: {},
  components: {
    NormNode,
  },
});

export const norm = Graph.registerNode("norm", {
  inherit: "vue-shape",
  width: 46,
  height: 200,
  component: "norm-node",
  ports: {
    groups: cloneDeep(startPortsGroups),
    items: [
      {
        group: "in",
        zIndex: 99,
      },
      {
        group: "out",
        zIndex: 99,
      },
    ],
  },
});
