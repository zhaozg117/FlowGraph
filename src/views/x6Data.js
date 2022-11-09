export const x6Option = {
  // 节点
  nodes: [
    {
      id: "node1", // String，可选，节点的唯一标识
      x: 40, // Number，必选，节点位置的 x 值
      y: 40, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "hello", // String，节点标签
    },
    {
      id: "node2", // String，节点的唯一标识
      x: 160, // Number，必选，节点位置的 x 值
      y: 180, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "world", // String，节点标签
    },
  ],
  // 边
  edges: [
    {
      source: "node1", // String，必须，起始节点 id
      target: "node2", // String，必须，目标节点 id
    },
  ],
};

export const compileData = [
  {
    id: "aaaa",
    name: "合成一营",
    nodeType: "compile",
    originId: "aaaa-1",
    level: 1,
    children: [
      {
        id: "aaaa-2.1",
        name: "营部",
        nodeType: "compile",
        originId: "aaaa-2.1",
        level: 2,
        children: [],
      },
      {
        id: "aaaa-2.1",
        name: "突击连",
        nodeType: "compile",
        originId: "aaaa-2.1",
        level: 2,
        children: [],
      },
      {
        id: "aaaa-2.2",
        name: "火力连",
        nodeType: "compile",
        originId: "aaaa-2.2",
        level: 2,
        children: [],
      },
      {
        id: "aaaa-2.3",
        name: "支援保障连",
        nodeType: "compile",
        originId: "aaaa-2.3",
        level: 2,
        children: [],
      },
      {
        id: "aaaa-2.4",
        name: "警卫侦察连",
        nodeType: "compile",
        originId: "aaaa-2.4",
        level: 2,
        children: [],
      },
    ],
  },
];
