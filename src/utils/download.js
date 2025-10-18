/**
 * @description: 文件下载
 * @param {*} res 文件流
 * @return {*} 直接下载文件
 */
export function createDownloadLink (res = {}) {
  const downloadLink = window.document.createElement('a')
  let fileName =
    res.headers &&
    Reflect.has(res.headers, 'content-disposition') &&
    res.headers['content-disposition'].split('filename=')[1]
  fileName = decodeURIComponent(fileName)
  const fileUrl = res.data && window.URL.createObjectURL(res.data)
  downloadLink.href = fileUrl
  downloadLink.download = fileName
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  window.URL.revokeObjectURL(fileUrl)
}
