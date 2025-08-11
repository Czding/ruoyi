/**
 * @description: 文件大小转换
 * @param {Number} bytes 字节大小
 * @return {String} 转换后带单位的文件大小结果
 */
export const convertBytesToSize = (bytes) => {
  const thresh = 1024
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }
  const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return bytes.toFixed(0) + ' ' + units[u]
}

/**
 * @description: 获取url参数
 * @param {*} name  参数名称
 * @return {string}
 */
export function getQueryString (name) {
  const href = window.location.href
  /*eslint-disable */
  const reg = new RegExp(name + '=[^&|#|\/]*')
  const res = href.match(reg)
  return res ? href.match(reg)[0].split('=')[1] : ''
}

/**
 * @description: 移除url参数
 * @param {*} name  参数名称
 * @return {string}
 */
export const removeURLParam = (name) => {
  let tempUrl = window.location.href
  tempUrl = tempUrl.split("?")[0]
  window.history.replaceState({}, "0", tempUrl)
}

/**
 * @description: 复制内容到剪贴板
 * @param {string} text  复制文本
 * @return {string}
 */
export const copy = (text) => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', text)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      resolve()
    } else {
      reject()
    }
    document.body.removeChild(input)
  })
}

/**
 * @description: 根据字符串长度生成*号字符串
 * @param {*} text  字符串
 * @return {string}
 */
export function generateAsterisksByString (text) {
  const length = text.length
  if (typeof length !== 'number' || length <= 0) {
    return ''
  }
  return '*'.repeat(length)
}

