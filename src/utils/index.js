export function genRenderComponentFunction(context, refName) {
  return function (componentOption, props = {}, options = {}) {
    if (context.$refs[refName]) {
      return context.$refs[refName].renderComponent(
        componentOption,
        props,
        options
      );
    }
  };
}
/**
 * =======================================================  辅助函数库  =======================================================
 * 提供一些常用的复杂函数
 */

/**
 * ================================= (>^ω^<) =============================================
 * @param: -len 长度
 * @param: -radix 基数
 * @return: String
 * @description: 该方法会生成一串随机字符串,可用作生成唯一id
 */
export function uuid(len = 10, radix = 24) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
}

/**
 * ================================= (>^ω^<) =============================================
 * @author:
 * @time: 2018/12/12
 * @param: {time: Number, action: Function, context: Object}
 * @return: Function
 * @description: 防抖函数，context绑定上下文，对给定动作（action）在time毫秒内只执行一次，防止连续操作
 */
export function debounce(time, action, context) {
  let timer;
  return (...args) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      action.apply(context, args);
    }, time);
  };
}

/**
 * ================================= (>^ω^<) =============================================
 * @author:
 * @time: 2018/12/12
 * @param: {delay: Number, action: Function, context: Object}
 * @return: Function
 * @description: 节流函数，context绑定上下文，对连续的给定动作（action）设为每隔delay毫秒执行一次
 */
export function throttle(delay, action, context) {
  let last = 0;
  return (...args) => {
    let curr = +new Date();
    if (curr - last > delay) {
      action.apply(context, args);
      last = curr;
    }
  };
}

/**
 * ================================= (>^ω^<) =============================================
 * @author:
 * @time: 2018/12/12
 * @param: -
 * @return: Function
 * @description: 将变量转换成json字符串，同时删除掉循环套用的属性
 */
export function stringify(v) {
  try {
    var seen = [];
    var json;
    json = JSON.stringify(v, function (key, val) {
      if (typeof val === "object") {
        if (seen.indexOf(val) >= 0) return;
        seen.push(val);
      }
      return val;
    });
    return json;
  } catch (e) {
    return e;
  }
}

/**
 * ================================= (>^ω^<) =============================================
 * @author: LoryHuang
 * @time: 2019/3/25
 * @param: {variable: String}
 * @return: Function
 * @description: 获取url参数
 */
export function getQueryVariable(variable) {
  let search = decodeURIComponent(window.location.href);
  let url = new URL(search);
  if (url.searchParams.has(variable)) {
    return url.searchParams.get(variable);
  } else {
    return false;
  }
  // let search = decodeURIComponent(window.location.search)
  // let query = search.substring(1)
  // let vars = query.split('&')
  // for (let i = 0; i < vars.length; i++) {
  //   let pair = vars[i].split('=')
  //   if (pair[0] === variable) { return pair[1] }
  // }
  // return (false)
}
/**
 * ================================= (>^ω^<) =============================================
 * @author: Linyj
 * @time: 2019/11/18
 * @param: {graph: graphData}
 * @return: Function
 * @description: 判断是否是连通图
 */
export function isConnectedGraph(graph) {
  let connected = false;
  let nodeIds = graph.nodes.map((v) => v.id);
  let connectedIds = [];
  let tempIds = [];
  connectedIds.push(nodeIds[0]);
  nodeIds.splice(0, 1);
  while (connectedIds.length) {
    tempIds.splice(0);
    graph.edges.forEach((e) => {
      if (connectedIds.includes(e.source)) {
        let index = nodeIds.findIndex((item) => item === e.target);
        if (index !== -1) {
          tempIds.push(e.target);
          nodeIds.splice(index, 1);
        }
      }
      if (connectedIds.includes(e.target)) {
        let index = nodeIds.findIndex((item) => item === e.source);
        if (index !== -1) {
          tempIds.push(e.source);
          nodeIds.splice(index, 1);
        }
      }
    });
    connectedIds = JSON.parse(JSON.stringify(tempIds));
  }
  if (!nodeIds.length) {
    connected = true;
  }
  return connected;
}

/**
 * get object type
 * @param obj
 */
export const getObjType = (obj) => {
  const toString = Object.prototype.toString;
  const typeMap = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
  };

  return typeMap[toString.call(obj)];
};

/**
 * deepClone
 * @param {Object} data
 * @returns {Object}
 */
