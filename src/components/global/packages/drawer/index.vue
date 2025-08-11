<!-- 抽屉 -->
<template>
  <el-drawer
    v-bind="$attrs"
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :size="width"
    v-on="$listeners"
    @closed="closed"
  >
    <template slot="title">
      <slot name="title" />
    </template>
    <div class="flex-col hf">
      <div class="flex-1">
        <slot />
      </div>
      <div v-if="showButton" class="ar mt16">
        <el-button
          type="primary"
          :icon="submitButtonIcon"
          :loading="loading"
          @click="submit"
        >
          {{ submitButtonText }}
        </el-button>
        <el-button @click="cancel">
          {{ cancelButtonText }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'DDrawer',
  components: {},
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showButton: {
      type: Boolean,
      default: true
    },
    submitButtonText: {
      type: String,
      default: '确定'
    },
    submitButtonIcon: {
      type: String,
      default: ''
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    // 需要重置的表单ref
    formRefs: {
      type: [String, Array],
      default: ''
    },
    width: {
      type: String,
      default: '70%'
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    visible: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  },
  methods: {
    async submit () {
      // 是否需要进行表单校验
      if (this.formRefs) {
        // 多表单校验
        if (Array.isArray(this.formRefs)) {
          await Promise.all(this.formRefs.map(ref => this.$parent.$refs[ref] && this.$parent.$refs[ref].validate()))
        } else {
          this.$parent.$refs[this.formRefs] && (await this.$parent.$refs[this.formRefs].validate())
        }
      }
      this.loading = true
      this.$emit('submit', (status) => {
        this.loading = false
        if (!status) {
          this.visible = false
        }
      })
    },
    cancel () {
      this.$emit('cancel')
      this.visible = false
    },
    /**
     * @description: 弹窗关闭时清楚表单校验
     */
    closed () {
      if (this.formRefs) {
        // 多表单校验
        if (Array.isArray(this.formRefs)) {
          this.formRefs.forEach(ref => this.$parent.$refs[ref] && this.$parent.$refs[ref].resetFields())
        } else {
          this.$parent.$refs[this.formRefs] && this.$parent.$refs[this.formRefs].resetFields()
        }
      }
    }
  }
}
</script>
