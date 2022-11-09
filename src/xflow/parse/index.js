import { defaultFormData, edgeList, nodeStyle } from "../graph/config";
import { cloneDeep } from "lodash";
const { startEdge, stateEdge } = edgeList;
// 节点和边减少不必要的样式数据
function cutCellStyle(cell) {
  let obj = {};
  if (cell.shape === "edge") {
    let style = {
      router: cell.router,
      attrs: cell.attrs
    };
    obj = {
      uuid: cell.id,
      shape: cell.shape,
      sourceCell: cell.source.cell,
      sourcePort: cell.source.port,
      targetCell: cell.target.cell,
      targetPort: cell.target.port,
      style: JSON.stringify(style)
    };
  } else {
    let data = cell.data;
    let style = {
      position: cell.position,
      size: cell.size,
      ports: cell.ports.items
    };
    // let nodes = data.nodes ? JSON.stringify(data.nodes) : JSON.stringify(data);
    obj = {
      uuid: cell.id,
      style: JSON.stringify(style),
      shape: cell.shape,
      data: data
      // nodes: nodes,
      // name: data.name,
      // description: data.description || ""
    };
  }
  return obj;
}
// 添加边的默认样式
function addEdgeStyle(edge, startUuid) {
  let bol = edge.sourceCell == startUuid;
  let defaultStyle = bol ? cloneDeep(startEdge) : cloneDeep(stateEdge);
  let style = edge.style ? JSON.parse(edge.style) : defaultStyle;
  let obj = {
    id: edge.uuid,
    shape: edge.shape || "edge",
    router: style?.router || {},
    attrs: style?.attrs,
    source: {
      cell: edge.sourceCell,
      port: edge.sourcePort
    },
    target: {
      cell: edge.targetCell,
      port: edge.targetPort
    },
    data: {
      mark: defaultFormData["edge"]["mark"]
    }
  };
  return obj;
}
// 添加节点的默认样式
function addNodeStyle(node) {
  let style = cloneDeep(nodeStyle[node.shape]);
  if (node.shape === "start") {
    style.ports[0].id = node.uuid + "-out";
  } else if (node.shape === "state") {
    style.ports = [];
    let nodes = node.nodes ? JSON.parse(node.nodes) : [];
    let height = 38 + 30 + 160 * nodes.length;
    style.size.height = height;
    let inPort = { group: "in", id: node.uuid + "-in" };
    style.ports.push(inPort);
    nodes.forEach((item, index) => {
      let y = 38 + 80 + index * 160;
      let outPort = {
        group: "out",
        id: item.id,
        args: { y: y }
      };
      style.ports.push(outPort);
    });
  } else if (node.shape === "transfer") {
    style.ports[0].id = node.uuid + "-in";
  }

  return style;
}
// 节点数据调整
function formatNode(node, isAuto) {
  let style = {};
  if (!node.style) {
    style = addNodeStyle(node);
  } else {
    style = isAuto ? addNodeStyle(node) : JSON.parse(node.style);
  }
  let nodeData = node.data;
  let defaultData = cloneDeep(
    defaultFormData[node.shape] || defaultFormData["default"]
  );
  let data = Object.assign({}, defaultData, nodeData);
  let obj = {
    id: node.uuid,
    shape: node.shape,
    position: style.position,
    size: style.size,
    ports: {
      items: style.ports
    },
    data: data
  };
  return obj;
}
// 服务端状态机数据转为x6图数据
function serverDataToGraphData(obj, isAuto = false) {
  let data = cloneDeep(obj);
  const { states, edges } = data;
  let cells = [];
  let startUuid = 0;
  states &&
    states.forEach((item) => {
      item.shape == "start" && (startUuid = item.uuid);
      let node = formatNode(item, isAuto);
      cells.push(node);
    });
  edges &&
    edges.forEach((item) => {
      let edge = addEdgeStyle(item, startUuid);
      cells.push(edge);
    });
  let grahpData = { cells: cells };
  return grahpData;
}

// 过滤转移节点和链接的边
function filterNode(data, shape = "transfer") {
  const { states, edges } = data;
  let uuids = [];
  let graph = {
    states: [],
    edges: []
  };
  if (states && states.length > 0) {
    states.forEach((item) => {
      if (item.shape === shape) {
        uuids.push(item.uuid);
      } else {
        graph.states.push(item);
      }
    });
  }
  if (edges && edges.length > 0 && uuids.length > 0) {
    graph.edges = edges.filter((item) => !uuids.includes(item.targetCell));
  } else {
    graph.edges = edges;
  }
  return graph;
}

// cells数据转为tree
function cellsToTree(arr) {
  return arr;
}

// 以后  tree数据转为cells
// function treeToCells(){};

const parse = {
  cutCellStyle,
  serverDataToGraphData,
  filterNode,
  cellsToTree
};

export default parse;
