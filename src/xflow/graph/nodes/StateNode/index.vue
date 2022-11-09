<template>
  <div
    @drop="drop($event)"
    @dragenter="dragEnter($event)"
    @dragover="allowDrop($event)"
    class="entity-container fact"
    :class="{ warn: warnStyle }"
  >
    <div class="content fact" :id="nodeData.id">
      <div class="head" @dblclick.prevent.stop="openEdit(nodeData.id)">
        <el-input
          type="text"
          ref="inputName"
          placeholder="请输入状态名称"
          maxlength="15"
          v-if="nodeData.id === nodeId || nodeData.name.length == 0"
          v-model="nodeData.name"
          @change="setIsUpdate"
          @click.native.prevent="fetchFocus('inputName')"
        ></el-input>
        <span v-else>{{ nodeData.name }}</span>
      </div>

      <div v-if="nodeData.nodes && nodeData.nodes.length > 0" class="body">
        <el-form
          :model="nodeData"
          :ref="nodeData.id + 'Form'"
          label-position="top"
          label-width="80px"
          size="mini"
        >
          <div
            v-for="(item, index) in nodeData.nodes"
            :key="item.id"
            @dblclick.prevent.stop="openEdit(item.id)"
            class="body-item"
          >
            <el-form-item
              :prop="`nodes[${index}].conds`"
              :rules="getRules(item.id, 'conds')"
              class="first-item"
              label="条件"
            >
              <!-- <el-select
                v-if="nodeId === item.id || !(validList[item.id] || isValid)"
                v-model="item.conds[0]"
                @change="setIsUpdate"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in conditionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->

              <!-- <el-cascader
                v-if="nodeId === item.id || !(validList[item.id] || isValid)"
                :props="cascaderOptions"
                :options="conditionOptions"
                :show-all-levels="false"
                v-model="item.conds[0]"
              ></el-cascader> -->
              <el-input
                v-if="nodeId === item.id || !(validList[item.id] || isValid)"
                v-model="item.conds[0]"
              ></el-input>

              <div v-else class="text-content text-row1">
                <el-tooltip
                  :disabled="item.conds[0] | conditionIsTooltip"
                  :content="item.conds[0] | conditionFilter"
                  :enterable="false"
                  effect="dark"
                  placement="bottom"
                >
                  <div class="text-ellipsis">
                    {{ item.conds[0] | conditionFilter }}
                  </div>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item
              v-if="index === 0"
              label="执行方案"
              :prop="`nodes[${index}].actions`"
              :rules="getRules(item.id, 'actions')"
            >
              <el-select
                :ref="'action' + index"
                v-if="nodeId === item.id || !(validList[item.id] || isValid)"
                v-model="item.actions"
                @change="setIsUpdate"
                multiple
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in actionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <!-- 当前状态为不可编辑的时候 -->
              <div v-else class="text-content text-row2">
                <el-tooltip
                  :disabled="item.actions | actionIsTooltip"
                  :content="transTip(item.actions)"
                  :enterable="false"
                  effect="dark"
                  popper-class="state-tooltip"
                  placement="bottom"
                >
                  <div>{{ transTip(item.actions) }}</div>
                </el-tooltip>
              </div>
            </el-form-item>
            <i
              v-if="isCanEdit"
              class="delete el-icon-close"
              @click.stop.prevent="deleteNode(index)"
            ></i>
          </div>
        </el-form>
      </div>
      <div
        v-if="isCanEdit"
        class="footer"
        @click.stop.prevent="debounceAddNode"
      >
        +
      </div>
    </div>
  </div>
</template>

