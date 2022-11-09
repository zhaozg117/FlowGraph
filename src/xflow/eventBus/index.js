/*注：
   eventBus.$on("eventName",fn(val){})
   eventBus.$emit("eventName", value);
记得 eventBus.$off(); */

import Vue from "vue";
const eventBus = new Vue();
export default eventBus;
