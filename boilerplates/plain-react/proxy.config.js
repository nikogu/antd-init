// Learn more on how to config.
// - https://github.com/dora-js/dora-plugin-proxy#规则定义
'use strict';

var qs = require('qs');
const mockjs = require('mockjs');

// 数据持久
var tableListData = {};
if (!global.tableListData) {

  var data = mockjs.mock({
    'data|100': [{
      'key|+1': 1,
      name: '@cname',
      'age|11-99': 1,
      address: '@region',
    }],
    page: {
      total: 100,
      current: 1,
    },
  });

  tableListData = data;

  global.tableListData = tableListData;

} else {

  tableListData = global.tableListData;

}

module.exports = {

  '/api/todos': function (req, res) {
    setTimeout(function () {
      res.json({
        success: true,
        data: [
          {
            id: 1,
            text: 'Learn antd',
            isComplete: true,
          },
          {
            id: 2,
            text: 'Learn ant-tool',
          },
          {
            id: 3,
            text: 'Learn dora',
          },
        ],
      });
    }, 500);
  },

  '/api/tablelist': function (req, res) {

    var page = qs.parse(req.query);
    var pageSize = page.pageSize || 10;
    var currentPage = page.currentPage || 1;

    var data = tableListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    tableListData.page.current = currentPage*1;

    setTimeout(function () {
      res.json({
        success: true,
        data: data,
        page: tableListData.page,
      });
    }, 500);
  },

  '/api/tablelist_addItem': function (req, res) {
    setTimeout(function () {
      var newData = qs.parse(req.body);

      newData.key = tableListData.data.length + 1;
      tableListData.data.push(newData);

      tableListData.page.total = tableListData.data.length;

      global.tableListData = tableListData;
      res.json({
        success: true,
        data: tableListData.data,
        page: tableListData.page,
      });
    }, 500);

  },

  '/api/tablelist_deleteItem': function (req, res) {
    setTimeout(function () {
      var deleteItem = qs.parse(req.body);

      tableListData.data = tableListData.data.filter(function (item) {
        if (item.key == deleteItem.key) {
          return false;
        }
        return true;
      });

      tableListData.page.total = tableListData.data.length;

      global.tableListData = tableListData;
      res.json({
        success: true,
        data: tableListData.data,
        page: tableListData.page,
      });
    }, 500);
  },

  '/api/tablelist_editItem': function (req, res) {
    setTimeout(function () {
      var editItem = qs.parse(req.body);

      tableListData.data = tableListData.data.map(function (item) {
        if (item.key == editItem.key) {
          return editItem;
        }
        return item;
      });

      global.tableListData = tableListData;
      res.json({
        success: true,
        data: tableListData.data,
        page: tableListData.page,
      });
    }, 500);
  },

};
