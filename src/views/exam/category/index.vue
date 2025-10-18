<template>
  <div class="page">
    <div class="page-left">
      <div class="flex-items-center flex-content-between">
        <div class="mt">
          题目分类
        </div>
        <div>
          <el-button class="mb16" type="text" @click="importFile">导入</el-button>
          <el-button class="mb16" type="text" icon="el-icon-plus" @click="nodeAppend()">
            新增
          </el-button>
        </div>
      </div>
      <d-filter-tree class="flex-1-auto" :data="treeData" node-key="id" :current-default="node => node.id"
        :current-key="nodeData.id" :props="{
          label: 'name',
          value: 'id'
        }" :button-props="{
          append: node => node.categoryLevel === '1',
          edit: true,
          remove: true
        }" @node-change="nodeChange" @node-append="nodeAppend" @node-edit="nodeEdit" @node-remove="nodeRemove" />
    </div>
    <div class="page-right">
      <d-search-table ref="searchTableRef" :config="config" v-if="nodeData.categoryLevel === '2'">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="topicAppend">新增题目</el-button>
      </d-search-table>
    </div>
    <d-dialog form-refs="formRef" v-model="visible" :title="`${handleType === 'edit' ? '编辑' : '新增'}分类`" width="600px"
      @submit="categorySubmit">
      <d-form ref="formRef" v-model="form" :config="formConfig" direction="line" label-width="80px"></d-form>
    </d-dialog>
    <d-dialog form-refs="formRef2" v-model="visible2" :title="`${handleType === 'edit' ? '编辑' : '新增'}题目`" width="600px"
      @submit="topicSubmit">
      <d-form ref="formRef2" v-model="form2" :config="formConfig2" direction="line" label-width="80px"></d-form>
    </d-dialog>
    <d-import-file
      v-model="importVisible"
      title="批量导入"
      :template-url="templateUrl"
      @submit="importSubmit"
    />

  </div>
</template>

<script>
import { categoryTree, categorySelectList, categoryInsert, categoryEdit, categoryDeleteById, categoryImport } from '@/api/exam/category'
import TopicOption from './topicOption.vue'
import pattern from '@/exports/pattern'
import { getToken } from '@/utils/auth'

