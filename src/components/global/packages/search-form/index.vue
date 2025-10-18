<!-- 搜索组件 -->
<template>
  <div class="d-search-form">
    <div class="d-search-form-content">
      <div class="flex">
        <div class="search-item" v-for="(item, index) in list" :key="item.prop">
          <div class="search-item-label">
            {{ item.label }}
          </div>
          <form-item style="width: 240px" v-model="form[item.prop]" :config="item" />
        </div>
      </div>
      <div>
        <el-button type="primary" :disabled="searchLoading" icon="el-icon-search" size="mini" @click="search">
          搜索
        </el-button>
        <el-button :disabled="searchLoading" icon="el-icon-refresh" size="mini" @click="reset">
          重置
        </el-button>
      </div>
    </div>
    <div class="mb16">
      <slot />
    </div>
  </div>
</template>

<script>
import FormItem from '../form-item'
import { cloneDeep } from 'lodash'

// 初始化表单
let initForm = {}

export default {
  name: 'DSearchForm',
  components: {
    FormItem
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    config: {
      require: true,
      default: () => [],
      type: Array
    },
    cell: {
      default: 6,
      type: Number
    },
    gutter: {
      default: 16,
      type: Number
    },
    value: {
      default: () => { },
      type: Object
    },
    searchData: {
      default: null,
      type: Function
    },
    buttonSpan: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      list: [],
      hiddenIndex: 0,
      emptySpan: 0,
      expend: false,
      searchLoading: false,
      // 判断是否有插槽节点，目前只在组件初始化完成时判断
      hasSlot: false,
      suffixSlot: true
    }
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('change', value)
      }
    },
    submitSpan() {
      return this.buttonSpan || 24 / this.cell
    },
    spanList() {
      return this.list.map(item => item.span || Math.floor(24 / this.cell)) || []
    },
    showCol() {
      return (index) => {
        return this.expend || index < this.hiddenIndex
      }
    }
  },
  watch: {
    config: {
      handler() {
        this.list = this.config.filter(item => !item.hidden)
      },
      deep: true,
      immediate: true
    },
    spanList: {
      handler(val, oldVal) {
        if (!val.length || JSON.stringify(val) === JSON.stringify(oldVal)) {
          return
        }
        this.calcSpan()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    initForm = cloneDeep(this.value)
    this.$nextTick(() => {
      this.hasSlot = !!(this.$slots.default && this.$slots.default.length)
      this.calcSpan()
    })
  },
  methods: {
    /**
     * @description: 查询
     */
    async search() {
      this.$emit('search')
      if (this.searchData) {
        try {
          this.searchLoading = true
          await this.searchData({ pageNum: 1 }, this.form)
          this.searchLoading = false
        } catch (e) {
          this.searchLoading = false
        }
      }
    },
    /**
     * @description: 重置
     */
    async reset() {
      this.form = cloneDeep(initForm)
      this.$emit('search')
      if (this.searchData) {
        this.resetLoading = true
        await this.searchData({ pageNum: 1 }, this.form)
        this.resetLoading = false
      }
    },
    /**
     * @description: 展开/收起
     */
    changeStatus() {
      this.expend = !this.expend
      this.$emit('expand-change', this.expend)
    },
    calcSpan() {
      let hiddenIndex = 1
      const total = this.spanList.length ? this.spanList.reduce((a, b, index) => {
        const sum = a + b
        if (hiddenIndex < 2) {
          if (24 - sum < this.submitSpan) {
            hiddenIndex = index
          }
          if (24 - sum >= this.submitSpan && index === this.spanList.length - 1) {
            hiddenIndex = index + 1
          }
        }
        return sum
      }) : 0
      this.hiddenIndex = hiddenIndex

      const offsetSpan = 24 - total % 24
      if (this.hasSlot) {
        if (offsetSpan < this.submitSpan || offsetSpan === 24) {
          this.suffixSlot = false
          this.emptySpan = 0
        } else {
          this.suffixSlot = true
          this.emptySpan = offsetSpan >= this.submitSpan ? offsetSpan - this.submitSpan : 24 - this.submitSpan
        }
      } else {
        this.emptySpan = offsetSpan >= this.submitSpan ? offsetSpan - this.submitSpan : 24 - this.submitSpan
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.d-search-form {
  .d-search-form-content {
    display: flex;
    margin-bottom: 16px;
    width: 100%;
  }

  .el-select {
    width: 100%;

    .el-input_inner {
      height: 32px;
    }
  }

  &-btn {
    text-align: right;
    margin-bottom: 16px;
  }

  &-overflow {
    margin-top: 24px;
  }

  .expend-btn {
    padding: 4px 8px;
  }
}

.search-item {
  display: flex;
  align-items: center;

  &-label {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    margin-right: 8px;
  }

  ::v-deep .el-input__inner {
    height: 32px !important;
  }
}
</style>
