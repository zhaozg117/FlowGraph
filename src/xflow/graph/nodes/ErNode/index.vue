<template>
  <div class="entity-container fact">
    <div class="content fact">
      <div class="head">
        <div>
          <i class="el-icon-s-fold type" />
          <span>{{ nodeData.name }}</span>
        </div>
        <i class="el-icon-more more" />
      </div>
      <div v-if="nodeData.properties" class="body">
        <el-input
          ref="node-input"
          v-model="val"
          placeholder="请输入文本"
          @click.native.prevent="fetchFocus('node-input')"
        ></el-input>
        <div
          v-for="item in nodeData.properties"
          :key="item.propertyId"
          class="body-item"
        >
          <div class="name">
            <span class="fk">FK</span>
            {{ item.name }}
          </div>
          <div class="type">{{ item.propertyType }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const mockProperties = [
  {
    propertyId: "propertyId1",
    name: "业务日期",
    propertyType: "string",
    isPK: true
  },
  {
    propertyId: "propertyId2",
    name: "交易号1",
    propertyType: "bigint",
    isFK: true
  },
  {
    propertyId: "propertyId3",
    name: "最长显示的表单名最长显示的表单名",
    propertyType: "string"
  },
  {
    propertyId: "propertyId4",
    name: "交易支付外键",
    propertyType: "string"
  },
  {
    propertyId: "propertyId5",
    name: "卖家支付日期",
    propertyType: "string"
  },
  {
    propertyId: "propertyId6",
    name: "网商银行",
    propertyType: "string"
  }
];
export default {
  name: "NodeTest",
  data() {
    return {
      val: "",
      nodeData: {
        entityId: "fact_1",
        name: "业务表",
        entityType: "FACT",
        properties: mockProperties,
        x: 550,
        y: 400,
        width: 214,
        height: 248
      }
    };
  },
  inject: ["getGraph", "getNode"],
  mounted() {
    //  // console.log("getGraph",this.getGraph())
    //  // console.log("getNode",this.getNode())
  },
  methods: {
    fetchFocus(ref) {
      this.$refs[ref].focus();
    },
    getCls() {
      // if (entity.entityType === EntityType.FACT) {
      //   return 'fact';
      // } else if (entity.entityType === EntityType.DIM) {
      //   return 'dim';
      // } else {
      //   return 'other';
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