<script>
// import { conditionOptions, actionOptions } from "../../../config";
import { debounce } from "lodash";
import { uuid } from "@/utils";
import { memory } from "../../../memory";
// import { cActionPlanApi } from "@/api";
const nodeHeight = 160;
export default {
  name: "StateNode",
  filters: {
    conditionFilter: (val) => {
      // let obj = memory.state.conditionList.find((item) => item.id === val);
      let obj = {};
      memory.state.conditionList.forEach((item) => {
        if (!obj?.name) {
          item?.children &&
            (obj = item.children.find((item) => item.id === val));
        }
      });

      return obj?.name || val;
    },
    actionFilter: (arr, vue) => {
      console.log(arr, "arr");
      console.log(vue, "that");
      let str = "";
      arr.forEach((item, index) => {
        let obj = memory.state.actionsList.find((sub) => sub.id === item);
        let name = obj?.name || item;
        str += index === 0 ? name : "、" + name;
      });
      return str;
    },
    conditionIsTooltip: (val) => {
      let bol = true;
      let obj = memory.state.conditionList.find((item) => item.id === val);
      bol = obj?.name ? obj.name.length < 21 : true;
      return bol;
    },
    actionIsTooltip: (arr) => {
      let bol = true;
      let str = "";
      arr.forEach((item, index) => {
        let obj = memory.state.actionsList.find((sub) => sub.id === item);
        let name = obj?.name || item;
        str += index === 0 ? name : "、" + name;
      });
      bol = str.length < 42;
      return bol;
    },
  },
  data() {
    return {
      isCanEdit: false,
      isChange: true,
      cascaderOptions: {
        emitPath: false,
        value: "id",
        checkStrictly: true,
        label: "name",
      },
      conditionOptions: [],
      actionOptions: [], // 执行方案列表
      currentNode: null,
      nodeId: "0",
      that_: this,
      validList: {
        conds: {},
        actions: {},
      },
      nodeData: {
        id: 0,
        name: "状态1",
        description: "描述",
        mark: {
          isCreate: true,
          isValid: false,
          isUpdate: false,
        },
        nodes: [],
      },
      warnStyle: false, // 预留校验失败样式
      maxLen: 21,
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
      },
    },
    // 用于过滤条件执行方案集是否编辑状态
    // nodeList: {
    //   get() {
    //     let list = this.nodeData.nodes;
    //     let nodeId = this.nodeId;
    //     let isValid = this.nodeData.mark.isValid;
    //     let validList = this.validList;
    //     let arr = list.map((item) => {
    //       item.isEdit = nodeId === item.id || !(validList[item.id] || isValid);
    //       return item;
    //     });
    //     return arr;
    //   },
    //   set(val) {
    //     this.nodeData.nodes = val;
    //   }
    // }
  },
  watch: {},
  inject: ["getGraph", "getNode"],
  created() {
    // this.getList();
    this.currentNode = this.getNode();
    this.initNodeData();
    this.isCanEdit = memory.state.isCanEdit;
    this.conditionOptions = memory.state.conditionList;
    // 执行方案列表
    // this.actionOptions = memory.state.actionsList;
  },
  mounted() {
    this.registerEvent();
    // // console.log("getGraph", this.getGraph());
    // // console.log("getNode", this.getNode());
  },
  methods: {
    // 方案列表
    // async getList() {
    //   let actionPlanName;
    //   let params = {
    //     actionPlanName,
    //     page: 1,
    //     size: 1000,
    //   };
    //   const res = await cActionPlanApi.search(params);
    //   const { object, success, msg } = res.data;
    //   if (success) {
    //     console.log(object.list, "object");
    //     this.actionOptions = object.list.map((item) => {
    //       return {
    //         id: item.id,
    //         name: item.scenarioName,
    //       };
    //     });
    //   } else {
    //     this.$message.error(msg);
    //   }
    // },
    transTip(val) {
      let str = "";
      val.forEach((item, index) => {
        let obj = this.actionOptions.find((sub) => sub.id === item);
        let name = obj?.name || item;
        str += index === 0 ? name : "、" + name;
      });
      return str;
    },
    // 初始化节点data数据,并监听
    initNodeData() {
      let nodeData = this.currentNode.getData();
      Object.assign(this.nodeData, nodeData);
    },
    registerEvent() {
      this.getGraph().on("node:unselected", ({ cell }) => {
        if (cell.id === this.currentNode.id) {
          this.nodeId = "0";
          this.isChange && this.setNodeInfo();
        }
      });
      this.currentNode.on("change:position", ({ cell }) => {
        this.setIsUpdate();
      });
      // this.currentNode.on("change:data", ({ current }) => {
      //   this.nodeData = current;
      // });
    },
    // 设置当前节点data的数据
    async setNodeInfo() {
      let options = {
        silent: false,
        overwrite: true,
      };
      await this.validateNode();
      this.currentNode.setData(this.nodeData, options);
      this.isChange = false;
    },
    getRules(key, type) {
      let text = type == "conds" ? "条件" : "执行方案";
      let validateFn = (rule, value, callback) => {
        if (value.length === 0) {
          this.validList[type][key] = false;
          this.isValid = false;
          callback(new Error("请选择" + text));
        } else {
          this.validList[type][key] = true;
          callback();
        }
        this.setSingelValid(key);
      };
      let obj = { validator: validateFn, trigger: "change" };
      return obj;
    },
    setSingelValid(key) {
      this.validList[key] =
        this.validList.actions[key] && this.validList.conds[key];
    },
    validateNode() {
      if (this.$refs[this.nodeData.id + "Form"]) {
        this.$refs[this.nodeData.id + "Form"].validate((valid) => {
          this.isValid = valid;
        });
      } else {
        this.isValid = true;
      }
      if (this.nodeData.name.length == 0) {
        this.isValid = false;
      }
    },
    debounceAddNode: debounce(function () {
      console.log(this.nodeData, "nodeData");
      this.addNode();
    }, 300),
    fetchFocus(ref) {
      this.$refs[ref] && this.$refs[ref].focus();
    },
    // filterActions(val) {
    //   // console.log(281, val);
    //   this.actionOptions = this.actionOptions.filter((item) => {
    //     return item.label.indexOf(val) !== -1;
    //   });
    // },
    openEdit(val) {
      this.isCanEdit && (this.nodeId = val);
    },
    addNode() {
      let id = uuid();
      let index = this.nodeData.nodes.length;
      let y = 38 + 80 + index * nodeHeight;
      this.nodeData.nodes.push({
        id: id,
        order: index,
        conds: [],
        actions: [],
      });
      const size = this.currentNode.size();
      this.currentNode.resize(size.width, size.height + nodeHeight);
      this.currentNode.addPort({
        id: id,
        group: "out",
        args: { y: y },
      });
      this.openEdit(id);
      this.setIsUpdate();
    },
    deleteNode(index) {
      let bol = this.nodeData.nodes.length != index + 1;
      let portId = this.nodeData.nodes[index].id;
      this.currentNode.removePort(portId);
      this.nodeData.nodes.splice(index, 1);
      const size = this.currentNode.size();
      this.currentNode.resize(size.width, size.height - nodeHeight);
      this.setIsUpdate();
      bol && this.updatePortArgs();
    },
    updatePortArgs() {
      this.nodeData.nodes.forEach((item, index) => {
        let y = 38 + 80 + index * nodeHeight;
        this.currentNode.setPortProp(item.id, "args", { y: y });
      });
    },
    setIsUpdate() {
      if (this.nodeData.mark.isUpdate === false) {
        this.nodeData.mark.isUpdate = true;
      }
      if (this.isChange === false) {
        this.isChange = true;
      }
    },
    allowDrop(event) {
      // // console.log("allowDrop", event);
      event.preventDefault();
    },
    dragEnter(event) {
      // console.log("dragEnter", event);
      event.preventDefault();
    },
    drop(event) {
      event.preventDefault();
      // console.log("drop", event);
      // var data=ev.dataTransfer.getData("Text");
      // ev.target.appendChild(document.getElementById(data));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
.fsm-select {
  .el-select__tags {
    & > span {
      width: 100%;
      display: flex;

      .el-tag.el-tag--info.el-tag--small.el-tag--light {
        &:first-child {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipse;
          white-space: nowrap;
        }
      }
    }
  }
}
.state-tooltip {
  max-width: 300px;
}
</style>
