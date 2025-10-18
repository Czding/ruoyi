import request from '@/utils/request'

// 新增试卷
export const paperInsert = (data) => {
  return request({
    url: '/work/paper/insert',
    method: 'post',
    data
  })
}

// 编辑分类
export const paperUpdate = (data) => {
  return request({
    url: '/work/paper/update',
    method: 'post',
    data
  })
}

// 删除分类
export const paperDeleteById = (params) => {
  return request({
    url: '/work/paper/deleteById',
    method: 'get',
    params
  })
}

// 题目列表
export const paperSelectList = (data) => {
  return request({
    url: '/work/paper/selectList',
    method: 'post',
    data
  })
}