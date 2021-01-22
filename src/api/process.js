import request from '@/utils/request'


//  驳回记录详情
export function rejectDetail(id) {
    return request({
        url: `/process/query/rejectHistory/detail/${id}`,
        method: 'get',
    })
}