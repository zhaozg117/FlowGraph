import { graphTheme } from "../theme/index.js";
//普通连线
const commonEdge = {
  zIndex: 1,
  attrs: {
    line: {
      sourceMarker: null,
      targetMarker: "classic",
      strokeWidth: 1.5,
      stroke: graphTheme.edgeStroke
    }
  }
};
// 智能路由连线配置
const stateEdge = {
  zIndex: 1,
  router: {
    name: "manhattan",
    args: {
      startDirections: ["right"],
      endDirections: ["left"]
    }
  },
  attrs: {
    line: {
      sourceMarker: null,
      targetMarker: "classic",
      strokeWidth: 1.5,
      stroke: graphTheme.edgeStroke
    }
  }
};
const startEdge = {
  zIndex: 1,
  router: {
    name: "manhattan",
    args: {
      startDirections: ["bottom"],
      endDirections: ["left"]
    }
  },
  attrs: {
    line: {
      sourceMarker: null,
      targetMarker: "classic",
      strokeWidth: 1.5,
      stroke: graphTheme.edgeStroke
    }
  }
};

const defaultEdge = {
  zIndex: 1,
  router: {
    name: "manhattan",
    args: {
      startDirections: ["bottom"],
      endDirections: ["top"]
    }
  },
  attrs: {
    line: {
      sourceMarker: null,
      targetMarker: "classic",
      strokeWidth: 1.5,
      stroke: graphTheme.edgeStroke
    }
  }
};

export default { stateEdge, startEdge, commonEdge, defaultEdge };
export { stateEdge, startEdge, commonEdge, defaultEdge };
