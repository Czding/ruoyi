<template>
  <div class="app-container">
    <d-search-table ref="searchTableRef" :config="config">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="paperAppend">新增试卷</el-button>
    </d-search-table>
    <d-dialog form-refs="formRef" v-model="visible" :title="`${cid ? '编辑' : '新增'}试卷`" width="600px" @submit="paperSubmit">
      <d-form ref="formRef" v-model="form" :config="formConfig" direction="line" label-width="120px"></d-form>
    </d-dialog>
  </div>
</template>

<script>
import { paperInsert, paperUpdate, paperDeleteById, paperSelectList } from '@/api/exam/paper'
import { categoryTree } from '@/api/exam/category'

import pattern from '@/exports/pattern'

export default {
  components: {},
  data() {
    return {
      visible: false,
      cid: '',
      form: {
        name: '',
        categoryIds: [],
        examTime: '',
        categoryScore: '',
        paperScore: '',
        passScore: '',
        paperNum: '',
        imgUrl: [],
        remark: ''
      },
      treeData: []
    }
  },
  computed: {
    config() {
      return {
        searchConfig: [
          {
            component: 'el-input',
            label: '试卷名称',
            prop: 'paperName',
            placeholder: '请输入试卷名称'
          }
        ],
        columns: [
          {
            label: '试卷名称',
            prop: 'name',
            minWidth: '140px'
          },
          {
            label: '题目数量',
            prop: 'paperNum',
            minWidth: '100px'
          },
          {
            label: '题目分数',
            prop: 'categoryScore',
            minWidth: '100px'
          },
          {
            label: '通过分数',
            prop: 'passScore',
            minWidth: '100px'
          },
          {
            label: '考试时间(分钟)',
            prop: 'examTime',
            minWidth: '120px'
          },
          {
            label: '创建时间',
            prop: 'createTime',
            width: '170px'
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: '140px'
          },
          {
            label: '操作',
            prop: 'action',
            component: 'buttonGroup',
            list: [
              { name: '编辑', method: this.paperEdit },
              { name: '删除', showConfirm: true, title: '是否确认删除？', method: this.paperRemove }
            ],
            width: '100px'
          }
        ],
        requestConfig: {
          method: this.getData
        }
      }
    },
    formConfig() {
      return [
        {
          component: 'el-input',
          label: '试卷名称',
          prop: 'name',
          required: true
        },
        {
          component: 'el-cascader',
          label: '试卷分类',
          prop: 'categoryIds',
          width: '100%',
          props: {
            props: {
              label: 'name',
              value: 'id',
              multiple: true,
              emitPath: false
            },
            options: this.treeData
          },
          required: true
        },
        {
          component: 'el-input',
          label: '题目数量',
          prop: 'paperNum',
          required: true,
          rules: [
            {
              required: true,
              message: '请输入题目分数',
              trigger: 'blur'
            },
            {
              pattern: pattern.POSITIVE_INTEGER_REGX,
              message: '请输入正整数',
              trigger: 'blur'
            }
          ]
        },
        {
          component: 'el-input',
          label: '题目分数',
          prop: 'categoryScore',
          required: true,
          rules: [
            {
              required: true,
              message: '请输入题目分数',
              trigger: 'blur'
            },
            {
              pattern: pattern.POSITIVE_INTEGER_REGX,
              message: '请输入正整数',
              trigger: 'blur'
            }
          ]
        },
        {
          component: 'el-input',
          label: '试卷通过分数',
          prop: 'passScore',
          required: true,
          rules: [
            {
              required: true,
              message: '请输入试卷通过分数',
              trigger: 'blur'
            },
            {
              pattern: pattern.POSITIVE_INTEGER_REGX,
              message: '请输入正整数',
              trigger: 'blur'
            }
          ]
        },
        {
          component: 'el-input',
          label: '考试时间(分钟)',
          prop: 'examTime',
          required: true,
          rules: [
            {
              required: true,
              message: '请输入考试时间',
              trigger: 'blur'
            },
            {
              pattern: pattern.POSITIVE_INTEGER_REGX,
              message: '请输入正整数',
              trigger: 'blur'
            }
          ]
        },
        {
          component: 'd-upload',
          label: '试卷图片',
          prop: 'imgUrl',
          props: {
            limitType: ['png','jpg','jpeg','bmp','webp']
          },
        },
        {
          component: 'el-input',
          label: '备注',
          prop: 'remark',
          props: {
            type: 'textarea',
            rows: 4
          }
        }
      ]
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
      console.log(222)
    },
    async getData(params) {
      const { data } = await paperSelectList(params)
      return {
        data: data.list,
        total: data.total
      }

    },
    paperAppend () {
      this.cid = ''
      this.form = {
        name: '',
        categoryIds: [],
        examTime: '',
        categoryScore: '',
        paperScore: '',
        passScore: '',
        paperNum: '',
        imgUrl: [],
        remark: ''
      }
      this.visible = true
    },
    paperEdit (row) {
      this.cid = row.id
      this.visible = true
      this.$nextTick(() => {
        this.form = {
          name: row.name,
          categoryIds: row.categoryIds,
          imgUrl: row.imgUrl ? [row.imgUrl] : [],
          remark: row.remark,
          id: row.id,
          examTime: row.examTime,
          categoryScore: row.categoryScore,
          paperScore: row.paperScore,
          passScore: row.passScore,
          paperNum: row.paperNum
        }
      })
    },
    async paperRemove (callback, row) {
      console.log(111, row)
      try {
        await paperDeleteById({
          id: row.id
        })
        this.$message.success('删除成功')
        this.$refs.searchTableRef.search()
        callback()
      } catch (error) {
        callback(Error())
      }
    },
    async paperSubmit (callback) {
      try {
        const params = { ...this.form }
        params.imgUrl = params.imgUrl.length ? (params.imgUrl[0].fileUrl || params.imgUrl[0]) : ''
        params.paperScore = Number(params.categoryScore) * Number(params.paperNum)
        if (this.cid) {
          await paperUpdate({ ...params, id: this.cid })
          this.$message.success('修改成功')
        } else {
          await paperInsert(params)
          this.$message.success('新增成功')
        }
        this.$refs.searchTableRef.search()
        callback()
      } catch (error) {
        callback(Error())
      }
    }
  }
}
</script>

<style lang='scss' scoped></style>
