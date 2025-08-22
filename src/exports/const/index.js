import * as STATIC_CONST from './staticConst'
import getRemoteConst from './remoteConst'

class Constant {
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
    const REMOTE_CONST = await getRemoteConst()
    const CONSTANT = Object.assign(REMOTE_CONST, STATIC_CONST)
    this._appendConstInInstance(CONSTANT)
  }

  /**
   * @description: 所有常量赋值到实例
   * @return {data}
   */
  _appendConstInInstance (data) {
    Object.entries(data).forEach(([key, value]) => (this[key] = value))
  }
}

export default new Constant()
