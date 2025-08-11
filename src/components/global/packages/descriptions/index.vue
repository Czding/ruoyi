<!-- eslint-disable vue/no-lone-template -->
<!-- 描述列表 -->
<template>
  <el-descriptions
    :class="{
      'd-descriptions': true,
      'border': border
    }"
    :border="border"
    :label-style="{
      width: labelWidth,
      ...labelStyle
    }"
    v-bind="$attrs"
  >
    <el-descriptions-item
      v-for="item in config"
      :key="item.prop"
      v-bind="item"
    >
      <template slot="label">
        <item-render v-if="item.labelRender" :scope="data" :render="item.labelRender" />
        <span v-else>{{ item.label }}</span>
      </template>
      <template>
        <component
          :is="item.component"
          v-if="item.component"
          v-bind="item"
          :row="data"
        />
        <item-render v-else-if="item.render" :scope="data" :render="item.render" />
        <span v-else>{{ data[item.prop] }}</span>
      </template>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import ItemRender from '../render'
import modules from '../../lib/slots'

export default {
  name: 'DDescriptions',
  components: { ...modules, ItemRender },
  props: {
    data: {
      default: () => ({}),
      type: Object
    },
    config: {
      default: () => [],
      type: Array
    },
     border: {
      default: true,
      type: Boolean
    },
    labelWidth: {
      default: '112px',
      type: String
    },
    labelStyle: {
      default: () => ({}),
      type: Object
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.d-descriptions {
  ::v-deep .el-descriptions__body {
    .el-descriptions__header {
      margin-bottom: 12px;
    }
    .el-descriptions-item__container {
      display: flex;
    }
    .el-descriptions-item__label {
      display: block;
      width: 112px;
      text-align: right;
      color: #333;
    }
    .el-descriptions-item__cell {
      padding: 6px 0;
      color: #333;
      vertical-align: middle;
    }
    .el-descriptions-item__content {
      color: #666;
    }
  }
}
.d-descriptions.border {
  ::v-deep .el-descriptions__body {
    .el-descriptions__table.is-bordered {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
    .el-descriptions-item__cell {
      padding: 12px;
      color: #333;
      border: 1px solid #ebeef5;
      vertical-align: middle;
      padding-left: 14px;
    }
    .el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label {
      display: table-cell;
      vertical-align: middle;
      font-weight: normal;
    }
  }
}
</style>
