<!-- 带有icon图标的内容 -->
<template>
  <div class="icon-slot">
    <div v-for="({ icon, type, color }, index) in list" :key="index">
      <!-- image -->
      <img  v-if="type === 'image'" class="icon-image" :src="icon" alt="">
      <!-- svg -->
      <svg-icon v-else-if="type === 'svg'" :style="{ color }" class="icon-svg" :icon="icon" />
      <!-- iconfont -->
      <i v-else class="icon-iconfont" :style="{ color }" :class="`${icon}`"></i>
    </div>
    <span class="icon-content">{{ row[prop] }}</span>
  </div>
</template>

<script>
import SvgIcon from '../../packages/svg-icon'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Icon',
  components: { SvgIcon },
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    prop: {
      type: String,
      default: ''
    },
    // 字典的code
    icons: {
      type: [Function, Array],
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {
    list () {
      if (typeof this.icons === 'function') {
        return this.icons(this.row)
      } else {
        return this.icons
      }
    }
  },
  created () {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.icon-slot {
  display: flex;
  align-items: center;
  .icon-image {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  .icon-svg, .icon-iconfont {
    font-size: 18px;
    margin-right: 4px;
  }
  .icon-content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
