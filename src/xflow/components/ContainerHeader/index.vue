<template>
  <div class="contain-top">
    <!-- 过滤 -->
    <filter-container :span="[23, 1]" :title-info="titleInfo" has-clear>
      <template #operateSlot>
        <el-button
          v-if="isCanEdit"
          class="filter-item"
          type="primary"
          @click="handleSave()"
          >保 存</el-button
        >
      </template>
    </filter-container>
    <div class="detail">
      <div class="detail-item">
        任务：
        <el-tooltip
          :content="ruleData.taskName"
          :enterable="false"
          :disabled="ruleData.taskName.length < 10"
          effect="dark"
          placement="bottom"
        >
          <span class="item-value">{{ ruleData.taskName }}</span>
        </el-tooltip>
      </div>
      <div class="detail-item">
        阶段：
        <el-tooltip
          :content="ruleData.stageName"
          :enterable="false"
          :disabled="ruleData.stageName.length < 10"
          effect="dark"
          placement="bottom"
        >
          <span class="item-value">{{ ruleData.stageName }}</span>
        </el-tooltip>
      </div>
      <div class="detail-item">
        样式：
        <el-tooltip
          :content="ruleData.styleName"
          :disabled="ruleData.styleName.length < 10"
          :enterable="false"
          effect="dark"
          placement="bottom"
        >
          <span class="item-value">{{ ruleData.styleName }}</span>
        </el-tooltip>
      </div>
      <div class="detail-item">
        描述：
        <el-tooltip
          :content="ruleData.description"
          :disabled="ruleData.description.length < 30"
          :enterable="false"
          effect="dark"
          placement="bottom-start"
        >
          <span class="item-value">{{ ruleData.description }}</span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { memory } from "../../memory";
export default {
  name: "",
  props: {
    ruleDetails: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isCanEdit: false,
      titleInfo: {
        title: ""
      },
      ruleData: {
        name: "",
        taskName: "",
        stageName: "",
        styleName: "",
        description: ""
      }
    };
  },
  watch: {
    ruleDetails: {
      handler(val) {
        if (val) {
          Object.assign(this.ruleData, val);
          this.titleInfo.title = val.name || "基础信息";
        }
      },
      immediate: true
    }
  },
  created() {
    this.isCanEdit = memory.state.isCanEdit;
  },
  methods: {
    handleSave() {
      this.$emit("saveState");
    }
  }
};
</script>

<style lang="scss" scoped>
.contain-top {
  height: 100%;
  display: flex;
  flex-direction: column;
  .detail {
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    color: #79b8e8;
    padding: 0 24px;
    width: 96%;
    .detail-item {
      margin-right: 2%;
      flex-shrink: 0;
      width: 10%;
      overflow: hidden;
      white-space: nowrap;
      letter-spacing: normal;
      text-overflow: ellipsis;
      &:last-child {
        flex-grow: 1;
        max-width: 62%;
      }
    }
    .item-value {
      cursor: pointer;
    }
  }
}
</style>
