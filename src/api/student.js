import request from '@/utils/request'

// 用户查询新
export const selectListNew = (data) => {
  return request({
    url: '/system/user/selectList',
    method: 'post',
    data
  })
}

// 下阶段学习
export const nextStudy = (params) => {
  return request({
    url: '/work/user/nextStudy',
    method: 'get',
    params
  })
}

// 学习退回
export const studyBack = (params) => {
  return request({
    url: '/work/user/studyBack',
    method: 'get',
    params
  })
}

// 推荐考试
export const recommendExam = (params) => {
  return request({
    url: '/work/user/recommendExam',
    method: 'get',
    params
  })
}

// 考试通过
export const examPass = (data) => {
  return request({
    url: '/work/user/examPass',
    method: 'post',
    data
  })
}

// 挂科
export const examMakeUpInsert = (data) => {
  return request({
    url: '/work/examMakeUp/insert',
    method: 'post',
    data
  })
}

// 补考记录列表
export const examMakeUpList = (data) => {
  return request({
    url: '/work/examMakeUp/selectList',
    method: 'post',
    data
  })
}

// 导出用户信息
export function exportUser (data) {
  return request({
    url: '/system/user/exportUser',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}

// 导出用户附件
export function exportUserFile (data) {
  return request({
    url: '/system/user/exportUserFile',
    method: 'POST',
    data,
    responseType: 'blob'
  })
}

// 用户文件列表
export const userFileList = (data) => {
  return request({
    url: '/work/userFile/selectList',
    method: 'post',
    data
  })
}

// 用户文件新增
export const insertUserFile = (data) => {
  return request({
    url: '/work/userFile/insertUserFile',
    method: 'post',
    data
  })
}

// 用户文件删除
export const userFileDeleteById = (params) => {
  return request({
    url: '/work/userFile/deleteById',
    method: 'get',
    params
  })
}

// 用户文件修改
export const userFileUpdate = (data) => {
  return request({
    url: '/work/userFile/update',
    method: 'post',
    data
  })
}
