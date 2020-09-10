import request from '@/utils/request'

// 添加年度任务/月度任务
export function taskAdd(data) {
    return request({
        url: '/task_mgr/add',
        method: 'post',
        data
    })
}
// 修改年度任务/月度任务
export function taskModify(data) {
    return request({
        url: '/task_mgr/yearTask/modify',
        method: 'put',
        data
    })
}