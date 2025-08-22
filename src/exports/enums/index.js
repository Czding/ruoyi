/**
 * 枚举class对象
 */

import * as STATIC_ENUM from './staticEnum'
import getRemoteEnum from './remoteEnum'
class Enum {
  /**
   * @description: 完成初始化
   */
  async prepare () {
    await this._mergeOption()
    return Promise.resolve(this)
  }

  /**
   * @description: 合并枚举选项
   * @return {data}
   */
  async _mergeOption () {
    const REMOTE_ENUM = await getRemoteEnum()
    const ENUM = Object.assign(REMOTE_ENUM, STATIC_ENUM)
    this._appendAllOption(ENUM)
  }

  /**
   * @description: 给所有选项添加‘全部’选项
   */
  _appendAllOption (data) {
    Object.entries(data).forEach(([key, options]) => {
      this[key] = options
      this[key + '_ALL'] = [{ label: '全部', value: '' }, ...options]
    })
  }

  /**
   * @description: 通过label查找value
   * @param {Array} options 查找选项列表
   * @param {String} label label名称
   */
  getValue (options, label) {
    options = typeof options === 'string' ? this[options] : (options || [])
    const option = options.find(item => item.label === label)
    return option ? option.value : ''
  }

  /**
   * @description: 通过value查找label
   * @param {Array} options 查找选项列表
   * @param {*} value
   */
  getLabel (options, value) {
    options = typeof options === 'string' ? this[options] : (options || [])
    const option = options.find(item => item.value === value)
    return option ? option.label : ''
  }

  /**
   * @description: 通过value批量查找label
   * @param {Array} options 查找选项列表
   * @param {Array} value
   */
  getLabels (options, values) {
    options = typeof options === 'string' ? this[options] : (options || [])
    const arr = []
    options.forEach(item => {
      values.includes(item.value) && arr.push(item.label)
    })
    return arr
  }
}
export default new Enum()
