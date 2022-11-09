// cell data对象，新增时的初始值
const initformData = {
  default: {
    mark: {
      isValid: true,
      isCreate: true,
      isUpdate: false
    }
  },
  pipeline: {
    name: "策略编辑", // 标题
    description: "策略编辑", // 描述
    units: [], // 执行单元
    type: null, // 类型
    strategy: null, // 方式
    params: {
      targetType: null, //  攻击> 任务目标
      targetUnit: null, // 攻击> 固定目标
      distance: null, // 距离
      angle: null, // 角度
      duration: null, // 守卫 时长
      range: null, // 侦察、守卫 范围
      locations: null, // 新建地点
      paths: null, // 路径
      area: null // 区域
    }
  },
  er: {
    id: 0,
    name: "ER"
  },
  fork: {
    name: "判断节点",
    description: "判断节点",
    triggerType: null, // 触发条件
    targetUnit: null, // 目标单位
    statusUnit: null, // 单位状态
    targetArea: null, // 区域
    situationTime: null, // 态势时间
    countdown: null, // 倒计时
    selectTime: null // 指定时间点
  },
  start: {
    mark: {
      isValid: true,
      isCreate: true,
      isUpdate: false
    },
    name: "开始节点",
    description: "描述"
  },
  state: {
    id: 0,
    name: "状态",
    description: "描述",
    mark: {
      nodeId: "0",
      isValid: true,
      isCreate: true,
      isUpdate: false
    },
    nodes: []
  },
  transfer: {
    id: 0,
    name: "转移节点",
    description: "描述",
    mark: {
      isValid: true,
      isCreate: true,
      isUpdate: false
    },
    nodes: {
      targetStateId: null,
      styleId: null
    }
  },
  edge: {
    mark: {
      isValid: true,
      isCreate: true,
      isUpdate: false
    }
  },
  norm: {
    mark: {
      isValid: true,
      isCreate: true,
      isUpdate: false
    }
  },
  count: {
    mark: {
      isValid: true,
      isCreate: true,
      isUpdate: false
    }
  },
  troops: {
    mark: {
      isValid: false,
      isCreate: true,
      isUpdate: false
    },
    list: [
      {
        id: "a0001",
        label: "建制",
        disabled: false,
        type: "default",
        children: []
      },
      {
        id: "a0002",
        label: "配属",
        disabled: false,
        type: "default",
        children: []
      },
      {
        id: "a0003",
        label: "支援",
        disabled: false,
        type: "default",
        children: []
      }
    ]
  },
  marshal: {
    mark: {
      isValid: false,
      isCreate: true,
      isUpdate: false
    },
    list: []
  },
  sub: {
    mark: {
      isValid: false,
      isCreate: true,
      isUpdate: false
    }
  },
  formation: {
    mark: {
      isValid: true,
      isCreate: true,
      isUpdate: false
    }
  },
  all: {
    mark: {
      isValid: true,
      isCreate: true,
      isUpdate: false
    }
  }
};

// 默认数据
const defaultFormData = {
  default: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    }
  },
  start: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    },
    nodes: ""
  },
  state: {
    mark: {
      nodeId: "0",
      isValid: true,
      isCreate: false,
      isUpdate: false
    },
    nodes: []
  },
  transfer: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    },
    nodes: {
      targetStateId: null,
      styleId: null
    }
  },
  edge: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    }
  },
  norm: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    }
  },
  count: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    }
  },
  troops: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    },
    list: []
  },
  marshal: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    },
    list: []
  },
  sub: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    }
  },
  formation: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    }
  },
  all: {
    mark: {
      isValid: true,
      isCreate: false,
      isUpdate: false
    }
  }
};

export { initformData, defaultFormData };
