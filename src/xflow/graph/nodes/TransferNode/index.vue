<template>
  <div class="entity-container fact" :class="{ warn: warnStyle }">
    <div class="content fact" :id="nodeData.id">
      <div class="head">
        <el-input
          type="text"
          ref="inputName"
          placeholder="请输入状态名称"
          maxlength="15"
          v-if="false"
          v-model="nodeData.name"
          @change="setIsUpdate"
          @click.native.prevent="fetchFocus('inputName')"
        ></el-input>
        <span v-else>{{ nodeData.name }}</span>
      </div>

      <div class="body">
        <el-form
          :model="nodeData.nodes"
          :rules="formRules"
          :ref="nodeData.id + 'Form'"
          label-position="top"
          label-width="80px"
          size="mini"
        >
          <div @dblclick.prevent.stop="openEdit()" class="body-item">
            <el-form-item
              prop="styleId"
              class="first-item"
              label="选择转移规则"
            >
              <el-select
                v-if="isEdit || !isValid"
                v-model="nodeData.nodes.styleId"
                @change="changeStyleId"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in styleOptions"
                  :key="item[map.style.key]"
                  :label="item[map.style.name]"
                  :value="item[map.style.key]"
                >
                </el-option>
              </el-select>
              <div v-else class="text-content text-row1">
                <el-tooltip
                  :disabled="
                    nodeData.nodes.styleId
                      | isShowTooltip(styleOptions, 'style')
                  "
                  :content="
                    nodeData.nodes.styleId | nameFilter(styleOptions, 'style')
                  "
                  :enterable="false"
                  effect="dark"
                  placement="bottom"
                >
                  <div class="text-ellipsis">
                    {{
                      nodeData.nodes.styleId | nameFilter(styleOptions, "style")
                    }}
                  </div>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="选择转移状态" prop="targetStateId">
              <el-select
                v-if="isEdit || !isValid"
                v-model="nodeData.nodes.targetStateId"
                @change="setIsUpdate"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in stateOptions"
                  :key="item[map.state.key]"
                  :label="item[map.state.name]"
                  :value="item[map.state.key]"
                >
                </el-option>
              </el-select>

              <div v-else class="text-content text-row2">
                <el-tooltip
                  :disabled="
                    nodeData.nodes.targetStateId
                      | isShowTooltip(stateOptions, 'state')
                  "
                  :content="
                    nodeData.nodes.targetStateId
                      | nameFilter(stateOptions, 'state')
                  "
                  :enterable="false"
                  effect="dark"
                  placement="bottom"
                >
                  <div>
                    {{
                      nodeData.nodes.targetStateId
                        | nameFilter(stateOptions, "state")
                    }}
                  </div>
                </el-tooltip>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- <div
        v-if="isCanEdit"
        class="footer"
        @click.stop.prevent="debounceAddNode"
      >
        +
      </div> -->
    </div>
  </div>
</template>

<script>
import { memory } from "../../../memory";

const map = {
  style: {
    key: "styleId",
    name: "styleName"
  },
  state: {
    key: "uuid",
    name: "name"
  },
  child: "states"
};

export default {
  name: "TransferNode",
  filters: {
    nameFilter: (val, list, type) => {
      /*prop content 接收的必须是字符串类型*/
      let name = val ? toString(val) : "";
      if (list && list.length > 0) {
        let obj = list.find((item) => item[map[type]["key"]] === val);
        name = obj ? obj[map[type]["name"]] : val;
      }
      return name;
    },
    isShowTooltip: (val, list, type) => {
      let bol = true;
      if (list && list.length > 0) {
        let obj = list.find((item) => item[map[type]["key"]] === val);
        bol = obj ? obj[map[type]["name"]].length < 19 : true;
      }
      return bol;
    }
  },
  data() {
    return {
      map,
      styleOptions: [],
      stateOptions: [],
      isCanEdit: false,
      isChange: true,
      isEdit: false,
      currentNode: null,
      validList: {
        conds: {},
        actions: {}
      },
      nodeData: {
        id: 0,
        name: "转移节点",
        description: "描述",
        mark: {
          isCreate: true,
          isValid: false,
          isUpdate: false
        },
        nodes: {
          styleId: null,
          targetStateId: null
        }
      },
      formRules: {
        styleId: [
          {
            required: true,
            message: "请选择转移规则",
            trigger: "change"
          }
        ],
        targetStateId: [
          {
            required: true,
            message: "请选择转移状态",
            trigger: "change"
          }
        ]
      },
      warnStyle: false, // 预留校验失败样式
      maxLen: 21
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
      }
    }
  },
  watch: {},
  inject: ["getGraph", "getNode"],
  created() {
    this.isCanEdit = memory.state.isCanEdit;
    this.currentNode = this.getNode();
    this.initNodeData();
    this.setStyleOptions();
  },
  mounted() {
    this.registerEvent();
    // // console.log("getGraph", this.getGraph());
    // // console.log("getNode", this.getNode());
  },
  methods: {
    // 初始化节点data数据,并监听
    initNodeData() {
      let nodeData = this.currentNode.getData();
      // console.log("nodeData", nodeData);
      Object.assign(this.nodeData, nodeData);
    },
    registerEvent() {
      this.getGraph().on("node:unselected", ({ cell }) => {
        if (cell.id === this.currentNode.id) {
          this.isEdit = false;
          this.isChange && this.setNodeInfo();
        }
      });
      this.currentNode.on("change:position", ({ cell }) => {
        this.setIsUpdate();
      });
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
    fetchFocus(ref) {
      this.$refs[ref] && this.$refs[ref].focus();
    },
    openEdit() {
      this.isCanEdit && (this.isEdit = true);
    },
    setStyleOptions() {
      this.styleOptions = memory.state.styleList;
      let styleId = this.nodeData.nodes.styleId;
      if (styleId) {
        this.setStateOptions(styleId);
      }
    },
    changeStyleId(val) {
      this.nodeData.nodes.targetStateId = null;
      this.setStateOptions(val);
    },
    setStateOptions(val) {
      let id = Number(val);
      // console.log(288, id, this.styleOptions);
      // console.log(map.style.key);
      let style = this.styleOptions.find((item) => item[map.style.key] === id);
      // console.log("style", style);
      if (style) {
        this.stateOptions = style[map.child];
      }
    },
    setIsUpdate() {
      if (this.nodeData.mark.isUpdate === false) {
        this.nodeData.mark.isUpdate = true;
      }
      if (this.isChange === false) {
        this.isChange = true;
      }
    }
  }
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
</style>
