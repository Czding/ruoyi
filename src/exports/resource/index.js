import * as methods from './methods'

class Resource {
  constructor () {
    this.cacheMap = new Map()
    this._proxyMethods()
  }

  /**
   * @description: 劫持函数绑定特殊代理
   */
  _proxyMethods () {
    for (const key in methods) {
      // isCache: 是否缓存   data: 传参
      this[key] = async (isCache, data) => {
        try {
          if (!isCache || !this.cacheMap.get(key)) {
            const result = await methods[key](data)
            this.cacheMap.set(key, result)
          }
          return this.cacheMap.get(key)
        } catch (e) {
          this.cacheMap.delete(key)
          return []
        }
      }
    }
  }
}

export default new Resource()
