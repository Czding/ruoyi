<template>
  <d-dialog
    v-model="visible"
    form-refs="importForm"
    :width="width"
    :title="title"
    submit-btn-text="导入"
    submit-btn-icon="el-icon-upload2"
    @submit="submit"
  >
    <el-form
      ref="importForm"
      :model="form"
      :inline="true"
    >
      <el-form-item
        class="import-form-item"
        prop="file"
        label="选择文件"
        :rules="[
          { required: true, message: '请选择文件' }
        ]"
      >
        <div class="custom-file-input">
          <div class="custom-file-content">
            {{ form.file ? form.file.name : '请选择' }}
          </div>
          <el-upload
            :file-list="fileList"
            :show-file-list="false"
            :auto-upload="false"
            action=""
            :on-change="uploadChange"
          >
            <el-button
              type="primary"
              icon="el-icon-folder"
            />
          </el-upload>
        </div>
      </el-form-item>
      <el-button
        v-show="templateUrl"
        icon="el-icon-paperclip"
        type="text"
        @click="downloadFile"
      >
        模板下载
      </el-button>
    </el-form>
    <slot>
      <p>1. 支持导入格式为{{ fileType.join('、') }}的文件，且文件大小不可超过{{ fileSize }}M</p>
      <p>2. 模板的表头不可更改，不可删除</p>
      <p>3. 若导入数据存在编码一致的情况则会更新原有数据</p>
      <p>4. 若导入过程中有问题，需调整模板内容后再重新导入</p>
    </slot>
  </d-dialog>
</template>

<script>
import DDialog from '../dialog'

export default {
  name: 'DImportFile',
  components: { DDialog },
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    modelValue: {
      default: false,
      type: Boolean
    },
    width: {
      default: '520px',
      type: String
    },
    title: {
      default: '',
      type: String
    },
    templateUrl: {
      default: '',
      type: String
    },
    fileType: {
      default: () => ['xlsx', 'xls'],
      type: Array
    },
    fileSize: {
      default: 5,
      type: Number
    }
  },
  data () {
    return {
      fileList: [],
      form: {
        file: ''
      }
    }
  },
  computed: {
    visible: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.form.file = ''
        this.fileList = []
        this.$refs.importForm.clearValidate()
        this.$emit('change', value)
      }
    }
  },
  methods: {
    downloadFile () {
      window.location.href = this.templateUrl
    },
    uploadChange (file, fileList) {
      const isLimit = file.size / 1024 / 1024 < this.fileSize
      const isType = this.fileType.includes(file.name.substr(file.name.lastIndexOf('.') + 1).toLocaleLowerCase())
      if (!isType) {
        this.$message.error(`请上传正确的文件格式（${this.fileType.join('、')}）`)
        return false
      }
      if (!isLimit) {
        this.$message.error(`上传文件大小不能超过${this.fileSize}MB`)
        return false
      }
      this.fileList = fileList
      this.form.file = file.raw
    },
    async submit (callback) {
      if (!this.form.file) {
        this.$message.error('请选择导入文件')
        callback(new Error(false))
        return
      }
      try {
        this.$emit('submit', this.form.file, callback)
      } catch (e) {
        callback(new Error(false))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-file-input {
  display: flex;
  width: 230px;
  .custom-file-content {
    width: 100%;
    height: 32px;
    border: 1px solid #dcdfe6;
    border-right: none;
    border-radius: 2px 0 0 2px;
    padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
