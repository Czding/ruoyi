<!-- 文件slot -->
<template>
  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <file-upload v-model="row[prop]" readonly />
</template>

<script>
import FileUpload from '../../packages/upload'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'File',
  components: { FileUpload },
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    prop: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