export default {
  components: {
    TopicOption
  },
  data() {
    return {
      treeData: [],
      nodeData: {},
      visible: false,
      visible2: false,
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
      form2: {
        parentId: '',
        categoryName: '',
        topicCmdList: [],
        score: '',
        remark: ''
      },
      handleType: 'add',
      cid: '',
      importVisible: false
    }
  },
  computed: {
    templateUrl () {
      return `http://47.99.204.6:8001/lxqh/work/category/downloadTemplate?accesstoken=${getToken()}`
    },
    formConfig() {
      return [
        {
          component: 'el-input',
          label: '分类名称',
          prop: 'categoryName',
          required: true
        },
        // {
        //   component: 'el-input',
        //   label: '分类层级',
        //   prop: 'categoryLevel',
        //   required: true
        // },
        {
          component: 'el-input',
          label: '排序',
          prop: 'categoryOrder'
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
    formConfig2() {
      return [
        {
          component: 'el-input',
          label: '题目名称',
          prop: 'categoryName',
          required: true
        },
        {
          component: TopicOption,
          label: '题目选项',
          prop: 'topicCmdList',
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value.length === 0) {
                  callback(new Error('请添加题目选项'))
                } else {
                  if (value.some(item => item.topicName === '')) {
                    callback(new Error('请填写完整题目名称'))
                  } else if (value.every(item => item.isResult === '0')) {
                    callback(new Error('请设置答案'))
                  } else {
                    callback()
                  }
                }
              }
            }
          ]
        },
        {
          component: 'el-input',
          label: '分数',
          prop: 'score',
          rules: [
            { required: true, message: '请输入分数', trigger: 'blur' },
            { pattern: pattern.POSITIVE_INTEGER_REGX, message: '请输入正确数字', trigger: 'blur' }

          ]
        },
        {
          component: 'el-input',
          label: '解析',
          prop: 'remark',
          props: {
            type: 'textarea',
            rows: 4
          }
        }
      ]
    },
    config() {
      return {
        searchConfig: [
          {
            component: 'el-input',
            label: '题目名称',
            prop: 'categoryName'
          }
        ],
        columns: [
          {
            label: '题目名称',
            prop: 'categoryName',
            minWidth: '200px'
          },
          {
            label: '分值',
            prop: 'score',
            minWidth: '100px'
          },
          {
            label: '解析',
            prop: 'remark',
            minWidth: '200px'
          },
          {
            label: '操作',
            prop: 'action',
            component: 'buttonGroup',
            list: [
              { name: '编辑', method: this.topicEdit },
              { name: '删除', showConfirm: true, title: '是否确认删除？', method: this.topicRemove }
            ],
            width: '100px'
          }
        ],
        requestConfig: {
          api: categorySelectList,
          params: {
            id: this.nodeData.id
          },
          autoRequest: false
        }
      }
    }
  },
  watch: {},
  created() {
    this.getCategoryTree()
  },
  methods: {
    async getCategoryTree() {
      const { data } = await categoryTree({ type: '1' })
      this.treeData = data
    },
    nodeChange(node) {
      console.log(111, node)
      this.nodeData = node
      this.$nextTick(() => {
        this.$refs.searchTableRef?.search()
      })
    },
    nodeAppend(node) {
      console.log('append', node)
      this.handleType = 'add'
      this.nodeData = node ? node.data : {}
      this.visible = true
      this.form = {
        parentId: this.nodeData.id,
        categoryName: '',
        categoryType: '1',
        categoryLevel: Number(this.nodeData.categoryLevel || 0) + 1,
        categoryOrder: '',
        idFullPath: '',
        score: '1',
        remark: '',
        id: ''
      }
      this.form.parentId = this.nodeData.id
    },
    nodeEdit(node) {
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
    async nodeRemove(node) {
      await this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await categoryDeleteById({
        id: node.data.id
      })
      this.$message.success('删除成功')
      this.getCategoryTree()
    },
    async categorySubmit(callback) {
      try {
        if (this.handleType === 'edit') {
          await categoryEdit(this.form)
          this.$message.success('更新成功')
          this.visible = false
          this.getCategoryTree()
          callback()
        } else {
          await categoryInsert({ ...this.form, idFullPath: this.nodeData.idFullPath })
          this.$message.success('新增成功')
          this.visible = false
          this.getCategoryTree()
          callback()
        }
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    importFile () {
      this.importVisible = true
    },
    async importSubmit (file, callback) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        await categoryImport(formData)
        this.$message.success('导入成功')
        this.getCategoryTree()
        callback()
      } catch (err) {
        callback(Error())
      }
    },

    topicAppend() {
      this.cid = ''
      this.form2 = {
        parentId: this.nodeData.id,
        categoryName: '',
        topicCmdList: [],
        remark: '',
        score: '1',
        categoryLevel: Number(this.nodeData.categoryLevel || 0) + 1,
        idFullPath: this.nodeData.idFullPath
      }
      this.visible2 = true
    },
    topicEdit(row) {
      console.log(row)
      this.cid = row.id
      this.form2 = {
        parentId: this.nodeData.id,
        categoryName: row.categoryName,
        topicCmdList: row.topicVoList,
        remark: row.remark,
        score: row.score,
        id: row.id,
        categoryLevel: row.categoryLevel,
        idFullPath: row.idFullPath
      }
      this.visible2 = true
    },
    async topicRemove(callback, row) {
      try {
        await categoryDeleteById({
          id: row.id
        })
        this.$message.success('删除成功')
        this.$refs.searchTableRef.search()
        callback()
      } catch (error) {
        callback(Error())
      }
    },
    async topicSubmit(callback) {
      try {
        if (this.cid) {
          await categoryEdit({ ...this.form2, categoryType: '2', id: this.cid })
          this.$message.success('更新成功')
          this.visible2 = false
          this.$refs.searchTableRef.search()
          callback()
        } else {
          await categoryInsert({ ...this.form2, categoryType: '2' })
          this.$message.success('新增成功')
          this.visible2 = false
          this.$refs.searchTableRef.search()
          callback()
        }
      } catch (error) {
        console.log(2)
        this.$message.error(error.message)
        callback(Error())
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
