<!-- eslint-disable vue/no-template-shadow -->
<!-- 多功能筛选树 -->
<template>
  <div class="d-filter-tree">
    <slot name="header" />
    <el-input
      v-if="filterable"
      v-model="searchContent"
      type="text"
      :placeholder="placeholder"
      suffix-icon="el-icon-search"
    />
    <el-tree
      ref="tree"
      class="filter-tree mt16"
      :data="data"
      :node-key="nodeKey"
      :expand-on-click-node="false"
      highlight-current
      :props="props"
      :filter-node-method="filterNode"
      :default-expanded-keys="defaultExpandIds"
      v-bind="$attrs"
      @node-click="nodeClick"
      @node-expand="(data)=>handleNodeToggle(data,true)"
      @node-collapse="(data)=>handleNodeToggle(data,false)"
      v-on="$listeners"
    >
      <span
        slot-scope="{ node, data }"
        class="d-filter-tree-node"
      >
        <span class="node-label ellipsis">
          <slot
            name="label"
            :data="data"
          >{{ node.label }}</slot>
        </span>
        <span class="mr8">
          <el-button
            v-if="showNodeButton('append', data)"
            type="text"
            icon="el-icon-plus"
            @click.stop="append(node)"
          />
          <el-button
            v-if="showNodeButton('edit', data)"
            type="text"
            icon="el-icon-edit"
            @click.stop="edit(node)"
          />
          <el-button
            v-if="showNodeButton('remove', data)"
            type="text"
            icon="el-icon-delete"
            @click.stop="remove(node)"
          />
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { getNodeByKey, getFirstVaildNode, flatTree } from '../../utils/treeLib'

export default {
  name: 'DFilterTree',
  components: {},
  props: {
    data: {
      default: () => [],
      type: Array
    },
    nodeKey: {
      default: 'id',
      type: String
    },
    // 默认选中第一个匹配的节点，如果有指定currentKey，则优先选中该节点
    // eg: { key: 'id', vlaue: true }
    currentDefault: {
      default: null,
      type: Function
    },
    // 选中的节点值
    currentKey: {
      default: '',
      type: [String, Number]
    },
    props: {
      default: () => ({}),
      type: Object
    },
    filterable: {
      default: true,
      type: Boolean
    },
    showButtons: {
      default: false,
      type: Boolean
    },
    templateUrl: {
      default: '',
      type: String
    },
    placeholder: {
      default: '请输入查询内容',
      type: String
    },
    buttonProps: {
      type: Object,
      default: () => ({
        append: false,
        edit: false,
        remove: false
      })
    },
    searchKey: {
      type: String,
      default: 'search'
    }
  },
  data () {
    return {
      searchContent: '',
      defaultExpandIds: [],
      first: true
    }
  },
  computed: {
    showNodeButton () {
      return (type, data) => {
        if (this.buttonProps[type]) {
          if (typeof this.buttonProps[type] === 'function') {
            return this.buttonProps[type](data)
          } else {
            return true
          }
        } else {
          return false
        }
      }
    }
  },
  watch: {
    data: {
      handler () {
        if (this.data && this.data.length) {
          let node
          if (this.currentKey) {
            node = getNodeByKey(this.data, this.currentKey, { key: this.nodeKey })
          } else if (this.currentDefault) {
            // 获取需要默认选中的节点
            const props = {
              key: this.nodeKey
            }
            this.props.label && (props.label = this.props.label)
            this.props.children && (props.children = this.props.children)
            node = getFirstVaildNode(this.data, this.currentDefault, props)
          }
          this.$nextTick(() => {
            if (node) {
              this.$refs.tree.setCurrentKey(node[this.nodeKey])
              this.$emit('node-change', node)
              this.first && this.handleNodeToggle(node, true)
            }
            this.first = false // 只在第一次有数据时执行默认展开
          })
        }
      },
      immediate: true
    },
    searchContent (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {},
  methods: {
    // 树的过滤methods
    filterNode (value, data) {
      if (!value) return true
      return (data[this.searchKey] || data[(this.props && this.props.label) || 'label']).indexOf(value) !== -1
    },
    // 树节点触发点击
    nodeClick (node) {
      this.$emit('node-change', node)
    },
    append (node) {
      this.$emit('node-append', node)
    },
    edit (node) {
      this.$emit('node-edit', node)
    },
    remove (node) {
      this.$emit('node-remove', node)
    },
    // 树节点展开/关闭
    handleNodeToggle (data, isExpanded) {
      if (isExpanded) {
        // 展开节点
        if (!this.defaultExpandIds.includes(data[this.nodeKey])) {
          this.defaultExpandIds.push(data[this.nodeKey])
        }
      } else {
        // 关闭节点
        const index = this.defaultExpandIds.indexOf(data[this.nodeKey])
        if (index > -1) {
          this.defaultExpandIds.splice(index, 1)
        }
      }
      this.removeExpandChildIds(data)
    },
    removeExpandChildIds (data) {
      const ids = (flatTree(data.children || [], { key: this.nodeKey }) || []).map(node => node[this.nodeKey])
      this.defaultExpandIds = this.defaultExpandIds.filter(id => !ids.includes(id))
    },
    expandNode (id) {
      const node = getNodeByKey(this.data, id, { key: this.nodeKey })
      if (node) this.handleNodeToggle(node, true)
    },
    // el-tree methods
    updateKeyChildren (...args) {
      this.$refs.tree.updateKeyChildren(...args)
    },
    getCheckedNodes (...args) {
      return this.$refs.tree.getCheckedNodes(...args)
    },
    setCheckedNodes (...args) {
      this.$refs.tree.setCheckedNodes(...args)
    },
    getCheckedKeys (...args) {
      return this.$refs.tree.getCheckedKeys(...args)
    },
    setCheckedKeys (...args) {
      this.$refs.tree.setCheckedKeys(...args)
    },
    setChecked (...args) {
      this.$refs.tree.setChecked(...args)
    },
    getHalfCheckedNodes (...args) {
      return this.$refs.tree.getHalfCheckedNodes(...args)
    },
    getHalfCheckedKeys (...args) {
      return this.$refs.tree.getHalfCheckedKeys(...args)
    },
    getCurrentKey (...args) {
      return this.$refs.tree.getCurrentKey(...args)
    },
    getCurrentNode (...args) {
      return this.$refs.tree.getCurrentNode(...args)
    },
    setCurrentKey (...args) {
      this.$refs.tree.setCurrentKey(...args)
    },
    setCurrentNode (...args) {
      this.$refs.tree.setCurrentNode(...args)
    },
    getNode (...args) {
      return this.$refs.tree.getNode(...args)
    }
  }
}
</script>

<style lang='scss' scoped>
.d-filter-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 14px;
  .d-filter-tree-buttons {
    display: flex;
    justify-content: space-between;
    & > div {
      cursor: pointer;
      color: #3786FD;
    }
  }
  .d-filter-tree-node {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;
    width: 100%;
    .node-label {
      flex: 1;
      overflow: hidden;
    }
  }
  .filter-tree {
    flex: 1;
    overflow: auto;
  }
}
</style>
