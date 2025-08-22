import {
  findAreaList,
  findRelCategoryTree,
  findSysDeptTree,
  findRoadList,
  getClassifyTreebyBusinessCode,
  getDistrictTreeList
} from '@/api/common'
import constant from '@/exports/const'

/**
* @description: 获取全量区域
*/
export const getAreaList = async () => {
  const { data } = await findAreaList()
  return data
}
/**
 * @description: 获取部门选项
 */
export const getDeptList = async () => {
  const { data } = await findSysDeptTree({})
  return data
}
/**
 * @description: 获取道路
 */
export const getRoadList = async () => {
  const { data } = await findRoadList()
  return data.map(item => ({
    label: item.roadName,
    value: item.id
  }))
}
export const getEventCategoryTree = async (params) => {
  const param = {
    categoryIdList: params.categoryIdList,
    subQueryList: params.resourceIdList.map(item => ({ subId: item, subType: 'EVENT_SOURCE' }))
  }
  const { data } = await findRelCategoryTree(param)
  return data.categoryTree && data.categoryTree.children ? data.categoryTree.children : []
}

// 获取问题类型树
export const getEventTypeTree = async () => {
  const { data } = await getClassifyTreebyBusinessCode({ businessCode: constant.S_BUSSINESS_CODE })
  return data || []
}
export const getDistrictTree = async () => {
  const { data } = await getDistrictTreeList({})
  return data || []
}
