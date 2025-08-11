<!-- 二次确认弹窗 -->
<template>
  <div class="inline">
    <span
      v-if="button === 'text'"
      slot="reference"
      :class="`${buttonType || 'primary'}-text-btn ${disabled ? 'disabled': ''}`"
      @click="() => { visible = true }"
    >
      {{ buttonName }}
    </span>
    <el-button
      v-else
      :disabled="disabled"
      :icon="buttonIcon"
      :type="buttonType"
      @click="() => { visible = true }"
    >
      {{ buttonName }}
    </el-button>
    <d-dialog
      v-model="visible"
      :title="title"
      width="374px"
      append-to-body
      @submit="submit"
    >
      <div class="d-dialog-confirm-container">
        <i class="el-icon-warning" />
        <p class="d-dialog-confirm-content">
          <slot>您确定删除该信息？</slot>
        </p>
      </div>
    </d-dialog>
  </div>
</template>

<script>
import DDialog from '../dialog'

export default {
  name: 'DDialogConfirm',
  components: { DDialog },
  props: {
    buttonName: {
      default: '批量删除',
      type: String
    },
    buttonIcon: {
      default: '',
      type: String
    },
    buttonType: {
      default: '',
      type: String
    },
    title: {
      default: '提示',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    button: {
      default: 'button',
      type: String
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    submit (callback) {
      this.$emit('submit', callback)
    }
  }
}
</script>

<style lang="scss" scoped>
.d-dialog-confirm-container {
  display: flex;
  align-items: center;
  & > i {
    font-size: 28px;
    color: rgb(255, 153, 0);
    margin-right: 8px;
  }
  & > div {
    flex: 1;
  }
  .d-dialog-confirm-content {
    white-space: normal;
  }
}
</style>
