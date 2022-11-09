import VirtualTree from "./tree.vue";

/* istanbul ignore next */
VirtualTree.install = function (Vue) {
  Vue.component(VirtualTree.name, VirtualTree);
};

export default VirtualTree;
