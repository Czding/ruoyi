<!-- eslint-disable vue/valid-v-for -->
<template>
  <div class="search-item">
    <div>
      <span
        v-if="config.prefix"
        class="mr6"
      >{{ config.prefix }}</span>
      <el-radio-group
        v-if="config.component === 'el-radio-group'"
        v-model="value"
        :disabled="!!config.disabled"
        v-bind="config.props"
        v-on="config.listeners"
        @change="change"
      >
        <el-radio
          v-for="radio in config.options"
          :key="radio.value"
          :label="radio.value"
          :disabled="!!radio.disabled"
        >
          {{ radio.label }}
        </el-radio>
      </el-radio-group>
      <component
        :is="config.component"
        v-else
        :ref="config.prop"
        v-model.trim="value"
        :style="{
          width: config.width
        }"
        :clearable="clearable(config)"
        :maxlength="config.maxlength || maxlength(config)"
        :disabled="!!config.disabled"
        :placeholder="config.placeholder || placeholder(config)"
        v-bind="config.props"
        v-on="config.listeners"
        @change="change"
      >
        <template
          v-for="s in slots"
          :slot="s.slotName"
        >
          <form-item-render
            :scope="config"
            :render="s.render"
          />
        </template>
        <template v-if="config.component === 'el-checkbox-group'">
          <el-checkbox
            v-for="(checkbox, checkboxIndex) in config.options"
            :key="checkboxIndex"
            :label="checkbox.value"
          >
            {{ checkbox.label }}
          </el-checkbox>
        </template>

        <template v-if="config.component === 'el-select'">
          <el-option
            v-for="(option, optionIndex) in config.options"
            :key="optionIndex"
            :label="option.label"
            :value="option.value"
            :disabled="!!option.disabled"
          />
        </template>
        <span
          v-if="config.suffix"
          class="ml6"
        >{{ config.suffix }}</span>
      </component>
    </div>
  </div>
</template>

<script>
import FormItemRender from '../render'

export default {
  name: 'DFormItem',
  components: { FormItemRender },
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    config: {
      require: true,
      type: Object,
      default: () => {}
    },
    modelValue: {
      type: [Number, String, Boolean, Object, Array],
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    slots () {
      return Object.entries(this.config.slots || []).map(([key, value]) => ({
        slotName: key,
        render: value
      }))
    },
    clearable () {
      return (config) => {
        // 优先取配置项clearable
        if (config.clearable !== undefined) {
          return !!config.clearable
        } else {
          return true
        }
      }
    },
    maxlength () {
      return (config) => {
        if (config.component === 'el-input') {
          if (config.props && config.props.type === 'textarea') {
            return 500
          } else {
            return 50
          }
        } else {
          return 99999
        }
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
    /**
     * @description: 普通选择器和级联选择器输出勾选Item节点数据
     * @param {*} value
     * @return {*} data: 输出结构和value数据结构一致，对应value中的节点data
     */
    change (value) {
      if (this.config.onChange) {
        let data = null

        // 处理级联选择器
        if (this.config.component === 'el-cascader') {
          this.$nextTick(() => {
            // el-cascader搜索勾选bug，需要nextTick后才能正常使用getCheckedNodes
            data = this.$refs[this.config.prop].getCheckedNodes()
            const emitPath = (this.config.props && this.config.props.props && this.config.props.props.emitPath !== undefined) ? this.config.props.props.emitPath : true
            const multiple = this.config.props && this.config.props.props && this.config.props.props.multiple
            if (emitPath) {
              if (multiple) {
                data = value.map(arr => data.find(node => arr[arr.length - 1] === node.value).pathNodes)
              } else {
                data = data[data.length - 1].pathNodes
              }
            } else {
              if (multiple) {
                data = value.map(item => data.find(node => item === node.value))
              } else {
                data = data[data.length - 1]
              }
            }
            this.config.onChange(value, data)
          })
        }

        // 处理下拉选择器
        if (this.config.component === 'el-select') {
          data = this.config.options
          if (Array.isArray(value)) {
            data = data.filter(i => value.includes(i.value)) || []
          } else {
            data = data.find(i => value === i.value) || {}
          }
          this.config.onChange(value, data)
        }
      }
    }
  }
}
</script>
