import request from '@/utils/request'

// 删除附件
export function delUpload(id) {
  return request({
    url: `/accessory/common/delUpload/${id}`,
    method: 'delete',
  })
}

// 上传附件
export function uploadProcessPDF(data) {
  return request({
    url: `/accessory/uploadProcessPDF`,
    method: 'post',
    data
  })
}