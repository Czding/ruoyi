<!-- 二次确认气泡 -->
<template>
  <el-popconfirm
    :title="title"
    cancel-button-type=""
    icon="el-icon-warning"
    @confirm="confirm"
  >
    <span slot="reference" :class="`${type}-text-btn`">{{ buttonName }}</span>
  </el-popconfirm>
</template>

<script>
export default {
  name: 'DPopconfirm',
  props: {
    title: {
      default: '您确定删除该信息？',
      type: String
    },
    buttonName: {
      default: '删除',
      type: String
    },
    type: {
      default: 'primary',
      type: String
    }
  },
  data () {
    return {}
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>
