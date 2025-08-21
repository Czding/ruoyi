import request from '@/utils/request'

// 分类树
export const categoryTree = (params) => {
  return request({
    url: '/work/category/categoryTree',
    method: 'get',
    params
  })
}

// 新增分类
export const categoryInsert = (data) => {
  return request({
    url: '/work/category/insert',
    method: 'post',
    data
  })
}

// 编辑分类
export const categoryEdit = (data) => {
  return request({
    url: '/work/category/edit',
    method: 'post',
    data
  })
}

// 删除分类
export const categoryDeleteById = (params) => {
  return request({
    url: '/work/category/deleteById',
    method: 'get',
    params
  })
}
