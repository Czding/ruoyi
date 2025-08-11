<!-- 按钮 -->
<template>
  <el-button
    v-bind="$attrs"
    :loading="loading"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<script>
export default {
  name: 'DButton',
  components: {},
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    handleClick () {
      this.loading = true
      this.$emit('submit', () => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
