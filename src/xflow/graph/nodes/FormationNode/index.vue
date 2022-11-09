<template>
  <div class="container">
    <!-- <div class="node-icon"><i class="el-icon-s-tools"></i></div> -->
    <div class="title">{{ nodeData.name || nodeData.label }}</div>
  </div>
</template>

<script>
export default {
  name: "StartNode",
  data() {
    return {
      nodeData: {
        label: "编组字节点"
      },
      currentNode: null,
      change: false
    };
  },
  inject: ["getGraph", "getNode"],
  created() {
    this.currentNode = this.getNode();
    this.setNodeData();
    this.registerEvent();
  },
  methods: {
    // 节点data数据
    setNodeData() {
      let nodeData = this.currentNode.getData();
      Object.assign(this.nodeData, nodeData);
    },
    registerEvent() {
      this.currentNode.on("change:data", ({ current }) => {
        this.nodeData = current;
      });
      this.currentNode.on("change:position", ({ cell }) => {
        this.setIsUpdate();
      });
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
