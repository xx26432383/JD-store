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
  getTableData: {
    url: '/pc/menu/listMenu',
    method: 'post'
  },
  listMenu: {
    url: '/pc/menu/listMenu',
    method: 'post'
  },
  addMenu: {
    url: '/pc/menu/addMenu',
    method: 'post'
  },
  findMenuById: {
    url: '/pc/menu/findMenuById',
    method: 'post'
  },
  getMenu: {
    url: '/pc/menu/findMenuById',
    method: 'post'
  },
  updateMenu: {
    url: '/pc/menu/updateMenu',
    method: 'post'
  },
  deleteMenu: {
    url: '/pc/menu/deleteMenu',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
