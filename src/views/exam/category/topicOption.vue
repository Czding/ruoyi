<template>
  <div class="topic-option">
    <div class="topic-option-item" v-for="item, index in values" :key="index">
      <div class="mr8">{{ numberToUppercase(index + 1) }}</div>
      <el-input :validate-event="false" v-model="item.topicName" placeholder="请输入题目选项名称" size="small"></el-input>
      <el-button type="danger" size="small" class="ml8" @click="values.splice(index, 1)">删除</el-button>
      <el-button type="primary" size="small" v-if="item.isResult === '0'" @click="setResult(item, index)">设为答案</el-button>
      <el-button type="warning" size="small" v-else @click="item.isResult = '0'">取消答案</el-button>
    </div>
    <el-button type="primary" size="small" @click="addOption">添加选项</el-button>
  </div>
</template>

<script>
export default {
  components: {},
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  },
  computed: {
    values: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('change', value)
      }
    }
  },
  methods: {
    numberToUppercase(num) {
      return String.fromCharCode(64 + num)
    },
    setResult (item, index) {
      item.isResult = '1'
      this.values = this.values.map((item, i) => {
        if (index !== i) {
          item.isResult = '0'
        }
        return item
      })
      console.log(123123, this.values)
    },
    addOption () {
      this.values.push({
        topicName: '',
        isResult: '0'
      })

    }
  }
}
</script>
<style lang="scss" scoped>
.topic-option {
  .topic-option-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    & > div:first-child {
      background-color: #d2d6de;
      width: 100px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 3px;
    }
  }
}
</style>
