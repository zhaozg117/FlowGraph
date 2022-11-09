/* eslint-disable no-unused-vars */
import { graphTheme } from "../config";
export default class EventController {
  constructor(flowGraph) {
    this.flowGraph = flowGraph;
    this.graph = flowGraph.graph;
  }

  registerEvent(events) {
    events &&
      events.forEach((event) => {
        switch (event.eventName) {
          case "scale": {
            this.graph.on("scale", ({ sx, sy, ox, oy }) => {
              const scale = sx;
              event.handler && event.handler({ scale });
            });
            break;
          }
          case "graph:mouseenter": {
            this.graph.on("graph:mouseenter", ({ e }) => {
              event.handler && event.handler();
            });
            break;
          }
          case "graph:mouseleave": {
            this.graph.on("graph:mouseleave", ({ e }) => {
              event.handler && event.handler();
            });
            break;
          }
          case "blank:mouseDown": {
            this.graph.on("blank:mousedown", ({ e, x, y }) => {
              event.handler && event.handler({ x, y });
            });
            break;
          }
          case "blank:mouseUp": {
            this.graph.on("blank:mouseup", ({ e, x, y }) => {
              event.handler && event.handler({ x, y });
            });
            break;
          }
          case "blank:click": {
            this.graph.on("blank:click", ({ e, x, y }) => {
              event.handler && event.handler({ x, y });
            });
            break;
          }
          case "node:added": {
            this.graph.on("node:added", ({ node }) => {
              // if (!this.flowGraph.isDataDrivenUpdate) {
              //   event.handler && event.handler({ node });
              // }
              this.flowGraph.bringNodesToFront([node]);
            });
            break;
          }
          case "node:removed": {
            this.graph.on("node:removed", ({ node }) => {
              // if (!this.flowGraph.isDataDrivenUpdate) {
              //   event.handler && event.handler({ node })
              // }
            });
            break;
          }
          case "edge:added": {
            this.graph.on("edge:added", ({ edge }) => {
              event.handler && event.handler({ edge });
              // if (!this.flowGraph.isDataDrivenUpdate) {
              //   event.handler && event.handler({ edge })
              // }
              // this.flowGraph.bringCellsToBack([edge])
            });
            break;
          }
          case "edge:removed": {
            this.graph.on("edge:removed", ({ edge }) => {
              if (this.isDeleteX6DefaultEdge) {
                return;
              }
              // if (!this.flowGraph.isDataDrivenUpdate) {
              //   event.handler && event.handler({ edge })
              // }
            });
            break;
          }
          case "node:mousedown": {
            this.graph.on("node:mousedown", ({ e, view, x, y }) => {
              event.handler && event.handler({ node: view.cell, x, y });
            });
            break;
          }
          case "node:mousemove": {
            this.graph.on("node:mousemove", ({ e, view, x, y }) => {
              event.handler && event.handler({ node: view.cell, x, y });
            });
            break;
          }
          case "node:mouseup": {
            this.graph.on("node:mouseup", ({ e, view, x, y }) => {
              event.handler && event.handler({ node: view.cell, x, y });
            });
            break;
          }
          case "node:click": {
            this.graph.on("node:click", ({ view }) => {
              event.handler && event.handler({ node: view.cell });
            });
            break;
          }
          case "node:dbclick": {
            this.graph.on("node:dblclick", ({ view }) => {
              event.handler && event.handler({ node: view.cell });
            });
            break;
          }
          case "edge:connected": {
            this.graph.on("edge:connected", (args) => {
              // let { isNew, edge }=args;
              // if (isNew) {
              //   const source = edge.getSourceCell();
              //   const rightPorts = source.getPortsByGroup("out");
              //   if (rightPorts.length === 2) {
              //     const sourcePortId = edge.getSourcePortId();
              //     const portIndex = source.getPortIndex(sourcePortId);
              //     const label = portIndex == 1 ? "是" : "否";
              //     edge.setLabels(label);
              //   }
              // }
              event.handler && event.handler(args);
            });
            break;
          }
          case "selection:changed": {
            this.graph.on(
              "selection:changed",
              ({ selected, removed, added }) => {
                event.handler && event.handler({ selected, removed, added });
                // this.flowGraph.bringCellsToFront(selected);
              }
            );
            break;
          }
          case "cell:click": {
            this.graph.on("cell:click", ({ cell }) => {
              event.handler && event.handler(cell);
            });
            break;
          }
          case "node:change:position": {
            this.graph.on("node:change:position", (args) => {
              /*可以用于节点的互斥功能的参考*/
              // const num=10;
              // const {current,node}=args;
              // const size =node.size();
              // const {x,y,width,height}={...current,...size}
              // const options={strict:false}
              // const cellViews =  this.graph.findViewsInArea(x-num,y-num,width+num,height+num,options);
              // console.log(x,y,width,height);
              // console.log("cellViews",cellViews)
              // window.cellViews=cellViews;
              // cellViews.forEach(views=>views.update())
              let Edges = this.graph.getEdges();
              Edges.forEach((edge) => {
                this.graph.findViewByCell(edge).update();
              });
            });
            break;
          }
          case "cell:selected": {
            this.graph.on("cell:selected", ({ cell, e }) => {
              if (cell.isEdge()) {
                cell.attr("line/stroke", graphTheme.edgeSelected);
                cell.attr("line/strokeWidth", 2.5);
              }
              event.handler && event.handler(cell, e);
            });
            break;
          }
          case "cell:unselected": {
            this.graph.on("cell:unselected", ({ cell }) => {
              if (cell.isEdge()) {
                cell.attr("line/stroke", graphTheme.edgeStroke);
                cell.attr("line/strokeWidth", 1);
              }
              // else {
              //   console.log("unselected", cell);
              // }
              event.handler && event.handler(cell);
            });
            break;
          }
          case "cell:added": {
            this.graph.on("cell:added", ({ cell }) => {
              event.handler && event.handler(cell);
            });
            break;
          }
          case "cell:removed": {
            this.graph.on("cell:removed", ({ cell }) => {
              event.handler && event.handler(cell);
            });
            break;
          }
          /*因state节点里不想重新获取data数据，先不在这监听修改了*/
          case "node:change:data": {
            this.graph.on("node:change:data", (args) => {
              event.handler && event.handler(args);
            });
            break;
          }
          case "blank:mouseup": {
            this.graph.on("blank:mouseup", ({ e, x, y }) => {
              event.handler && event.handler(e, x, y);
            });
            break;
          }
          default: {
            break;
          }
        }
      });
  }
}
