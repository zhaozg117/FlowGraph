<template>
  <div class="container text-ellipsis">{{ nodeData.name }}</div>
</template>

<script>
export default {
  name: "StartNode",
  data() {
    return {
      nodeData: {
        name: "开始"
      }
    };
  },
  inject: ["getGraph", "getNode"],
  created() {
    this.currentNode = this.getNode();
    this.initNodeData();
  },
  methods: {
    // 初始化节点data数据,并监听
    initNodeData() {
      let nodeData = this.currentNode.getData();
      Object.assign(this.nodeData, nodeData);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../theme/index.scss";
.container {
  width: 100%;
  height: 100%;
  padding: 0 14px;
  font-size: 14px;
  // color: #79b8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(
    rgba(44, 254, 255, 0.18) 0%,
    rgba(44, 254, 255, 0) 100%
  );
  border: 1px solid $node-border-color-outline;
  color: $node-color-text-light;
}
</style>
<style lang="scss">
.x6-node-selected {
  .container {
    border-color: #2cfeff;
  }
}
</style>
