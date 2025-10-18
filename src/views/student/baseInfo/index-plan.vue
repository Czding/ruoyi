<!-- 课程安排 -->
<template>
  <div class="app-container">
    <el-col>
      <el-button type="primary" size="mini" class="mb16" @click="addItem">新增</el-button>
      <d-search-table ref="searchTable" :config="config"></d-search-table>
    </el-col>
    <d-dialog :title="cid ? '修改' : '新增'" width="400px" form-refs="form" v-model="visible" @submit="submit">
      <d-form ref="form" v-model="form" :config="formConfig"></d-form>
    </d-dialog>
    <d-dialog title="预览" width="1000px" v-model="previewVisible" :show-button="false">
      <img style="width: 960px;height: 540px;object-fit: cover;" :src="url" alt="">
    </d-dialog>
  </div>
</template>

<script>
import { userFileList, userFileDeleteById, insertUserFile, userFileUpdate } from "@/api/student"

export default {
  components: {},
  data () {
    return {
      visible: false,
      form: {
        name: '',
        fileList: []
      },
      previewVisible: false,
      url: '',
      cid: ''
    }
  },
  computed: {
    config () {
      return {
        searchConfig: [],
        columns: [
          {
            label: '课程名称',
            prop: 'originalFileName',
          },
          {
            component: 'buttonGroup',
            label: '操作',
            width: '200px',
            list: [
              { name: '预览',  method: this.handlePreview },
              { name: '修改',  method: this.handleUpdate },
              { name: '删除',  method: this.handleDelete }
            ]
          }
        ],
        requestConfig: {
          api: userFileList,
          params: {
            fileProperty: '8'
          }
        }
      }
    },
    formConfig () {
      return [
        {
          component: 'el-input',
          label: '课程名称',
          prop: 'name',
          required: true
        },
        {
          component: 'd-upload',
          label: '课程安排图片',
          prop: 'fileList',
          props: {
            limit: 1,
            limitType: ['png','jpg','jpeg','bmp','webp']
          },
          required: true
        },
      ]
    }
  },
  watch: {},
  created () {},
  methods: {
    addItem () {
      this.visible = true
    },
    handleUpdate (row) {
      this.cid = row.id
      this.form = {
        name: row.originalFileName,
        fileList: [row]
      }
      this.visible = true
    },
    handlePreview (row) {
      this.previewVisible = true
      this.url = row.filePath
    },
    async handleDelete (row) {
      await this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await userFileDeleteById({
        id: row.id
      })
      this.$message.success('删除成功')
      this.$refs.searchTable.search()
    },
    async submit (callback) {
      try {
        const params = {
          belongUserId: this.$store.getters.id,
          cmdList: this.form.fileList.map(item => ({
            ...item,
            originalFileName: this.form.name,
            fileProperty: '8'
          }))
        }
        if (this.cid) {
          await userFileUpdate(params)
        } else {
          await insertUserFile(params)
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
