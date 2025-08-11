<!-- 菜单 -->
<template>
  <el-menu
    class="d-menu"
    :default-active="isVertical ? $route.path : activeMenu"
    :router="isVertical"
    unique-opened
    :mode="mode"
    @select="menuSelect">
    <menu-item v-for="item in data" :key="item.name" :data="item" :mode="mode"></menu-item>
  </el-menu>
</template>

<script>
import MenuItem from './menuItem.vue'
export default {
  name: 'DMenu',
  components: { MenuItem },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'vertical'
    }
  },
  data () {
    return {
      activeMenu: ''
    }
  },
  computed: {
    isVertical () {
      return this.mode === 'vertical'
    }
  },
  watch: {
    '$route.path': {
      handler (path) {
        if (!this.isVertical) {
          if (this.activeMenu && path.substring(0, this.activeMenu.length) === this.activeMenu) return
          const data = this.data.find(item => path.substring(0, item.path.length) === item.path)
          this.activeMenu = data?.path
          this.$emit('select', data, false)
        }
      },
      immediate: true
    }
  },
  methods: {
    menuSelect (index) {
      if (this.isVertical) return
      const data = this.data.find(item => item.path === index)
      this.$emit('select', data, true)
    }
  }
}
</script>

<style lang='scss' scoped>
.d-menu {
  height: 100%;
}
</style>
