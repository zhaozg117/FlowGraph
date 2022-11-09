import "@antv/x6-vue-shape";
import _ from "lodash";
const x6VueShape = "vue-shape";
export default class CellController {
  constructor(flowGraph) {
    this.flowGraph = flowGraph;
    this.graph = flowGraph.graph;
  }
  /**
   * 添加单个节点
   * @param {T} nodeData 节点数据
   */
  addNode(nodeConfig) {
    const { id, shape, x, y, width, height, component, data, ...rest } =
      nodeConfig;
    this.graph.addNode({
      id,
      shape: shape ? shape : x6VueShape,
      x: x ? x : 0,
      y: y ? y : 0,
      width: width ? width : 100,
      height: height ? height : 100,
      data: data ? data : undefined,
      component: component,
      ...rest
    });
  }
  /**
   * 更新节点
   * @param {Node} node 节点实例
   * @param {NodeConfig} newNodeData 节点最新数据
   */
  updateNode(node, newNodeData) {
    //  数据不一致才更新数据
    if (!_.isEqual(node.data, newNodeData.data)) {
      node.setData(newNodeData.data);
    }
  }
}