export function deepClone(data) {
  const type = getObjType(data);
  let obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    // 不再具有下一层次
    return data;
  }
  if (type === "array") {
    for (let i = 0, len = data.length; i < len; i++) {
      data[i] = (() => {
        if (data[i] === 0) {
          return data[i];
        }
        return data[i];
      })();
      delete data[i].$parent;
      obj.push(deepClone(data[i]));
    }
  } else if (type === "object") {
    for (let key in data) {
      delete data.$parent;
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

/**
 *
 * @param {url地址} url
 */
export function openBrowser(url, offsetWidth = 200, offsetHeight = 200) {
  let width = document.body.clientWidth - offsetWidth;
  let height = document.body.clientHeight - offsetHeight;
  return window.open(
    url,
    uuid(8),
    `height=${height}, width=${width}, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=no, status=no`
  );
}

export const jsType = function (value) {
  return Object.prototype.toString.call(value);
};
export const isJSON = function (str) {
  if (typeof str == "string") {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
};

export function isStartAndEndRepeat(item) {
  return item.start === item.end;
}

// 交换数组元素 用于上移、下移数组元素
export function swapArrItems(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

const gaussBlur = function (imgData, radius) {
  radius *= 3; //不知为什么,我的模糊半径是 css中 filter:bulr 值的三倍时效果才一致。
  //Copy图片内容
  let pixes = new Uint8ClampedArray(imgData.data);
  const width = imgData.width;
  const height = imgData.height;
  let gaussMatrix = [],
    gaussSum,
    x,
    y,
    r,
    g,
    b,
    a,
    i,
    j,
    k,
    w;

  radius = Math.floor(radius);
  const sigma = radius / 3;

  a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  b = -1 / (2 * sigma * sigma);

  //生成高斯矩阵
  for (i = -radius; i <= radius; i++) {
    gaussMatrix.push(a * Math.exp(b * i * i));
  }

  //x 方向一维高斯运算
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      r = g = b = a = gaussSum = 0;
      for (j = -radius; j <= radius; j++) {
        k = x + j;
        if (k >= 0 && k < width) {
          i = (y * width + k) * 4;
          w = gaussMatrix[j + radius];

          r += pixes[i] * w;
          g += pixes[i + 1] * w;
          b += pixes[i + 2] * w;
          a += pixes[i + 3] * w;

          gaussSum += w;
        }
      }

      i = (y * width + x) * 4;
      //计算加权均值
      imgData.data.set(
        [r, g, b, a].map((v) => v / gaussSum),
        i
      );
    }
  }
  pixes.set(imgData.data);
  //y 方向一维高斯运算
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      r = g = b = a = gaussSum = 0;
      for (j = -radius; j <= radius; j++) {
        k = y + j;

        if (k >= 0 && k < height) {
          i = (k * width + x) * 4;
          w = gaussMatrix[j + radius];

          r += pixes[i] * w;
          g += pixes[i + 1] * w;
          b += pixes[i + 2] * w;
          a += pixes[i + 3] * w;

          gaussSum += w;
        }
      }
      i = (y * width + x) * 4;
      imgData.data.set(
        [r, g, b, a].map((v) => v / gaussSum),
        i
      );
    }
  }

  return imgData;
};
/**
 * 图片高斯模糊异步方法
 * @param URL       图片地址,需要跨域支持
 * @param r         模糊半径 {Int}
 * @param shrink    缩小比率 {Number}
 * @return {Promise}
 */
export const blur = (URL, r, shrink = 1) => {
  return new Promise((resolve, reject) => {
    const IMG = new Image();
    IMG.crossOrigin = "*"; //需要图片跨域支持

    IMG.onload = function () {
      const Canvas = document.createElement("CANVAS"); //大量使用可考虑只创建一次

      let w = IMG.width,
        h = IMG.height;

      //缩小比例不为1时 , 重新计算宽高比
      if (shrink !== 1) {
        w = Math.ceil(w / shrink);
        h = Math.ceil(h / shrink);
        r = Math.ceil(r / shrink);
      }

      //因为懒, 就全Try了, 实际上只 Try跨域错误 即可
      try {
        //设置Canvas宽高,获取上下文
        Canvas.width = w;
        Canvas.height = h;
        let ctx = Canvas.getContext("2d");

        ctx.drawImage(IMG, 0, 0, w, h);

        //提取图片信息
        let d = ctx.getImageData(0, 0, w, h);

        //进行高斯模糊
        let gd = gaussBlur(d, r, 0);

        //绘制模糊图像
        ctx.putImageData(gd, 0, 0);

        resolve(Canvas.toDataURL());
      } catch (e) {
        reject(e);
      }
    };
    IMG.src = URL;
  });
};

