<!-- 字典slot -->
<template>
  <div>{{ dictText }}</div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Dict',
  components: {},
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
    code: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    dictText () {
      if (Array.isArray(this.row[this.prop])) {
        const result = this.$DDWL.enum.getLabels(this.code, this.row[this.prop])
        return result?.length ? result.join(',') : ''
      } else {
        return this.$DDWL.enum.getLabel(this.code, this.row[this.prop])
      }
    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
