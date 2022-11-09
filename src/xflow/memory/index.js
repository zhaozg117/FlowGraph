// store 模式,请勿改成vuex，不支持vuex；
/*
 *静止编辑功能集合：
 * 节点中的（双击、x、+）
 * 工具栏
 * 右键、
 * 移动节点
 * 连线
 * 添加节点
 */

// const StyleList = [
//   {
//     styleId: 1,
//     styleName: "任务-阶段-样式",
//     states: [
//       {
//         uuid: "adf12",
//         name: "状态1",
//         styleId: 1,
//         styleName: "任务-阶段-样式"
//       }
//     ]
//   }
// ];

export const memory = {
  debug: true,
  state: {
    isCanEdit: true, // 是否可以编辑
    conditionList: [],
    actionsList: [],
    styleList: []
  },
  setCondition(newValue) {
    if (this.debug) console.log("setCondition triggered with", newValue);
    this.state.conditionList = newValue;
  },
  setActions(newValue) {
    if (this.debug) console.log("setActions triggered", newValue);
    this.state.actionsList = newValue;
  },
  setIsCanEdit(newValue) {
    if (this.debug) console.log("setIsCanEdit triggered", newValue);
    this.state.isCanEdit = newValue;
  },
  setStyleList(newValue) {
    if (this.debug) console.log("setStyleList triggered", newValue);
    this.state.styleList = newValue;
  },
  clearStore() {
    if (this.debug) console.log("clearStore triggered");
    this.state.conditionList = [];
    this.state.actionsList = [];
    this.state.styleList = [];
    this.state.isCanEdit = false;
  }
};

export default memory;
