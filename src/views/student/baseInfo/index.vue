<!-- 租户管理 -->
<template>
  <div class="app-container">
    <d-search-table ref="searchTable" :config="config">
      <el-button type="primary" size="mini" @click="addItem">新增</el-button>
    </d-search-table>
    <d-dialog :title="cid ? '修改' : '新增'" width="600px" form-refs="form" v-model="visible" @submit="submit">
      <d-form ref="form" v-model="form" :config="formConfig"></d-form>
    </d-dialog>
  </div>
</template>

<script>
import { tenantSelectPageList, tenantInsert, tenantEdit, tenantEditStatus } from '@/api/tenement'

export default {
  components: {},
  data () {
    return {
      visible: false,
      form: {
        tenantName: '',
        phone: '',
        email: '',
        remark: ''
      },
      cid: ''
    }
  },
  computed: {
    config () {
      return {
        searchConfig: [
          {
            component: 'el-input',
            label: '租户名称',
            prop: 'tenantName'
          },
          {
            component: 'el-input',
            label: '手机号码',
            prop: 'phone'
          },
          {
            component: 'el-select',
            label: '状态',
            prop: 'status',
            options: this.$enum.S_STATUS
          },
        ],
        columns: [
          {
            label: '租户名称',
            prop: 'tenantName',
            minWidth: '100px'
          },
          {
            label: '租户编码',
            prop: 'tenantCode',
            minWidth: '100px',
          },
          {
            label: '手机号码',
            prop: 'phone',
            minWidth: '140px'
          },
          {
            label: '邮箱',
            prop: 'email',
            minWidth: '140px'
          },
          {
            label: '状态',
            prop: 'status',
            component: 'dict',
            code: 'S_STATUS',
            minWidth: '100px'
          },
          {
            label: '备注',
            prop: 'remark',
            component: 'dict',
            code: 'S_COUNTRY',
            minWidth: '80px'
          },
          {
            component: 'buttonGroup',
            list: [
              { name: '修改', method: this.handleEdit },
              { name: '停用', hide: row => row.status === '1', method: this.handleStatus },
              { name: '启用', hide: row => row.status === '0', method: this.handleStatus }
            ]
          }
        ],
        requestConfig: {
          api: tenantSelectPageList
        }
      }
    },
    formConfig () {
      return [
        {
          component: 'el-input',
          label: '租户名称',
          prop: 'tenantName',
          required: true
        },
        {
          component: 'el-input',
          label: '手机号码',
          prop: 'phone',
          required: true
        },
        {
          component: 'el-input',
          label: '邮箱',
          prop: 'email'
        },
        {
          component: 'el-input',
          label: '备注',
          prop: 'remark'
        },
      ]
    }
  },
  watch: {},
  created () {},
  methods: {
    addItem () {
      this.form = {
        tenantName: '',
        phone: '',
        email: '',
        remark: ''
      }
      this.visible = true
    },
    handleEdit (row) {
      console.log(row)
      this.form = { ...row }
      this.cid = row.id
      this.visible = true
    },
    async handleStatus (row) {
      await tenantEditStatus({
        id: row.id,
        status: row.status === '1' ? '0' : '1'
      })
      this.$message.success('操作成功')
      this.$refs.searchTable.search()
    },
    async submit (callback) {
      try {
        if (this.cid) {
          await tenantEdit({ ...this.form, id: this.cid })
        } else {
          await tenantInsert(this.form)
        }
        this.$message.success('操作成功')
        this.$refs.searchTable.search()
        callback()
      } catch (e) {
        callback(Error())
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
