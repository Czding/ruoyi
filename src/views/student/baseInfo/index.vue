<!-- 课程视频 -->
<template>
  <div class="app-container">
    <el-col>
      <d-search-table ref="searchTable" :config="config">
        <el-button type="primary" size="mini" @click="addItem">新增</el-button>
      </d-search-table>
    </el-col>
    <d-dialog :title="cid ? '修改' : '新增'" width="400px" form-refs="form" v-model="visible" @submit="submit">
      <d-form ref="form" v-model="form" :config="formConfig"></d-form>
    </d-dialog>
    <d-dialog title="预览" width="1000px" v-model="previewVisible" :show-button="false">
      <video style="width: 960px;height: 540px;" :src="url" controls></video>
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
        courseType: '',
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
        searchConfig: [
          {
            component: 'el-input',
            label: '视频名称',
            prop: 'originalFileName',
          },
          {
            component: 'el-select',
            label: '课程类型',
            prop: 'courseType',
            width: '100%',
            options: this.$enum.S_COURSE_TYPE
          },
        ],
        columns: [
          {
            label: '视频名称',
            prop: 'originalFileName',
          },
          {
            label: '课程类型',
            prop: 'courseType',
            component: 'dict',
            code: 'S_COURSE_TYPE'
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
            fileProperty: '5'
          }
        }
      }
    },
    formConfig () {
      return [
        {
          component: 'el-input',
          label: '视频名称',
          prop: 'name',
          required: true
        },
        {
          component: 'el-select',
          label: '课程类型',
          prop: 'courseType',
          width: '100%',
          required: true,
          options: this.$enum.S_COURSE_TYPE
        },
        {
          component: 'd-upload',
          label: '课程视频',
          prop: 'fileList',
          props: {
            limit: 1,
            limitSize: 2000,
            limitType: ['mp4']
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
        courseType: row.courseType,
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
            courseType: this.form.courseType,
            originalFileName: this.form.name,
            fileProperty: '5'
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
