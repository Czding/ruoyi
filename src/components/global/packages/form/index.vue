<!-- 表单 -->
<template>
  <el-form
    ref="form"
    v-bind="$attrs"
    :model="source"
  >
    <el-row
      style="display: flex;flex-wrap: wrap;"
      :gutter="16"
      :class="!grid && 'flex'"
    >
      <template v-for="item in config">
        <component
          :is="grid ? 'el-col' : 'div'"
          v-if="!item.hide"
          :key="item.prop"
          :class="item.className"
          :span="item.span || 24"
        >
          <el-form-item
            class="d-form-item"
            :class="{ 'custom-form-item-top': item.direction === 'vertical' || direction === 'vertical' }"
            :label="item.label"
            :prop="item.prop"
            :label-width="(item.direction === 'line' || direction === 'line') ? (item.labelWidth || labelWidth) : '100%'"
            :rules="item.rules || (item.required ? [{ required: true, message: placeholder(item) }] : null)"
            v-bind="item.itemProps"
          >
            <span slot="label">
              <span v-if="!item.labelRender">{{ item.label }}</span>
              <form-label-render v-else :scope="item" :render="item.labelRender" />
            </span>
            <span v-if="item.preText" class="mr8">{{ item.preText }}</span>
            <slot v-if="item.component === 'slot'" :name="item.slotName" />
            <div
              v-else-if="item.component === 'text'"
              :class="item.innerClass"
              :style="item.style"
            >
              {{ item.text || source[item.prop] }}
            </div>
            <template v-else>
              <form-item :ref="item.prop" v-model="source[item.prop]" :config="item" />
            </template>
            <span v-if="item.sufText" class="ml8">{{ item.sufText }}</span>
          </el-form-item>
        </component>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import FormItem from '../form-item/index'
import FormLabelRender from '../render'

export default {
  name: 'DForm',
  components: {
    FormItem,
    FormLabelRender
  },
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    config: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      default: '120px',
      type: String
    },
    modelValue: {
      type: Object,
      default: () => ({})
    },
    grid: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: 'vertical'
    }
  },
  data () {
    return {}
  },
  computed: {
    source: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    placeholder () {
      return ({ component, label }) => {
        // 默认给组件添加placeholder，可自定义
        if (component === 'el-input' || component === 'el-input-number') {
          return `请输入${label}`
        } else {
          return `请选择${label}`
        }
      }
    }
  },
  methods: {
    resetFields () {
      this.$refs.form.resetFields()
    },
    clearValidate () {
      this.$refs.form.clearValidate()
    },
    async validate () {
      const valid = await this.$refs.form.validate()
      return valid
    }
  }
}
</script>

<style lang="scss" scoped>
.d-form-item {
  ::v-deep .el-form-item__content {
    display: flex;
    .search-item {
      flex: 1;
      overflow: hidden;
    }
  }
}
.custom-form-item-top {
  display: flex;
  flex-direction: column;

  ::v-deep .el-form-item__label {
    text-align: left;
  }
  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
