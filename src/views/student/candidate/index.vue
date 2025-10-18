<template>
  <div class="app-container">
    <el-col>
     <d-search-table ref="tableRef" :config="config">
      <div>
        <el-button type="primary" size="mini" @click="exportInfo">导出信息</el-button>
        <el-button type="primary" size="mini" @click="exportAttach">导出附件</el-button>
      </div>
     </d-search-table>
    </el-col>
    <d-dialog title="详情" v-model="detailVisible" width="800px" :show-button="false">
      <d-descriptions :data="data" :config="desConfig" :column="2"></d-descriptions>
    </d-dialog>
    <d-dialog form-refs="formRef" :title="title" v-model="visible" width="500px" @submit="handleSubmit">
      <d-form ref="formRef" v-model="form" :config="formConfig"></d-form>
    </d-dialog>
    <d-dialog title="补考记录" v-model="failVisible" width="600px" :show-button="false">
      <d-table v-if="failVisible" :columns="columns" index :requestConfig="requestConfig"></d-table>
    </d-dialog>
  </div>
</template>

<script>
import { selectListNew, recommendExam, examPass, examMakeUpInsert, examMakeUpList, exportUser, exportUserFile } from "@/api/student"

export default {
  data() {
    return {
      data: {},
      detailVisible: false,
      visible: false,
      title:'',
      userId: '',
      form: {
        studyStatus: '',
        graduationTime: '',
        exam: []
      },
      failVisible: false
    }
  },
  computed: {
    config () {
      return {
        searchConfig: [
          {
            component: 'el-input',
            label: '姓名',
            prop: 'userName'
          },
          {
            component: 'el-input',
            label: '联系电话',
            prop: 'phonenumber'
          },
          {
            component: 'el-select',
            label: '是否推荐考试',
            prop: 'isExam',
            options: this.$enum.S_WHETHER_STR
          },
        ],
        columns: [
          {
            label: '姓名',
            prop: 'userName',
            minWidth: '100px'
          },
          {
            label: '性别',
            prop: 'sex',
            minWidth: '100px',
            component: 'dict',
            code: 'S_SEX'
          },
          {
            label: '证件号码',
            prop: 'cardNumber',
            minWidth: '140px'
          },
          {
            label: '联系电话',
            prop: 'phonenumber',
            minWidth: '140px'
          },
          {
            label: '入学时间',
            prop: 'studyTime',
            minWidth: '140px'
          },
          {
            label: '模拟器打卡次数',
            prop: 'simulatorNum',
            minWidth: '120px'
          },
          {
            label: '实操打卡次数',
            prop: 'operationNum',
            minWidth: '100px'
          },
          {
            component: 'dict',
            label: '是否推荐考试',
            prop: 'isExam',
            code: 'S_WHETHER_STR'
          },
          {
            label: '操作',
            width: '240px',
            component: 'buttonGroup',
            list: [
              { name: '详情', method: this.handleDetail },
              { name: '补考记录', method: (row) => {
                this.failVisible = true
                this.userId = row.userId
              } },
              { 
                name: '推荐考试', 
                hide: row => row.isExam === '1', 
                method: this.handleRecommendExam 
              },
              { 
                name: '考试通过', 
                hide: row => row.isExam === '0', 
                method: this.handlePass 
              },
              { 
                name: '挂科', 
                hide: row => row.isExam === '0', 
                method: this.handleFail 
              }
            ]
          }
        ],
        requestConfig: {
          api: selectListNew,
          params: {
            studyStatus: '3', 
            examStatus: '2'
          }
        }
      }
    },
    desConfig () {
      return [
        {
          label: '姓名',
          prop: 'userName'
        },
        {
          label: '性别',
          prop: 'sex',
          component: 'dict',
          code: 'S_SEX'
        },
        {
          label: '联系电话',
          prop: 'phonenumber'
        },
        {
          label: '背题总次数',
          prop: 'reciteNum'
        },
        {
          label: '模拟考试总次数',
          prop: 'testExamNum'
        },
        {
          label: '理论考试次数',
          prop: 'testExamNum'
        },
        {
          label: '实操基础次数',
          prop: 'operationNum'
        },
        {
          label: '实操考试次数',
          prop: 'operationNum'
        }
      ]
    },
    formConfig () {
      return [
        {
          hide: this.title !== '考试通过',
          component: 'el-date-picker',
          label: '结业时间',
          prop: 'graduationTime',
          width: '100%',
          props: {
            type: 'date',
            valueFormat: 'yyyy-MM-dd'
          },
          required: true
        },
        {
          hide: this.title !== '挂科',
          component: 'el-select',
          label: '挂科科目',
          prop: 'exam',
          width: '100%',
          props: {
            multiple: true
          },
          options: this.$enum.S_SUBJECT,
          required: true
        }
      ]
    },
    requestConfig () {
      return {
        method: this.getData
      }
    },
    columns () {
      return [
        {
          label: '挂科科目',
          prop: 'examJson',
          component: 'dict',
          code: 'S_SUBJECT'
        }
      ]
    }
  },
  methods: {
    async getData (params) {
      const { data } = await examMakeUpList({
        ...params,
        belongUserId: this.userId
      })
      return {
        data: data.list.map(item => ({ ...item, examJson: item.examJson.split(',')})),
        total: data.total
      }
    },
    search () {
      this.$refs.tableRef.search()
    },
    handleDetail (row) {
      this.data = row
      this.detailVisible = true
    },
    async handleRecommendExam (row) {
      await this.$confirm('是否推荐考试?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await recommendExam({
        userId: row.userId
      })
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.search()
    },
    async handlePass (row) {
      this.title = '考试通过'
      this.userId = row.userId
      this.visible = true
    },
    async handleFail (row) {
      this.title = '挂科'
      this.userId = row.userId
      this.visible = true
    },
    async exportInfo () {
      const params = {
        ...this.$refs.tableRef.form,
        studyStatus: '3', 
        examStatus: '2'
      }
      this.download('system/user/exportUser', {
        ...params
      }, `用户信息_${new Date().getTime()}.xlsx`, {
        transformRequest: (params) => {
          return JSON.stringify(params)
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    exportAttach () {
      const params = {
        ...this.$refs.tableRef.form,
        studyStatus: '3', 
        examStatus: '2'
      }
      this.download('system/user/exportUserFile', {
        ...params
      }, `用户附件_${new Date().getTime()}.xlsx`, {
        transformRequest: (params) => {
          return JSON.stringify(params)
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    async handleSubmit (callback) {
      try {
        if (this.title === '学习退回') {
          await studyBack({
            userId: this.userId,
            studyStatus: '1'
          })
        } else if (this.title === '考试通过') {
          await examPass({
            userId: this.userId,
            graduationTime: this.form.graduationTime
          })
        } else if (this.title === '挂科') {
           await examMakeUpInsert({
            belongUserId: this.userId,
            examJson: this.form.exam.join(',')
          })
        }
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.search()
        callback()
      } catch (e) {
        console.log(e)
        callback(Error())
      }
      
    }
  }

}
</script>