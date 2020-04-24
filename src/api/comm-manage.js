import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: '/api/media/stimulate/exportExcel',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  uploadImage: {
    url: '/pc/upload/uploadImage',
    method: 'post'
  },
  getTableData: {
    url: '/pc/goods/listGoods',
    method: 'post'
  },
  saveGoods: {
    url: '/pc/goods/saveGoods',
    method: 'post'
  },
  getGoodsDetailData: {
    url: '/pc/goods/findGoodsById',
    method: 'post'
  },
  changeGoods: {
    url: '/pc/goods/updateGoods',
    method: 'post'
  },
  deletGoods: {
    url: '/pc/goods/deleteGoods',
    method: 'post'
  },
  upGoods: {
    url: '/pc/goods/upGoods',
    method: 'post'
  },
  downGoods: {
    url: '/pc/goods/downGoods',
    method: 'post'
  },
  findFirstLevel: {
    url: '/pc/goods/findFirstLevel',
    method: 'post'
  },
  findSecondLevel: {
    url: '/pc/goods/findSecondLevel',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