/**
 * Is html element
 * @param {HTMLElement} elm
 */
export function isHtmlElement(elm) {
  let doc = document.createElement("div");
  try {
    doc.appendChild(elm.cloneNode(true));
    return elm.nodeType == 1 ? true : false;
  } catch (e) {
    return elm == window || elm == document;
  }
}

export function parseFilePath(path) {
  const matchResult = path?.match(/8002/g);
  if (matchResult) {
    return path.replace(process.env.VUE_APP_LOCAL_FILEPATH, "/filePath");
  } else {
    return path;
  }
}

/**
 * 阿拉伯数字转中文汉字小写
 * @param num    阿拉伯数字 {Number}
 * @return {String}
 */
export function toChinesNum(num) {
  let changeNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]; //changeNum[0] = "零"
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum =
        (i == 0 && strArr[i] == 0
          ? ""
          : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
          ? ""
          : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) +
        newNum;
    }
    return newNum;
  };
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) noWan = "0" + noWan;
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

/**
 * [链式取值]
 *
 * @param   {Function}   fn            [于函数中返回的取值对象]
 * @param   {any}  defaultValue  [可选默认返回值]
 *
 * @return  {[type]}                   [return description]
 */
export function getValue(fn = () => null, defaultValue) {
  try {
    const result = fn();
    const nullish = [null, undefined];

    if (!result && nullish.includes(result))
      throw new Error(`get fn() error: ${result}`);

    return result;
  } catch (error) {
    // console.warn('get value error:', error)
    return defaultValue;
  }
}

/**
 * API then回调处理
 * @param {Object} res  [resolve参数]
 */
export function $thenBack(res) {
  const data = res?.data;
  const isError = !data?.success;

  if (isError) throw data;

  return data;
}

/**
 * API catch回调处理
 * @param {String} errPrefix  [自定义错误前缀]
 */
export function $catchBack(errPrefix = "request exception - ") {
  const t = this;

  return function (err) {
    const [backData, errorMsg] = [
      { ...err },
      errPrefix + (err?.msg || err?.errorMsg || ""),
    ];

    t.$message.error(errorMsg);

    return backData;
  };
}

/**
 * 链式访问器
 * @param {Any} result  [访问对象]
 * @param {String} path [访问链地址，例：'data.pageInfo.list.0']
 * @return {Any}
 */
export function chainAccess(result, path) {
  const aPath = path.split(".");
  let newRes = result[aPath.shift()];

  if (aPath.length && newRes) newRes = chainAccess(newRes, aPath.join("."));

  return newRes;
}

/**
 * item字段映射
 *
 * @param   {[Object]}  fieldsMap  [传入字段映射表，返回返]
 *
 * @return  {[Function]}             [return 映射转换]
 */
export function itemFiledsMap(fieldsMap) {
  return function (item = {}) {
    const formatItem = {};

    Object.entries(fieldsMap).forEach(([key, path]) => {
      formatItem[key] = chainAccess(item, path);
    });

    return formatItem;
  };
}

export function secondsToString(temp) {
  let str = "";
  const years = Math.floor(temp / 31536000);
  if (years) {
    str += years + "年";
  }
  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    str += days + "天";
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    str += hours + "小时";
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    str += minutes + "分钟";
  }
  const seconds = temp % 60;
  if (seconds) {
    str += seconds + "秒";
  }

  return str;
}

/**
 * 生成并行异步请求列表
 *
 * @param   {[Promise]}  apis  [Promise.all([...])]
 *
 * @return  {[Promise]}        [return description]
 */
export function genrateParallels(apis) {
  const parallels = apis.map((api) => (async () => await api)());

  return parallels;
}

/**
 * 请求提交定制确认
 * @param {String} tip  [确认提示语]
 * @param {Function} thenBack  [确认后执行回调]
 */
