import { cloneDeep } from "lodash";
function reverseTree(tree, key = "id") {
  let targetData = {};
  const loops = function (data = [], parent) {
    return data.map((item) => {
      key = item.id;
      let children = item.children;
      delete item.children;
      const node = {
        parent,
        ...item,
      };
      targetData[key] = node;
      loops(children, node);
      return node;
    });
  };
  loops(cloneDeep(tree));
  return targetData;
}

function fintParent(treeObj, node, key = "id") {
  let obj = {};
  const loops = function (target) {
    let str = target[key] + "";
    let cur = treeObj[str];
    if (cur.parent) {
      let temp = cloneDeep(cur.parent);
      delete temp.parent;
      temp.children = [];
      temp.children.push(target);
      obj = temp;
      loops(temp);
    } else {
      delete target.parent;
      obj = target;
    }
  };
  loops(node);
  return obj;
}

/*两个同层级数组合并*/
function mergeTree(source, target) {
  // console.log("mergeTree", source, target);
  let bol = false;
  const loops = function (tree, node) {
    let cur = tree && tree.find((item) => item.id === node.id);
    if (cur) {
      let children = node.children;
      let list = cur.children;
      if (children && list) {
        children.forEach((sub) => {
          loops(list, sub);
        });
      }
    } else {
      tree.push(node);
    }
  };
  loops(source, target);
}
/*根据子级状态同步父级状态*/
function updateTreeStatus(tree) {
  const loops = function (list, isTop = false) {
    list.forEach((item) => {
      if (item.children) {
        let bol = item.children.every((item) => item.disabled);
        item.disabled = bol;
        if (!bol) {
          updateTreeStatus(item.children);
        } else if (!isTop) {
          updateTreeStatus(tree, true);
        }
      }
    });
  };
  if (tree && tree.length > 0) {
    loops(tree, true);
  }
}

/*无最底层数组时，删除父节点*/
function refreshTree(tree) {
  const loops = function (list) {
    let max = list.length - 1;
    for (let i = max; i >= 0; i--) {
      let { level, children, type } = list[i];
      if (children && children.length > 0) {
        loops(children);
      } else if (level != 3 && type !== "default") {
        list.splice(i, 1);
      }
    }
  };
  loops(tree);
}

/*找到最底层的数组*/
function findLowestTree(list) {
  // console.log("findLowestTree", list);
  let arr = [];
  let loops = function (ar, parent) {
    let bol = ar.some((item) => {
      return item?.cell || item?.level == 3;
    });
    if (bol) {
      let name = parent ? parent.label + "&" : "";
      let newArr = ar.map((item) => {
        item.name = name + item.label;
        return item;
      });
      arr.push(...newArr);
    } else {
      ar.forEach((item) => {
        item.children && loops(item.children, item);
      });
    }
  };
  loops(cloneDeep(list));
  return arr;
}
export {
  reverseTree,
  fintParent,
  updateTreeStatus,
  refreshTree,
  mergeTree,
  findLowestTree,
};
