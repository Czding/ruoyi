<!-- 菜单子项 -->
<template>
  <el-submenu
    v-if="mode === 'vertical' && data.children && data.children.length"
    :index="data.path"
  >
    <template slot="title">
      <img
        v-if="data.meta.icon"
        class="mr8 menu-icon"
        :src="data.meta.icon"
      >
      <span>{{ data.meta.title }}</span>
    </template>
    <menu-item
      v-for="item in data.children"
      :key="item.name"
      :data="item"
    />
  </el-submenu>
  <el-menu-item
    v-else
    :index="data.path"
  >
    <template slot="title">
      <div
        v-if="data.meta.icon"
        class="menu-icon-box"
      >
        <img
          class="menu-icon"
          :src="data.meta.icon"
        >
      </div>
      <span class="ml6 ellipsis flex-1">{{ data.meta.title }}</span>
    </template>
  </el-menu-item>
</template>

<script>
export default {
  name: 'MenuItem',
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: 'vertical'
    }
  },
  data () {
    return {
    }
  },
  computed: {},
  created () {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.menu-icon-box {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-icon {
  width: 16px;
  height: 16px;
}
</style>
