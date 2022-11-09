<template>
  <div class="team-tree">
    <VirtualTree
      :data="treeData"
      :props="treeProps"
      nodeKey="id"
      draggable
      @node-drag-start="nodeDragStart"
      @node-drag-over="nodeDragOver"
      @node-drag-end="nodeDragEnd"
    />
  </div>
</template>

<script>
import VirtualTree from "@/components/virtual-tree/tree.vue";
import { treeData } from "@/mock/data";
export default {
  components: { VirtualTree },
  data() {
    return {
      treeData,
      treeProps: {
        children: "children",
        label: "name",
        disabled: "disabled",
      },
    };
  },

  methods: {
    nodeDragStart(...args) {
      console.log("node drag start:", args);
    },
    nodeDragOver(...args) {
      console.log("node drag over:", args);
    },
    nodeDragEnd(...args) {
      console.log("node drag end:", args);
    },
  },
};
</script>

<style lang="scss" scoped>
.team-tree {
  height: 300px;
  width: 500px;
}
</style>