export function $confirmReq(tip = "", thenBack = () => null) {
  this.$confirm(tip, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then((res) => {
      setTimeout(() => thenBack(res), 300); // 避免遮罩层关闭时与下一个弹窗开启冲突
    })
    .catch(() => null);
}

/**
 * 接口请求封装
 *
 * @param   {[Promise]}  api  [接口]
 *
 * @return  {[Promise]}       [回调处理后的新接口]
 */
export function apiReq(api) {
  const { $thenBack, $catchBack } = this;

  return (...params) =>
    api(...params)
      .then($thenBack)
      .catch($catchBack());
}

/**
 * 文件下载
 *
 * @param   {[any]}  res  接口回调
 *
 * @return  {[type]}       [return description]
 */
export function $downloadFile(res) {
  const { data, headers } = res || {};
  const isError = !data;

  if (isError) throw res;

  const { "content-disposition": contDesc, "content-type": contType } =
    headers || {};

  const type = contType?.split(";").find((v) => v.includes("application"));
  const fileName = contDesc
    ?.split(";")
    .find((v) => v.includes("filename="))
    ?.replace("filename=", "");

  const decodeName = fileName ? decodeURIComponent(fileName) : "气象导出";

  const [blob, eLink] = [
    new Blob([data], { type }),
    document.createElement("a"),
  ];

  eLink.download = decodeName;
  eLink.style.display = "none";
  eLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eLink);
  eLink.click();
  URL.revokeObjectURL(eLink.href);
  document.body.removeChild(eLink);
}

/**
 * 下载二进制流文件，自定义类型及文件名
 * @param {Object} res // 接口返回值
 * @param {String} filename // 下载的文件名
 * @param {String} type  // 文件类型
 */
export function downLoadBinary(
  res,
  filename,
  type = "application/vnd.ms-excel"
) {
  let blob = new Blob([res.data], { type });
  const eLink = document.createElement("a");
  eLink.download = filename;
  eLink.style.display = "none";
  eLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eLink);
  eLink.click();
  URL.revokeObjectURL(eLink.href);
  document.body.removeChild(eLink);
}

/**
 * 树结构拉平为平铺数组
 * @param {Array} tree 树形结构数据
 * @param {String} children children字段名
 * @returns Array 平铺后的数组
 */
export const treeToArray = (tree, children = "children") => {
  return tree.reduce((pre, cur) => {
    return pre.concat([cur], treeToArray(cur[children] || [], children));
  }, []);
};

/**
 * 树结构转平铺对象
 * @param {Array} tree 树结构数据
 * @param {String} children children字段名
 * @param {String} idKey id字段名
 * @returns Object {key:value}
 */
export const treeToMap = (tree, children = "children", idKey = "id") => {
  return tree.reduce((pre, cur) => {
    return Object.assign(
      pre,
      { [idKey]: cur },
      treeToMap(cur[children] || [], children, idKey)
    );
  }, {});
};

/**
 * 过滤数结构数据
 * @param {any[]} nodes 树结构数据
 * @param {string} key 搜索关键字
 * @param {string[]} fields // 待匹配的字段列表
 * @returns any [] 过滤后的数据
 */
export function deepFilter(list, key, fields) {
  const reg = new RegExp(`^\\S*${key}\\S*$`, "ig");
  return list.filter((node) => {
    node.children = deepFilter(node.children, key, fields);
    const isMatched = fields.some((e) => reg.test(node[e] || ""));
    return isMatched || node.children.length;
  });
}

/**
 * 过滤数结构数据
 * @param {any[]} nodes 树结构数据
 * @param {string} key 搜索关键字
 * @param {string[]} fields // 待匹配的字段列表
 * @returns any [] 过滤后的数据
 */
export function treeFilter(nodes, key, fields) {
  const result = [];
  if (!Array.isArray(nodes) || !nodes.length) return result;
  const reg = new RegExp(`^\\S*${key}\\S*$`, "ig");
  for (const node of nodes) {
    // 带上父节点
    let subs = treeFilter(node.children, key, fields);
    const isMatched = fields.some((e) => reg.test(node[e] || ""));
    if (isMatched) {
      result.push(node);
    } else if (subs && subs.length) {
      node.children = subs;
      result.push(node);
    }

    //不带父节点
    // if (isMatched) {
    //   result.push(node);
    //   node.children = deepFilter(node.children, key, fields);
    // } else {
    //   result.push(...deepFilter(node.children, key, fields));
    // }
  }
  return result.length ? result : [];
}

/**
 * API工具组合
 *
 * @var {[type]}
 */
export const apiTools = { apiReq, $thenBack, $catchBack, $downloadFile };
