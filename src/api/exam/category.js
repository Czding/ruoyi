import request from '@/utils/request'

// 分类树
export function categoryTree(params) {
  return request({
    url: '/category/categoryTree',
    method: 'get',
    params
  })
}
