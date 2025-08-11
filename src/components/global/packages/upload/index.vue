<!-- 上传组件 -->
<template>
  <div>
    <div
      v-show="imgOrVideoList.length || !readonly"
      ref="imgList"
      class="img-list el-upload-list el-upload-list--picture-card"
    >
      <div
        v-for="(file, index) in imgOrVideoList"
        v-show="imgOrVideoList.length"
        :key="file.uid"
        class="img-part el-upload-list__item is-success"
      >
        <el-image
          v-if="_hasFileType(imgExts, file)"
          class="el-upload-list__item-thumbnail"
          :src="file.fileUrl"
        />
        <el-image
          v-if="_hasFileType(videoExts, file)"
          class="el-upload-list__item-thumbnail"
          :src="videoBg"
        />
        <span class="el-upload-list__item-actions">
          <span
            v-if="_hasFileType(imgExts, file)"
            class="el-upload-list__item-preview"
            @click="picturePreview(index)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="_hasFileType(videoExts, file)"
            class="el-upload-list__item-preview"
            @click="picturePreview(index)"
          >
            <i class="el-icon-video-play" />
          </span>
          <span
            v-show="!readonly"
            class="el-upload-list__item-delete"
            @click="uploadRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
      <div
        v-show="!readonly && value.length < limit"
        class="img-part el-upload-list__item is-success"
        style="border: none"
      >
        <el-upload
          ref="fileUpload"
          class="custom-upload-files"
          :class="
            showFileList && list.length >= limit && 'custom-upload-files-limit'
          "
          v-bind="$attrs"
          :show-file-list="false"
          action="#"
          :file-list="list"
          list-type="picture-card"
          :http-request="uploadRequest"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          v-on="$listeners"
        >
          <div
            slot="default"
            class="custom-upload-files-content"
          >
            <i class="el-icon-plus" />
          </div>
        </el-upload>
      </div>
    </div>
    <div class="file-list">
      <div
        v-for="file in restFileList"
        :key="file.uid"
        class="el-upload-list__item is-success"
        style="width: 100%; height: auto"
      >
        <a
          class="el-upload-list__item-name"
          :href="file.fileUrl"
          :download="file.name || file.fileName"
        >
          <i class="el-icon-document" />
          {{ file.name || file.fileName }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i
            v-show="!readonly"
            class="el-icon-upload-success el-icon-circle-check"
          />
        </label>
        <i
          v-show="!readonly"
          class="el-icon-close"
          @click="uploadRemove(file)"
        />
      </div>
    </div>
    <div
      v-show="!readonly"
      slot="tip"
      class="el-upload__tip"
    >
      文件大小不超过 {{ limitSizeText }} , 支持扩展名: {{ (_calcLimitType(limitType) || []).join(' ') }}
    </div>
    <file-preview
      v-if="previewVisible"
      v-model="previewVisible"
      :file-arr="imgOrVideoList.map(i=> i.fileUrl)"
    />
  </div>
</template>

<script>
import { get } from 'lodash'
import videoBg from '../../assets/video-play.jpeg'
import { convertBytesToSize } from '@/utils'
import FilePreview from '../file-preview/index.vue'

const imgExts = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg']
const fileExts = ['doc', 'docx', 'pdf']
const videoExts = ['mp4']

export default {
  name: 'DUpload',
  components: { FilePreview },
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    readonly: {
      default: false,
      type: Boolean
    },
    limit: {
      default: 5,
      type: Number
    },
    limitSize: {
      default: 5,
      type: Number
    },
    imgExts: {
      type: Array,
      default: () => imgExts
    },
    fileExts: {
      type: Array,
      default: () => fileExts
    },
    videoExts: {
      type: Array,
      default: () => videoExts
    },
    limitType: {
      default: () => [...imgExts, ...fileExts, ...videoExts],
      type: [Array, String] // 兼容自定义表单配置
    },
    showFileList: {
      default: true,
      type: Boolean
    },
    modelValue: {
      default: () => [],
      type: Array
    },
    onSuccess: {
      default: () => [], // 外部传入上传成功处理函数，备用
      type: Function
    }
  },
  data () {
    return {
      list: [],
      dialogVisible: false,
      dialogImageUrl: '',
      videoBg,
      preveiwIndex: 0,
      previewVisible: false
    }
  },
  computed: {
    value: {
      get () {
        if (this.modelValue && this.modelValue.length && this.modelValue.some(v => typeof v === 'string')) {
          return this.modelValue.filter(url => url).map(url => this._urlToObj(url))
        } else {
          return this.modelValue || []
        }
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    imgOrVideoList () {
      return this.value.filter(
        (item) => this._hasFileType(imgExts.concat(videoExts), item)
      )
    },
    restFileList () {
      return this.value.filter((item) => !this._hasFileType(imgExts.concat(videoExts), item))
    },
    limitSizeText () {
      return convertBytesToSize(Number(this.limitSize || 5) * 1024 * 1024)
    }
  },
  mounted () {
  },
  methods: {
    _hasFileType (files, item) {
      if (!item.fileExt) {
        return false
      }
      return files.includes(item.fileExt.toLowerCase())
    },
    _calcLimitType (limitType) {
      if (typeof limitType === 'string') return limitType.split(',').map(l => l.trim())
      return limitType
    },
    _urlToObj (url) {
      if (typeof url !== 'string') return url
      const name = url.substring(url.lastIndexOf('/') + 1, url.length) // 最后的文件名截取出来
      const fileExt = url.substring(url.lastIndexOf('.') + 1)
      return {
        name,
        fileExt,
        url,
        fileUrl: url
      }
    },
    async uploadRequest (data) {
      const formData = new FormData()
      formData.append('file', data.file)
      const res = await this.$DDWL.upload(formData)
      return res
    },
    beforeUpload (file) {
      const isLimit = file.size / 1024 / 1024 < this.limitSize
      const limitType = this._calcLimitType(this.limitType)
      const isType = limitType.includes(
        file.name.substr(file.name.lastIndexOf('.') + 1)
      )

      if (!isType) {
        this.$message.error(
          `请上传正确的文件格式（${limitType.join('、')}）`
        )
        return false
      }
      if (!isLimit) {
        this.$message.error(`上传文件大小不能超过${this.limitSize}MB`)
        return false
      }
    },
    uploadSuccess (res, file) {
      if (res.code === 200) {
        this.value = this.value.concat({
          ...file,
          ...get(file, 'response.data'),
          fileUrl: get(file, 'response.data.filePath'),
          filePath: get(file, 'response.data.filePath')
        })
        this.$parent.$emit('el.form.change')
      } else {
        this.$message.error(res.message)
      }
    },
    uploadError (res) {
      console.log('upload error', res)
    },
    uploadRemove (file) {
      this.value = this.value.filter(item => item.fileUrl !== file.fileUrl)
      // const index = this.value.findIndex((item) => item.fileUrl === file.fileUrl)
      // index > -1 && this.value.splice(index, 1)
      this.$parent.$emit('el.form.change')
    },
    picturePreview (index) {
      this.preveiwIndex = index
      this.previewVisible = true
    }
  }
}
</script>

<style lang='scss' scoped>
.custom-upload-files-content {
  display: inline-block;
  width: 80px;
  height: 80px;
  text-align: center;
  & > span {
    line-height: 16px;
    margin-top: 4px;
    color: #999;
    font-size: 12px;
  }
  i {
    text-align: center;
  }
}
.custom-upload-files {
  display: inline-block;
}
.custom-upload-files-limit {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
.img-list {
  padding-left: 3px;
  display: block;
  line-height: 1;
  .img-part {
    width: 80px;
    height: 80px;
  }
}
.file-list {
  ::v-deep .el-upload-list__item:first-child {
    margin-top: -5px;
  }
}
::v-deep .upload-preview-dialog {
  margin-top: 0vh !important;
  max-height: 90vh;
  max-width: 80%;
  min-width: 150px;
  min-height: 150px;
  width: inherit;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    flex: 1;
    overflow: auto;
    text-align: center;
    img{
      max-height: 65vh;
    }
  }
}
.el-upload__tip {
  line-height: 20px;
  margin-top: 0;
}
</style>
