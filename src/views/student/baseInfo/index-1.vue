<template>
  <div class="app-container">
    <el-col>
     <d-search-table :config="config"></d-search-table>
    </el-col>
  </div>
</template>

<script>
import { selectListNew } from "@/api/student"

export default {
  data() {
    return {

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
            label: '证件类型',
            prop: 'cardType',
            component: 'dict',
            code: 'S_CARD_TYPE',
            minWidth: '100px'
          },
          {
            label: '证件号码',
            prop: 'cardNumber',
            minWidth: '140px'
          },
          {
            label: '国籍',
            prop: 'country',
            component: 'dict',
            code: 'S_COUNTRY',
            minWidth: '80px'
          },
          {
            label: '民族',
            prop: 'nation',
            minWidth: '80px',
            component: 'dict',
            code: 'S_NATION',

          },
          {
            label: '出生日期',
            prop: 'birth',
            width: '140px'
          },
          {
            label: '地址',
            prop: 'address',
            minWidth: '160px'
          },
          {
            label: '联系电话',
            prop: 'phonenumber',
            minWidth: '140px'
          },
          {
            label: '邮箱',
            prop: 'email',
            minWidth: '140px'
          },
          {
            label: '邮政编码',
            prop: 'postalCode',
            minWidth: '100px'
          },
          {
            label: '入学时间',
            prop: 'studyTime',
            width: '140px'
          },
          {
            label: '模拟考试通过次数',
            prop: 'testPassNum',
            minWidth: '130px'
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
          }
        ],
        requestConfig: {
          api: selectListNew,
          params: {
            userProperty: '3'
          }

        }
      }
    }
  },
  methods: {

  }

}
</script>