<template>
  <div
    class="container"
    :class="{ 'disabled-pointer-events': forbiddenChildePointerEvents }"
    @dragenter="Handlethrottle(true)"
    @dragleave="Handlethrottle(false)"
    @drop="handleDrop"
    @dragover.prevent
  >
    <div v-if="nodeData.id" class="title" @dblclick.prevent.stop="openEdit">
      <el-form
        :model="nodeData"
        :rules="rulesForm"
        :ref="nodeData.id + 'Form'"
        label-position="top"
        label-width="80px"
        size="mini"
      >
        <el-form-item prop="name" class="first-item" label="">
          <el-input
            type="text"
            ref="inputName"
            placeholder="请输入节点名称"
            maxlength="15"
            v-if="isEdit || !isValids"
            v-model="nodeData.name"
            @change="setIsUpdate"
            @click.native="fetchFocus('inputName')"
          ></el-input>
          <span v-else>{{ nodeData.name }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../../../index.js";
import { throttle } from "lodash";
export default {
  name: "StartNode",
  data() {
    return {
      nodeData: {
        id: "",
        name: "",
        list: []
      },
      currentNode: null,
      isEdit: false,
      isValids: false,
      isChange: false,
      rulesForm: {
        name: [
          { required: true, message: "请输入节点名称", trigger: "blur" },
          { min: 0, max: 20, message: "最多输入20个字符", trigger: "blur" }
        ]
      },
      forbiddenChildePointerEvents: false
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
      }
    }
  },
  inject: ["getGraph", "getNode"],
  created() {
    this.currentNode = this.getNode();
    this.initNodeData();
    this.registerEvent();
  },
  methods: {
    // 初始化节点data数据,并监听
    initNodeData() {
      let nodeData = this.currentNode.getData();
      Object.assign(this.nodeData, nodeData);
      if (nodeData.name) {
        this.validateNode();
      }
    },
    registerEvent() {
      this.getGraph().on("node:unselected", ({ cell }) => {
        // console.log("unselected", cell, this.currentNode);
        if (cell.id === this.currentNode.id) {
          this.isEdit = false;
          if (!this.nodeData.name) {
            this.validateNode();
          } else {
            this.isChange && this.setNodeInfo();
          }
        }
      });
      this.currentNode.on("change:position", ({ cell }) => {
        this.setIsUpdate();
      });
      this.currentNode.on("change:data", ({ current }) => {
        this.nodeData = current;
      });
    },
    fetchFocus(ref) {
      this.$refs[ref] && this.$refs[ref].focus();
    },
    // 设置当前节点data的数据
    async setNodeInfo() {
      let options = {
        silent: false,
        overwrite: true
      };
      await this.validateNode();
      this.currentNode.setData(this.nodeData, options);
      this.isChange = false;
    },
    validateNode() {
      if (this.$refs[this.nodeData.id + "Form"]) {
        // console.log("nodeData", JSON.parse(JSON.stringify(this.nodeData)));
        this.$refs[this.nodeData.id + "Form"].validate((valid, object) => {
          this.isValid = valid;
          // console.log("valid", valid, object);
        });
      } else {
        this.isValid = true;
      }
    },
    openEdit(val) {
      this.isEdit = true;
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
      this.forbiddenChildePointerEvents = true;
      // 当可拖动的元素进入可放置的目标高亮目标节点
      // if (event.target.className == "container") {
      //   event.target.style.background = "purple";
      // }
    },
    Handlethrottle: throttle(
      function (bol) {
        // console.log("Handlethrottle", bol);
        this.forbiddenChildePointerEvents = bol;
      },
      10,
      {
        leading: true,
        trailing: false
      }
    ),
    handleDrop(event) {
      this.forbiddenChildePointerEvents = false;
      const { dataTransfer } = event;
      if (dataTransfer) {
        let data = JSON.parse(dataTransfer.getData("dragComponent"));
        const { node, source } = data;
        if (node) {
          let arr = [node]; //this.filterDragData(node);
          let { list } = this.nodeData;
          if (list && list.length > 0) {
            list[0].children.push(...arr);
          } else if (list) {
            list.push(...arr);
          }
        }
        if (source == "tree") {
          this.dropSuccess(node);
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

      // console.log("arr", arr);
      eventBus.$emit("dropSuccess", JSON.stringify(arr));
    },
    removeNode(node) {
      eventBus.$emit("removeNode", JSON.stringify(node));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
