<!-- banner图 -->
<template>
  <div class="app-container">
    <el-col>
      <el-button type="primary" size="mini" class="mb16" @click="addItem">新增</el-button>
      <d-search-table ref="searchTable" :config="config"></d-search-table>
    </el-col>
    <d-dialog title="文件上传" width="600px" form-refs="form" v-model="visible" @submit="submit">
      <d-form ref="form" v-model="form" :config="formConfig"></d-form>
    </d-dialog>
    <d-dialog title="预览" width="1000px" v-model="previewVisible" :show-button="false">
      <img style="width: 960px;height: 540px;object-fit: cover;" :src="url" alt="">
    </d-dialog>
  </div>
</template>

<script>
import { userFileList, userFileDeleteById, insertUserFile } from "@/api/student"

export default {
  components: {},
  data () {
    return {
      visible: false,
      form: {
        fileList: []
      },
      previewVisible: false,
      url: ''
    }
  },
  computed: {
    config () {
      return {
        searchConfig: [],
        columns: [
          {
            label: '文件名称',
            prop: 'originalFileName',
          },
          {
            component: 'buttonGroup',
            label: '操作',
            width: '200px',
            list: [
              { name: '预览',  method: this.handlePreview },
              { name: '删除',  method: this.handleDelete }
            ]
          }
        ],
        requestConfig: {
          api: userFileList,
          params: {
            fileProperty: '7'
          }
        }
      }
    },
    formConfig () {
      return [
        {
          component: 'd-upload',
          label: 'banner图',
          prop: 'fileList',
          props: {
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
            fileProperty: '7'
          }))
        }
        console.log(params)
        await insertUserFile(params)
        this.$message.success('新增成功')
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
