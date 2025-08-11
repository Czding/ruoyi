<!-- 表格 -->
<template>
  <div
    :key="key"
    v-loading="loading"
    :class="draggable && 'drag-query-table'"
  >
    <el-table
      ref="table"
      :row-key="rowKey"
      style="width: 100%"
      :data="list"
      :border="border"
      v-bind="$attrs"
      v-on="$listeners"
      @select="selectChange"
      @select-all="selectAllChange"
      @selection-change="selectionChange"
    >
      <el-table-column
        v-if="selection || asyncSelection"
        key="selection"
        type="selection"
        align="center"
        width="50"
      />
      <el-table-column
        v-if="index"
        key="index"
        label="序号"
        align="center"
        width="55"
      >
        <template slot-scope="scope">
          {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        v-bind="column"
        v-on="$listeners"
      >
        <template slot-scope="scope">
          <component
            :is="column.component"
            v-if="column.component"
            v-bind="{ ...scope.row, ...column }"
            :row="scope.row"
            :index="scope.$index"
          />
          <column-render
            v-else-if="column.render"
            :scope="scope"
            :render="column.render"
          />
          <template v-else>
            {{ scope.row[column.prop] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="draggable"
        label=""
        width="55"
        align="center"
      >
        <img
          class="table-drag-icon"
          src="./drag.png"
        >
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div
      v-if="pagination"
      class="d-table-footer"
    >
      <div>
        <slot name="footer" />
      </div>
      <el-pagination
        class="pagination"
        :background="background"
        :layout="layout"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="pageNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { cloneDeep } from 'lodash'
import modules from '../../lib/slots'
import ColumnRender from '../render'

export default {
  name: 'DTable',
  components: { ...modules, ColumnRender },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: true
    },
    // request config
    requestConfig: {
      type: Object,
      require: false,
      default: () => ({
        api: () => {}, // 接口
        params: {}, // 默认参数
        autoRequest: true, // 是否自动请求
        method: null // 自定义请求方法
      })
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSizes: {
      type: Array,
      default: () => ([10, 20, 30, 50])
    },
    size: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 1
    },
    background: {
      type: Boolean,
      default: true
    },
    // 是否需要分页
    pagination: {
      default: true,
      type: Boolean
    },
    // 是否拖拽
    draggable: {
      default: false,
      type: Boolean
    },
    // 是否展示多选框
    selection: {
      default: false,
      type: Boolean
    },
    // 是否跨页勾选
    asyncSelection: {
      default: false,
      type: Boolean
    },
    // 默认勾选项，必须设置rowKey
    defaultCheckList: {
      default: () => [],
      type: Array
    },
    // 是否展示排序列
    index: {
      default: false,
      type: Boolean
    },
    // 列表项配置
    columns: {
      default: () => [],
      type: Array
    },
    // 开启静态分页
    staticPaging: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false,
      checkedList: [],
      ids: [],
      key: 0,
      list: [],
      totalList: []
    }
  },
  computed: {
    visibleColumns () {
      return this.columns.filter(item => !item.hide)
    }
  },
  watch: {
    data: {
      handler (val) {
        if (JSON.stringify(val) === JSON.stringify(this.list)) {
          return
        }
        this.handleRequestData(val)
        if (this.draggable) {
          this.$nextTick(() => {
            this.initSortable()
          })
        }
      },
      deep: true,
      immediate: true
    },
    defaultCheckList: {
      handler () {
        this.handleSelectionData()
      },
      deep: true
    }
  },
  mounted () {
    this.checkedList = this.defaultCheckList
    // 如果不需要分页器，每页显示条目数设置最大
    if (!this.pagination) {
      this.pageSize = 9999999
    }
    // 注册表格拖拽
    if (this.draggable) {
      this.initSortable()
    }
    // 是否开启自动请求
    if (!this.staticPaging && (this.requestConfig.autoRequest || this.requestConfig.autoRequest === undefined)) {
      this.search()
    }
  },
  methods: {
    /**
     * @description: 表格查询方法包装
     * @param {*} param 自定义查询条件
     */
    async search (param = {}) {
      this.loading = true
      try {
        if (param.pageNum) {
          this.pageNum = param.pageNum
        }
        if (param.pageSize) {
          this.pageSize = param.pageSize
        }
        const { total, data } = await (this.requestConfig.method || this.getData)({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          ...this.requestConfig.params,
          ...param
        })
        this.total = total
        this.handleRequestData(data)
      // eslint-disable-next-line no-empty
      } catch (e) {}
      this.loading = false
    },
    async getData (params) {
      const defaultParams = typeof this.requestConfig.params === 'function' ? this.requestConfig.params() : this.requestConfig.params
      const { data } = await this.requestConfig.api({ ...defaultParams, ...params })
      this.total = data.total
      let listData = data.list || []
      if (this.requestConfig.props) {
        if (this.requestConfig.props.list === null) {
          listData = data
        } else if (this.requestConfig.props.list) {
          listData = data[this.requestConfig.props.list]
        }
      }
      return {
        total: data.total,
        data: listData
      }
    },
    /**
     * @description: 处理表格接口获取的数据
     */
    handleRequestData (data) {
      if (this.staticPaging) {
        this.totalList = cloneDeep(data)
        this.total = this.totalList.length
      } else {
        this.list = cloneDeep(data)
      }

      // 静态分页
      if (this.staticPaging) {
        this.pageNum = 1
        this.calcStaticPageData()
        return
      }

      this.$emit('loaded', this.list)

      // 如果当前页码大于1且当前数据列表为空，自动返回上一页并查询
      if (this.list.length === 0 && this.pageNum > 1) {
        this.pageNum = this.pageNum - 1
        this.search()
        return
      }
      // 跨页勾选逻辑
      if (this.asyncSelection || this.selection) {
        this.key++
        this.handleSelectionData()
      }
    },
    /**
     * @description: 处理表格默认勾选
     */
    handleSelectionData () {
      this.checkedList = this.defaultCheckList
      this.$refs.table && this.$refs.table.clearSelection()
      if (this.checkedList.length) {
        const ids = this.checkedList.map(item => item[this.rowKey])
        const rows = this.list.filter(item => ids.includes(item[this.rowKey]))
        this.$nextTick(() => {
          rows.forEach(row => {
            this.$refs.table.toggleRowSelection(row, true)
          })
        })
      }
    },
    calcStaticPageData () {
      const _list = JSON.parse(JSON.stringify(this.totalList))
      this.list = _list.splice((this.pageNum - 1) * this.pageSize, this.pageSize)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNum = 1
      this.staticPaging ? this.calcStaticPageData() : this.search()
      this.$emit('page-change', { size: this.pageSize, page: this.pageNum })
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.staticPaging ? this.calcStaticPageData() : this.search()
      this.$emit('page-change', { size: this.pageSize, page: this.pageNum })
    },
    /**
     * @description: 勾选改变事件
     * @param {Array} list
     * @return {Array}
     */
    selectChange (list, row) {
      if (!this.asyncSelection) {
        this.$emit('select-change', list)
      } else {
        if (list.some(i => i[this.rowKey] === row[this.rowKey])) {
          this.checkedList.push(row)
        } else {
          this.checkedList = this.checkedList.filter(item => item[this.rowKey] !== row[this.rowKey])
        }
        this.$emit('select-change', cloneDeep(this.checkedList))
      }
    },
    selectAllChange (list) {
      if (!this.asyncSelection) {
        this.$emit('select-change', list)
      } else {
        if (list.length) {
          const checkedKeys = this.checkedList.map(item => item[this.rowKey])
          const newData = list.filter(item => !checkedKeys.includes(item[this.rowKey]))
          this.checkedList = this.checkedList.concat(newData)
        } else {
          const listKeys = this.list.map(item => item[this.rowKey])
          this.checkedList = this.checkedList.filter(item => !listKeys.includes(item[this.rowKey]))
        }
        this.$emit('select-change', cloneDeep(this.checkedList))
      }
    },

    selectionChange () {},
    /**
     * @description: 清空用户的选择
     */
    clearSelection () {
      this.checkedList = []
      this.$refs.table.clearSelection()
    },
    /**
     * @description: 改变给定值的选中状态
     * @param {*} value 改变选中状态的值
     * @param {*} selected 是否选中
     */
    toggleAsyncSelection (value, selected = false) {
      this.checkedList = this.checkedList.filter(item => item[this.rowKey] !== value)
      const data = this.list.find(item => item[this.rowKey] === value)
      if (data) {
        this.$refs.table.toggleRowSelection(data, selected)
      } else {
        this.$emit('select-change', this.checkedList)
      }
    },
    /**
     * @description: 表格拖拽
     */
    initSortable () {
      const el = this.$refs.table.$el.querySelector('.el-table__body-wrapper > table > tbody')
      /* eslint-disable no-new */
      new Sortable(el, {
        handle: '.table-drag-icon',
        onEnd: (evt) => {
          // 拖拽后数据位置置换
          const oldList = JSON.parse(JSON.stringify(this.list))
          const data = oldList.splice(evt.oldIndex, 1)
          oldList.splice(evt.newIndex, 0, data[0])
          this.list = oldList
          // this.key++
          this.$nextTick(() => {
            // 改变key值table重新渲染导致拖拽功能消失，需要重新初始化sorable实例
            this.initSortable()
            this.handleSelectionData()
            this.$emit('drag-change', this.list, evt)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-query-table {
  ::v-deep .hover-row {
    td {
      background-color: #fff;
    }
  }
}
.table-drag-icon {
  cursor: pointer;
}
.d-table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
