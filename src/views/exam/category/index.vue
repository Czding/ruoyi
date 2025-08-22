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
        :current-default="node => node.id"
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
      <d-search-table ref="searchTableRef" :config="config">
        <el-button type="primary" @click="nodeAppend(this.node)">新增题目</el-button>
      </d-search-table>
    </div>
    <d-dialog form-refs="formRef" v-model="visible" :title="`${handleType === 'edit' ? '编辑' : '新增'}分类`" width="600px" @submit="categorySubmit">
      <d-form ref="formRef" v-model="form" :config="formConfig"></d-form>
    </d-dialog>
  </div>
</template>

<script>
import { categoryTree, categorySelectList, categoryInsert, categoryEdit } from '@/api/exam/category'

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
        remark: '',
        id: ''
      },
      handleType: 'add'
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
          label: '分类层级',
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
          {
            label: '题目名称',
            prop: '',
            minWidth: '120px'
          },
          {
            label: '分类名称',
            prop: 'categoryName',
            minWidth: '120px'
          },
          {
            label: '试题类型',
            prop: '',
            width: '120px'
          },
          {
            label: '难度',
            prop: '',
            width: '100px'
          },
          {
            label: '分值',
            prop: 'score',
            width: '100px'
          },
          {
            label: '正确答案',
            prop: '',
            width: '100px'
          },
        ],
        requestConfig: {
          api: categorySelectList,
          params: {
            //id: this.nodeData.id
          },
          autoRequest: false
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
      console.log(111, node)
      this.nodeData = node
      this.$nextTick(() => {
        this.$refs.searchTableRef.search()
      })
    },
    nodeAppend (node) {
      console.log('append', node)
      this.handleType = 'add'
      this.nodeData = node ? node.data : {}
      this.visible = true
      this.form = {
        parentId: this.nodeData.id,
        categoryName: '',
        categoryType: '2',
        categoryLevel: Number(this.nodeData.categoryLevel || 0) + 1,
        categoryOrder: '',
        idFullPath: '',
        score: '',
        remark: '',
        id: ''
      }
      this.form.parentId = this.nodeData.id
    },
    nodeEdit (node) {
      console.log('edit', node)
      this.handleType = 'edit'
      this.nodeData = node.data
      this.visible = true
      this.form = {
        parentId: this.nodeData.parentId,
        categoryName: this.nodeData.name,
        categoryLevel: this.nodeData.categoryLevel,
        categoryOrder: this.nodeData.weight,
        idFullPath: this.nodeData.idFullPath,
        score: this.nodeData.score,
        remark: this.nodeData.remark,
        id: this.nodeData.id
      }
    },
    nodeRemove (node) {
      console.log('remove', node)
    },
    async categorySubmit (callback) {
      try {
        if (this.handleType === 'edit') {
          await categoryEdit(this.form)
          this.$message.success('更新成功')
          this.visible = false
          this.getCategoryTree()
          callback()
        } else {
          await categoryInsert(this.form)
          this.$message.success('新增成功')
          this.visible = false
          this.getCategoryTree()
          callback()
        }
      } catch (error) {
        this.$message.error(error.message)
      }
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
