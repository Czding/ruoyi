<!-- 弹窗 -->
<template>
  <el-dialog
    :class="fullscreen ? 'cover-screen-dialog' : ''"
    class="d-dialog"
    v-bind="$attrs"
    :title="title"
    :close-on-click-modal="closeOnClickModal"
    :visible.sync="visible"
    :width="width"
    v-on="$listeners"
    @closed="closed"
  >
    <template slot="title">
      <slot name="title" />
    </template>
    <slot />
    <template slot="footer">
      <slot name="footer" />
      <div v-if="showButton" class="ar">
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
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DDialog',
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
    closeOnClickModal: {
      type: Boolean,
      default: false
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
    },
    maxWidth: {
      type: String,
      default: '70%'
    },
    // 是否高度撑满
    fullscreen: {
      type: Boolean,
      default: false
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
      this.$emit('closed')
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
<style lang="scss" scoped>
.d-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep .el-dialog {
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    .el-dialog__body {
      flex: 1;
      overflow: auto;
    }
  }
}
.cover-screen-dialog {
  ::v-deep .el-dialog {
    height: 90vh;
  }
}
</style>
