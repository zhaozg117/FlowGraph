/* 如果你不知道自己在做什么，请勿更改本配置内容*/

import { initformData, defaultFormData } from "./nodeData";
import edgeList from "./edges";
import { graphTheme, pageTheme } from "../theme/index.js";
// 节点数列表
const stencilList = [
  { label: "判断节点", value: "fork" },
  { label: "算法组件", value: "pipeline" },
  { label: "数据表组件", value: "er" },
  { label: "状态机组件", value: "state" },
  { label: "开始组件", value: "start" },
  { label: "转移组件", value: "transfer" }
];
// dag-edge 二次贝塞尔曲线边的配置数据
const curveEdage = {
  attrs: {
    line: {
      stroke: "#2CFEFF", // #e52e1a
      strokeWidth: 1,
      targetMarker: {
        name: "classic",
        size: 8
      }
    }
  },
  connector: {
    name: "curve"
  },
  defaultLabel: {
    markup: [
      {
        tagName: "rect",
        selector: "body"
      },
      {
        tagName: "text",
        selector: "label"
      }
    ],
    attrs: {
      label: {
        fontSize: 14,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
        fill: "#2CFEFF"
      }
    },
    position: {
      distance: 0.5
    }
  },
  // labels: "是",
  router: {
    name: "manhattan"
  },
  zIndex: 0
};

// 节点默认样式

const nodeStyle = {
  start: {
    position: {
      x: 0,
      y: 0
    },
    size: {
      width: 180,
      height: 38
    },
    ports: [
      {
        group: "out",
        id: ""
      }
    ]
  },
  state: {
    position: { x: 0, y: 0 },
    size: { width: 278, height: 228 },
    ports: [
      { group: "in", id: "" },
      { group: "out", id: "", args: { y: 0 } }
    ]
  },
  transfer: {
    position: { x: 0, y: 0 },
    size: { width: 278, height: 198 },
    ports: [{ group: "in", id: "" }]
  }
};

// dag-node节点链接桩群组的配置数据
const commonPortsGroups = {
  in: {
    position: "left",
    attrs: {
      circle: {
        r: 4,
        magnet: "passive",
        fill: "#2cfeff",
        fillOpacity: "0.15",
        stroke: "#2cfeff",
        strokeOpacity: "0.6",
        strokeWidth: 1,
        style: {
          visibility: "visible"
        }
      },
      zIndex: 99
    }
  },
  out: {
    position: {
      name: "right",
      args: { strict: true }
    },
    attrs: {
      circle: {
        r: 4,
        magnet: true,
        fill: "#2cfeff",
        fillOpacity: "0.15",
        stroke: "#2cfeff",
        strokeOpacity: "0.6",
        strokeWidth: 1,
        style: {
          visibility: "visible"
        }
      }
    },
    zIndex: 99
  }
};

// start-shape 节点链接桩群组的配置数据
const startPortsGroups = {
  in: {
    position: {
      name: "top"
    },
    attrs: {
      circle: {
        r: 5,
        magnet: true,
        fill: "#79B8E8",
        fillOpacity: "1",
        stroke: "#79B8E8",
        strokeOpacity: "1",
        strokeWidth: 1,
        style: {
          visibility: "visible"
        }
      }
    },
    zIndex: 99
  },
  out: {
    position: {
      name: "bottom"
    },
    attrs: {
      circle: {
        r: 5,
        magnet: true,
        fill: "#79B8E8",
        fillOpacity: "1",
        stroke: "#79B8E8",
        strokeOpacity: "1",
        strokeWidth: 1,
        style: {
          visibility: "visible"
        }
      }
    },
    zIndex: 99
  }
};

// vue-shape 节点链接桩群组的配置数据

const vuePortsGroups = {
  in: {
    position: {
      name: "absolute",
      args: { x: 0, y: 20 }
    },
    attrs: {
      circle: {
        r: 5,
        magnet: "passive",
        fill: "#79B8E8",
        fillOpacity: "1",
        stroke: "#79B8E8",
        strokeOpacity: "1",
        strokeWidth: 1,
        style: {
          visibility: "visible"
        }
      }
    },
    zIndex: 20
  },
  out: {
    position: {
      name: "absolute",
      args: { x: 277, y: 30 }
    },
    attrs: {
      circle: {
        r: 5,
        magnet: true,
        fill: "#79B8E8",
        fillOpacity: "1",
        stroke: "#79B8E8",
        strokeOpacity: "1",
        strokeWidth: 1,
        style: {
          visibility: "visible"
        }
      }
    },
    zIndex: 20
  }
};

//  禁止链接桩群组的配置数据
const disabledPortsGroups = {
  in: {
    position: {
      name: "top"
    },
    attrs: {
      circle: {
        r: 5,
        magnet: false,
        fill: "#79B8E8",
        fillOpacity: "1",
        stroke: "#79B8E8",
        strokeOpacity: "1",
        strokeWidth: 1,
        style: {
          visibility: "visible"
        }
      }
    },
    zIndex: 99
  },
  out: {
    position: {
      name: "bottom"
    },
    attrs: {
      circle: {
        r: 5,
        magnet: false,
        fill: "#79B8E8",
        fillOpacity: "1",
        stroke: "#79B8E8",
        strokeOpacity: "1",
        strokeWidth: 1,
        style: {
          visibility: "visible"
        }
      }
    },
    zIndex: 99
  }
};
export {
  initformData,
  defaultFormData,
  stencilList,
  curveEdage,
  edgeList,
  commonPortsGroups,
  startPortsGroups,
  disabledPortsGroups,
  vuePortsGroups,
  nodeStyle,
  graphTheme,
  pageTheme
  // conditionOptions,
  // actionOptions
  // entityTree
};
