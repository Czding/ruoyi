import { sysConfigAll } from '@/api/common'

/**
 * 接口导出key备注映射见文件同级README.md
*/

const getRemoteConst = async () => {
  const { data = [] } = await sysConfigAll()
  const remoteConst = {}
  data.forEach(item => {
    remoteConst[item.configCode] = item.configValue
  })
  return remoteConst
}

export default getRemoteConst
