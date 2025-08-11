<!-- 查询输入框组件 -->
<template>
  <div class="d-search-input">
    <slot><div /></slot>
    <div>
      <el-input
        v-model="value"
        class="search-input-container"
        :placeholder="placeholder"
        :clearable="clearable"
        @keyup.enter.native="$emit('search', value)"
      >
        <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="$emit('search', value)" />
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DSearchInput',
  components: {},
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入查询内容'
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  },
  watch: {},
  created () {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.d-search-input {
  display: flex;
  justify-content: space-between;
  .search-input-container {
    width: 320px;
  }
}
</style>
