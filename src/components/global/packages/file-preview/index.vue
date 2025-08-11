<template>
  <div
    v-if="visible && fileArr.length"
    class="container"
  >
    <div
      id="left"
      class="left"
    >
      <el-tabs
        v-model="activeTab"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="(v, i) in fileList"
          :key="i"
          :label="v.name"
          :name="v.type"
        />
      </el-tabs>
      <ul class="list">
        <li
          v-for="(url, i) in currentFileList"
          :key="i"
          :class="currentFileIndex === i ? 'active_left' : ''"
          @click="handleClickLeft(url, i)"
        >
          <el-image
            style="width: 140px; height: 140px"
            :src="getUrl(url)"
            fit="cover"
          />
        </li>
      </ul>
    </div>
    <el-image-viewer
      v-show="activeTab === 'image'"
      ref="viewer"
      :mask-closable="false"
      :append-to-body="false"
      :url-list="[activeTab === 'image' ? currentFileList[currentFileIndex] : '']"
      :on-close="close"
    />
    <div
      v-show="activeTab !== 'image'"
      class="box"
    >
      <span
        class="el-image-viewer__btn el-image-viewer__close"
        @click="close"
      >
        <i class="el-icon-close" />
      </span>
      <audio
        v-show="activeTab === 'audio'"
        controls
        style="width: 60%"
      >
        <source :src="currentFileList[currentFileIndex]">
        您的浏览器不支持 audio 元素。
      </audio>
      <video
        v-show="activeTab === 'video'"
        controls
        style="min-width: 80%;max-height: 90%"
      >
        <source :src="currentFileList[currentFileIndex]">
        您的浏览器不支持 HTML5 video 标签。
      </video>
    </div>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
const imgExts = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg']
const videoExts = ['mp4']
const audioExts = ['mp3', 'wav', 'ogg']
export default {
  name: 'DFilePreview',
  components: { ElImageViewer },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    fileArr: {
      type: Array,
      default: () => {
        return [
          { name: '图片', type: 'image', urls: [] },
          { name: '视频', type: 'video', urls: [] },
          { name: '音频', type: 'audio', urls: [] }
        ]
      }
    }
  },
  data () {
    return {
      fileList: [],
      currentFileIndex: 0,
      activeTab: ''
    }
  },
  computed: {
    currentFileList () {
      return this.fileList.find(item => item.type === this.activeTab)?.urls || []
    },
    visible: {
      get () {
        return this.value
      },
      set (value) {
        this.removeEventFun()
        this.$emit('change', value)
      }
    }
  },
  watch: {
    fileArr: {
      handler (val) {
        if (val.length && typeof (val[0]) === 'string') {
          let arr = [
            { name: '图片', type: 'image', urls: [] },
            { name: '视频', type: 'video', urls: [] },
            { name: '音频', type: 'audio', urls: [] }
          ]
          val.map(url => {
            if (imgExts.includes(url.substring(url.lastIndexOf('.') + 1))) {
              arr[0].urls.push(url)
            }
            if (videoExts.includes(url.substring(url.lastIndexOf('.') + 1))) {
              arr[1].urls.push(url)
            }
            if (audioExts.includes(url.substring(url.lastIndexOf('.') + 1))) {
              arr[2].urls.push(url)
            }
          })
          this.fileList = arr.filter(item => item.urls.length)
        } else {
          this.fileList = val
        }
        this.activeTab = this.fileList[0].type
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.addEventEventFun()
  },
  methods: {
    deviceSupportUninstall () {
      this.$refs.viewer.deviceSupportUninstall()
    },
    deviceSupportInstall () {
      this.$refs.viewer.deviceSupportInstall()
    },
    addEventEventFun () {
      const element = document.getElementById('left')
      element.addEventListener('mouseenter', this.deviceSupportUninstall)
      element.addEventListener('mouseleave', this.deviceSupportInstall)
    },
    removeEventFun () {
      const element = document.getElementById('left')
      element.removeEventListener('mouseenter', this.deviceSupportUninstall)
      element.removeEventListener('mouseleave', this.deviceSupportInstall)
    },
    close () {
      this.visible = false
    },
    getUrl (val) {
      switch (this.activeTab) {
        case 'video':
          return require('./static/video.png')
        case 'image':
          return val
        case 'audio':
          return require('./static/audio.png')
        default:
          break
      }
    },
    handleClickLeft (url, index) {
      this.currentFileIndex = index
    },
    handleTabClick () {
      this.currentFileIndex = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  .box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    padding-left: 250px;
    background-color: rgba($color: #000000, $alpha: 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left {
    position: fixed;
    z-index: 3000;
    width: 220px;
    height: 100vh;
    top: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;
    padding: 12px 12px 12px 20px;
    display: flex;
    flex-direction: column;
    background: #606266;

    ::v-deep .el-tabs__nav-wrap::after {
      background-color: transparent;
    }

    ::v-deep .el-tabs__item {
      color: #fff;
    }

    ::v-deep .el-tabs__item.is-active {
      color: #5f9efd;
    }

    .list {
      flex: 1;
      overflow: auto;
      text-align: center;
      font-size: 0;

      li {
        margin-bottom: 7px;
        border: 2px solid transparent;
        margin-right: 2px;
      }

      .active_left {
        border: 2px solid #5f9efd;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  ::v-deep .el-image-viewer__wrapper {
    left: calc(220px);
  }

  ::v-deep .el-icon-close {
    color: #fff;
  }
}
</style>
