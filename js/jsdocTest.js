/**
 * @fileOverview kekTable
 * @author keke
 */

(function ($, window, document, undefined) {
    'use strict';
    /**
     * 插件名称
     * @name _pluginName
     * @type {string}
     * @constant
     * @default 'kekTable'
     */
    var _pluginName = 'kekTable';
    /**
     * 插件配置参数
     * @name kekOption
     * @namespace
     */
    var _options = {
        /**
         * 表格标题
         * @name kekOption.title
         * @type {string}
         * @default ''
         */
        title: '',
        /**
         * 面板的颜色
         * bootstrap的panel样式：'panel-primary'(深蓝)、'panel-success'(浅绿)、'panel-info'(浅蓝)、'panel-warning'(浅黄)、'panel-danger'(浅灰)、'panel-default'(浅灰)
         * @name kekOption.panelColor
         * @type {string}
         * @default 'panel-primary'
         */
        panelColor: '',
        /**
         * 表格总宽度
         * .kekTable-listPanel的width样式，要加單位，冻结情况下确保和字段总宽度一样。'100%'、'auto'(colgroup的和+3)
         * @name kekOption.tableWidth
         * @type {string}
         * @default '100%'
         */
        tableWidth: '100%',
        /**
         * 編輯框的寬度
         * 要加單位
         * @name kekOption.editDialogWidth
         * @type {string}
         * @default '600px'
         */
        editDialogWidth: '600px',
        /**
         * 排序框的寬度
         * 要加單位
         * @name kekOption.sortDialogWidth
         * @type {string}
         * @default '600px'
         */
        sortDialogWidth: '600px',
        /**
         * 查询框的寬度
         * 要加單位
         * @name kekOption.searchDialogWidth
         * @type {string}
         * @default '600px'
         */
        searchDialogWidth: '600px',
        /**
         * 是否显示分页
         * false将查询出所有的记录
         * @name kekOption.showPaging
         * @type {bool}
         * @default true
         */
        showPaging: true,
        /**
         * 行数
         * 显示多少行记录。设为1的话，采用单记录显示方式
         * @name kekOption.rowNum
         * @type {number}
         * @default true
         */
        rowNum: 20,
        /**
         * 冻结字段数
         * 冻结前几列,1起始(无论是否开启序号列)。如果为0则冻结序号列
         * @name kekOption.frozenNum
         * @type {number}
         * @default null
         */
        frozenNum: null,
        /**
         * 是否显示行号
         * @name kekOption.showRowNo
         * @type {bool}
         * @default false
         */
        showRowNo: false,
        /**
         * 初始化后是否自动读取数据
         * @name kekOption.autoLoad
         * @type {bool}
         * @default true
         */
        autoLoad: true,
        /**
         * 延时时间
         * 显示加载遮罩的延时时间，单位毫秒
         * @name kekOption.loadingDelay
         * @type {number}
         * @default 500
         */
        loadingDelay: 500,
        /**
         * 是否启用鼠标悬停
         * 鼠标hover的样式。冻结型表格会影响性能
         * @name kekOption.canRowHover
         * @type {bool}
         * @default true
         */
        canRowHover: true,
        /**
         * 表格是否可以折叠
         * bootstrap的collapse
         * @name kekOption.isCollapse
         * @type {bool}
         * @default false
         */
        isCollapse: false,
        /**
         * 表格是否默认展开
         * bootstrap的collapse的aria-expanded属性
         * @name kekOption.collapseExpanded
         * @type {bool}
         * @default true
         */
        collapseExpanded: true,
        /**
         * 工具条(按顺序显示，需二维数组)
         * 'refresh'(刷新)、'search'(查询)、'sort'(排序)、'add'(新增)、'edit'(修改)、'delete'(删除)、'export'(导出)
         * @name kekOption.toolbar
         * @type {Array<toolbarItem>}
         * @default [[{id:'refresh'}],[{id:'search'},{id:'sort'}],[{id:'add'},{id:'edit'},{id:'delete'}]]
         * @example 自定义按钮
         * toolbar=[[{id:'upload',icon:'glyphicon-upload',label:'上传',title:'上传图片',action:function(o,d){ }}]]
         */
        toolbar: [[{id: 'refresh'}], [{id: 'search'}, {id: 'sort'}], [{id: 'add'}, {id: 'edit'}, {id: 'delete'}]],
        /**
         * 是否调试
         * 调试模式会检查各个参数是否设置正确。ie10+
         * @name kekOption.isDebug
         * @type {bool}
         * @default false
         */
        isDebug: false,
        /**
         * 查询URL(必需)
         * 触发查询Ajax的URL参数
         * @name kekOption.listURL
         * @type {string}
         * @default null
         */
        listURL: null,
        /**
         * 新增URL
         * 设为null将调整为listURL
         * @name kekOption.insertURL
         * @type {string}
         * @default null
         */
        insertURL: null,
        /**
         * 更新URL
         * 设为null将调整为listURL
         * @name kekOption.updateURL
         * @type {string}
         * @default null
         */
        updateURL: null,
        /**
         * 删除URL
         * 设为null将调整为listURL
         * @name kekOption.deleteURL
         * @type {string}
         * @default null
         */
        deleteURL: null,
        /**
         * 汇出URL
         * 设为null将调整为listURL
         * @name kekOption.exportURL
         * @type {string}
         * @default null
         */
        exportURL: null,
        /**
         * 初始的查询条件
         * @name kekOption.defaultSearch
         * @type {Array<Object>}
         * @default null
         * @example 过滤条件
         * defaultSearch = [
         * 		['empNo','eq','14563'],
         * 		['AND','state','isnull'],
         * 		['AND',[
         * 			['deptNo','eq','D02'],
         * 			['OR','deptNo','eq','D03']
         * 		]]
         * ]
         */
        defaultSearch: null,
        /**
         * 初始的排序条件
         * @name kekOption.defaultSort
         * @type {Array<string>}
         * @default null
         * @example 排序条件
         * defaultSort = [
         * 		['empNo','ASC','NULLS FIRST'],
         * 		['empName','DESC','NULLS LAST']
         * ]
         */
        defaultSort: null,
        /**
         * 新增初始字段
         * 新增数据时有初始值的栏位(后台Cols下标)，如果在columns.editIndex中定义了该字段，此设置将无效
         * @name kekOption.defaultInsertCols
         * @type {Array<number>}
         * @default null
         */
        defaultInsertCols: null,
        /**
         * 新增初始值
         * defaultInsertCols对应的值。特殊字符为['KEKSYSDATEKEK'(DB的系统时间),'KEKUSERIDKEK'(Session用户ID)]
         * @name kekOption.defaultInsertVals
         * @type {Array<Object>}
         * @default null
         */
        defaultInsertVals: null,
        /**
         * 更新初始字段
         * 更新数据时有初始值的栏位(后台Cols下标)，如果在columns.editIndex中定义了该字段，此设置无效
         * @name kekOption.defaultUpdateCols
         * @type {Array<number>}
         * @default null
         */
        defaultUpdateCols: null,
        /**
         * 更新初始值
         * defaultUpdateCols对应的值。特殊字符为['KEKSYSDATEKEK'(DB的系统时间),'KEKUSERIDKEK'(Session用户ID)]
         * @name kekOption.defaultUpdateVals
         * @type {Array<Object>}
         * @default null
         */
        defaultUpdateVals: null,
        /**
         * 点击刷新按钮，刷新数据之前。必需要写d.resolve()或者d.reject()
         * @name kekOption.beforeRefresh
         * @function
         * @param {deferredObject} object 当前页面上的值
         * @param {$.Deferred} deferred d.reject()将停止事件,d.resolve()将继续执行。
         */
        beforeRefresh: null,
        /**
         * 点击刷新按钮，刷新数据之后。必需要写d.resolve()或者d.reject()
         * @name kekOption.afterRefresh
         * @function
         * @param {deferredObject} object 当前页上的值
         * @param {$.Deferred} deferred d.reject()将停止事件,d.resolve()将继续执行。
         * @example 没有查询出数据
         * afterRefresh:function(object,deferred){
         *      if(!curPageRecords.length)
         *          deferred.resolve('没有查询到任何数据');
         * }
         */
        afterRefresh: null,
        /**
         * 点击修改按钮，数据填入编辑框之前。可以在这里改变editRecord(editRecordRef)的值
         * @name kekOption.beforeEdit
         * @function
         * @param {deferredObjectRef} object 当前页上的值
         * @param {$.Deferred} deferred d.reject()将停止事件,d.resolve()将继续执行。
         * @example 修改数据呈现前取得员工姓名，类D2K的post-change
         * beforeEdit:function(object,deferred){
         *      $.post('getEmpName.ashx',{empNo:object.editRecordRef.empNo}).done(function(res){
         *          object.editRecordRef.empName=res;
         *      }).always(function(){
         *          deferred.resolve();
         *      });
         * }
         */
        beforeEdit: null,
        /**
         * 点击修改按钮，数据填入编辑框之后，显示编辑框之前。
         * @name kekOption.afterEdit
         * @function
         * @param {deferredObject} object 当前页上的值
         * @param {$.Deferred} deferred d.reject()将停止事件,d.resolve()将继续执行。
         * @example 不允许修改
         * afterEdit:function(object,deferred){
         *      if(object.curRecord.empNo='99999')
         *          d.reject('不允许修改');
         *      else
         *          d.resolve();
         * }
         */
        afterEdit: null
    };

})(jQuery, window, document);
/**
 * 工具栏按钮
 * @name toolbarItem
 * @namespace
 * @property {string} id 标识(必需)
 * @property {string} icon 图标,bootstrap的glyphicon样式
 * @property {string} label 按钮上的文字
 * @property {string} title 按钮上的提示文字title
 */

