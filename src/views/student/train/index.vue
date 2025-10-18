<template>
  <div class="app-container">
    <el-col>
     <d-search-table ref="tableRef" :config="config"></d-search-table>
    </el-col>
    <d-dialog title="详情" v-model="detailVisible" width="800px" :show-button="false">
      <d-descriptions :data="data" :config="desConfig" :column="2"></d-descriptions>
    </d-dialog>
  </div>
</template>

<script>
import { selectListNew, nextStudy } from "@/api/student"

export default {
  data() {
    return {
      data: {},
      detailVisible: false,
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
            label: '理论考试通过次数',
            prop: 'testPassNum',
            minWidth: '120px'
          },
          {
            label: '理论考试总次数',
            prop: 'testExamNum',
            minWidth: '100px'
          },
          {
            label: '操作',
            width: '130px',
            component: 'buttonGroup',
            list: [
              { name: '详情', method: this.handleDetail },
              { name: '下阶段学习', method: this.handleNextStep }
            ]
          }
        ],
        requestConfig: {
          api: selectListNew,
          params: {
            studyStatus: '1'
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
    }
  },
  methods: {
    handleDetail (row) {
      this.data = row
      this.detailVisible = true
    },
    search () {
      this.$refs.tableRef.search()
    },
    async handleNextStep (row) {
      await this.$confirm('是否进行下阶段学习?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await nextStudy({
        userId: row.userId
      })
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.search()
    }
  }
}
</script>