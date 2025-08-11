<!-- 查询表格 -->
<template>
  <div class="table-search-wrap">
    <search-form v-model="form" :config="config.searchConfig" :search-data="searchData" v-bind="$attrs"
      v-on="$listeners">
      <slot />
    </search-form>
    <d-table ref="dTable" :request-config="requestConfig" :columns="config.columns" :data="data" v-bind="$attrs"
      class="table-wrap" v-on="$listeners" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import SearchForm from '../search-form/index.vue'
import DTable from '../table/index.vue'

export default {
  name: 'DSearchTable',
  components: { SearchForm, DTable },
  props: {
    config: {
      type: Object,
      default: () => ({
        searchConfig: [],
        requestConfig: {},
        columns: []
      })
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    requestConfig() {
      const requestConfig = this.config.requestConfig
      return {
        ...requestConfig,
        params: typeof requestConfig.params === 'function'
          ? requestConfig.params(cloneDeep(this.form)) // 处理自定义参数
          : {
            ...this.form,
            ...requestConfig.params
          }
      }
    }
  },
  created() {
    this.createFormBind()
  },
  methods: {
    createFormBind() {
      const _form = {};
      (this.config.searchConfig || []).forEach(c => {
        _form[c.prop] = c.defaultValue || ''
      })
      this.form = _form
    },
    search(params) {
      this.$refs.dTable.search(params)
    },
    searchData(params = { pageNum: 1 }) {
      this.$nextTick(() => {
        this.search(params)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-search-wrap {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .table-wrap {
    flex: 1;
    overflow: hidden;

    ::v-deep .el-table {
      max-height: calc(100% - 52px) !important;
    }
  }
}
</style>
