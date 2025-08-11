<template>
  <div class="page">
    <div class="page-left">
      <div class="flex-items-center flex-content-between">
        <div class="mt">
          题目分类
        </div>
        <el-button
          class="mb16"
          type="text"
          icon="el-icon-plus"
          @click="nodeAppend()"
        >
          新增
        </el-button>
      </div>
      <d-filter-tree
        class="flex-1-auto"
        :data="treeData"
        node-key="id"
        :current-default="(node) => node.id"
        :current-key="nodeData.id"
        :props="{
          label: 'name',
          value: 'id'
        }"
        :button-props="{
          append: true,
          edit: true,
          remove: true
        }"
        @node-change="nodeChange"
        @node-append="nodeAppend"
        @node-edit="nodeEdit"
        @node-remove="nodeRemove"
      />
    </div>
    <div class="page-right">
      <d-search-table :config="config"></d-search-table>
    </div>
    <d-dialog form-refs="form" v-model="visible" title="分类" width="600px" @submit="categorySubmit">
      <d-form ref="form" v-model="form" :config="formConfig"></d-form>
    </d-dialog>
  </div>
</template>

<script>
import { categoryTree } from '@/api/exam/category'

export default {
  components: {},
  data () {
    return {
      treeData: [],
      nodeData: {},
      visible: false,
      form: {
        parentId: '',
        categoryName: '',
        categoryLevel: '',
        categoryOrder: '',
        idFullPath: '',
        score: '',
        remark: ''
      }
    }
  },
  computed: {
    formConfig () {
      return [
        {
          component: 'el-input',
          label: '分类名称',
          prop: 'categoryName',
          required: true
        },
        {
          component: 'el-input',
          label: '分类级别',
          prop: 'categoryLevel',
          required: true
        },
        {
          component: 'el-input',
          label: '排序',
          prop: 'categoryOrder'
        },
        {
          component: 'el-input',
          label: '分数',
          prop: 'score'
        },
        {
          component: 'el-input',
          label: '分类描述',
          prop: 'remark',
          props: {
            type: 'textarea',
            rows: 4
          }
        }
      ]
    },
    config () {
      return {
        searchConfig: [],
        columns: [

        ],
        requestConfig: {
          api: ''
        }
      }
    }
  },
  watch: {},
  created () {
    this.getCategoryTree()
  },
  methods: {
    async getCategoryTree() {
      const { data } = await categoryTree({ type: '1' })
      this.treeData = data
    },
    nodeChange (node) {
      console.log(node)
    },
    nodeAppend (node) {
      console.log('append', node)
      this.visible = true
    },
    nodeEdit (node) {
      console.log('edit', node)
    },
    nodeRemove (node) {
      console.log('remove', node)
    },
    categorySubmit (callback) {

    }
  }
}
</script>

<style lang='scss' scoped>
.page {
  display: flex;
  width: 100%;
  height: calc(100vh - 104px);
  .page-left {
    width: 300px;
    padding: 16px;
    border-right: 1px solid #eee;
  }
  .page-right {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }
}
</style>
