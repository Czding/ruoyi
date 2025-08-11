import { cloneDeep } from 'lodash'

// 默认的props传参
const defaultProps = {
  key: 'id',
  label: 'label',
  children: 'children'
}

const _getProps = (props) => {
  return { ...defaultProps, ...props }
}

/**
 * @description: 获取树结构第一个匹配的节点数据
 * @param {Array} tree
 * * @param {String} matchs 匹配规则函数
 * @return {Any}
 */
export const getFirstVaildNode = (tree, matchs, props = {}) => {
  props = _getProps(props)
  for (const node of tree) {
    if (matchs(node)) {
      return node
    }
    if (node[props.children] && node[props.children].length) {
      const data = getFirstVaildNode(node[props.children], matchs, props)
      if (data) return data
    }
  }
}

/**
 * @description: 根据key查找树中的匹配节点
 * @param {Array} data
 * @param {String | Number} value 匹配的值
 * @return {Any}
 */
export const getNodeByKey = (data, value, props = {}) => {
  props = _getProps(props)
  const tree = cloneDeep(data)
  const arr = Array.isArray(tree) ? tree : [tree]
  let result = null
  while (arr.length) {
    const item = arr.pop()
    if (item && item[props.key] === value) {
      result = item
      break
    } else if (item && item[props.children] && item[props.children].length) {
      arr.push(...item[props.children])
    }
  }
  return result
}

/**
 * @description: 根据key查找树中的匹配节点集合
 * @param {Array} data
 * @param {String | Number} value 匹配的值
 * @return {Any}
 */
export const getNodeByKeys = (data, values, props = {}, arr = []) => {
  props = _getProps(props)
  let tree = cloneDeep(data)
  tree = Array.isArray(tree) ? tree : [tree]
  tree.forEach((node) => {
    if (values.includes(node[props.key])) {
      arr.push(node)
    }
    if (node[props.children] && node[props.children].length) {
      arr = arr.concat(getNodeByKeys(node[props.children], values, props))
    }
  })
  return arr
}

/**
 * @description: 获取树所有节点 --- 树扁平化
 * @param {Array} data
 * @return {Array}
 */
export const flatTree = (data, props = {}) => {
  props = _getProps(props)
  let arr = []
  data.forEach((node) => {
    arr.push(node)
    if (node[props.children] && node[props.children].length) {
      arr = arr.concat(flatTree(node[props.children], props))
    }
  })
  return arr
}

/**
 * @description: 获取树所有没有子节点的节点 --- 树扁平化
 * @param {Array} data
 * @return {Array}
 */
export const flatTreeByLastNode = (data, props = {}) => {
  props = _getProps(props)
  let arr = []
  data.forEach((node) => {
    if (node[props.children] && node[props.children].length) {
      arr = arr.concat(flatTreeByLastNode(node[props.children], props))
    } else {
      arr.push(node)
    }
  })
  return arr
}

/**
 * @description: 删除树指定节点
 * @param {Array} data
 * @param {String} value 匹配的节点值
 * @param {String} self true: 删除自身 false: 只删除子节点 默认true
 * @return {Array}
 */
export const deleteNode = (data, value, self = true, props = {}) => {
  props = _getProps(props)
  data = cloneDeep(data)
  let arr = []
  if (self) {
    arr = data.filter((node) => node[props.key] !== value)
    if (arr.length === data.length) {
      arr = arr.map((node) => {
        if (node[props.children] && node[props.children].length) {
          node[props.children] = deleteNode(
            node[props.children],
            value,
            self,
            props
          )
        }
        return node
      })
    }
  } else {
    arr = data.map((node) => {
      if (node[props.key] === value) {
        delete node[props.children]
      }
      if (node[props.children] && node[props.children].length) {
        node[props.children] = deleteNode(
          node[props.children],
          value,
          self,
          props
        )
      }
      return node
    })
  }

  return arr
}

/**
 * @description: 根据key 精准/模糊搜索匹配到的所有节点
 * @param {Array} data
 * @param {Array} data 匹配的节点值
 * @param {String} type fuzzy: 模糊搜索  precise: 精准搜索
 * @return {Array}
 */
export const filterNodeMethod = (value, data = [], type = 'fuzzy', props = {}) => {
  props = _getProps(props)
  let newarr = []
  data.forEach((node) => {
    if (type === 'fuzzy' ? (node[props.key].indexOf(value) > -1) : node[props.key] === value) {
      const ab = filterNodeMethod(value, node[props.children], type, props)
      const obj = {
        ...node,
        children: ab
      }
      newarr.push(obj)
    } else {
      if (node[props.children] && node[props.children].length > 0) {
        const ab = filterNodeMethod(value, node[props.children], type, props)
        const obj = {
          ...node,
          children: ab
        }
        if (ab && ab.length > 0) {
          newarr.push(obj)
        }
      }
    }
  })
  return newarr
}