/**
 * 点击按钮执行的自定义操作
 * @name toolbarItem.action
 * @function
 * @param {deferredObject} object 当前页的值
 * @param {$.Deferred} deferred 延时对象。函数中必需执行deferred.resolve()、deferred.reject()
 * @return void
 * @example 判断是否有选中记录
 * action:function(object,deferred){
 *     if(!object.curRecordNo)
 *         d.reject('请先选择一行');
 *     else if(object.curPageRecords[object.curRecordNo-1].weight<1000)
 *         d.reject('重量小于1000');
 *     else{
 *         d.resolve();
 *         alert('操作成功');
 *     }
 * }
 */

/**
 * 当前页面上的一系列值。供外部接口
 * @typedef {object} deferredObject
 * @prop {object.<colEntity>} [curRecord=null] - 选中的数据(值传递不可修改)，已转换为colEntity类
 * @prop {object.<colEntity>} [editRecord=null] - 修改框中的数据(值传递不可修改)，已转换为colEntity类
 * @prop {Array.<object.<colEntity>>} [pageRecords=null] - 当前页的数据(值传递不可修改)，已转换为colEntity类
 * @prop {int} [curPageNo=null] - 当前页码
 * @prop {int} [curRecordNo=null] - 当前行号，起始于1
 * @prop {string} [tableStatus=null] - 表格狀態，一般為__toolbarItem.id
 */

/**
 * 当前页面上的一系列值。供外部接口
 * @typedef {object} deferredObjectRef
 * @prop {object.<colEntity>} [curRecord=null] - 选中的数据(值传递不可修改)，已转换为colEntity类
 * @prop {object.<colEntity>} [editRecordRef=null] - 修改框中的数据(引用传递可修改)，已转换为colEntity类
 * @prop {Array.<object.<colEntity>>} [pageRecords=null] - 当前页的数据(值传递不可修改)，已转换为colEntity类
 * @prop {int} [curPageNo=null] - 当前页码
 * @prop {int} [curRecordNo=null] - 当前行号，起始于1
 * @prop {string} [tableStatus=null] - 表格狀態，一般為__toolbarItem.id
 */
