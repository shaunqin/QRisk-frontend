import {
  initData
} from '@/api/data'

export default {
  data() {
    return {
      loading: true,
      data: [],
      page: 1,
      size: 10,
      total: 0,
      url: '',
      params: {},
      query: '',
      time: 50,
      isAdd: false,
      spanArr: [],
      position: 0
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.params).then(res => {
          if (res.code === '200') {
            this.data = res.obj
            this.nodeData = res.obj
            this.total = Number(res.total)
            this.queryTotal = Number(res.total)
            if (!res.total) {
              this.total = 0
              this.queryTotal = 0
            }
          } else {
            this.$message.error(res.msg)
          }
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e
      this.init()
    },
    sizeChange(e) {
      // this.page = 0
      this.size = e
      // 更换size page重置为1
      this.page = 1
      this.init()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page > 1) {
        this.page = this.page - 1
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    getIndex(index) {
      return (this.page - 1) * this.size + index + 1;
    },
    sortChange({ column, prop, order }) {
      console.log(column)
      let orderByColumn = prop;
      let isAsc = order == 'descending' ? 'desc' : 'asc';
      switch (orderByColumn) {
        case 'daysRemained': orderByColumn = 'deadline'; break;
        case 'daysRemainedHD': orderByColumn = 'dueDate'; break;
        default: break;
      }
      // 清空排序
      if (order == null) {
        orderByColumn = null;
        isAsc = null;
      }
      this.params = { ...this.params, orderByColumn, isAsc };
      this.init();
    }
  }
}
