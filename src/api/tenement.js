import request from '@/utils/request'

// 租户列表
export const tenantSelectPageList = (data) => {
  return request({
    url: '/work/tenant/selectPageList',
    method: 'post',
    data
  })
}

// 租户 - 新增
export const tenantInsert = (data) => {
  return request({
    url: '/work/tenant/insert',
    method: 'post',
    data
  })
}

// 租户 - 编辑
export const tenantEdit = (data) => {
  return request({
    url: '/work/tenant/edit',
    method: 'post',
    data
  })
}

// 租户 - 状态
export const tenantEditStatus = (data) => {
  return request({
    url: '/work/tenant/editStatus',
    method: 'post',
    data
  })
}
