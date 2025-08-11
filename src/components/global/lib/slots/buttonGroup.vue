<!-- 按钮组 -->
<template>
  <div>
    <template v-for="btn in buttons">
      <span
        v-if="typeof btn.hide === 'function' ? !btn.hide(row) : !btn.hide"
        :key="btn.name"
        class="button-group-item"
      >
        <dialog-confirm
          v-if="btn.showConfirm"
          button="text"
          :button-name="btn.name"
          :button-type="btn.type"
          :disabled="typeof btn.disabled === 'function' ? btn.disabled(row) : btn.disabled"
          @submit="(callback) => { btn.method(callback, row, index) }"
        >
          {{ typeof btn.title === 'function' ? btn.title(row) : btn.title }}
        </dialog-confirm>
        <span
          v-else
          :class="`${btn.type === 'danger' ? 'danger-text-btn' : 'primary-text-btn'} ${(typeof btn.disabled === 'function' ? btn.disabled(row) : btn.disabled) ? 'disabled' : ''}`"
          @click="btn.method(row, index)"
        >{{ btn.name }}</span>
      </span>
    </template>
    <el-dropdown
      v-if="dropdownButtons.length"
      class="ml8"
      trigger="click"
      placement="bottom"
      @command="commandChange"
    >
      <span class="el-dropdown-link ml8px">
        更多<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="btn in dropdownButtons"
          :key="btn.name"
          :command="btn.name"
          :disabled="typeof btn.disabled === 'function' ? btn.disabled(row) : btn.disabled"
        >
          {{ btn.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import DialogConfirm from '../../packages/dialog-confirm'
export default {
  name: 'ButtonGroup',
  components: { DialogConfirm },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      buttons: [],
      dropdownButtons: []
    }
  },
  computed: {},
  watch: {
    list: {
      handler () {
        if (this.list.length) {
          this.buttons = this.list.filter(btn => !btn.dropdown)
          this.dropdownButtons = this.list.filter(btn => btn.dropdown)
        } else {
          this.buttons = []
          this.dropdownButtons = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () { },
  methods: {
    commandChange (value) {
      const button = this.dropdownButtons.find(btn => btn.name === value)
      button.method(this.row)
    }
  }
}
</script>

<style lang='scss' scoped>
.button-group-item + .button-group-item {
  margin-left: 8px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
