<template>
  <div
    class="container"
    :class="{ 'disabled-pointer-events': forbiddenChildePointerEvents }"
    @dragenter="Handlethrottle(true)"
    @dragleave="Handlethrottle(false)"
    @drop="handleDrop"
    @dragover.prevent
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 80"
      xmlns:xmlns="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(0, 12, 16,1)" />
          <stop offset="80%" stop-color="rgba(0, 66, 81,1)" />
          <stop offset="100%" stop-color="rgba(0, 66, 81,1)" />
        </linearGradient>

        <filter id="drop-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dx="0" dy="0" result="offsetblur" />
          <feFlood flood-color="rgba(44, 254, 255,0.8)" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        class="svg-polygon"
        fill="url(#linear)"
        points="36,0 264,0 300,40 264,80 34,80 0,40"
      />
      <text class="svg-title-text" x="50%" y="48%">{{ nodeData.name }}</text>
      <text class="svg-sub-text" x="50%" y="76%">
        兵力:{{ troops }}&nbsp;&nbsp; 装备:{{ equips }}
      </text>
    </svg>
  </div>
</template>

<script>
import { eventBus } from "../../../index.js";
import { throttle } from "lodash";
import { mergeTree, findLowestTree } from "../../distribute/index.js";
export default {
  data() {
    return {
      graph: null,
      currentNode: null,
      onceFn: true,
      nodeData: {
        id: "",
        name: "",
        list: [],
        mark: {
          isValid: true,
          isCreate: false,
          isUpdate: false,
        },
      },
      equips: 0, // 装备 equipTroops
      troops: 0, //兵力
      isEdit: false,
      isValids: false,
      isChange: false,
      rulesForm: {
        name: [
          { required: true, message: "请输入节点名称", trigger: "blur" },
          { min: 0, max: 20, message: "最多输入20个字符", trigger: "blur" },
        ],
      },
      forbiddenChildePointerEvents: false,
    };
  },
  computed: {
    isValid: {
      get() {
        let val = this.nodeData.mark.isValid;
        return val;
      },
      set(val) {
        this.nodeData.mark.isValid = val;
        this.isValids = val;
      },
    },
  },
  inject: ["getGraph", "getNode"],
  created() {
    this.currentNode = this.getNode();
    this.graph = this.getGraph();
    this.$nextTick(() => {
      this.getNodeData();
      this.registerEvent();
      this.getEquipTroops();
    });
  },
  methods: {
    // 初始化节点data数据,并监听
    getNodeData() {
      let nodeData = this.currentNode.getData();
      Object.assign(this.nodeData, nodeData);
      if (nodeData.name) {
        this.validateNode();
      }
    },
    registerEvent() {
      // this.getGraph().on("node:unselected", ({ cell }) => {
      //   // console.log("unselected", cell, this.currentNode);
      //   if (cell.id === this.currentNode.id) {
      //     this.isEdit = false;
      //     if (!this.nodeData.name) {
      //       this.validateNode();
      //     } else {
      //       this.isChange && this.setNodeInfo();
      //     }
      //   }
      // });
      this.currentNode.on("change:position", ({ cell }) => {
        this.setIsUpdate();
      });
      this.currentNode.on("change:data", (data) => {
        // console.log("marshal-change:data", data);
        const { current, previous, cell } = data;
        this.nodeData = current;
        this.getEquipTroops();
        // 没意义了，经常触发不了change:data
        // this.compareData(current, previous, cell);
      });
    },
    fetchFocus(ref) {
      this.$refs[ref] && this.$refs[ref].focus();
    },
    // 设置当前节点data的数据
    /*坑，这地方setData不会触发 change:data事件*/
    async setNodeInfo() {
      let options = {
        silent: false,
        overwrite: true,
      };
      await this.validateNode();
      // console.log("marshal-setData", this.nodeData);
      this.currentNode.setData(this.nodeData, options);
      this.isChange = false;
    },
    validateNode() {
      if (this.$refs[this.nodeData.id + "Form"]) {
        this.$refs[this.nodeData.id + "Form"].validate((valid, object) => {
          this.isValid = valid;
        });
      } else {
        this.isValid = true;
      }
    },
    setIsUpdate() {
      if (this.nodeData.mark.isUpdate === false) {
        this.nodeData.mark.isUpdate = true;
      }
      if (this.isChange === false) {
        this.isChange = true;
      }
    },
    handleEnter(event) {
      this.graph.resetSelection(this.currentNode.id);
      this.forbiddenChildePointerEvents = true;
      // 当可拖动的元素进入可放置的目标高亮目标节点
      // if (event.target.className == "container") {
      //   event.target.style.background = "purple";
      // }
    },
    Handlethrottle: throttle(
      function (bol) {
        this.forbiddenChildePointerEvents = bol;
      },
      10,
      {
        leading: true,
        trailing: false,
      }
    ),
    handleDrop(event) {
      this.forbiddenChildePointerEvents = false;
      const { dataTransfer } = event;
      if (dataTransfer) {
        let data = JSON.parse(dataTransfer.getData("dragComponent"));
        const { node, source } = data;
        /*先禁止节点之间的拖拽*/
        if (source == "property") {
          return false;
        }

        if (node) {
          // let arr = [node]; //this.filterDragData(node);
          let { list } = this.nodeData;
          let type = list[0]?.type;
          if (type && type === "default") {
            let arr = list[0].children;
            mergeTree(arr, node);
            // list[0].children.push(...arr);
          } else if (list) {
            mergeTree(list, node);
            // list.push(...arr);
          }
          this.getEquipTroops();
        }
        if (source == "tree") {
          this.dropSuccess(node);
          this.addChildNode(node);
        }
        if (source == "property") {
          this.removeNode(node);
        }
        this.setNodeInfo();
      }
    },
    // filterDragData(node){
    //   let arr=[];
    //   const fileterData = function (arr, newArr) {
    //     let list = arr.filter((item) => !item.disabled);
    //     if (list && list.length > 0) {
    //       newArr.children = list;
    //       list.forEach((item) => {
    //         if (item.children && item.children.length > 0) {
    //           fileterData(item.children, item);
    //         }
    //       });
    //     }
    //   };
    // },
    dropSuccess(node) {
      let arr = [];
      const getId = function (list) {
        list.forEach((item) => {
          arr.push(item.id);
          if (item.children && item.children.length > 0) {
            getId(item.children);
          }
        });
      };
      arr.push(node.id);
      if (node.children && node.children.length > 0) {
        getId(node.children);
      }
      eventBus.$emit("dropSuccess", JSON.stringify(arr));
    },
    removeNode(node) {
      eventBus.$emit("removeNode", JSON.stringify(node));
    },
    addChildNode(node) {
      let obj = {
        cell: this.currentNode,
        list: [node],
        type: "add", // add/remove
      };
      eventBus.$emit("updateChildNode", JSON.stringify(obj));
    },
    // 弃用，业务需求变了
    compareData(cur, pre, cell) {
      let obj = {
        cell: cell,
        list: [],
        type: "", // add/remove
      };
      let curList = this.getList(cur.list);
      let preList = this.getList(pre.list);

      if (
        this.onceFn &&
        preList.length > 0 &&
        preList.length == curList.length
      ) {
        preList = this.getChildNodes(cell);
      }
      if (curList.length > preList.length) {
        obj.type = "add";
        obj.list = this.diffArr(curList, preList);
      } else if (preList.length > curList.length) {
        obj.type = "remove";
        obj.list = this.diffArr(preList, curList);
      }
      if (obj.type) {
        eventBus.$emit("updateChildNode", JSON.stringify(obj));
      }
    },
    getList(list) {
      let tree = [];
      list.forEach((item) => {
        let { type, children } = item;
        let bol = children && children.length > 0;
        if (type == "default" && bol) {
          tree.push(...children);
        } else if (type !== "default") {
          tree.push(item);
        }
      });
      return tree;
    },
    getChildNodes(cell) {
      this.onceFn = false;
      let options = {
        incoming: false,
        outgoing: true,
      };
      let nodes = this.graph.getNeighbors(cell, options);
      let list = [];
      nodes &&
        nodes.forEach((node) => {
          if (node.shape == "sub") {
            let data = node.getData();
            list.push(data);
          }
        });
      return list;
    },
    diffArr(arr1, arr2) {
      let result = arr1.filter((item) => {
        return arr2.every((sub) => sub.id !== item.id);
      });
      return result;
    },
    getEquipTroops() {
      let arr = findLowestTree(this.nodeData.list);
      let equips = 0,
        troops = 0;
      arr.forEach((item) => {
        let { weapon } = item;
        if (weapon && weapon.length) {
          weapon.forEach((sub) => {
            let { number, equip, people, personal } = sub;
            let num = number || 1;
            let peo = people || 1;
            let len = personal.length || 1;
            troops += num * peo;
            equips += num + num * peo * len;
            if (equip) {
              let n = equip?.number || 1;
              equips += n;
            }
          });
        }
      });
      this.equips = equips;
      this.troops = troops;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
