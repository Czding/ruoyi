<!-- 搜索组件 -->
<template>
  <div class="d-search-form">
    <el-row class="flex-wrap" :gutter="gutter">
      <el-col
        v-for="(item, index) in list"
        v-show="showCol(index)"
        :key="item.prop"
        :span="item.span || Math.floor(24 / cell)"
        class="col-item"
      >
        <div class="search-item">
          <div class="search-item-label">
            {{ item.label }}
          </div>
          <form-item v-model="form[item.prop]" :config="item" />
        </div>
      </el-col>
      <el-col :span="hiddenIndex === list.length || expend ? emptySpan : 0" style="height: 68px;">
        <span />
      </el-col>
      <el-col v-if="hasSlot && expend && !suffixSlot" :span="24 - submitSpan" class="mb16">
        <slot />
      </el-col>
      <el-col :span="submitSpan">
        <div
          :style="{
            'margin-top': hasSlot && expend && !suffixSlot ? '0px' : '24px'
          }"
          class="d-search-form-btn"
        >
          <el-button type="primary" :disabled="searchLoading" @click="search">
            查询
          </el-button>
          <el-button :disabled="searchLoading" @click="reset">
            重置
          </el-button>
          <el-button
            v-if="list.length > hiddenIndex"
            class="expend-btn"
            :class="`el-icon-arrow-${expend ? 'up' : 'down'}`"
            @click="changeStatus"
          />
        </div>
      </el-col>
      <el-col v-if="hasSlot && (!expend || suffixSlot)" :span="20" class="mb16">
        <slot />
      </el-col>
    </el-row>
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
      default: () => {},
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
  data () {
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
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    submitSpan () {
      return this.buttonSpan || 24 / this.cell
    },
    spanList () {
      return this.list.map(item => item.span || Math.floor(24 / this.cell)) || []
    },
    showCol () {
      return (index) => {
        return this.expend || index < this.hiddenIndex
      }
    }
  },
  watch: {
    config: {
      handler () {
        this.list = this.config.filter(item => !item.hidden)
      },
      deep: true,
      immediate: true
    },
    spanList: {
      handler (val, oldVal) {
        if (!val.length || JSON.stringify(val) === JSON.stringify(oldVal)) {
          return
        }
        this.calcSpan()
      },
      deep: true,
      immediate: true
    }
  },
  created () {
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
    async search () {
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
    async reset () {
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
    changeStatus () {
      this.expend = !this.expend
      this.$emit('expand-change', this.expend)
    },
    calcSpan () {
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
  margin-bottom: 4px;
  .col-item {
    align-items: end;
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
  margin-bottom: 12px;
  &-label {
    margin-bottom: 4px;
    font-weight: 400;
    color: #333333;
  }
  ::v-deep .el-input__inner {
    height: 32px !important;
  }
}
</style>
