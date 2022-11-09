<template>
  <div class="page">
    <el-input
      v-model="searchValue"
      prefix-icon="el-icon-search"
      clearable
      class="search-input"
      placeholder="请输入要搜索的内容"
    ></el-input>
    <div class="list-box">
      <el-tree
        ref="treeRef"
        :data="list"
        :default-expanded-keys="defaultExpanded"
        :highlight-current="false"
        :filter-node-method="filterNode"
        :props="treeProp"
        :check-on-click-node="true"
        node-key="id"
        accordion
        @node-click="handleNodeClick"
      >
        <div class="custom-tree-node" slot-scope="{ node }">
          <el-tooltip
            :content="node.label"
            :disabled="node.label.length < 13"
            :enterable="false"
            :open-delay="1000"
            effect="dark"
            placement="right-end"
          >
            <div class="text-ellipsis">{{ node.label }}</div>
          </el-tooltip>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
export default {
  name: "TreeList",
  props: {
    treeList: {
      type: Array,
      default: () => []
    },
    currentEntityId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [],
      searchValue: "",
      defaultExpanded: [],
      currentKey: null,
      treeProp: {
        disabled: function (data) {
          return data.disabled;
        }
      }
    };
  },
  watch: {
    searchValue(val) {
      this.$refs.treeRef.filter(val);
    },
    currentEntityId: {
      handler(val) {
        this.currentKey = val;
        this.$nextTick(() => {
          this.$refs.treeRef.setCurrentKey(val);
        });
      },
      immediate: true
    },
    treeList: {
      handler(val) {
        this.list = [];
        this.list.push(...val);
      },
      deep: true
    }
  },
  created() {
    this.list = [];
    this.list.push(...this.treeList);
    this.defaultExpanded[0] = this.list[0].children[0].id;
  },
  mounted() {
    this.$nextTick(() => {
      //
      // this.currentKey = this.list[0]["children"][0].id;
    });
  },
  methods: {
    handleNodeClick: debounce(function (data) {
      if (data.disabled) {
        this.$refs.treeRef.setCurrentKey(this.currentKey);
        return;
      } else {
        if (!data.children) {
          this.$emit("changeEntity", data.id);
        }
        if (data.id !== this.currentKey) {
          this.$refs.treeRef.setCurrentKey(this.currentKey);
        }
      }
    }, 1000),
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
