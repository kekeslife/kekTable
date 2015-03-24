/**
 * @fileOverview kekTable
 * @author keke
 */

(function ($, window, document) {
    'use strict';
    //region   ====================默认配置====================
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
         * 汇出文件类型
         * [ 'CSV','TXT' ]
         * @name kekOption.exportType
         * @type {string}
         * @default null
         */
        exportType: 'CSV',
        /**
         * 字段配置参数
         * @name kekOption.columns
         * @type {Object}
         * @default null
         */
        columns: null,
        /**
         * 多表间的关联(二维数组(后台数据库字段下标))
         * @name kekOption.tableRelations
         * @type {Array.<Array.<number>>}
         * @default null
         * @example 后台下标1字段=后台下标4字段
         * tableRelations:[[1,4,0]]
         * @example 后台下标1字段=后台下标4字段(+)
         * tableRelations:[[1,4,1]]
         */
        tableRelations: null,
        /**
         * 子表id
         * @name kekOption.detailTable
         * @type {string}
         * @default null
         */
        detailTable: null,
        /**
         * 初始的查询条件
         * @name kekOption.defaultSearch
         * @type {Array.<searchCondition>}
         * @default null
         * @example 过滤条件
         * defaultSearch = [
         * 		{Col: 'empNo',Opt: 'eq',Val: '14563'},
         * 		{Bool: 'AND',Col: 'state',Val: 'isnull'},
         * 		{Bool: 'AND',Child: [
         * 			{Col: 'deptNo',Opt: 'eq',Val: 'D02'},
         * 			{Bool: 'OR',Col: 'deptNo',Opt: 'eq',Val: 'D03'}
         * 		]}
         * ]
         */
        defaultSearch: null,
        /**
         * 初始的排序条件
         * @name kekOption.defaultSort
         * @type {Array.<sortCondition>}
         * @default null
         * @example 排序条件
         * defaultSort = [
         * 		{Col:'empNo',Type:'ASC',Nulls:'NULLS FIRST'},
         * 		{Col:'empName',Type:'DESC',Nulls:'NULLS LAST'}
         * ]
         */
        defaultSort: null,
        /**
         * 新增初始字段
         * 新增数据时有初始值的栏位(后台Cols下标)，如果在columns.editIndex中定义了该字段，此设置将无效
         * @name kekOption.defaultInsertCols
         * @type {Array.<number>}
         * @default null
         */
        defaultInsertCols: null,
        /**
         * 新增初始值
         * defaultInsertCols对应的值。特殊字符为['KEKSYSDATEKEK'(DB的系统时间),'KEKUSERIDKEK'(Session用户ID)]
         * @name kekOption.defaultInsertVals
         * @type {Array.<Object>}
         * @default null
         */
        defaultInsertVals: null,
        /**
         * 更新初始字段
         * 更新数据时有初始值的栏位(后台Cols下标)，如果在columns.editIndex中定义了该字段，此设置无效
         * @name kekOption.defaultUpdateCols
         * @type {Array.<number>}
         * @default null
         */
        defaultUpdateCols: null,
        /**
         * 更新初始值
         * defaultUpdateCols对应的值。特殊字符为['KEKSYSDATEKEK'(DB的系统时间),'KEKUSERIDKEK'(Session用户ID)]
         * @name kekOption.defaultUpdateVals
         * @type {Array.<Object>}
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
        afterEdit: null,
        /**
         * 点击新增按钮，数据填入编辑框之前。可以在这里改变editRecord(editRecordRef)的值
         * @name kekOption.beforeAdd
         * @function
         * @param {deferredObjectRef} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         * @example 设置新增时的初始值
         * beforeAdd:function(object,deferred){
         *      object.editRecordRef.inStock='Y';
         *      deferred.resolve();
         * }
         */
        beforeAdd: null,
        /**
         * 点击新增按钮，数据填入编辑框之后，显示编辑框之前
         * @name kekOption.afterAdd
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         * @example 不允许新增
         * afterAdd:function(object,deferred){
         *      deferred.reject('不允许新增');
         * }
         */
        afterAdd: null,
        /**
         * 点击删除按钮，显示删除确认框之前
         * @name kekOption.beforeDelete
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         * @example 不允许删除
         * beforeDelete:function(object,deferred){
         *      if(object.curRecord.inStock='Y')
         *          deferred.reject('已入库不允许删除');
         *      else
         *          deferred.resolve();
         * }
         */
        beforeDelete: null,
        /**
         * 点击删除按钮，显示删除确认框之后
         * @name kekOption.afterDelete
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        afterDelete: null,
        /**
         * 点击汇出按钮，显示汇出选项框之前
         * @name kekOption.beforeExport
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        beforeExport: null,
        /**
         * 点击汇出按钮，显示汇出选项框之后
         * @name kekOption.afterExport
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        afterExport: null,
        /**
         * 点击分页按钮，进行分页之前
         * @name kekOption.beforePaging
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        beforePaging: null,
        /**
         * 点击分页按钮，进行分页之后
         * @name kekOption.afterPaging
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        afterPaging: null,
        /**
         * 新增数据，点击保存按钮，保存数据之前
         * @name kekOption.beforeInsert
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        beforeInsert: null,
        /**
         * 新增数据，点击保存按钮，保存数据之后
         * @name kekOption.afterInsert
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        afterInsert: null,
        /**
         * 更新数据，点击保存按钮，保存数据之前
         * @name kekOption.beforeUpdate
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        beforeUpdate: null,
        /**
         * 更新数据，点击保存按钮，保存数据之后
         * @name kekOption.afterInsert
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        afterUpdate: null,
        /**
         * 点击查询按钮，查询框初始化之前
         * @name kekOption.beforeSearch
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        beforeSearch: null,
        /**
         * 点击查询按钮，查询框初始化之后，查询框显示之前
         * @name kekOption.afterSearch
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        afterSearch: null,
        /**
         * 点击排序按钮，排序框初始化之前
         * @name kekOption.beforeSort
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        beforeSort: null,
        /**
         * 点击排序按钮，排序框初始化之后，排序框显示之前
         * @name kekOption.afterSort
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         */
        afterSort: null
    };
    /**
     * 字段配置参数
     * @name Column
     * @namespace
     */
    var _column = {
        /**
         * 后台Tables属性的下标
         * 该字段所属的表，不设置代表该栏位非数据库字段
         * @name Column.tableId
         * @type {number}
         * @default null
         */
        tableId: null,
        /**
         * 后台Cols属性的下标
         * 不设置代表该栏位非数据库字段
         * @name Column.colId
         * @type {number}
         * @default null
         */
        colId: null,
        /**
         * 是否为主键字段
         * 如果table中没有主键，请设置ROWID字段。一个插件至少需要一个主键
         * 设置了主键的tableId将作为更新删除操作的表，主键不可跨表
         * @name Column.isKey
         * @type {bool}
         * @default false
         */
        isKey: false,
        /**
         * 是否为必要字段
         * 新增修改时将作为检核条件
         * @name Column.isRequire
         * @type {bool}
         * @default false
         */
        isRequire: false,
        /**
         * 字段的数据类型
         * 用于验证资料的有效性
         * [ null(文本)、'number'、'date'(YYYY/MM/DD)、'datetime'(YYYY/MM/DD HH24:MI:SS) ]
         * @name Column.colType
         * @type {string}
         * @default null
         */
        colType: null,
        /**
         * 字段的数据长度
         * 设置null，表示无限制，('3.2'代表3位整数，2位小数)
         * @name Column.colLength
         * @type {string}
         * @default null
         */
        colLength: null,
        /**
         * 是否按byte计算长度
         * 字段的长度按byte计算,false将按char计算
         * @name Column.isByte
         * @type {bool}
         * @default true
         */
        isByte: true,
        /**
         * 中文占的字节数
         * 按byte计算长度时一个中文算多少byte
         * @name Column.chBytes
         * @type {number}
         * @default 2
         */
        chBytes: 2,
        /**
         * 显示顺序
         * 设置后此字段数据会显示于画面上
         * 显示顺序按值从小到大，不同字段不可设置重复的值
         * @name Column.listIndex
         * @type {number}
         * @default null
         */
        listIndex: null,
        /**
         * 显示名称
         * 显示在画面上的字段标题
         * 设置null，将被调整为colName，如果不需要显示listTitle请设置为''
         * @name Column.listTitle
         * @type {string}
         * @default null
         */
        listTitle: null,
        /**
         * 显示宽度
         * 显示在画面上的字段单元格宽度
         * <col>标签的width属性，需要单位
         * @name Column.listWidth
         * @type {string}
         * @default '100px'
         */
        listWidth: '100px',
        /**
         * 是否行内显示
         * 单笔记录显示模式时，此栏位是否和前一个栏位在同一行显示
         * @name Column.listInline
         * @type {bool}
         * @default false
         */
        listInline: false,
        /**
         * 显示键值对
         * 数据显示的时候将值转化为显示文字，和editList类似
         * 固定数据，不提供Ajax取值。
         * @name Column.listList
         * @type {object}
         * @default null
         * @example 将部门代码转换成部门名称后显示在画面上
         * listList:{ 'Q021': '系统管理课', 'Q022': '系统开发课' }
         */
        listList: null,
        /**
         * 是否可筛选
         * 该字段是否出现在查询框的字段列表中，只对数据库字段有效
         * 设置null，数据库字段会自动设置为true
         * @name Column.canFilter
         * @type {bool}
         * @default true
         */
        canFilter: true,
        /**
         * 是否可排序
         * 该字段是否出现在排序框的字段列表中，只对数据库字段有效
         * 设置null，数据库字段会自动设置为true
         * @name Column.canSort
         * @type {bool}
         * @default true
         */
        canSort: true,
        /**
         * 是否可汇出
         * 该字段是否在执行汇出操作后汇出数据，只对数据库字段有效
         * 设置null，数据库字段会自动设置为true
         * @name Column.canExport
         * @type {bool}
         * @default true
         */
        canExport: true,
        /**
         * 编辑字段顺序
         * 设置后此字段可用于新增修改，编辑框的栏位顺序按值从小到大，不可重复设置
         * @name Column.editIndex
         * @type {number}
         * @default null
         */
        editIndex: null,
        /**
         * 字段编辑标题
         * 编辑框中字段上面的标题
         * 设置null，将被调整为listTitle,不显示编辑名称请设置为''
         * @name Column.editTitle
         * @type {string}
         * @default null
         */
        editTitle: null,
        /**
         * 编辑字段的显示方式
         * [ null(单独一行)、'inline'(与前一个栏位同一行)、'cling'(紧贴前一个栏位) ]
         * 第一个显示的编辑字段只能是null
         * @name Column.editDisplay
         * @type {string}
         * @default null
         */
        editDisplay: null,
        /**
         * 编辑字段宽度
         * 该字段在编辑框中的width属性，需要单位
         * @name Column.editWidth
         * @type {string}
         * @default '100px'
         */
        editWidth: '100px',
        /**
         * 编辑字段的组件类型
         * [ null(单行文本框)、'list'(下拉框插件)、'lov(下拉表格插件)'、'textarea'(多行文本框) ]
         * @name Column.editType
         * @type {string}
         * @default null
         */
        editType: null,
        /**
         * 编辑字段的数据特性
         * [ null(正常默认，回传)、'readonly'(只读，回传)、'hidden'(隐藏，回传)、'disabled'(只读，不回传) ]
         * @name Column.editAttr
         * @type {string}
         * @default null
         */
        editAttr: null,
        /**
         * lov字段名
         * 下拉表格(editType='lov')中数据(editList)的标题
         * 如果字段名是columns中的字段名，会联动修改editRecord字段的值，否则只用于普通显示
         * @name Column.lovCols
         * @type {string}
         * @default null
         * @example empNo下拉框
         * lovCols: [ 'empNo', '员工姓名' ] //empNo为columns.empNo,选取后会修改editRecord.empNo。'员工姓名'只是普通的显示
         */
        lovCols: null,
        /**
         * 下拉选项
         * list、lov类型的下拉选项，必需要写d.resolve('列表数据')或者d.reject('异常提示')
         * list类型请返回对象{值:文字}，lov类型请返回数组[[值,文字],[值,文字],[值,文字]]
         * @name Column.editList
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         * @example 性别list下拉框
         * editList:function(object,deferred){
         *      //当然你可以将下面的包含在$.post().done()里面
         *      d.resolve({M:'男',F:'女'});
         * }
         * @example 城市lov下拉表格
         * editList:function(object,deferred){
         *      d.resolve([['JS','江苏','SZ','苏州'],['TW','台湾','GX','高雄']]);
         *      //lov需设置lovCols:['pCode','省','cCode','市']
         * }
         */
        editList: null,
        /**
         * 栏位聚合
         * 聚合所有的数据，非单页的数据
         * [ 'SUM'(求和)、'COUNT'(计数)、'AVG'(平均)、'MAX'(最大)、'MIN'(最小)、'STDDEV'(标准差)、'VARIANCE'(协方差)、'MEDIAN'(中间数) ]
         * @name Column.colTotalSummary
         * @type {string}
         * @default null
         */
        colTotalSummary: null,
        /**
         * 聚合所有值
         * 聚合字段(colTotalSummary)是否聚合所有数据还是过滤掉重复项，oracle中聚合函数的DISTINCT、ALL
         * @name Column.isTotalAll
         * @type {bool}
         * @default true
         */
        isTotalAll: true,
        /**
         * 显示数据之前
         * 查询出数据之后，显示数据之前的自定义操作
         * 所有字段都可以有此回调，非数据库字段可当作临时字段
         * 必需要写d.resolve('将要显示的文字或HTML，非数据库栏位将保存text至curPageRecords中')或者d.reject()
         * @name Column.beforeList
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         * @example ajax显示员工姓名(写在empName字段中)
         * beforeList:function(object,deferred){
         *      $.post('getEmpName.ashx',{empNo:object.curRecord.empNo})
         *       .done(function(res){
         *          d.resolve(res.EmpName);
         *       })
         *       .fail(function(){
         *          d.reject();
         *       });
         * }
         * @example 按 工号+姓名 显示
         * beforeList:function(object,deferred){
         * 		d.resolve(object.curRecord.empNo+' - '+object.curRecord.empName);
         * }
         */
        beforeList: null,
        /**
         * 编辑框中的字段改变值以后发生的操作
         * 必需要写d.resolve('将要填入的值')或者d.reject('错误框提示文字')
         * @name Column.afterChange
         * @function
         * @param {deferredObject} object - 当前页上的值
         * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
         * @example 检查是否输入5位工号
         * afterChange:function(object,deferred){
         *      if(object.editRecord.empNo.length!==5)
         *          deferred.reject('只能输入5位的工号');
         *      else
         *          deferred.resolve(object.editRecord.empNo+'@yiehphuichina.com');
         * }
         * @example ajax编辑框联动修改员工姓名
         * afterChange:function(object,deferred){
         *      deferred.resolve({empName:''});
         * }
         */
        afterChange: null
    };
    //endregion====================默认配置====================

    //region   =====================JS扩展=====================
    //ie bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (obj) {
            var that = this;
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                that.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
            };
        };
    }
    if(!String.prototype.capitalize){
        /**
         * 首字母大写
         * @name capitalize
         * @type {function}
         * @memberOf String
         * @returns {string} 首字母大写的字符串
         */
        String.prototype.capitalize = function () {
            var str = $.trim(this);
            return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
        };
    }

    /**
     * $.Deferred扩展
     * 类似于$.when，详细请参阅jQuery的Deferred使用说明
     * 区别:whenAll将等待所有deferred执行完毕
     * @name whenAll
     * @memberOf jQuery
     * @function
     * @param {Array.<deferred>|deferred} subordinate 保存$.Deferred实例的数组
     * @returns {jQuery.Deferred} deferred.promise()
     * @example
     * $.whenAll.apply($,defArr);
     */
    $.whenAll = function(subordinate) {
        var i = 0,
            fails,
            slice = Array.prototype.slice,
            resolveValues = slice.call( arguments ),
            length = resolveValues.length,
            remaining = length !== 1 || ( subordinate && $.isFunction( subordinate.promise ) ) ? length : 0,
            deferred = remaining === 1 ? subordinate : $.Deferred(),
            progressValues, progressContexts, resolveContexts,
            updateFunc = function( j, contexts, values, isDone ) {
                if(!isDone){
                    fails++;
                }
                return function( value ) {
                    contexts[ j ] = this;
                    values[ j ] = arguments.length > 1 ? slice.call( arguments ) : value;
                    if ( values === progressValues ) {
                        deferred.notifyWith( contexts, values );
                    }
                    else if ( !( --remaining ) ) {
                        deferred.resolveWith( contexts, values );
                    }
                };
            };
        if ( length > 1 ) {
            progressValues = new Array( length );
            progressContexts = new Array( length );
            resolveContexts = new Array( length );
            for ( ; i < length; i++ ) {
                if ( resolveValues[ i ] && $.isFunction( resolveValues[ i ].promise ) ) {
                    resolveValues[ i ].promise()
                        .done( updateFunc( i, resolveContexts, resolveValues, true ) )
                        .fail( updateFunc( i, resolveContexts, resolveValues, false ) )
                        .progress( updateFunc( i, progressContexts, progressValues ) );
                }
                else {
                    --remaining;
                }
            }
        }
        if ( !remaining ){
            if(fails){
                deferred.reject();
            }
            else{
                deferred.resolveWith( resolveContexts, resolveValues );
            }
        }
        return deferred.promise();
    };
    //endregion=====================JS扩展=====================

    //region   ====================构造函数====================
    /**
     * @name Plugin
     * @constructor
     * @param {HTMLElement} element html元素
     * @param {kekOption} options 用户自定义插件配置参数
     */
    function Plugin(element, options){
        /**
         * 插件的HTML元素对象
         * @name Plugin#element
         * @type {HTMLElement}
         */
        this.element = element;
        /**
         * 插件内部的局部jQuery对象
         * @namespace Plugin#elements
         */
        this.elements = {
            /**
             * Plugin->panel
             * @name Plugin#elements.$pluginPanel
             * @type {jQuery}
             */
            $pluginPanel: null,
            /**
             * 表格loading遮罩
             * @name Plugin#elements.$loading
             * @type {jQuery}
             */
            $loading: null,
            /**
             * 提示框
             * @name Plugin#elements.$alert
             * @type {jQuery}
             */
            $alert: null,
            /**
             * 确认框
             * @name Plugin#elements.$confirm
             * @type {jQuery}
             */
            $confirm: null,
            /**
             * 表格状态栏
             * @name Plugin#elements.$state
             * @type {jQuery}
             */
            $state: null,
            /**
             * 分页
             * @name Plugin#elements.$paging
             * @type {jQuery}
             */
            $paging: null,
            /**
             * 查询框
             * @namespace Plugin#elements.search
             */
            search: {
                /**
                 * 查询框
                 * @name Plugin#elements.search.$dialog
                 * @type {jQuery}
                 */
                $dialog: null,
                /**
                 * 条件区域
                 * @name Plugin#elements.search.$block
                 * @type {jQuery}
                 */
                $block: null,
                /**
                 * 字段列表
                 * @name Plugin#elements.search.$col
                 * @type {jQuery}
                 */
                $col: null,
                /**
                 * 关系运算符列表
                 * @name Plugin#elements.search.$operator
                 * @type {jQuery}
                 */
                $operator: null,
                /**
                 * 逻辑运算符列表
                 * @name Plugin#elements.search.$bool
                 * @type {jQuery}
                 */
                $bool: null,
                /**
                 * 功能项列表
                 * @name Plugin#elements.search.$control
                 * @type {jQuery}
                 */
                $control: null,
                /**
                 * 提示区
                 * @name Plugin#elements.search.$alert
                 * @type {jQuery}
                 */
                $alert: null
            },
            /**
             * 编辑框
             * @namespace Plugin#elements.edit
             */
            edit: {
                /**
                 * 编辑框
                 * @name Plugin#elements.edit.$dialog
                 * @type {jQuery}
                 */
                $dialog: null,
                /**
                 * 字段区域
                 * @name Plugin#elements.edit.$block
                 * @type {jQuery}
                 */
                $block: null,
                /**
                 * list类型字段的选项列表
                 * @name Plugin#elements.edit.$list
                 * @type {jQuery}
                 */
                $list: null,
                /**
                 * lov类型字段的选项列表
                 * @name Plugin#elements.edit.$lov
                 * @type {jQuery}
                 */
                $lov: null,
                /**
                 * 提示区
                 * @name Plugin#elements.edit.$alert
                 * @type {jQuery}
                 */
                $alert: null,
                /**
                 * 编辑框loading遮罩
                 * @name Plugin#elements.edit.$loading
                 * @type {jQuery}
                 */
                $loading: null
            },
            /**
             * 排序框
             * @namespace Plugin#elements.sort
             */
            sort: {
                /**
                 * 排序框
                 * @name Plugin#elements.sort.$dialog
                 * @type {jQuery}
                 */
                $dialog: null,
                /**
                 * 排序区域
                 * @name Plugin#elements.sort.$block
                 * @type {jQuery}
                 */
                $block: null,
                /**
                 * 排序条件设定区
                 * @name Plugin#elements.sort.$ctrl
                 * @type {jQuery}
                 */
                $ctrl: null
            },
            /**
             * 汇出Form
             * @namespace Plugin#elements.exportForm
             */
            exportForm: {
                /**
                 * form元素
                 * @name Plugin#elements.exportForm.$form
                 * @type {jQuery}
                 */
                $form: null,
                /**
                 * form提交的参数(input)
                 * @name Plugin#elements.exportForm.$param
                 * @type {jQuery}
                 */
                $param: null
            }
        };
        /**
         * 插件配置参数 (插件默认 extend 用户自定义)
         * @name Plugin#options
         * @type {kekOption}
         */
        this.options = $.extend({}, _options, options);
        /**
         * 内建菜单功能是否开启
         * @namespace Plugin#hasTool
         */
        this.hasTool = {
            /**
             * 查询功能
             * @name Plugin#hasTool.search
             * @type {bool}
             */
            search: null,
            /**
             * 修改功能
             * @name Plugin#hasTool.edit
             * @type {bool}
             */
            edit: null,
            /**
             * 新增功能
             * @name Plugin#hasTool.add
             * @type {bool}
             */
            add: null,
            /**
             * 刷新功能
             * @name Plugin#hasTool.refresh
             * @type {bool}
             */
            refresh: null,
            /**
             * 排序功能
             * @name Plugin#hasTool.sort
             * @type {bool}
             */
            sort: null,
            /**
             * 删除功能
             * @name Plugin#hasTool.delete
             * @type {bool}
             */
            'delete': null,
            /**
             * 汇出功能
             * @name Plugin#hasTool.export
             * @type {bool}
             */
            'export': null
        };
        /**
         * 显示loading时使用setTimeout的返回值
         * 用于判断是否已经显示loading
         * @name Plugin#loadingDelay
         * @type {number}
         */
        this.loadingDelay = null;
        /**
         * 当前画面上显示的是哪个遮罩 'list'、'edit'
         * @name Plugin#curLoading
         * @type {string}
         */
        this.curLoading = null;
        /**
         * columns配置参数里面用到了哪些tableId
         * @name Plugin#tablesId
         * @type {Array<number>}
         */
        this.tablesId = [];
        /**
         * columns配置参数里面设置了isKey的属性名
         * @name Plugin#keyCols
         * @type {Array<string>}
         */
        this.keyCols = [];
        /**
         * columns配置参数里面设置了listIndex的属性名
         * @name Plugin#listCols
         * @type {Array<string>}
         */
        this.listCols = [];
        /**
         * columns配置参数里面设置了editIndex的属性名
         * @name Plugin#editCols
         * @type {Array<string>}
         */
        this.editCols = [];
        /**
         * columns配置参数里面设置了colId的属性名
         * @name Plugin#dbCols
         * @type {Array<string>}
         */
        this.dbCols = [];
        /**
         * columns配置参数里面设置了colTotalSummary的属性名
         * @name Plugin#summaryCols
         * @type {Array<string>}
         */
        this.summaryCols = [];
        /**
         * 当前分页的页码
         * @name Plugin#curPageNo
         * @type {number}
         */
        this.curPageNo = 1;
        /**
         * 当前页面上的所有数据(所有columns)
         * 已转换为类
         * @name Plugin#curPageRecords
         * @type {Array<object>}
         */
        this.curPageRecords = [];
        /**
         * 当前选中的行号
         * 起始于1
         * @name Plugin#curRecordNo
         * @type {number}
         */
        this.curRecordNo = null;
        /**
         * 表格狀態，一般為toolbarIte.id
         * @name Plugin#tableStatus
         * @type {string}
         */
        this.tableStatus = null;
        /**
         * 新增、修改后的临时数据类
         * @name Plugin#editRecord
         * @type {Object}
         */
        this.editRecord = null;
        /**
         * 排序条件
         * @name Plugin#sortConditions
         * @type {Array.<sortCondition>}
         * @example 排序条件
         * sortConditions = [
         * 		{Col:'empNo',Type:'ASC',Nulls:'NULLS FIRST'},
         * 		{Col:'empName',Type:'DESC',Nulls:'NULLS LAST'}
         * ]
         */
        this.sortConditions = null;
        /**
         * 查询条件
         * @name Plugin#searchConditions
         * @type {Array.<Array.<Object>>}
         * @example 过滤条件
         * searchConditions = [
         * 		['empNo','eq','14563'],
         * 		['AND','state','isnull'],
         * 		['AND',[
         * 			['deptNo','eq','D02'],
         * 			['OR','deptNo','eq','D03']
         * 		]]
         * ]
         */
        this.searchConditions = null;

        this.init();
        this.registEvents();
    }
    //endregion====================构造函数====================

    //region   ======================原型======================
    /**
     * Plugin 原型
     */
    Plugin.prototype = {
        //region   =====================初始化=====================
        /**
         * 插件初始化
         * @var Plugin#init
         * @function
         * @this Plugin
         * @returns {void}
         */
        init: function(){
            /**
             * @type {Plugin}
             */
            var that = this;
            this.adjustOptions();
            if(this.options.isDebug){
                this.debug();
            }
            this.createPlugin();
            if(this.options.autoLoad){
                this.deferredFlow(
                    [this.createDeferred(this.loadData, null)],
                    null,
                    function(v){
                        that.showState( v ? v : $[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail, 'danger');
                    },
                    function(){
                        that.hideLoading();
                    }
                );
            }
            this.tableStatus = 'init';
        },
        /**
         * 调整插件配置参数
         * @var Plugin#adjustOptions
         * @function
         * @this Plugin
         * @returns {void}
         */
        adjustOptions: function(){
            var opt = this.options,
                vKeyTable;
            /**
             * @type {Plugin}
             */
            var that = this;
            //this.hasTool
            if(opt.toolbar) {
                $.each(opt.toolbar,
                    /**
                     * @param {number} i
                     * @param {Array.<toolbarItem>} toolGroup
                     */
                    function (i, toolGroup) {
                        $.each(toolGroup,
                            /**
                             * @param {number} j
                             * @param {toolbarItem} tool
                             */
                            function (j, tool) {
                                if (that.hasTool[tool.id] !== undefined) {
                                    that.hasTool[tool.id] = true;
                                }
                            }
                        );
                    }
                );
            }
            //tableWidth
            if(opt.tableWidth != null){
                if((opt.tableWidth - 0 === opt.tableWidth - 0) && (opt.tableWidth - 0)){
                    opt.tableWidth += 'px';
                }
            }
            //URL
            if(this.hasTool.add && opt.insertURL == null){
                opt.insertURL = opt.listURL;
            }
            if(this.hasTool.edit && opt.updateURL == null){
                opt.updateURL = opt.listURL;
            }
            if(this.hasTool['delete'] && opt.deleteURL == null){
                opt.deleteURL = opt.listURL;
            }
            if(this.hasTool['export'] && opt.exportURL == null){
                opt.exportURL = opt.listURL;
            }
            //export
            if(this.hasTool['export'] && opt.exportType == null){
                opt.exportType = 'CSV';
            }
            //columns
            $.each(opt.columns,
                /**
                 * @param {string} colName 字段名
                 * @param {Column} colObj 字段参数配置
                 */
                function(colName, colObj) {
                    colObj = $.extend(true, {}, _column, colObj);
                    $.each(colObj,
                        /**
                         * @param {string} prop 字段参数名
                         * @param {*} val 字段参数值
                         */
                        function (prop, val) {
                            switch (prop) {
                                case 'listIndex':
                                    //最终产生['empNo',undefined,'empName']，后面会将undefined去掉
                                    if (val != null) {
                                        if (that.listCols[val]) {
                                            throw colName + ' 有重复的listIndex';
                                        }
                                        that.listCols[val] = colName;
                                        //column.canExport
                                        if (colObj.colId != null && colObj.canExport == null) {
                                            colObj.canExport = true;
                                        }
                                    }
                                    break;
                                case 'listTitle':
                                    //null值初始化为colName
                                    if (val == null) {
                                        colObj[prop] = colName;
                                    }
                                    break;
                                case 'tableId':
                                    //整理所用到的tableId
                                    if (val != null) {
                                        if ($.inArray(val, that.tablesId) === -1) {
                                            that.tablesId.push(val);
                                        }
                                    }
                                    break;
                                case 'editIndex':
                                    if (val != null) {
                                        //this.editCols: 最终产生['empNo',undefined,'empName']，后面会将undefined去掉
                                        if (that.editCols[val]) {
                                            throw colName + '有重复的editIndex';
                                        }
                                        that.editCols[val] = colName;
                                        //column.editTitle: ''值将初始化为listTitle或'&nbsp;'。不设置'&nbsp;'的话，编辑框的字段会向上移位
                                        if (colObj.editTitle != null && !$.trim(colObj.editTitle)) {
                                            colObj.editTitle = '&nbsp;';
                                        }
                                        else {
                                            colObj.editTitle = colObj.listTitle || '&nbsp;';
                                        }
                                    }
                                    break;
                                case 'colId':
                                    //最终产生['empNo',undefined,'empName']，后面会将undefined去掉
                                    if (val != null) {
                                        if (that.dbCols[val]) {
                                            throw colName + '有重复的colId';
                                        }
                                        that.dbCols[val] = colName;
                                    }
                                    break;
                                case 'isKey':
                                    //最终产生['empNo','empName']
                                    if (val === true) {
                                        if (vKeyTable == null) {
                                            vKeyTable = colObj.tableId;
                                        }
                                        else if (vKeyTable !== colObj.tableId) {
                                            throw colName + ' 字段中的主键设置涉及到不同的表';
                                        }
                                        that.keyCols.push(colName);
                                    }
                                    break;
                                case 'listWidth':
                                    if (colObj.listIndex != null) {
                                        if (val == null) {
                                            val = 100;
                                        }
                                        if ((val - 0 === val - 0) && (val - 0)) {
                                            colObj[prop] = val + 'px';
                                        }
                                    }
                                    break;
                                case 'editWidth':
                                    if (colObj.editIndex != null) {
                                        if (val == null) {
                                            val = 100;
                                        }
                                        if ((val - 0 === val - 0) && (val - 0)) {
                                            colObj[prop] = val + 'px';
                                        }
                                    }
                                    break;
                                case 'colTotalSummary':
                                    //最终产生['empNo','empName']
                                    if (val != null) {
                                        that.summaryCols.push(colName);
                                    }
                                    break;
                                //no default
                            }
                        }
                    );
                    opt.columns[colName] = colObj;
                }
            );
            //去掉数组中的undefined
            this.listCols = $.map(this.listCols, function(v) {return v; });
            this.dbCols = $.map(this.dbCols, function(v) {return v; });
            this.editCols = $.map(this.editCols, function(v) {return v; });
            //第一个编辑字段初始化为 'block'
            if(this.editCols.length){
                opt.columns[this.editCols[0]].editDisplay = null;
            }
            //sortConditions
            this.sortConditions = opt.defaultSort || [];
            //searchConditions
            this.searchConditions = opt.defaultSearch || [];
        },
        /**
         * 检查插件配置参数
         * @var Plugin#debug
         * @function
         * @this Plugin
         * @returns {void}
         */
        debug: function(){
            var opt = this.options,
                totListWidth = 0,
                i, j, m, n;
            /**
             * @type {Plugin}
             */
            var that = this;
            //panelColor
            if($.inArray(opt.panelColor, ['panel-primary', 'panel-success', 'panel-info', 'panel-warning', 'panel-danger', 'panel-default']) === -1){
                console.warn('panelColor非内建值，当然你可以使用自定义的css');
            }
            //tableWidth
            if(!/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.tableWidth)){
                throw 'tableWidth请使用正确的宽度单位';
            }
            if(opt.tableWidth === '100%' && opt.frozenNum != null){
                console.warn('frozen表格请确保在画面上为固定宽度，否则屏幕过长后会导致非冻结栏位溢出');
            }
            //editDialogWidth
            if((this.hasTool.add || this.hasTool.edit) && !/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.editDialogWidth)){
                throw 'editDialogWidth请使用正确的宽度单位';
            }
            //sortDialogWidth
            if(this.hasTool.sort && !/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.sortDialogWidth)){
                throw 'sortDialogWidth请使用正确的宽度单位';
            }
            //searchDialogWidth
            if(this.hasTool.search && !/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.searchDialogWidth)){
                throw 'searchDialogWidth请使用正确的宽度单位';
            }
            //rowNum
            if(!opt.rowNum){
                throw 'rowNum必需大于0。否则你需要这个表来做什么';
            }
            //单笔显示
            else if(opt.rowNum === 1){
                if(opt.frozenNum != null){
                    console.warn('rowNum设置为1代表是单笔显示模式，此模式下没有冻结功能，你可以去掉frozenNum');
                }
                if(opt.showRowNo){
                    console.warn('rowNum设置为1代表是单笔显示模式，此模式下没有序号列，你可以去掉showRowNo');
                }
            }
            //冻结
            if(!opt.showRowNo && opt.frozenNum === 0){
                console.warn('frozenNum=0代表冻结行号，但是你并没有显示行号');
            }
            //toolbar
            if(!opt.toolbar || opt.toolbar.length === 0){
                console.log('未开启工具栏');
            }
            else{
                if($.type(opt.toolbar) !== 'array'){
                    throw 'toolbar必需是数组';
                }
                for(i = 0, j = opt.toolbar.length; i < j; i++){
                    if($.type(opt.toolbar[i]) !== 'array'){
                        throw 'toolbar按钮组必需是数组';
                    }
                    for(m = 0, n = opt.toolbar[i].length; m < n; m++){
                        if($.inArray(opt.toolbar[i][m].id, ['refresh', 'search', 'sort', 'add', 'edit', 'delete', 'export']) === -1){
                            if(!opt.toolbar[i][m].id || $.type(opt.toolbar[i][m].id) !== 'string'){
                                throw 'toolbar.id必需要有(string类型)';
                            }
                            if(opt.toolbar[i][m].icon && $.type(opt.toolbar[i][m].icon) !== 'string'){
                                throw 'toolbar.icon必需是string类型';
                            }
                            if(opt.toolbar[i][m].label && $.type(opt.toolbar[i][m].label) !== 'string'){
                                throw 'toolbar.label必需是string类型';
                            }
                            if(opt.toolbar[i][m].title && $.type(opt.toolbar[i][m].title) !== 'string'){
                                throw 'toolbar.title必需是string类型';
                            }
                            if(opt.toolbar[i][m].action && $.type(opt.toolbar[i][m].action) !== 'function'){
                                throw 'toolbar.action必需是function类型';
                            }
                            if(!opt.toolbar[i][m].icon && !opt.toolbar[i][m].label){
                                console.warn(opt.toolbar[i][m].id + '按钮没有icon也没有label');
                            }
                            if(!opt.toolbar[i][m].action){
                                throw 'toolbar.' + opt.toolbar[i][m].id + '没有action';
                            }
                        }
                        else if(opt.toolbar[i][m].action || opt.toolbar[i][m].icon || opt.toolbar[i][m].title){
                            console.warn(opt.toolbar[i][m].id + '内建按钮无法改变其action,label,title');
                        }
                    }
                }
            }
            //URL
            if(!opt.listURL){
                throw '没有listURL';
            }
            if(this.hasTool.add && opt.insertURL == null){
                throw '没有insertURL';
            }
            if(this.hasTool.edit && opt.updateURL == null){
                throw '没有updateURL';
            }
            if(this.hasTool['delete'] && opt.deleteURL == null){
                throw '没有deleteURL';
            }
            //columns
            if(!opt.columns){
                throw '必需设置columns';
            }
            else if($.type(opt.columns) !== 'object'){
                throw 'columns必需是object类型';
            }
            //tableRelations
            if(this.tablesId.length > 1){
                if(opt.tableRelations == null || !opt.tableRelations.length){
                    console.warn('有多表，却没有设置tableRelations');
                }
                else if($.type(opt.tableRelations) !== 'array'){
                    throw 'tableRelations必须是数组';
                }
                else{
                    $.each(opt.tableRelations,
                        /**
                         * @param {number} ci
                         * @param {Array.<number>} relation
                         */
                        function(ci, relation) {
                            if ($.type(relation) !== 'array'){
                                throw 'tableRelations必须是二维数组';
                            }
                            if (relation.length !== 3){
                                throw 'tableRelation数组长度必需为3';
                            }
                            if (relation[2] !== 0 && relation[2] !== 1){
                                throw 'tableRelation数组第三位必需是0,1';
                            }
                        }
                    );
                }
            }
            if(opt.defaultSearch){
                this.checkSearchCondition(opt.defaultSearch);
            }
            //defaultSort
            if(opt.defaultSort){
                this.checkSortCondition(opt.defaultSort);
            }
            //col
            $.each(opt.columns,
                /**
                 * @param {string} colName
                 * @param {Column} colObj
                 */
                function(colName, colObj) {
                    if (colObj == null){
                        throw colName + '不能设为Null';
                    }
                    if (colObj.colId < 0 || colObj.listIndex < 0 || colObj.editIndex < 0 || colObj.tableId < 0){
                        throw colName + '不能设为负数(colId,listIndex,editIndex,tableId)';
                    }
                    if ((colObj.colId != null && colObj.tableId == null) || (colObj.colId == null && colObj.tableId != null)){
                        throw colName + '必需同时设置colId，tableId';
                    }
                    if (colObj.colId == null && colObj.isKey){
                        throw colName + '没有设置colId，代表是非数据库字段，不能设置isKey';
                    }
                    if (colObj.colType && $.inArray(colObj.colType, ['number', 'date', 'datetime']) === -1){
                        throw colName + ' colType必需是number、date、datetime';
                    }
                    if (colObj.colLength != null) {
                        if (parseFloat(colObj.colLength).toString() !== colObj.colLength){
                            throw colName + ' colLength格式错误';
                        }
                    }
                    if (colObj.listIndex == null) {
                        if (colObj.listWidth){
                            console.warn(colName + '没有设置listIndex代表非显示栏位，不用设置listWidth');
                        }
                        if (colObj.listTitle && colObj.listTitle !== colName){
                            console.warn(colName + '没有设置listIndex代表非显示栏位，不用设置listTitle');
                        }
                    }
                    if (colObj.listWidth === '0'){
                        console.warn(colName + '的listWidth被设置为0，如果不需要显示，请设置listIndex=null');
                    }
                    if (colObj.listWidth){
                        totListWidth += parseInt(colObj.listWidth, 10);
                    }
                    if (colObj.colId == null && colObj.canFilter){
                        console.warn(colName + '没设置colId,代表非数据库栏位，canFilter设置将无效');
                    }
                    if (!that.hasTool.search && colObj.canFilter){
                        console.warn(colName + '没开启查询功能，canFilter设置将无效');
                    }
                    if (colObj.colId == null && colObj.canSort){
                        console.warn(colName + '没设置colId,代表非数据库栏位，canSort设置将无效');
                    }
                    if (!that.hasTool.sort && colObj.canSort){
                        console.warn(colName + '没开启排序功能，canSort设置将无效');
                    }
                    if (!that.hasTool.edit && !that.hasTool.add) {
                        if (colObj.editTitle || colObj.editIndex){
                            console.warn(colName + '没有开启新增修改功能，不用设置editTitle、editIndex、afterChange');
                        }
                    }
                    //editCols
                    if (colObj.editDisplay && $.inArray(colObj.editDisplay, ['inline', 'cling']) === -1){
                        throw colName + ' editDisplay只能设置为inline,cling';
                    }
                    if (colObj.editIndex == null && (colObj.afterChange)){
                        console.warn(colName + '沒有設置editIndex,不用設置afterChange');
                    }
                    if (colObj.editType !== 'lov' && colObj.lovCols){
                        console.warn(colName + '不是lov类型，不用设置lovCols');
                    }
                    else if (colObj.editType === 'lov') {
                        if (!colObj.lovCols){
                            throw colName + '是lov类型，没设置lovCols';
                        }
                        if (!colObj.editList){
                            throw colName + '是lov类型，没设置editList';
                        }
                    }

                    if (colObj.editType !== 'lov' && colObj.editType !== 'list' && colObj.editList){
                        console.warn(colName + '不是lov、list类型，不用设置editList');
                    }
                    if (colObj.editType === 'list') {
                        if (!colObj.editList && !colObj.listList){
                            throw colName + '是list类型，没设置listList、editList';
                        }
                        else if (!colObj.editList){
                            console.warn(colName + '是list类型，应设置editList');
                        }
                    }
                    //colTotal
                    if (colObj.colTotalSummary && $.inArray(colObj.colTotalSummary, ['SUM', 'COUNT', 'AVG', 'MAX', 'MIN', 'STDDEV', 'VARIANCE', 'MEDIAN']) === -1){
                        throw colName + ' colTotalSummary只能设置为SUM,COUNT,AVG,MAX,MIN,STDDEV,VARIANCE,MEDIAN';
                    }
                }
            );
            //col array
            if(!this.listCols.length){
                throw '没有设置任何的listIndex';
            }
            if(!this.dbCols.length){
                throw '没有设置任何的colId';
            }
            if(this.hasTool.add && this.hasTool.edit && !this.editCols.length){
                console.warn('开启了新增修改功能却没有任何的editIndex');
            }
            if(!this.keyCols.length && (this.hasTool.add || this.hasTool.edit || this.hasTool['delete'])){
                throw '没有设置任何的isKey，如果table没有主键请设置ROWID为主键';
            }
            //editCols
            if(this.editCols.length && opt.columns[this.editCols[0]].editDisplay != null){
                console.warn(this.editCols[0] + '只能设置为null');
            }
            //totListWidth
            if(opt.frozenNum != null && totListWidth < parseInt(opt.tableWidth, 10)){
                throw '字段总宽度' + totListWidth + '小于表宽度' + opt.tableWidth + '，冻结情况下会产生单元格对齐问题。你不需要开启冻结';
            }
        },
        //endregion=====================初始化=====================

        //region   ====================建立插件====================
        /* Plugin
         *   Panel
         *     Head
         * 		 H3
         *       H5
         *     Collapse
         *       Toolbar
         *       Table-Group
         *       Table-Summary
         *       Table-Detail
         *       Footer
         *         Paging
         *   Loading
         * 	 Alert
         * 	 Confirm
         * 	 Search
         * 	 Edit
         * 	 Sort
         * 	 Export
         */
        /**
         * 建立插件
         * @this Plugin
         * @returns {void}
         */
        createPlugin: function(){
            var $frag = $(document.createDocumentFragment());
            $frag.append(this.createPluginPanel())
                .append(this.createPluginLoading())
                .append(this.createPluginAlert())
                .append(this.createPluginConfirm())
                .append(this.createPluginSearch())
                .append(this.createPluginEdit())
                .append(this.createPluginSort())
                .append(this.createExport());
            $(this.element).addClass('kekTable-listPanel panel-group')
                .css('width', this.options.tableWidth)
                .append($frag);
        },
        /**
         * 建立主表格
         * @this Plugin
         * @returns {jQuery} 主表格$pluginPanel
         */
        createPluginPanel: function(){
            var $el = this.elements.$pluginPanel;
            this.elements.$pluginPanel = $('<div>');
            $el.addClass('panel ' + this.options.panelColor)
                .append(this.createPanelHead())
                .append(this.createPanelCollapse());
            return $el;
        },
        /**
         * 建立主表格 标题区
         * @this Plugin
         * @returns {jQuery} 标题区panel-heading
         */
        createPanelHead: function(){
            var $el = $('<div>');
            $el.addClass('panel-heading');
            //展开
            if(this.options.isCollapse){
                $el.attr({
                    'data-toggle': 'collapse',
                    'data-target': '#' + this.element.id + 'CollapseGroup'
                }).append('<h5 class="glyphicon glyphicon-chevron-down pull-right"></h5>');
            }
            $el.append($('<h3 class="pull-left">' + this.options.title + '</h3>'));
            return $el;
        },
        /**
         * 建立主表格 内容区
         * @this Plugin
         * @returns {jQuery} 内容区panel-collapse
         */
        createPanelCollapse: function(){
            var $el = $('<div>');
            $el.attr('id', this.element.id + 'CollapseGroup')
                .addClass('panel-collapse collapse' + (this.options.collapseExpanded ? ' in' : ''))
                .append(this.createCollapseToolbar())
                .append(this.createCollapseTableGroup())
                .append(this.createCollapseTableSummary())
                .append(this.createCollapseTableDetail())
                .append(this.createCollapseFooter());
            return $el;

        },
        /**
         * 建立主表格 内容区 工具栏
         * @this Plugin
         * @returns {jQuery} 工具栏
         */
        createCollapseToolbar: function(){
            var $el = $('<div>'),
                tb = this.options.toolbar,
                $tb, $btnGroup, i, j, m, n;
            $el.addClass('panel-body');
            if(tb && tb.length > 0){
                $tb = $('<div>');
                $tb.addClass('btn-toolbar');
                for(i = 0, j = tb.length; i < j; i++){
                    //分组
                    $btnGroup = $('<div class="btn-group btn-group-sm"></div>');
                    for(m = 0, n = tb[i].length; m < n; m++){
                        if($.type(this['createTool' + tb[i][m].id.capitalize()]) === 'function'){
                            $btnGroup.append(this['createTool' + tb[i][m].id.capitalize()]());
                        }
                        else{
                            $btnGroup.append(this.createToolCustom(tb[i][m]));
                        }
                    }
                    $tb.append($btnGroup);
                }
                $el.append($tb);
            }
            return $el;
        },
        /**
         * 建立主表格 内容区 工具栏 刷新按钮
         * @this Plugin
         * @returns {jQuery} 刷新按钮
         */
        createToolRefresh: function(){
            /**
             * @type {Plugin}
             */
            var that = this;
            var $el = $('<span class="btn btn-default" title="' + $[_pluginName].regional.toolbarRefresh + '"><span class="glyphicon glyphicon-refresh"></span><span>' +
                        $[_pluginName].regional.toolbarRefresh + '</span></span>');
            $el.click(function(){that.refresh(); });
            return $el;
        },
        /**
         * 建立主表格 内容区 工具栏 查询按钮
         * @this Plugin
         * @returns {jQuery} 查询按钮
         */
        createToolSearch: function(){
            /**
             * @type {Plugin}
             */
            var that = this;
            var $el = $('<span class="btn btn-default" title="' + $[_pluginName].regional.toolbarSearch + '"><span class="glyphicon glyphicon-search"></span><span>' +
                        $[_pluginName].regional.toolbarSearch + '</span></span>');
            $el.click(function(){that.search(); });
            return $el;
        },
        /**
         * 建立主表格 内容区 工具栏 排序按钮
         * @this Plugin
         * @returns {jQuery} 排序按钮
         */
        createToolSort: function(){
            /**
             * @type {Plugin}
             */
            var that = this;
            var $el = $('<span class="btn btn-default" title="' + $[_pluginName].regional.toolbarSort + '"><span class="glyphicon glyphicon-sort"></span><span>' +
                        $[_pluginName].regional.toolbarSort + '</span></span>');
            $el.click(function(){that.sort(); });
            return $el;
        },
        /**
         * 建立主表格 内容区 工具栏 新增按钮
         * @this Plugin
         * @returns {jQuery} 新增按钮
         */
        createToolAdd: function(){
            /**
             * @type {Plugin}
             */
            var that = this;
            var $el = $('<span class="btn btn-default" title="' + $[_pluginName].regional.toolbarAdd + '"><span class="glyphicon glyphicon-plus"></span><span>' +
                        $[_pluginName].regional.toolbarAdd + '</span></span>');
            $el.click(function(){that.add(); });
            return $el;
        },
        /**
         * 建立主表格 内容区 工具栏 修改按钮
         * @this Plugin
         * @returns {jQuery} 修改按钮
         */
        createToolEdit: function(){
            /**
             * @type {Plugin}
             */
            var that = this;
            var $el = $('<span class="btn btn-default" title="' + $[_pluginName].regional.toolbarEdit + '"><span class="glyphicon glyphicon-edit"></span><span>' +
                        $[_pluginName].regional.toolbarEdit + '</span></span>');
            $el.click(function(){that.edit(); });
            return $el;
        },
        /**
         * 建立主表格 内容区 工具栏 删除按钮
         * @this Plugin
         * @returns {jQuery} 删除按钮
         */
        createToolDelete: function(){
            /**
             * @type {Plugin}
             */
            var that = this;
            var $el = $('<span class="btn btn-default" title="' + $[_pluginName].regional.toolbarDelete + '"><span class="glyphicon glyphicon-minus"></span><span>' +
                        $[_pluginName].regional.toolbarDelete + '</span></span>');
            $el.click(function(){that['delete'](); });
            return $el;
        },
        /**
         * 建立主表格 内容区 工具栏 汇出按钮
         * @this Plugin
         * @returns {jQuery} 汇出按钮
         */
        createToolExport: function(){
            /**
             * @type {Plugin}
             */
            var that = this;
            var $el = $('<span class="btn btn-default" title="' + $[_pluginName].regional.toolbarExport + '"><span class="glyphicon glyphicon-export"></span><span>' +
                        $[_pluginName].regional.toolbarExport + '</span></span>');
            $el.click(function(){that['export'](); });
            return $el;
        },
        /**
         * 建立主表格 内容区 工具栏 自定义按钮
         * @this Plugin
         * @param {toolbarItem} btn 自定义的toolbarItem对象
         * @returns {jQuery} 自定义按钮
         */
        createToolCustom: function(btn){
            /**
             * @type {Plugin}
             */
            var that = this;
            var $el = $('<span class="btn btn-default" title="' + (btn.title || btn.label || btn.id) + '"><span class="glyphicon ' + (btn.icon || '') +
                        '"></span><span>' + (btn.label || '') + '</span></span>');
            $el.click(function(){
                that.tableStatus = btn.id;
                that.showLoading('', 'list');
                that.deferredFlow(
                    [
                        that.createDeferred(that.options['before' + btn.id.capitalize()], that.deferredObject),
                        that.createDeferred(btn.action, that.deferredObject),
                        that.createDeferred(that.options['after' + btn.id.capitalize()], that.deferredObject)
                    ],
                    null,
                    function(v){
                        that.showState(v ? v : btn.label + $[_pluginName].regional.eventFail, 'danger');
                    },
                    function(){
                        that.hideLoading('list');
                    }
                );
            });
            return $el;
        },
        /**
         * 建立主表格 内容区 表格区
         * @this Plugin
         * @returns {jQuery} 表格区
         */
        createCollapseTableGroup: function(){
            var $el,
                opt = this.options;
            this.elements.$tableGroup = $el = $('<div class="kekTable-table-group"></div>');
            $el.append((opt.rowNum === 1 && this.createTableSingle()) || (opt.frozenNum != null && this.createTableFrozen()) || this.createTable());
            return $el;
        },
        /**
         * 建立主表格 内容区 表格区 普通表格
         * @this Plugin
         * @returns {jQuery} 普通表格
         */
        createTable: function(){
            var $el = $('<table>'),
                colGroup = [],
                tHead = [],
                cols = this.options.columns;
            $el.addClass('table table-bordered table-condensed' + (this.options.canRowHover ? (this.options.frozenNum != null ? '' : ' table-hover') : ''));
            if(this.options.showRowNo){
                colGroup.push('<col style="width:50px;">');
                tHead.push('<th>#</th>');
            }
            $.each(this.listCols, function(i, v) {
                colGroup.push('<col' + (cols[v].listWidth ? (' style="width:' + cols[v].listWidth + ';"') : '') + ' />');
                tHead.push('<th>' + cols[v].listTitle + '</th>');
            });
            $el.append('<colgroup>' + colGroup.join('') + '</colgroup>')
                .append('<thead><tr>' + tHead.join('') + '</tr></thead>')
                .append('<tbody></tbody>');
            return $el;
        },
        /**
         * 建立主表格 内容区 表格区 冻结表格
         * @this Plugin
         * @returns {jQuery} 冻结表格
         */
        createTableFrozen: function(){
            var $el = $(document.createDocumentFragment()),
                $fTable = $('<table class="table table-bordered table-condensed kekTable-table-frozen"></table>'),
                colGroup = [],
                tHead = [],
                cols = this.options.columns,
                i;
            //frozen
            if(this.options.showRowNo){
                colGroup.push('<col style="width:50px;">');
                tHead.push('<th>#</th>');
            }
            for(i = 0; i < this.options.frozenNum; i++){
                colGroup.push('<col' + (cols[this.listCols[i]].listWidth ? (' style="width:' + cols[this.listCols[i]].listWidth + ';"') : '') + ' />');
                tHead.push('<th>' + cols[this.listCols[i]].listTitle + '</th>');
            }
            $fTable.append('<colgroup>' + colGroup.join('') + '</colgroup>')
                .append('<thead><tr>' + tHead.join('') + '</tr></thead>')
                .append('<tbody></tbody>');
            $el.append($fTable).append(this.createTable());
            return $el;
        },
        /**
         * 建立主表格 内容区 表格区 单行记录表格
         * @this Plugin
         * @returns {jQuery} 单行记录表格
         */
        createTableSingle: function(){
            var $el = $('<ul class="kekTable-single-table"></ul>'),
                ul = [],
                li = [],
                cols = this.options.columns;
            $.each(this.listCols, function(i, colName) {
                if(li.length && !cols[colName].listInline){
                    ul.push('<li>' + li.join('') + '</li>');
                    li.length = 0;
                }
                li.push('<div><b>' + cols[colName].listTitle + '</b><span class="kekTable-col" data-col="' + colName + '"' +
                        (cols[colName].listWidth ? (' style="width:' + cols[colName].listWidth + ';"') : '') + '></span></div>');
            });
            if(li.length){
                ul.push('<li>' + li.join('') + '</li>');
            }
            $el.append(ul.join(''));
            return $el;
        },
        /**
         * 建立主表格 内容区 摘要区
         * @this Plugin
         * @returns {jQuery} 摘要区
         */
        createCollapseTableSummary: function(){
            var $el, cols;
            if(this.summaryCols.length){
                $el = $('<div class="kekTable-table-summary"></div>');
                cols = this.options.columns;
                $.each(this.summaryCols, function(i, colName) {
                    $el.append('<h5 data-col="' + colName + '">' + cols[colName].listTitle + '(' + $[_pluginName].regional['total' + cols[colName].colTotalSummary] + '): <b></b></h5>');
                });
                this.elements.$summary = $el;
                return $el;
            }
        },
        /**
         * 建立主表格 内容区 子表区
         * @this Plugin
         * @returns {jQuery} 子表区
         */
        createCollapseTableDetail: function(){
            var $el;
            if(this.options.detailTable){
                $el = $('<div class="kekTable-table-md"></div>');
                $('#' + this.options.detailTable).appendTo($el);
                return $el;
            }
        },
        /**
         * 建立主表格 内容区 表尾区
         * @this Plugin
         * @returns {jQuery} 表尾区
         */
        createCollapseFooter: function(){
            return $('<div class="panel-footer"></div>').append(this.createFooterPaging(1)).append(this.createFooterState());
        },
        /**
         * 建立主表格 内容区 表尾区 分页
         * @this Plugin
         * @param {number} recordCount 记录总数
         * @returns {jQuery} 分页
         */
        createFooterPaging: function(recordCount){
            /**
             * @type {jQuery}
             */
            var $el;
            var curPageBA = 1;//当前页前后的按钮数量
            var intactPages = curPageBA * 2 + 5;//一共有多少个按钮  1 .. 10 11 12 .. 20
            var pageCount = Math.ceil(recordCount / this.options.rowNum);//总页
            var pageArr = [];//分页按钮组
            var i = 0;
            if(this.options.showPaging){
                $el = this.elements.$paging || (this.elements.$paging = $('<nav><ul class="pagination"></ul></nav>'));
                if(recordCount == null){
                    throw '没有记录数';
                }
                pageArr[0] = '<li><a href="#">1</a></li>';
                //最後頁
                if (pageCount > 1){
                    pageArr[(intactPages > pageCount ? pageCount : intactPages) - 1] = '<li><a href="#">' + pageCount + '</a></li>';
                }
                if (pageCount <= intactPages) {
                    for (i = 2; i <= pageCount - 1; i++){
                        pageArr[i - 1] = '<li><a href="#">' + i + '</a></li>';
                    }
                    pageArr[this.curPageNo - 1] = '<li class="active"><span>' + this.curPageNo + '</span></li>';
                }
                else {
                    //1 2 3 4 5 ... 8
                    if (this.curPageNo <= curPageBA + 3) {
                        for (i = 2; i <= curPageBA + 4; i++){
                            pageArr[i - 1] = '<li><a href="#">' + i + '</a></li>';
                        }
                        pageArr[this.curPageNo - 1] = '<li class="active"><span>' + this.curPageNo + '</span></li>';
                        pageArr[intactPages - 2] = '<li class="disabled"><span>...</span></li>';
                    }
                    //1 ... 4 5 6 7 8
                    else if (this.curPageNo >= pageCount - curPageBA - 2) {
                        for (i = 2; i <= curPageBA + 4; i++){
                            pageArr[intactPages - i] = '<li><a href="#">' + (pageCount - i + 1) + '</a></li>';
                        }
                        pageArr[intactPages - (pageCount - this.curPageNo) - 1] = '<li class="active"><span>' + this.curPageNo + '</span></li>';
                        pageArr[1] = '<li class="disabled"><span>...</span></li>';
                    }
                    //1 ... 4 5 6 ... 9
                    else {
                        pageArr[1] = '<li class="disabled"><span>...</span></li>';
                        pageArr[intactPages - 2] = '<li class="disabled"><span>...</span></li>';
                        for (i = 1; i <= curPageBA; i++) {
                            pageArr[i + 1] = '<li><a href="#">' + (this.curPageNo - i) + '</a></li>';
                        }
                        for (i = 1; i <= curPageBA; i++) {
                            pageArr[intactPages - 2 - i] = '<li><a href="#">' + (this.curPageNo - i + 1 + curPageBA) + '</a></li>';
                        }
                        pageArr[Math.ceil(intactPages / 2) - 1] = '<li class="active"><span>' + this.curPageNo + '</span></li>';
                    }
                }
                $el.children().empty().append(pageArr.join(''));
                return $el;
            }
        },
        /**
         * 建立主表格 内容区 表尾区 状态栏
         * @this Plugin
         * @returns {jQuery} 状态栏
         */
        createFooterState: function(){
            this.elements.$state = $('<div class="alert alert-success"></div>');
            return this.elements.$state;
        },
        /**
         * 建立加载遮罩
         * @this Plugin
         * @param {string} [el] 是读取遮罩还是修改遮罩[ 'list'、'edit' ]
         * @returns {jQuery} 加载遮罩
         */
        createPluginLoading: function(el){
            var $el = $('<div class="kekTable-loading" style="display: none;"><div class="bk-opacity"></div><p><span class="alert alert-info">' + $[_pluginName].regional.loadingTxt + '</span></p></div>');
            if(el === 'edit'){
                this.elements.edit.$loading = $el;
            }
            else{
                this.elements.$loading = $el;
            }
            return $el;
        },
        /**
         * 建立提示框
         * @this Plugin
         * @returns {jQuery} 提示框
         */
        createPluginAlert: function(){
            this.elements.$alert = $('<div class="modal fade" data-backdrop="static" tabindex="-1" style="z-index:2000"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">' +
            $[_pluginName].regional.alertTitle + '</h4></div><div class="modal-body"><p></p></div></div></div></div>');
            return this.elements.$alert;
        },
        /**
         * 建立确认框
         * @this Plugin
         * @returns {jQuery} 确认框
         */
        createPluginConfirm: function(){
            var regional = $[_pluginName].regional;
            this.elements.$confirm = $('<div class="modal fade" data-backdrop="static" tabindex="-1" style="z-index:2000"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' +
                regional.alertTitle + '</h4></div><div class="modal-body"><p>' + regional.deleteConfirm + '</p></div><div class="modal-footer"><button class="btn btn-primary">' +
                regional.buttonOk + '</button><button class="btn btn-default" data-dismiss="modal">' + regional.buttonCancel + '</button></div></div></div></div>');
            return this.elements.$confirm;
        },
        /**
         * 建立查询框
         * @this Plugin
         * @returns {jQuery} 查询框
         */
        createPluginSearch: function(){
            var regional = $[_pluginName].regional;
            if(this.hasTool.search){
                this.elements.search.$dialog = $('<div class="modal fade kekTable-search" style="display:none;" data-backdrop="static" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' +
                    regional.searchTitle + '</h4></div><div class="modal-body"></div><div class="modal-footer"><div class="alert alert-danger">' + regional.searchErr + '</div><button type="button" class="btn btn-default" data-dismiss="modal">' +
                    regional.buttonCancel + '</button><button type="button" class="btn btn-primary">' + regional.searchCommit + '</button></div></div></div></div>');
                this.elements.search.$dialog.find('.modal-body').append(this.elements.search.$block = $('<ul class="kekTable-search-block"></ul>'));
                $('.modal-body', this.elements.search.$dialog).append(this.createSearchCol())
                    .append(this.createSearchOperator())
                    .append(this.createSearchBool())
                    .append(this.createSearchControl());
                $('.modal-dialog', this.elements.search.$dialog).css('width', this.options.searchDialogWidth);
                this.elements.search.$alert = this.elements.search.$dialog.find('.modal-footer .alert');
                return this.elements.search.$dialog;
            }
        },
        /**
         * 建立查询框 字段列表
         * @this Plugin
         * @returns {jQuery} 字段列表
         */
        createSearchCol: function(){
            var li = [], cols = this.options.columns;
            this.elements.search.$col = $('<ul class="dropdown-menu kekTable-dropList"></ul>');
            $.each(this.dbCols, function(i, colName) {
                if(cols[colName].canFilter){
                    li.push('<li data-col="' + colName + '"><span>' + (cols[colName].listTitle || colName) + '</span></li>');
                }
            });
            this.elements.search.$col.append(li.join(''));
            this.setSearchDialog();
            return this.elements.search.$col;
        },
        /**
         * 建立查询框 运算符列表
         * @this Plugin
         * @returns {jQuery} 运算符列表
         */
        createSearchOperator: function(){
            var li = [], regional = $[_pluginName].regional;
            this.elements.search.$operator = $('<ul class="dropdown-menu kekTable-dropList"></ul>');
            li.push(
                '<li data-opt="eq"><span>' + regional.searchOptEq + '</span></li>',
                '<li data-opt="gt"><span>' + regional.searchOptGt + '</span></li>',
                '<li data-opt="lt"><span>' + regional.searchOptLt + '</span></li>',
                '<li data-opt="ge"><span>' + regional.searchOptGe + '</span></li>',
                '<li data-opt="le"><span>' + regional.searchOptLe + '</span></li>',
                '<li data-opt="ne"><span>' + regional.searchOptNe + '</span></li>',
                '<li data-opt="beg"><span>' + regional.searchOptBeg + '</span></li>',
                '<li data-opt="end"><span>' + regional.searchOptEnd + '</span></li>',
                '<li data-opt="like"><span>' + regional.searchOptLike + '</span></li>',
                '<li data-opt="isnull"><span>' + regional.searchOptNull + '</span></li>',
                '<li data-opt="notnull"><span>' + regional.searchOptNNull + '</span></li>'
            );
            this.elements.search.$operator.append(li.join(''));
            return this.elements.search.$operator;
        },
        /**
         * 建立查询框 逻辑列表
         * @this Plugin
         * @returns {jQuery} 逻辑列表
         */
        createSearchBool: function(){
            var li = [], regional = $[_pluginName].regional;
            this.elements.search.$bool = $('<ul class="dropdown-menu kekTable-dropList"></ul>');
            li.push(
                '<li data-bool="AND"><span>' + regional.searchBoolAnd + '</span></li>',
                '<li data-bool="OR"><span>' + regional.searchBoolOr + '</span></li>'
            );
            this.elements.search.$bool.append(li.join(''));
            return this.elements.search.$bool;
        },
        /**
         * 建立查询框 控制列表
         * @this Plugin
         * @returns {jQuery} 控制列表
         */
        createSearchControl: function(){
            var li = [], regional = $[_pluginName].regional;
            this.elements.search.$control = $('<ul class="dropdown-menu kekTable-dropList"></ul>');
            li.push(
                '<li data-ctrl="pc"><span>' + regional.searchAddPreCond + '</span></li>',
                '<li data-ctrl="nc"><span>' + regional.searchAddNxtCond + '</span></li>',
                '<li class="divider"></li>',
                '<li data-ctrl="pg"><span>' + regional.searchAddPreGrp + '</span></li>',
                '<li data-ctrl="ng"><span>' + regional.searchAddNxtGrp + '</span></li>',
                '<li class="divider"></li>',
                '<li data-ctrl="del"><span>' + regional.searchDelCond + '</span></li>'
            );
            this.elements.search.$control.append(li.join(''));
            return this.elements.search.$control;
        },
        /**
         * 建立修改框
         * @this Plugin
         * @returns {jQuery} 修改框
         */
        createPluginEdit: function(){
            var regional = $[_pluginName].regional;
            if(this.hasTool.edit || this.hasTool.add){
                this.elements.edit.$dialog = $('<div class="modal fade kekTable-edit" data-backdrop="static" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' +
                    regional.editTitle + '</h4></div><div class="modal-body"></div><div class="modal-footer"><div class="alert alert-danger"></div><button type="button" class="btn btn-default" data-dismiss="modal">' +
                    regional.buttonCancel + '</button><button type="button" class="btn btn-primary">' + regional.editCommit + '</button></div></div></div></div>');
                $('.modal-body', this.elements.edit.$dialog).append(this.createEditBlock(), this.createEditList(), this.createEditLov());
                $('.modal-dialog', this.elements.edit.$dialog).append(this.elements.edit.$loading = this.createPluginLoading('edit'));
                $('.modal-dialog', this.elements.edit.$dialog).css('width', this.options.editDialogWidth);
                this.elements.edit.$alert = this.elements.edit.$dialog.find('.modal-footer .alert');
                return this.elements.edit.$dialog;
            }
        },
        /**
         * 建立修改框 list类型的列表
         * @this Plugin
         * @returns {jQuery} list类型的列表
         */
        createEditList: function(){
            this.elements.edit.$list = $('<ul class="dropdown-menu kekTable-dropList"></ul>');
            return this.elements.edit.$list;
        },
        /**
         * 建立修改框 lov类型的列表
         * @this Plugin
         * @returns {jQuery} lov类型的列表
         */
        createEditLov: function(){
            this.elements.edit.$lov = $('<div class="dropdown-menu kekTable-lov"><table class="table table-hover table-condensed"><thead></thead><tbody></tbody></table></div>');
            return this.elements.edit.$lov;
        },
        /**
         * 建立修改框 字段区
         * @this Plugin
         * @returns {jQuery} 字段区
         */
        createEditBlock: function(){
            var $el = $('<ul class="kekTable-edit-block"></ul>'),
                that = this, cols = this.options.columns,
                $l, $filed;
            $.each(this.editCols, function(i, colName) {
                if(cols[colName].editDisplay == null){
                    if($l){
                        $el.append($l);
                    }
                    $l = $('<li><div class="form-group"><label class="control-label' + (cols[colName].isRequire ? ' text-danger' : '') + ($.inArray(cols[colName].editType, ['list', 'lov']) !== -1 ? ' kekTable-edit-listLabel' : '') + '">' + cols[colName].editTitle + '</label></div></li>');
                    $filed = $('.form-group', $l);
                    $($filed).append(that.createEditItem(colName));
                }
                else if(cols[colName].editDisplay === 'inline'){
                    $filed = $('<div class="form-group has-feedback"><label>' + cols[colName].editTitle + '</label></div>');
                    $l.append($filed);
                    $($filed).append(that.createEditItem(colName));
                }
                else if(cols[colName].editDisplay === 'cling'){
                    if(!$('.input-group', $filed).length){
                        $('.form-control', $filed).wrap('<div class="input-group"></div>');
                    }
                    $('.input-group', $filed).append(that.createEditItem(colName));
                }
            });
            if($l){
                $el.append($l);
            }
            this.elements.edit.$block = $el;
            return this.elements.edit.$block;
        },
        /**
         * 建立修改框 字段区 字段
         * @this Plugin
         * @param {string} colName 字段属性名
         * @returns {jQuery} 字段
         */
        createEditItem: function(colName){
            var $el, col = this.options.columns[colName];
            if(col.editType === 'textarea'){
                $el = $('<textarea />');
            }
            else{
                $el = $('<input type="text" />');
            }
            $el.attr('data-col', colName).addClass('form-control').css('width', col.editWidth);
            //hidden
            if(col.editAttr === 'hidden'){
                $el.css('display', 'none');
            }
            //readonly
            else{
                $el.attr(col.editAttr, true);
            }
            //number,date
            if(col.colType){
                $el.addClass('kekTable-' + col.colType);
            }
            //list、lov
            if(col.editType === 'list' || col.editType === 'lov'){
                $el.addClass('kekTable-' + col.editType + '-input').attr('readonly', 'readonly');
            }
            return $el;
        },
        /**
         * 建立排序框
         * @this Plugin
         * @returns {jQuery} 排序框
         */
        createPluginSort: function(){
            var regional = $[_pluginName].regional;
            if(this.hasTool.sort){
                this.elements.sort.$dialog = $('<div class="modal fade kekTable-sort" data-backdrop="static" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' +
                    regional.sortTitle + '</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">' +
                    regional.buttonCancel + '</button><button type="button" class="btn btn-primary">' + regional.sortCommit + '</button></div></div></div></div>');
                $('.modal-body', this.elements.sort.$dialog).append(this.createSortList()).append(this.createSortCtrl());
                $('.modal-dialog', this.elements.sort.$dialog).css('width', this.options.sortDialogWidth);
                return this.elements.sort.$dialog;
            }
        },
        /**
         * 建立排序框 字段列表
         * @this Plugin
         * @returns {jQuery} 字段列表
         */
        createSortList: function(){
            var $el = $('<div class="kekTable-sort-list"></div>');
            this.elements.sort.$block = $('<ul class="kekTable-sort-block list-group"></ul>');
            $el.append(this.elements.sort.$block);
            return $el;
        },
        /**
         * 建立排序框 控制区
         * @this Plugin
         * @returns {jQuery} 控制区
         */
        createSortCtrl: function(){
            var $el = $('<div class="kekTable-sort-ctrl"></div>'),
                regional = $[_pluginName].regional,
                cols = [], that = this;
            $.each(this.listCols, function(i, colName) {
                if(that.options.columns[colName].canSort){
                    cols.push('<li data-col="' + colName + '"><span>' + (that.options.columns[colName].listTitle || colName) + '</span></li>');
                }
            });
            $el.append('<div class="btn-group"><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" title="' + regional.sortAdd +
                    '" data-toggle="dropdown"><span class="glyphicon glyphicon-plus"></span></button><ul class="dropdown-menu dropdown-menu-right kekTable-dropList">' +
                    cols.join('') + '</ul></div><button type="button" class="btn btn-default" title="' + regional.sortDelete + '"><span class="glyphicon glyphicon-remove"></span></button></div>')
                .append('<div class="btn-group"><button type="button" class="btn btn-default" title="' + regional.sortMoveUp + '"><span class="glyphicon glyphicon-chevron-up"></span></button>' +
                    '<button type="button" class="btn btn-default" title="' + regional.sortMoveDown + '"><span class="glyphicon glyphicon-chevron-down"></span></button></div>')
                .append('<div class="btn-group-vertical" data-toggle="buttons"><label class="btn btn-default active"><input type="radio" name="sort-type" autocomplete="off" value="ASC" checked />' + regional.sortAsc + '</label>' +
                    '<label class="btn btn-default"><input type="radio" name="sort-type" autocomplete="off" value="DESC" />' + regional.sortDesc + '</label></div>')
                .append('<div class="btn-group-vertical" data-toggle="buttons"><label class="btn btn-default active"><input type="radio" name="sort-nulls" autocomplete="off" value="NULLS FIRST" checked />' + regional.sortNullsFirst + '</label>' +
                    '<label class="btn btn-default"><input type="radio" name="sort-nulls" autocomplete="off" value="NULLS LAST" />' + regional.sortNullsLast + '</label></div>');
            this.elements.sort.$ctrl = $el;
            return $el;
        },
        /**
         * 建立汇出Form
         * @this Plugin
         * @returns {jQuery} 汇出Form
         */
        createExport: function(){
            var $form = $('<form method="post"  accept-charset="utf-8" action="' + this.options.exportURL + '?act=Export&title=' + this.options.title + '&expType=' + this.options.exportType + '" target="_blank"></form>'),
                $param = $('<input type="hidden" name="exportPars" />');
            if(this.hasTool['export']){
                $form.append($param);
                this.elements.exportForm.$form = $form;
                this.elements.exportForm.$param = $param;
                return $form;
            }

        },
        //endregion====================建立插件====================

        //region   ===================工具栏方法===================
        /**
         * 刷新操作
         * @this Plugin
         * @returns {void}
         */
        refresh: function(){
            var that = this;
            this.tableStatus = 'refresh';
            this.showLoading('', 'list');
            this.deferredFlow(
                [
                    this.createDeferred(this.options.beforeRefresh, this.deferredObject),
                    this.createDeferred(this.loadData, null),
                    this.createDeferred(this.options.afterRefresh, this.deferredObject)
                ],
                function(){
                    that.showState($[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventSuccess);
                },
                function(v){
                    that.showAlert(v ? v : $[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail);
                    that.showState(v ? v : $[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail, 'danger');
                },
                function(){
                    that.hideLoading('list');
                }
            );
        },
        /**
         * 查询操作
         * @this Plugin
         * @returns {void}
         */
        search: function(){
            var that = this;
            this.tableStatus = 'search';
            this.showLoading('', 'list');
            this.deferredFlow(
                [
                    this.createDeferred(this.options.beforeSearch, this.deferredObject),
                    this.createDeferred(function(o, d){
                        try {
                            that.setSearchDialog(that.searchConditions);
                            d.resolve();
                        }
                        catch(ex){
                            d.reject();
                            console.log('searchError', ex);
                        }
                    }, null),
                    this.createDeferred(this.options.afterSearch, this.deferredObject),
                    this.createDeferred(function(o, d){
                        that.elements.search.$dialog.modal('show');
                        d.resolve();
                    }, null)
                ],
                null,
                function(v){
                    that.showAlert(v ? v : $[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventFail);
                    that.showState(v ? v : $[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventFail, 'danger');
                },
                function(){
                    that.hideLoading('list');
                }
            );
        },
        /**
         * 排序操作
         * @this Plugin
         * @returns {void}
         */
        sort: function(){
            var that = this;
            this.tableStatus = 'sort';
            this.showLoading('', 'list');
            this.deferredFlow(
                [
                    this.createDeferred(this.options.beforeSort, this.deferredObject),
                    this.createDeferred(function(o, d){
                        try {
                            that.setSortDialog(that.sortConditions);
                            d.resolve();
                        }
                        catch(ex){
                            d.reject();
                            console.log('sortError', ex);
                        }
                    }, null),
                    this.createDeferred(this.options.afterSort, this.deferredObject),
                    this.createDeferred(function(o, d){
                        that.elements.sort.$dialog.modal('show');
                        d.resolve();
                    }, null)
                ],
                null,
                function(v){
                    that.showAlert(v ? v : $[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventFail);
                    that.showState(v ? v : $[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventFail, 'danger');
                },
                function(){
                    that.hideLoading('list');
                }
            );
        },
        /**
         * 新增操作
         * @this Plugin
         * @returns {void}
         */
        add: function(){
            var that = this,
                $block;
            this.tableStatus = 'add';
            this.showLoading('', 'list');
            this.editRecord = {};
            this.elements.edit.$alert.hide();
            this.deferredFlow(
                [
                    this.createDeferred(this.options.beforeAdd, this.deferredObjectRef),//可以被修改
                    this.createDeferred(function(o, d){
                        try {
                            $block = that.elements.edit.$block;
                            $('.modal-title', that.elements.edit.$dialog).text($[_pluginName].regional.addTitle);
                            $.each(that.editCols, function (i, colName) {
                                $('[data-col="' + colName + '"]', $block).val(that.editRecord[colName]);
                                that.editItemChange(colName, that.editRecord[colName], [], null, true);
                            });
                            d.resolve();
                        }
                        catch(ex){
                            d.reject();
                            console.log('addError', ex);
                        }
                    }, null),
                    this.createDeferred(this.options.afterAdd, this.deferredObject),
                    this.createDeferred(function(o, d){
                        that.elements.edit.$dialog.modal('show');
                        d.resolve();
                    }, null)
                ],
                null,
                function(v){
                    that.showAlert(v ? v : $[_pluginName].regional.toolbarAdd + $[_pluginName].regional.eventFail);
                    that.showState(v ? v : $[_pluginName].regional.toolbarAdd + $[_pluginName].regional.eventFail, 'danger');
                },
                function(){
                    that.hideLoading('list');
                }
            );
        },
        /**
         * 修改操作
         * @this Plugin
         * @returns {void}
         */
        edit: function(){
            var that = this,
                curRec = this.curPageRecords[this.curRecordNo - 1];
            if(this.curPageRecords.length && this.curRecordNo) {
                this.tableStatus = 'edit';
                this.showLoading('', 'list');
                this.editRecord = {};
                this.elements.edit.$alert.hide();
                $.each(this.editCols, function (i, colName) {
                    that.editRecord[colName] = curRec[colName];
                });
                this.deferredFlow(
                    [
                        this.createDeferred(this.options.beforeEdit, this.deferredObjectRef),//可修改
                        this.createDeferred(function (o, d) {
                            var $block = that.elements.edit.$block;
                            $('.modal-title', that.elements.edit.$dialog).text($[_pluginName].regional.editTitle);
                            $.each(that.editCols, function (i, colName) {
                                $('[data-col="' + colName + '"]', $block).val(that.editRecord[colName]);
                                that.editItemChange(colName, that.editRecord[colName], [], null, true);
                            });
                            d.resolve();
                        }, null),
                        this.createDeferred(this.options.afterEdit, this.deferredObject),
                        this.createDeferred(function (o, d) {
                            that.elements.edit.$dialog.modal('show');
                            d.resolve();
                        }, null)
                    ],
                    null,
                    function (v) {
                        that.showAlert(v ? v : $[_pluginName].regional.toolbarEdit + $[_pluginName].regional.eventFail);
                        that.showState(v ? v : $[_pluginName].regional.toolbarEdit + $[_pluginName].regional.eventFail, 'danger');
                    },
                    function () {
                        that.hideLoading('list');
                    }
                );
            }
            else {
                this.showAlert($[_pluginName].regional.errSelected);
                this.showState($[_pluginName].regional.errSelected, 'danger');
            }
        },
        /**
         * 删除操作
         * @this Plugin
         * @returns {void}
         */
        'delete': function(){
            var that = this;
            if(this.curPageRecords.length && this.curRecordNo) {
                this.tableStatus = 'delete';
                this.showLoading('', 'list');
                this.deferredFlow(
                    [
                        this.createDeferred(this.options.beforeDelete, this.deferredObject),
                        this.createDeferred(function (o, d) {
                            try {
                                $('.modal-body', that.elements.$confirm).html('<p>' + $[_pluginName].regional.deleteConfirm + '</p>');
                                that.elements.$confirm.off('click.' + _pluginName, '.modal-footer .btn-primary');
                                that.elements.$confirm.off('click.' + _pluginName, '.modal-footer .btn-default');
                                that.elements.$confirm.on('click.' + _pluginName, '.modal-footer .btn-primary', function () {
                                    that.deleteRecord(d);
                                });
                                that.elements.$confirm.on('click.' + _pluginName, '.modal-footer .btn-default', function () {
                                    d.reject();
                                });
                                that.elements.$confirm.modal('show');
                            }
                            catch (ex) {
                                d.reject();
                                console.log('deleteError', ex);
                            }
                        }, null),
                        this.createDeferred(this.options.afterDelete, this.deferredObject)
                    ],
                    function () {
                        that.showState($[_pluginName].regional.toolbarDelete + $[_pluginName].regional.eventSuccess);
                    },
                    function (v) {
                        if(v) {
                            that.showAlert(v ? v : $[_pluginName].regional.toolbarDelete + $[_pluginName].regional.eventFail);
                            that.showState(v ? v : $[_pluginName].regional.toolbarDelete + $[_pluginName].regional.eventFail, 'danger');
                        }
                    },
                    function () {
                        that.hideLoading('list');
                        that.elements.$confirm.modal('hide');
                    }
                );
            }
            else {
                this.showAlert($[_pluginName].regional.errSelected);
                this.showState($[_pluginName].regional.errSelected, 'danger');
            }
        },
        /**
         * 汇出操作
         * @this Plugin
         * @returns {void}
         */
        'export': function(){
            var that = this;
            if(this.curPageRecords.length) {
                this.tableStatus = 'export';
                this.showLoading('', 'list');
                this.deferredFlow(
                    [
                        this.createDeferred(this.options.beforeExport, this.deferredObject),
                        this.createDeferred(function (o, d) {
                            try {
                                $('.modal-body', that.elements.$confirm).html('<div class="btn-group" data-toggle="buttons"><label class="btn btn-primary active"><input type="radio" name="export" value="all" autocomplete="off" checked>' +
                                        $[_pluginName].regional.exportAll + '</label><label class="btn btn-primary"><input type="radio" name="export" value="page" autocomplete="off">' + $[_pluginName].regional.exportPage + '</label></div>');
                                that.elements.$confirm.off('click.' + _pluginName, '.modal-footer .btn-primary');
                                that.elements.$confirm.off('click.' + _pluginName, '.modal-footer .btn-default');
                                that.elements.$confirm.on('click.' + _pluginName, '.modal-footer .btn-primary', function () {
                                    that.exportData(d);
                                });
                                that.elements.$confirm.on('click.' + _pluginName, '.modal-footer .btn-default', function () {
                                    d.reject();
                                });
                                that.elements.$confirm.modal('show');
                            }
                            catch (ex) {
                                d.reject();
                                console.log('exportError', ex);
                            }
                        }, null),
                        this.createDeferred(this.options.afterExport, this.deferredObject)
                    ],
                    function () {
                        that.showState($[_pluginName].regional.toolbarExport + $[_pluginName].regional.eventSuccess);
                    },
                    function (v) {
                        if(v) {
                            that.showAlert(v ? v : $[_pluginName].regional.toolbarExport + $[_pluginName].regional.eventFail);
                            that.showState(v ? v : $[_pluginName].regional.toolbarExport + $[_pluginName].regional.eventFail, 'danger');
                        }
                    },
                    function () {
                        that.hideLoading('list');
                        that.elements.$confirm.modal('hide');
                    }
                );
            }
        },
        //endregion===================工具栏方法===================

        //region   ==================读取后台数据==================
        /**
         * 记录数据 string转类
         * @this Plugin
         * @param {Array.<Array.<string|number>>} arr 后台传回的二维数组
         * @returns {Array.<Object>} 转换后的类(包含各字段)
         */
        recordToEntity: function(arr){
            var newArr = [], that = this;
            $.each(arr, function(i, record) {
                var r = {};
                $.each(record, function(j, val) {
                    r[that.dbCols[j]] = val;
                });
                newArr.push(r);
            });
            return newArr;
        },
        /**
         * 读取数据
         * 后台数据格式 { Success=true, Total=100, Records=[['a1','b1','c1'],['a2','b2','c2']], Summary=[100,230], Message=''}
         * @this Plugin
         * @param {Object} o null
         * @param {deferred} d deferred
         * @returns {void}
         */
        loadData: function(o, d){
            var colsId = [], that = this, cols = this.options.columns, sortConditions = [], summaryConditions = [], searchConditions;
            this.showLoading($[_pluginName].regional.loadData, 'list');
            //colsId
            $.each(this.dbCols, function(i, colName) {
                colsId.push(cols[colName].colId);
            });
            //sortConditions
            $.each(this.sortConditions, function(i, cond) {
                sortConditions.push($.extend(true, {}, cond, {Col: cols[cond.Col].colId}));
            });
            //searchConditions
            searchConditions = $.extend(true, {}, that.searchConditions);
            searchConditions = $.map(searchConditions, function(c){return [c]; });
            //summaryCols
            $.each(this.summaryCols, function(i, colName) {
                var col = that.options.columns[colName];
                summaryConditions.push({Col: col.colId, Mode: col.colTotalSummary, IsAll: col.isTotalAll});
            });
            $.post(this.options.listURL, {
                act: 'Search',
                searchPars: JSON.stringify({
                    ColsId: colsId,
                    TablesId: that.tablesId,
                    SortConditions: sortConditions,
                    SearchConditions: that.toSearchPost(searchConditions),
                    SummaryConditions: summaryConditions,
                    Range: that.options.showPaging ? [(that.curPageNo - 1) * that.options.rowNum, that.curPageNo * that.options.rowNum] : null,
                    Relations: that.options.tableRelations
                })
            }).done(function(res){
                /**
                 * @type {loadResult}
                 */
                var obj;
                if(!res){
                    d.reject(that.options.isDebug ? '后台未返回数据' : $[_pluginName].regional.loadDataErr);
                }
                else{
                    obj = $.parseJSON(res);
                    if(obj.Success === undefined){
                        d.reject(that.options.isDebug ? '后台未返回Success值' : $[_pluginName].regional.loadDataErr);
                    }
                    else if(obj.Success){
                        if(obj.Total == null || obj.Records == null){
                            d.reject(that.options.isDebug ? '后台返回数据结构错误' : $[_pluginName].regional.loadDataErr);
                        }
                        else if(obj.Total && that.summaryCols.length && (obj.Summary == null || obj.Summary.length !== that.summaryCols.length)){
                            d.reject(that.options.isDebug ? '后台返回Summary值异常' : $[_pluginName].regional.loadDataErr);
                        }
                        else{
                            that.curPageRecords = that.recordToEntity(obj.Records);
                            that.listSummary(obj.Summary);
                            that.createFooterPaging(obj.Total);
                            if(that.options.rowNum === 1){
                                that.listDataSingle(obj.Records, d);
                            }
                            else if(that.options.frozenNum != null){
                                that.listDataFrozen(obj.Records, d);
                            }
                            else{
                                that.listData(obj.Records, d);
                            }
                            that.selectRow(1);
                        }
                    }
                    else{
                        d.reject(obj.Message || $[_pluginName].regional.loadDataErr);
                    }
                }
            }).fail(function(){
                d.reject($[_pluginName].regional.loadDataErr);
            });
        },
        /**
         * 显示字段数据
         * @this Plugin
         * @param {jQuery} $el 显示数据的$td
         * @param {string} colName 字段属性名
         * @param {number} recIndex 记录行索引(curPageRecords下标)
         * @param {function} b beforeList回调函数
         * @returns {deferred} deferred
         */
        listColData: function($el, colName, recIndex, b){
            var def = this.createDeferred(b, this.deferredObject)(),
                col = this.options.columns[colName],
                that = this;
            def.done(function(v){
                if(v == null){
                    v = that.curPageRecords[recIndex][colName];
                }
                if(col.listList){
                    if(col.listList[v] == null){
                        $el.html(v);
                    }
                    else{
                        $el.html(col.listList[v]);
                    }
                }
                else{
                    $el.html(v);
                }
                //非数据库字段将赋值
                if(that.options.columns[colName].colId == null){
                    that.curPageRecords[recIndex][colName] = $el.text();
                }
            }).fail(function () {
                $el.text('');
            });
            return def.promise();
        },
        /**
         * 显示数据
         * @this Plugin
         * @param {Array.<Array.<string|number>>} data 二维数据
         * @param {deferred} d deferred
         * @returns {void}
         */
        listData: function(data, d){
            var cols = this.options.columns, listCols = this.listCols,
                $block = $('tbody', this.elements.$tableGroup),
                $frg = $(document.createDocumentFragment()),
                that = this, defArr = [],
                $tr, tr, listIndex, $td;
            $.each(data, function(i){
                $tr = $('<tr />', {'data-index': i});
                tr = [];
                that.curRecordNo = i + 1;
                //遍历所有字段。非数据库字段会被暂存于 curPageRecords
                $.each(cols, function(colName, colObj) {
                    listIndex = $.inArray(colName, listCols);
                    $td = $('<td />');
                    if(listIndex !== -1){
                        tr[listIndex] = $td;
                    }
                    defArr.push(that.listColData($td, colName, i, colObj.beforeList));
                });
                if(that.options.showRowNo){
                    tr.unshift($('<td>' + (i + 1) + '</td>'));
                }
                $frg.append($tr.append(tr));
            });
            $.whenAll.apply($, defArr)
                .fail(function(){
                    console.log('_listData有异常');
                })
                .always(function(){
                    $block.empty().append($frg);
                    that.selectRow(that.curRecordNo);
                    if(d){
                        d.resolve();
                    }
                    else{
                        that.hideLoading('list');
                    }
                });
        },
        /**
         * 显示数据至 frozen-table
         * @this Plugin
         * @param {Array.<Array.<string|number>>} data 二维数据
         * @param {deferred} d deferred
         * @returns {void}
         */
        listDataFrozen: function(data, d){
            var cols = this.options.columns, that = this, listCols = this.listCols,
                defArr = [], $frg = $(document.createDocumentFragment()),
                $frgF = $(document.createDocumentFragment()),
                $tr, $trF, tr, trF, listIndex, $td;
            $.each(data, function(i){
                $tr = $('<tr />', {'data-index': i});
                $trF = $('<tr />', {'data-index': i});
                tr = []; trF = [];
                that.curRecordNo = i + 1;
                $.each(cols, function(colName, colObj) {
                    listIndex = $.inArray(colName, listCols);
                    $td = $('<td />');
                    if(listIndex !== -1){
                        tr[listIndex] = $td;
                        if(listIndex < that.options.frozenNum){
                            trF[listIndex] = $td;
                        }
                    }
                    defArr.push(that.listColData($td, colName, i, colObj.beforeList));
                });
                if(that.options.showRowNo){
                    tr.unshift($('<td>' + (i + 1) + '</td>'));
                    trF.unshift($('<td>' + (i + 1) + '</td>'));
                }
                $frg.append($tr.append(tr)[0].outerHTML);
                $frgF.append($trF.append(trF)[0].outerHTML);
            });
            $.whenAll.apply($, defArr)
                .fail(function(){
                    console.log('_listData_frozen有异常');
                })
                .always(function(){
                    $('table:not(.kekTable-table-frozen) tbody', that.elements.$tableGroup).empty().append($frg);
                    $('.kekTable-table-frozen tbody', that.elements.$tableGroup).empty().append($frgF);
                    that.selectRow(that.curRecordNo);
                    that.selectRowFrozen(that.curRecordNo);
                    if(d){
                        d.resolve();
                    }
                    else{
                        that.hideLoading('list');
                    }
                });
        },
        /**
         * 显示数据至 single-table
         * @this Plugin
         * @param {Array.<Array.<string|number>>} data 二维数据
         * @param {deferred} d deferred
         * @returns {void}
         */
        listDataSingle: function(data, d){
            var cols = this.options.columns, that = this, listCols = this.listCols,
                $block = $('.kekTable-single-table', this.elements.$tableGroup),
                defArr = [], listIndex, $col;
            that.curRecordNo = 1;
            $.each(cols, function(colName, colObj) {
                listIndex = $.inArray(colName, listCols);
                $col = listIndex === -1 ? $('<span/>') : $('span[data-col="' + colName + '"]', $block);
                defArr.push(that.listColData($col, colName, 0, colObj.beforeList));
            });
            $.whenAll.apply($, defArr)
                .fail(function() {
                    console.log('listDataSingle有异常');
                })
                .always(function(){
                    if(d){
                        d.resolve();
                    }
                    else{
                        that.hideLoading('list');
                    }
                });
        },
        /**
         * 显示摘要数据
         * @this Plugin
         * @param {Array.<string|number>} data 摘要数据数组
         * @returns {void}
         */
        listSummary: function(data){
            var that = this;
            if(this.summaryCols.length){
                $.each(this.summaryCols, function(i, colName){
                    $('h5[data-col="' + colName + '"] b', that.elements.$summary).text(data[i] == null ? '' : data[i]);
                });
            }
        },
        //endregion==================读取后台数据==================

        //region   ==================汇出后台数据==================
        /**
         * 汇出数据
         * @this Plugin
         * @param {deferred} d deferred
         * @returns {void}
         */
        exportData: function(d){
            var colsId = [], that = this, cols = this.options.columns,
                sortConditions = [], searchConditions, titles = [],
                range = this.options.showPaging ? [(this.curPageNo - 1) * this.options.rowNum, this.curPageNo * this.options.rowNum] : null;
            this.showLoading($[_pluginName].regional.loadData, 'list');
            //colsId
            $.each(this.dbCols, function(i, colName) {
                if(cols[colName].colId != null && cols[colName].canExport){
                    colsId.push(cols[colName].colId);
                    titles.push(cols[colName].listTitle || colName);
                }
            });
            //sortConditions
            $.each(this.sortConditions, function(i, cond) {
                sortConditions.push($.extend(true, {}, cond, {Col: cols[cond.Col].colId}));
            });
            //range
            range = $('input[type="radio"][name="export"]:checked', this.elements.$confirm).val() === 'all' ? null : range;
            //searchConditions
            searchConditions = $.extend(true, {}, that.searchConditions);
            searchConditions = $.map(searchConditions, function(c){return [c]; });
            this.elements.exportForm.$param.val(JSON.stringify({
                ColsId: colsId,
                TablesId: that.tablesId,
                SortConditions: sortConditions,
                SearchConditions: that.toSearchPost(searchConditions),
                Range: range,
                Relations: that.options.tableRelations,
                ExtType: that.options.exportType,
                FileName: that.options.title,
                Titles: titles
            }));
            this.elements.exportForm.$form.submit();
            d.resolve();
        },
        //endregion==================汇出后台数据==================

        //region   ==================新增后台数据==================
        /**
         * 新增数据
         * @this Plugin
         * @param {Object} o null
         * @param {deferred} d deferred
         * @returns {void}
         */
        insertRecord: function(o, d){
            var colsId = [], that = this, cols = this.options.columns,
                colsVal = [], defCols = [], defVals = [],
                vQuit, $editInput, valCheck, errMsg;
            /**
             * @type {loadResult}
             */
            var obj;
            //是否有未通过检核的值
            var errs = this.elements.edit.$block.find('.has-error');
            if(errs.length) {
                d.reject(errs.attr('title'));
                return;
            }
            //colsId
            $.each(this.editCols, function(i, colName) {
                if(cols[colName].editAttr !== 'disabled' && cols[colName].colId != null){
                    $editInput = that.elements.edit.$block.find('[data-col="' + colName + '"]');
                    if($editInput.data('status') === 1){
                        colsId.push(cols[colName].colId);
                        colsVal.push(that.editRecord[colName]);
                    }
                }
                //检查值
                valCheck = that.checkEditItemValue(colName, that.editRecord[colName]);
                if(!valCheck.result){
                    errMsg = cols[colName].editTitle + valCheck.val;
                    that.elements.edit.$block.find('[data-col="' + colName + '"]').data('status', -1).parents('.form-group').removeClass('has-success').addClass('has-error').attr('title', errMsg);
                    d.reject(errMsg);
                    vQuit = true;
                    return false;
                }
            });
            if(vQuit){
                return;
            }
            //defaultCols
            if(this.options.defaultInsertCols) {
                $.each(this.options.defaultInsertCols, function (i, colId) {
                    if ($.inArray(colId, colsId) === -1) {
                        defCols.push(colId);
                        defVals.push(that.options.defaultInsertVals[i]);
                    }
                });
            }
            $.post(this.options.insertURL, {
                act: 'Insert',
                insertPars: JSON.stringify({
                    ColsId: colsId,
                    TablesId: cols[that.keyCols[0]].tableId,
                    ColsVal: colsVal,
                    DefaultCols: defCols,
                    DefaultVals: defVals
                })
            }).done(function(res){
                if(!res){
                    d.reject(that.options.isDebug ? '后台未返回数据' : $[_pluginName].regional.loadDataErr);
                }
                else {
                    obj = $.parseJSON(res);
                    if (obj.Success === undefined){
                        d.reject(that.options.isDebug ? '后台未返回Success值' : $[_pluginName].regional.loadDataErr);
                    }
                    else if (obj.Success) {
                        that.deferredFlow(
                            [that.createDeferred(that.loadData, null)],
                            null,
                            function(v){
                                that.showState(v ? v : $[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail, 'danger');
                            },
                            function(){
                                d.resolve();
                            }
                        );
                    }
                    else{
                        d.reject(obj.Message || ($[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail));
                    }
                }
            }).fail(function(){
                d.reject($[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail);
            });
        },
        //endregion==================新增后台数据==================

        //region   ==================更新后台数据==================
        /**
         * 更新数据
         * @this Plugin
         * @param {Object} o null
         * @param {deferred} d deferred
         * @returns {void}
         */
        updateRecord: function(o, d){
            var colsId = [], that = this, cols = this.options.columns,
                colsVal = [], defCols = [], defVals = [], keysId = [], keysVal = [],
                vQuit, $editInput, valCheck, curRec;
            /**
             * @type {loadResult}
             */
            var obj;
            //是否有未通过检核的值
            var errs = this.elements.edit.$block.find('.has-error');
            if(errs.length) {
                d.reject(errs.attr('title'));
                return;
            }
            //colsId
            $.each(this.editCols, function(i, colName) {
                if(cols[colName].editAttr !== 'disabled' && cols[colName].colId != null){
                    $editInput = that.elements.edit.$block.find('[data-col="' + colName + '"]');
                    if($editInput.data('status') === 1){
                        colsId.push(cols[colName].colId);
                        colsVal.push(that.editRecord[colName]);
                    }
                }
                //检查值
                valCheck = that.checkEditItemValue(colName, that.editRecord[colName]);
                if(!valCheck.result){
                    d.reject(cols[colName].editTitle + valCheck.val);
                    vQuit = true;
                    return false;
                }
            });
            if(vQuit){
                return;
            }
            //keys
            curRec = this.curPageRecords[this.curRecordNo - 1];
            $.each(this.keyCols, function (i, colName) {
                keysId.push(cols[colName].colId);
                keysVal.push(curRec[colName]);
            });
            //defaultCols
            if(this.options.defaultUpdateCols) {
                $.each(this.options.defaultUpdateCols, function (i, colId) {
                    if ($.inArray(colId, colsId) === -1) {
                        defCols.push(colId);
                        defVals.push(that.options.defaultUpdateVals[i]);
                    }
                });
            }
            //if colsId.length......
            $.post(this.options.updateURL, {
                act: 'Update',
                updatePars: JSON.stringify({
                    ColsId: colsId,
                    TablesId: cols[that.keyCols[0]].tableId,
                    ColsVal: colsVal,
                    DefaultCols: defCols,
                    DefaultVals: defVals,
                    KeysId: keysId,
                    KeysVal: keysVal
                })
            }).done(function(res){
                if(!res){
                    d.reject(that.options.isDebug ? '后台未返回数据' : $[_pluginName].regional.eventFail);
                }
                else {
                    obj = $.parseJSON(res);
                    if (obj.Success === undefined){
                        d.reject(that.options.isDebug ? '后台未返回Success值' : $[_pluginName].regional.eventFail);
                    }
                    else if (obj.Success) {
                        that.deferredFlow(
                            [that.createDeferred(that.loadData, null)],
                            null,
                            function(v){
                                that.showState(v ? v : $[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail, 'danger');
                            },
                            function(){
                                d.resolve();
                            }
                        );
                    }
                    else{
                        d.reject(obj.Message || ($[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail));
                    }
                }
            }).fail(function(){
                d.reject($[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail);
            });
        },
        //endregion==================更新后台数据==================

        //region   ==================删除后台数据==================
        /**
         * 删除数据
         * @this Plugin
         * @param {deferred} d deferred
         * @returns {void}
         */
        deleteRecord: function(d){
            var that = this, cols = this.options.columns, keysId = [], keysVal = [];
            /**
             * @type {loadResult}
             */
            var obj;
            //keys
            var curRec = this.curPageRecords[this.curRecordNo - 1];
            $.each(this.keyCols, function (i, colName) {
                keysId.push(cols[colName].colId);
                keysVal.push(curRec[colName]);
            });
            $.post(this.options.deleteURL, {
                act: 'Delete',
                deletePars: JSON.stringify({
                    TablesId: cols[that.keyCols[0]].tableId,
                    KeysId: keysId,
                    KeysVal: keysVal
                })
            }).done(function(res){
                if(!res){
                    d.reject(that.options.isDebug ? '后台未返回数据' : $[_pluginName].regional.eventFail);
                }
                else {
                    obj = $.parseJSON(res);
                    if (obj.Success === undefined){
                        d.reject(that.options.isDebug ? '后台未返回Success值' : $[_pluginName].regional.eventFail);
                    }
                    else if (obj.Success) {
                        that.deferredFlow(
                            [that.createDeferred(that.loadData, null)],
                            null,
                            function(v){
                                that.showState(v ? v : $[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail, 'danger');
                            },
                            function(){
                                d.resolve();//删除成功
                            }
                        );
                    }
                    else{
                        d.reject(obj.Message || ($[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail));
                    }
                }
            }).fail(function(){
                d.reject($[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail);
            });
        },
        //endregion==================删除后台数据==================

        //region   ==================注册插件事件==================
        /**
         * @this Plugin
         * @returns {void}
         */
        registEvents: function(){
            var that = this;
            //table tr click
            this.elements.$tableGroup.on('click.' + _pluginName, 'tbody tr', function(){
                var index = $(this).data('index') - 0;
                if (index !== that.curRecordNo - 1) {
                    that.selectRow(index + 1);
                    if (that.options.frozenNum != null){
                        that.selectRowFrozen(index + 1);
                    }
                }
            });
            //frozen hover
            if(this.options.frozenNum != null && this.options.canRowHover){
                this.elements.$tableGroup.on('mouseover.' + _pluginName, 'tbody tr', function(){
                    $('tbody tr', that.elements.$tableGroup).removeClass('active');
                    $('tbody tr[data-index="' + $(this).data('index') + '"]:not(.info)', that.elements.$tableGroup).addClass('active');
                });
                this.elements.$tableGroup.on('mouseleave.' + _pluginName, 'tbody tr', function(){
                    $('tbody tr[data-index="' + $(this).data('index') + '"]:not(.info)', that.elements.$tableGroup).removeClass('active');
                });
            }
            //paging click
            if(this.elements.$paging){
                this.elements.$paging.on('click.' + _pluginName, 'li a', function(e){
                    that.showLoading('', 'list');
                    that.currentPageNo = $(this).text() - 0;
                    that.deferredFlow(
                        [
                            that.createDeferred(that.options.beforePaging, that.deferredObject),
                            that.createDeferred(that.loadData, null),
                            that.createDeferred(that.options.afterPaging, that.deferredObject)
                        ],
                        null,
                        function(v){
                            that.showAlert(v ? v : $[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail);
                            that.showState(v ? v : $[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail, 'danger');
                        },
                        function(){
                            that.hideLoading('list');
                        }
                    );
                    e.preventDefault();
                });
            }
            //search dialog
            if(this.hasTool.search){
                //search col-btn
                this.elements.search.$block.on('click.' + _pluginName, 'button[data-col]', function(){
                    var $btn = $(this), $ul = that.elements.search.$col,
                        mgTop = $ul.outerHeight(true) - $ul.outerHeight(),
                        mgLeft = $btn.outerWidth(true) - $btn.outerWidth();
                    $ul.css('top', $btn.position().top + $btn.outerHeight() - mgTop);
                    $ul.css('left', $btn.position().left + mgLeft);
                    $ul.data('target', $btn);
                    $ul.show();
                });
                this.elements.search.$block.on('blur.' + _pluginName, 'button[data-col]', function(){
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    if(!that.elements.search.$col.data('cancelBlur')){
                        that.elements.search.$col.hide();
                        that.elements.search.$col.data('cancelBlur', false);
                    }
                    else{
                        $(this).focus();
                    }
                });
                //search col-ul
                this.elements.search.$col.mousedown(function(e){
                    e.preventDefault();
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    $(this).data('cancelBlur', true);
                    setTimeout(function(){that.elements.search.$col.data('cancelBlur', false); }, 0);
                });
                this.elements.search.$col.on('click.' + _pluginName, 'li', function(){
                    var $this = $(this),
                        $btn = that.elements.search.$col.data('target');
                    $btn.text($this.text()).data('col', $this.data('col'));
                    that.elements.search.$col.hide();
                });
                //search opt-btn
                this.elements.search.$block.on('click.' + _pluginName, 'button[data-opt]', function(){
                    var $btn = $(this), $ul = that.elements.search.$operator,
                        mgTop = $ul.outerHeight(true) - $ul.outerHeight(),
                        mgLeft = $btn.outerWidth(true) - $btn.outerWidth();
                    $ul.css('top', $btn.position().top + $btn.outerHeight() - mgTop);
                    $ul.css('left', $btn.position().left + mgLeft);
                    $ul.data('target', $btn);
                    $ul.show();
                });
                this.elements.search.$block.on('blur.' + _pluginName, 'button[data-opt]', function(){
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    if(!that.elements.search.$operator.data('cancelBlur')){
                        that.elements.search.$operator.hide();
                        that.elements.search.$operator.data('cancelBlur', false);
                    }
                    else{
                        $(this).focus();
                    }
                });
                //search opt-ul
                this.elements.search.$operator.on('mousedown.' + _pluginName, function(e){
                    e.preventDefault();
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    $(this).data('cancelBlur', true);
                    setTimeout(function(){that.elements.search.$operator.data('cancelBlur', false); }, 0);
                });
                this.elements.search.$operator.on('click.' + _pluginName, 'li', function(){
                    var $this = $(this),
                        $btn = that.elements.search.$operator.data('target'),
                        $itemValue = $btn.nextAll('.kekTable-search-itemValue');
                    $btn.text($this.text()).data('opt', $this.data('opt'));
                    if($.inArray($this.data('opt'), ['isnull', 'notnull']) === -1){
                        $itemValue.attr('readonly', null);
                    }
                    else{
                        $itemValue.attr('readonly', 'readonly').val('');
                    }
                    that.elements.search.$operator.hide();
                });
                //search ctrl-btn
                this.elements.search.$block.on('click.' + _pluginName, 'button[data-ctrl]', function(){
                    var $btn = $(this), $ul = that.elements.search.$control,
                        mgTop = $ul.outerHeight(true) - $ul.outerHeight(),
                        mgLeft = $btn.outerWidth(true) - $btn.outerWidth();
                    $ul.css('top', $btn.position().top + $btn.outerHeight() - mgTop);
                    $ul.css('left', $btn.position().left + mgLeft);
                    $ul.data('target', $btn);
                    $ul.show();
                });
                this.elements.search.$block.on('blur.' + _pluginName, 'button[data-ctrl]', function () {
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    if (!that.elements.search.$control.data('cancelBlur')) {
                        that.elements.search.$control.hide();
                        that.elements.search.$control.data('cancelBlur', false);
                    }
                    else{
                        $(this).focus();
                    }
                });
                //search ctrl-ul
                this.elements.search.$control.on('mousedown.' + _pluginName, function (e) {
                    e.preventDefault();
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    $(this).data('cancelBlur', true);
                    setTimeout(function () {that.elements.search.$control.data('cancelBlur', false); }, 0);
                });
                this.elements.search.$control.on('click.' + _pluginName, 'li[data-ctrl]', function () {
                    var $this = $(this), $btn = that.elements.search.$control.data('target');
                    that['searchCtrl' + $this.data('ctrl').toUpperCase()]($btn);
                    that.elements.search.$control.hide();
                });
                //search bool-btn
                this.elements.search.$block.on('click.' + _pluginName, 'button[data-bool]', function () {
                    var $btn = $(this), $ul = that.elements.search.$bool,
                        mgTop = $ul.outerHeight(true) - $ul.outerHeight();
                    $ul.css('top', $btn.position().top + $btn.outerHeight() - mgTop);
                    $ul.css('left', $btn.position().left);
                    $ul.data('target', $btn);
                    $ul.show();
                });
                this.elements.search.$block.on('blur.' + _pluginName, 'button[data-bool]', function () {
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    if (!that.elements.search.$bool.data('cancelBlur')) {
                        that.elements.search.$bool.hide();
                        that.elements.search.$bool.data('cancelBlur', false);
                    }
                    else {
                        $(this).focus();
                    }
                });
                //search bool-ul
                this.elements.search.$bool.on('mousedown.' + _pluginName, function (e) {
                    e.preventDefault();
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    $(this).data('cancelBlur', true);
                    setTimeout(function () {that.elements.search.$bool.data('cancelBlur', false); }, 0);
                });
                this.elements.search.$bool.on('click.' + _pluginName, 'li[data-bool]', function () {
                    var $this = $(this), $btn = that.elements.search.$bool.data('target');
                    $btn.text($this.text()).data('bool', $this.data('bool'));
                    that.elements.search.$bool.hide();
                });
                //search value
                this.elements.search.$block.on('blur.' + _pluginName, '.kekTable-search-itemValue', function () {
                    var $this = $(this), $opt = $this.prevAll('[data-opt]'),
                        $col = $this.prevAll('[data-col]'),
                        format;
                    if ($.inArray($opt.data('opt'), ['eq', 'gt', 'lt', 'ge', 'le', 'ne']) !== -1) {
                        format = that.checkEditItemValue($col.data('col'), $this.val());
                        if (format.result) {
                            $this.val(format.val);
                            $this.parent().removeClass('has-error');
                            that.elements.search.$alert.hide();
                        }
                        else {
                            $this.parent().addClass('has-error');
                            $this.focus();
                            that.elements.search.$alert.text(format.val).show();
                        }
                    }
                    else {
                        $this.parent().removeClass('has-error');
                        that.elements.search.$alert.hide();
                    }
                });
                //search commit
                this.elements.search.$dialog.on('click.' + _pluginName, '.modal-footer .btn-primary', function () {
                    var err = that.getSearchDialog();
                    if (err){
                        that.elements.search.$alert.text(err).show();
                    }
                    else {
                        that.elements.search.$alert.hide();
                        that.elements.search.$dialog.modal('hide');
                        that.curPageNo = 1;
                        that.deferredFlow(
                            [that.createDeferred(that.loadData, null)],
                            function () {
                                that.showState($[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventSuccess);
                            },
                            function (v) {
                                that.showAlert(v ? v : $[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventFail);
                                that.showState(v ? v : $[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventFail, 'danger');
                            },
                            function () {
                                that.hideLoading('list');
                            }
                        );
                    }
                });
            }
            //sort dialog
            if(this.hasTool.sort){
                //sort addList
                this.elements.sort.$ctrl.on('click.' + _pluginName, '.kekTable-dropList li:not(.disabled)', function () {
                    var $this = $(this),
                        col = $this.data('col'),
                        $li = $('<li class="list-group-item">' + $this.text() + '<span class="glyphicon glyphicon-sort-by-attributes pull-right"></span></li>');
                    $li.data('col', col).data('type', 'ASC').data('nulls', 'NULLS FIRST');
                    that.elements.sort.$block.append($li);
                    $this.addClass('disabled');
                });
                //sort delete
                this.elements.sort.$ctrl.on('click.' + _pluginName, '.btn:has(.glyphicon-remove)', function () {
                    var $li = that.elements.sort.$block.children('.active');
                    that.elements.sort.$ctrl.find('.kekTable-dropList li[data-col="' + $li.data('col') + '"]').removeClass('disabled');
                    $li.remove();
                });
                //sort up
                this.elements.sort.$ctrl.on('click.' + _pluginName, '.btn:has(.glyphicon-chevron-up)', function () {
                    var $li = that.elements.sort.$block.children('.active');
                    $li.prev().before($li);
                });
                //sort down
                this.elements.sort.$ctrl.on('click.' + _pluginName, '.btn:has(.glyphicon-chevron-down)', function () {
                    var $li = that.elements.sort.$block.children('.active');
                    $li.next().after($li);
                });
                //sort type
                this.elements.sort.$ctrl.on('change.' + _pluginName, '[name=sort-type]', function () {
                    var type = $(this).val(), $li = that.elements.sort.$block.children('.active');
                    $li.data('type', type).children('.glyphicon')
                        .removeClass(type === 'ASC' ? 'glyphicon-sort-by-attributes-alt' : 'glyphicon-sort-by-attributes')
                        .addClass(type === 'ASC' ? 'glyphicon-sort-by-attributes' : 'glyphicon-sort-by-attributes-alt');
                });
                //sort nulls
                this.elements.sort.$ctrl.on('change.' + _pluginName, '[name=sort-nulls]', function () {
                    var type = $(this).val(), $li = that.elements.sort.$block.children('.active');
                    $li.data('nulls', type);
                });
                //sort block
                this.elements.sort.$block.on('click.' + _pluginName, 'li', function () {
                    var $this = $(this);
                    that.elements.sort.$block.children('li.active').removeClass('active');
                    $this.addClass('active');
                    that.elements.sort.$ctrl.find('input[name="sort-type"][value="' + $this.data('type') + '"]').click();
                    that.elements.sort.$ctrl.find('input[name="sort-nulls"][value="' + $this.data('nulls') + '"]').click();
                });
                //sort commit
                this.elements.sort.$dialog.on('click.' + _pluginName, '.modal-footer .btn-primary', function () {
                    that.sortConditions.length = 0;
                    that.elements.sort.$block.children('li').each(function (i, li) {
                        /**
                         * @type {sortData}
                         */
                        var data = $(li).data();
                        that.sortConditions.push({
                            Col: data.col,
                            Type: $.inArray(data.type, ['ASC', 'DESC']) === -1 ? 'ASC' : data.type,
                            Nulls: $.inArray(data.nulls, ['NULLS FIRST', 'NULLS LAST']) === -1 ? 'NULLS FIRST' : data.nulls
                        });
                    });
                    that.elements.sort.$dialog.modal('hide');
                    that.curPageNo = 1;
                    that.deferredFlow(
                        [that.createDeferred(that.loadData, null)],
                        function () {
                            that.showState($[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventSuccess);
                        },
                        function (v) {
                            that.showAlert(v ? v : $[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventFail);
                            that.showState(v ? v : $[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventFail, 'danger');
                        },
                        function () {
                            that.hideLoading('list');
                        }
                    );
                });

            }
            //edit dialog
            if(this.hasTool.add || this.hasTool.edit){
                //edit item
                this.elements.edit.$block.on('change.' + _pluginName, '[data-col]', function (e, defs, itemTriggered, parentCol) {
                    var deferrer = defs || [], $this = $(this), colName = $this.data('col');
                    that.editItemChange(colName, that.options.columns[colName].editType === 'list' ? that.editRecord[colName] : $this.val(), deferrer, itemTriggered, parentCol);
                    $.whenAll.apply($, deferrer)
                        .always(function () {
                            var errs = that.elements.edit.$block.find('.has-error');
                            that.hideLoading('edit');
                            if (errs.length){
                                that.elements.edit.$alert.text(errs.attr('title')).show();
                            }
                            else{
                                that.elements.edit.$alert.hide();
                            }
                        });
                });
                this.elements.edit.$block.on('focus.' + _pluginName, '[data-col]', function () {
                    var $group = $(this).parents('.form-group');
                    if ($group.hasClass('has-error')){
                        that.elements.edit.$alert.text($group.attr('title')).show();
                    }
                });
                //date
                this.elements.edit.$block.on('keypress.' + _pluginName, '.kekTable-date,.kekTable-datetime', function (e) {
                    var c = e.which;
                    if (!((c >= 47 && c <= 58) || c === 45 || c === 92 || c === 32)){
                        e.preventDefault();
                    }
                });
                //number
                this.elements.edit.$block.on('keypress.' + _pluginName, '.kekTable-number', function (e) {
                    var c = e.which;
                    if (!((c >= 48 && c <= 57) || (c === 46))){
                        e.preventDefault();
                    }
                });
                //list type input
                this.elements.edit.$block.on('click.' + _pluginName, '.kekTable-list-input', function () {
                    var li = [], $this = $(this), colName = $this.data('col'),
                        def = that.createDeferred(that.options.columns[colName].editList, that.deferredObject)();
                    that.showLoading($[_pluginName].regional.loadList, 'edit');
                    def.done(function (v) {
                        if (v == null){
                            v = that.options.columns[colName].listList;
                        }
                        $.each(v, function (name, val) {
                            li.push($('<li />').data('val', name).append($('<span />').html($.trim(val) === '' ? '&nbsp' : val)));
                        });
                    }).always(function () {
                        var $ul = that.elements.edit.$list,
                            $btn = $this.parents('.form-group'),
                            mgTop = $ul.outerHeight(true) - $ul.outerHeight(),
                            mgLeft = $btn.outerWidth(true) - $btn.outerWidth();
                        $ul.css('top', $btn.position().top + $btn.outerHeight() - mgTop);
                        $ul.css('left', $btn.position().left + mgLeft);
                        $ul.data('target', colName);
                        $ul.empty().append(li).show();
                        $this.focus();
                        that.hideLoading('edit');
                    });
                });
                this.elements.edit.$block.on('blur.' + _pluginName, '.kekTable-list-input', function () {
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    if (!that.elements.edit.$list.data('cancelBlur')) {
                        that.elements.edit.$list.hide();
                        that.elements.edit.$list.data('cancelBlur', false);
                    }
                    else{
                        $(this).focus();
                    }
                });
                //$list
                this.elements.edit.$list.on('mousedown.' + _pluginName, function (e) {
                    e.preventDefault();
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    $(this).data('cancelBlur', true);
                    setTimeout(function () {that.elements.edit.$list.data('cancelBlur', false); }, 0);
                });
                this.elements.edit.$list.on('click.' + _pluginName, 'li', function () {
                    var $this = $(this),
                        $btn = $('[data-col="' + that.elements.edit.$list.data('target') + '"]', that.elements.edit.$block);
                    that.setEditValue(that.elements.edit.$list.data('target'), $this.data('val'));
                    $btn.trigger('change.' + _pluginName);
                    that.elements.edit.$list.hide();
                });
                //lov type input
                this.elements.edit.$block.on('click.' + _pluginName, '.kekTable-lov-input', function () {
                    var tHead = [], tbody = [], $this = $(this), colName = $this.data('col'),
                        cols = that.options.columns,
                        def = that.createDeferred(that.options.columns[colName].editList, that.deferredObject)();
                    that.showLoading($[_pluginName].regional.loadList, 'edit');
                    $.each(cols[colName].lovCols, function (i, col) {
                        tHead.push('<td>' + (cols[col] ? cols[col].editTitle : col) + '</td>');
                    });
                    def.done(function (v) {
                        $.each(v, function (i, record) {
                            var tr = [], j, k;
                            for (j = 0, k = cols[colName].lovCols.length; j < k; j++){
                                tr.push('<td>' + record[j] + '</td>');
                            }
                            tbody.push('<tr>' + tr.join('') + '</tr>');
                        });
                    }).always(function () {
                        var $ul = that.elements.edit.$lov,
                            $btn = $this.parents('.form-group'),
                            mgTop = $ul.outerHeight(true) - $ul.outerHeight(),
                            mgLeft = $btn.outerWidth(true) - $btn.outerWidth();
                        $ul.css('top', $btn.position().top + $btn.outerHeight() - mgTop);
                        $ul.css('left', $btn.position().left + mgLeft);
                        $ul.data('target', colName);
                        $ul.children('table').empty().append('<thead>' + tHead.join('') + '</thead><tbody>' + tbody.join('') + '</tbody>');
                        $ul.show();
                        $this.focus();
                        that.hideLoading('edit');
                    });
                });
                this.elements.edit.$block.on('blur.' + _pluginName, '.kekTable-lov-input', function () {
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    if (!that.elements.edit.$lov.data('cancelBlur')) {
                        that.elements.edit.$lov.hide();
                        that.elements.edit.$lov.data('cancelBlur', false);
                    }
                    else{
                        $(this).focus();
                    }
                });
                //$lov
                this.elements.edit.$lov.on('mousedown.' + _pluginName, function (e) {
                    e.preventDefault();
                    //ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
                    $(this).data('cancelBlur', true);
                    setTimeout(function () {that.elements.edit.$lov.data('cancelBlur', false); }, 0);
                });
                this.elements.edit.$lov.on('click.' + _pluginName, 'tr', function () {
                    var $tds = $('td', $(this)),
                        deferrer = [],//lov每个字段afterChange
                        colName = that.elements.edit.$lov.data('target'),
                        cols = that.options.columns,
                        lovCols = cols[colName].lovCols;
                    that.elements.edit.$lov.hide();
                    that.showLoading('', 'edit');
                    $tds.each(function (i) {
                        var col = cols[lovCols[i]];
                        if (col) {
                            that.editItemChange(lovCols[i], $(this).text(), deferrer);
                        }
                    });
                    $.whenAll.apply($, deferrer)
                        .always(function () {
                            that.hideLoading('edit');
                        });
                });
                //edit commit
                this.elements.edit.$dialog.on('click.' + _pluginName, '.modal-footer .btn-primary', function () {
                    var errs = that.elements.edit.$block.find('.has-error');
                    if (errs.length){
                        that.elements.edit.$alert.text(errs.attr('title')).show();
                    }
                    else {
                        that.showLoading('', 'edit');
                        if (that.tableStatus === 'add') {
                            that.deferredFlow(
                                [
                                    that.createDeferred(that.options.beforeInsert, that.deferredObject),
                                    that.createDeferred(that.insertRecord, null),
                                    that.createDeferred(that.options.afterInsert, that.deferredObject)
                                ],
                                function () {
                                    that.showState($[_pluginName].regional.toolbarAdd + $[_pluginName].regional.eventSuccess);
                                    that.elements.edit.$dialog.modal('hide');
                                },
                                function (v) {
                                    that.elements.edit.$alert.text(v ? v : $[_pluginName].regional.toolbarAdd + $[_pluginName].regional.eventFail, 'danger').show();
                                },
                                function () {
                                    that.hideLoading('edit');
                                }
                            );
                        }
                        else if (that.tableStatus === 'edit') {
                            that.deferredFlow(
                                [
                                    that.createDeferred(that.options.beforeUpdate, that.deferredObject),
                                    that.createDeferred(that.updateRecord, null),
                                    that.createDeferred(that.options.afterUpdate, that.deferredObject)
                                ],
                                function () {
                                    that.showState($[_pluginName].regional.toolbarEdit + $[_pluginName].regional.eventSuccess);
                                    that.elements.edit.$dialog.modal('hide');
                                },
                                function (v) {
                                    that.elements.edit.$alert.text(v ? v : $[_pluginName].regional.toolbarEdit + $[_pluginName].regional.eventFail, 'danger').show();
                                },
                                function () {
                                    that.hideLoading('edit');
                                }
                            );
                        }
                    }
                });
            }
        },
        //endregion==================注册插件事件==================

        //region   ===================查询框操作===================
        /**
         * 添加条件至前
         * @this Plugin
         * @param {jQuery} $btn ctrl按钮
         * @returns {void}
         */
        searchCtrlPC: function($btn){
            var $li = $btn.parent();
            if($li.index() === 0){
                $li.before(this.searchAddItemFirst());
                $li.prepend(this.searchAddBool());
            }
            else{
                $li.before(this.searchAddItem());
            }
        },
        /**
         * 添加条件至后
         * @this Plugin
         * @param {jQuery} $btn ctrl按钮
         * @returns {void}
         */
        searchCtrlNC: function($btn){
            $btn.parent().after(this.searchAddItem());
        },
        /**
         * 添加条件组至前
         * @this Plugin
         * @param {jQuery} $btn ctrl按钮
         * @returns {void}
         */
        searchCtrlPG: function($btn){
            var $li = $btn.parent();
            if($li.index() === 0){
                this.searchCtrlNG($btn);
            }
            else{
                $li.before(this.searchAddSubBlock());
            }
        },
        /**
         * 删除条件
         * @this Plugin
         * @param {jQuery} $btn ctrl按钮
         * @returns {void}
         */
        searchCtrlDEL: function($btn){
            var $li = $btn.parent(), $ul = $li.parent();
            if($ul.hasClass('kekTable-search-block-sub') && $ul.children().length === 1){
                $ul.parent().remove();
            }
            else{
                if($li.index() === 0){
                    $li.next().children('[data-bool]').remove();
                }
                $li.remove();
            }
        },
        /**
         * 添加条件组至后
         * @this Plugin
         * @param {jQuery} $btn ctrl按钮
         * @returns {void}
         */
        searchCtrlNG: function($btn){
            $btn.parent().after(this.searchAddSubBlock());
        },
        /**
         * 添加第一个条件
         * @this Plugin
         * @returns {string} 条件HTML
         */
        searchAddItemFirst: function(){
            return ('<li><button class="btn btn-default dropdown-toggle kekTable-search-item-first" type="button" data-col="">' + $[_pluginName].regional.defaultCol +
                '</button><button class="btn btn-default dropdown-toggle" type="button" data-opt="eq">=</button><input type="text" class="form-control kekTable-search-itemValue"><button class="btn btn-default dropdown-toggle" type="button" data-ctrl=""><span class="glyphicon glyphicon-cog"></span></button></li>');
        },
        /**
         * 添加and、or按钮
         * @this Plugin
         * @returns {string} 按钮HTML
         */
        searchAddBool: function(){
            return ('<button class="btn btn-default dropdown-toggle" type="button" data-bool="AND">' + $[_pluginName].regional.searchBoolAnd + '</button>');
        },
        /**
         * 添加ctrl按钮
         * @this Plugin
         * @returns {string} 按钮HTML
         */
        searchAddCtrl: function(){
            return ('<button class="btn btn-default dropdown-toggle" type="button" data-ctrl=""><span class="glyphicon glyphicon-cog"></span></button>');
        },
        /**
         * 添加非第一个条件
         * @this Plugin
         * @returns {string} 条件HTML
         */
        searchAddItem: function(){
            return $(this.searchAddItemFirst()).prepend(this.searchAddBool());
        },
        /**
         * 添加条件组
         * @this Plugin
         * @returns {string} 条件组HTML
         */
        searchAddSubBlock: function(){
            var $li = $('<li />');
            $li.append(this.searchAddBool()).append($('<ul class="kekTable-search-block-sub"></ul>').append(this.searchAddItemFirst())).append(this.searchAddCtrl());
            return $li;
        },

        //endregion===================查询框操作===================

        //region   ===================编辑框操作===================
        /**
         * 编辑字段改变值之后
         * @this Plugin
         * @param {string} colName 字段属性名
         * @param {string} val 修改后的值
         * @param {Array.<deferred>} deferrer 联级触发的字段产生的deferred
         * @param {Array.<string>} [itemTriggered] 被触发过的字段
         * @param {bool} [isInit] 是否初始化调用
         * @param {string} [parentCol] 触发的根字段
         * @returns {void}
         */
        editItemChange: function(colName, val, deferrer, itemTriggered, isInit, parentCol){
            var that = this,
                valFormat = this.checkEditItemValue(colName, val),
                oldVal = this.tableStatus === 'add' ? '' : this.curPageRecords[this.curRecordNo - 1][colName],
                col = this.options.columns[colName],
                afterDef, afterFormat;
            this.showLoading('', 'edit');
            if(!itemTriggered){
                itemTriggered = [];
            }
            if($.inArray(colName, itemTriggered) !== -1){
                console.warn(colName + '有重复引用');
                return;
            }
            //格式化值成功
            if(valFormat.result){
                that.setEditValue(colName, valFormat.val);
                if(oldVal === valFormat.val || col.editAttr === 'disabled'){
                    that.setEditStatus(colName, 0);
                }
                else{
                    that.setEditStatus(colName, 1);
                }
                if (!isInit && col.afterChange) {
                    afterDef = this.createDeferred(col.afterChange, this.deferredObject)();
                    afterDef.fail(function (v) {
                        that.setEditStatus(colName, -1, (col.editTitle || colName) + ':' + v);
                    });
                    afterDef.done(function (v) {
                        v = v == null ? (valFormat.val || '') : v;
                        //返回的是联动的形式 afterChange(){d.resolve({empNo:'1',empName:'2'})}
                        if($.type(v) === 'object'){
                            $.each(v, function(childColName, otherVal){
                                if(parentCol){
                                    itemTriggered.push(childColName);
                                }
                                if (!parentCol) {
                                    parentCol = colName;
                                }
                                that.editItemChange(childColName, otherVal, deferrer, itemTriggered, parentCol);
                            });
                        }
                        else{
                            afterFormat = that.checkEditItemValue(colName, v);
                            if (afterFormat.result) {
                                if (afterFormat.val === oldVal || col.editAttr === 'disabled'){
                                    that.setEditStatus(colName, 0);
                                }
                                else{
                                    that.setEditStatus(colName, 1);
                                }
                                that.setEditValue(colName, afterFormat.val);
                            }
                            else {
                                that.setEditValue(colName, v);
                                that.setEditStatus(colName, -1, (col.editTitle || colName) + ':' + afterFormat.val);
                            }
                        }
                    });
                    deferrer.push(afterDef);
                }
            }
            else {
                that.setEditValue(colName, val);
                that.setEditStatus(colName, -1, (col.editTitle || colName) + ':' + valFormat.val);
            }
        },
        /**
         * 检核值
         * @this Plugin
         * @param {string} colName 字段属性名
         * @param {string} val 修改后的值
         * @returns {{result: boolean, val: string}} result:是否成功, val:格式化后的值、错误信息
         */
        checkEditItemValue: function(colName, val){
            var regional = $[_pluginName].regional,
                col = this.options.columns[colName],
                res, checkLen;
            val = val == null ? '' : val;
            res = {result: true, val: val};
            //不能为空
            if (col.isRequire && (val == null || val === '')) {
                res.result = false;
                res.val = regional.errNull;
                return res;
            }
            //检查字段长度
            checkLen = this.checkColLength(val, col.colLength);
            if (checkLen) {
                res.result = false;
                res.val = checkLen;
                return res;
            }
            switch (col.colType) {
                case 'date':
                    res.val = this.checkDate(val);
                    if(res.val === false){
                        res.result = false;
                        res.val = regional.errDateFormat;
                    }
                    return res;
                case 'datetime':
                    res.val = this.checkDateTime(val);
                    if(res.val === false){
                        res.result = false;
                        res.val = regional.errDateTimeFormat;
                    }
                    return res;
                case 'number':
                    res.val = this.checkNumber(val);
                    if(res.val === false){
                        res.result = false;
                        res.val = regional.errNumberFormat;
                    }
                    return res;
                default:
                    return res;
            }
        },
        /**
         * 设置编辑字段状态
         * @this Plugin
         * @param {string} colName 字段属性名
         * @param {number} status 状态[ -1:异常,0:未改变,1:改变 ]
         * @param {string} [msg] 异常信息
         * @returns {void}
         */
        setEditStatus: function (colName, status, msg) {
            var $editInput = this.elements.edit.$block.find('[data-col="' + colName + '"]');
            $editInput.data('status', status);
            if (status === -1) {
                $editInput.parents('.form-group').removeClass('has-success').addClass('has-error').attr('title', msg || '');
                this.elements.edit.$alert.text(msg || '').show();
            }
            else if (status === 0) {
                $editInput.parents('.form-group').removeClass('has-success has-error').attr('title', null);
                this.elements.edit.$alert.hide();
            }
            else if (status === 1) {
                $editInput.parents('.form-group').removeClass('has-error').addClass('has-success').attr('title', null);
                this.elements.edit.$alert.hide();
            }
        },
        /**
         * 设置编辑字段的值
         * @this Plugin
         * @param {string} colName 字段属性名
         * @param {string} val 值
         * @returns {void}
         */
        setEditValue: function (colName, val) {
            var $editInput = this.elements.edit.$block.find('[data-col="' + colName + '"]'),
                list;
            this.editRecord[colName] = val;
            //list将$input的val改成显示文字
            if (this.options.columns[colName].editType === 'list') {
                list = this.options.columns[colName].listList;
                if (list[val] !== undefined){
                    $editInput.val(list[val]);
                }
                else{
                    $editInput.val(val);
                }
            }
            else{
                $editInput.val(val);
            }
        },
        //endregion===================编辑框操作===================

        //region   ====================表格操作====================
        /**
         * 选中一行 起始1
         * @this Plugin
         * @param {number} num 行号，从1开始
         * @returns {void}
         */
        selectRow: function (num) {
            /**
             * @type {jQuery}
             */
            var $tbody = $('table:not(".kekTable-table-frozen") tbody', this.elements.$tableGroup);
            $tbody.children('tr').removeClass('info');
            $tbody.children('[data-index="' + (num - 1) + '"]').addClass('info');
            this.curRecordNo = num;
        },
        /**
         * 选中frozen一行 起始1
         * @this Plugin
         * @param {number} num 行号，从1开始
         * @returns {void}
         */
        selectRowFrozen: function (num) {
            /**
             * @type {jQuery}
             */
            var $tbody = $('.kekTable-table-frozen tbody', this.elements.$tableGroup);
            $tbody.children('tr').removeClass('info');
            $tbody.children('[data-index="' + (num - 1) + '"]').addClass('info');
        },
        /**
         * 显示状态信息
         * @this Plugin
         * @param {string} msg 信息
         * @param {string} [type] 状态[ 'danger', 'success' ]
         * @returns {void}
         */
        showState: function (msg, type) {
            if (msg) {
                this.elements.$state.text(msg).removeClass(type === 'danger' ? 'alert-success' : 'alert-danger').addClass(type === 'danger' ? 'alert-danger' : 'alert-success');
                this.elements.$state.show();
            }
        },
        //endregion====================表格操作====================

        //region   ===================排序框操作===================
        /**
         * 将排序条件列表数组显示到排序对话框中
         * @this Plugin
         * @param {Array.<sortCondition>} arr 排序条件
         * @returns {void}
         */
        setSortDialog: function (arr) {
            var $block = this.elements.sort.$block,
                $df = $(document.createDocumentFragment()),
                that = this;
            this.elements.sort.$ctrl.find('.kekTable-dropList li.disabled').removeClass('disabled');
            $.each(arr,
                /**
                 * @param {number} i
                 * @param {sortCondition} data 排序条件
                 */
                function (i, data) {
                    var $colLi = that.elements.sort.$ctrl.find('.kekTable-dropList li[data-col="' + data.Col + '"]'),
                        $li = $('<li />')
                            .addClass('list-group-item')
                            .text($colLi.text())
                            .data('col', data.Col).data('type', data.Type).data('nulls', data.Nulls)
                            .append('<span class="glyphicon ' + (data.Type === 'ASC' ? 'glyphicon-sort-by-attributes' : 'glyphicon-sort-by-attributes-alt') + ' pull-right"></span>');
                    $df.append($li);
                    $colLi.addClass('disabled');
                }
            );
            $block.empty().append($df);
        },
        /**
         * 檢核排序條件
         * @param {Array.<sortCondition>} arr 排序条件
         * @this Plugin
         * @returns {void}
         */
        checkSortCondition: function(arr){
            var opt = this.options;
            if($.type(arr) !== 'array'){
                throw 'sortConditions项必需是数组';
            }
            $.each(arr,
                /**
                 * @param {number} i
                 * @param {Array.<string>|sortCondition} condition
                 */
                function(i, condition) {
                    if ($.type(condition) !== 'array'){
                        throw 'sortConditions子项必需是数组';
                    }
                    if (condition.length !== 3){
                        throw 'sortConditions子项数组长度必需是3';
                    }
                    if (opt.columns[condition[0]] == null){
                        throw 'sortConditions无此栏位' + condition[0];
                    }
                    if (opt.columns[condition[0]].colId == null){
                        throw 'sortConditions非数据库栏位' + condition[0];
                    }
                    if (!opt.columns[condition[0]].canSort){
                        throw 'sortConditions非排序栏位' + condition[0];
                    }
                    if ($.inArray(condition[1], ['ASC', 'DESC']) === -1){
                        throw 'sortConditions第二个值必需是ASC，DESC';
                    }
                    if ($.inArray(condition[2], ['NULLS FIRST', 'NULLS LAST']) === -1){
                        throw 'sortConditions第三个值必需是NULLS FIRST，NULLS LAST';
                    }
                }
            );
        },
        //endregion===================排序框操作===================

        //region   ===================查询框操作===================
        /**
         * 检核查询条件
         * @param {Array.<searchCondition>} arr 查询条件
         * @this Plugin
         * @returns {void}
         */
        checkSearchCondition: function(arr){
            var that = this, opt = this.options;
            if($.type(arr) !== 'array'){
                throw 'searchConditions项必需是数组';
            }
            $.each(arr,
                /**
                 * @param {number} i
                 * @param {Array.<Object>|Plugin#searchConditions} condition
                 */
                function(i, condition) {
                    var len = condition.length;
                    if ($.type(condition) !== 'array'){
                        throw 'searchConditions子项必需是数组';
                    }
                    if (i) {
                        if ($.inArray(condition[0], ['AND', 'OR']) === -1){
                            throw 'searchConditions非第一个子项的第一个值必须是AND、OR';
                        }
                        if ($.inArray(len, [2, 3, 4]) === -1){
                            throw 'searchConditions非第一个子项只能有2，3，4个值';
                        }
                        //['AND',[]]
                        if (len === 2){
                            that.checkSearchCondition(condition[1]);
                        }
                        //['AND','empNo','IS NOT NULL']
                        else {
                            if (opt.columns[condition[1]] == null || opt.columns[condition[1]].colId == null){
                                throw 'searchConditions:columns设置中没有' + condition[1] + '栏位，或没有设置colId';
                            }
                            if ($.inArray(condition[2], ['eq', 'gt', 'lt', 'ge', 'le', 'ne', 'beg', 'end', 'like', 'isnull', 'notnull']) === -1){
                                throw '3,4个值的searchConditions子项的第三个值必需是eq、gt、lt、ge、le、ne、beg、end、like、isnull、notnull';
                            }
                            if ($.inArray(condition[2], ['isnull', 'notnull']) !== -1 && condition[3] != null){
                                throw 'searchConditions子项的关系符为isnull、notnull，不用设置第四个值';
                            }
                            else if ($.inArray(condition[2], ['isnull', 'notnull']) === -1 && condition[3] == null){
                                throw 'searchConditions子项的关系符不为isnull、notnull，必需设置第四个值';
                            }
                        }
                    }
                    else {
                        if ($.inArray(len, [2, 3]) === -1){
                            throw 'searchConditions第一个子项只能有2，3个值';
                        }
                        if (opt.columns[condition[0]] == null || opt.columns[condition[0]].colId == null){
                            throw 'searchConditions:columns设置中没有' + condition[0] + '栏位，或没有设置colId';
                        }
                        if ($.inArray(condition[1], ['eq', 'gt', 'lt', 'ge', 'le', 'ne', 'beg', 'end', 'like', 'isnull', 'notnull']) === -1){
                            throw '_searchConditions子项的第2个值必需是eq、gt、lt、ge、le、ne、beg、end、like、isnull、notnull';
                        }
                        if ($.inArray(condition[1], ['isnull', 'notnull']) !== -1 && condition[2] != null){
                            throw '_searchConditions子项的关系符为isnull、notnull，不用设置第3个值';
                        }
                        else if ($.inArray(condition[1], ['isnull', 'notnull']) === -1 && condition[2] == null){
                            throw '_searchConditions子项的关系符不为isnull、notnull，必需设置第3个值';
                        }
                    }
                }
            );
        },
        /**
         * 将查询条件列表数组显示到查询对话框中
         * @this Plugin
         * @param {Array.<searchCondition>} [arr] 排序条件
         * @returns {void}
         */
        setSearchDialog: function (arr) {
            var $block = this.elements.search.$block,
                that = this,
                $df = $(document.createDocumentFragment());
            if (!arr || !arr.length){
                $block.empty().append(this.searchAddItemFirst());
            }
            else {
                $.each(arr, function (i, condition) {
                    var $li = that.setSearchDialogItem(i, condition);
                    $df.append($li);
                });
                $block.empty().append($df);
            }
        },
        /**
         * 显示查询条件
         * @this Plugin
         * @param {number} i 条件下标(第几个条件)
         * @param {searchCondition} arr 排序条件
         * @returns {jQuery} 条件jQuery
         */
        setSearchDialogItem: function (i, arr) {
            var j = i ? 1 : 0,
                that = this,
                $ul, $bool;
            /**
             * @type {jQuery}
             */
            var $li = $('<li></li>');
            if (arr.Child) {
                $ul = $('<ul class="kekTable-search-block-sub"></ul>');
                $.each(arr.Child, function (index, condition) {
                    $ul.append(that.setSearchDialogItem(index, condition));
                });
                $li.append($ul).append(this.searchAddCtrl());
            }
            else {
                $li = $(this.searchAddItemFirst());
                //col
                $li.children('[data-col]').data('col', arr.Col).text(this.elements.search.$col.children('li[data-col="' + arr.Col + '"]').text());
                //opt
                $li.children('[data-opt]').data('opt', arr.Opt).text(this.elements.search.$operator.children('li[data-opt="' + arr.Opt + '"]').text());
                //val
                if ($.inArray(arr.Opt, ['isnull', 'notnull']) === -1){
                    $li.children('.kekTable-search-itemValue').val(arr.Val);
                }
                else{
                    $li.children('.kekTable-search-itemValue').attr('readonly', 'readonly');
                }
            }
            //bool
            if (j) {
                $bool = $(this.searchAddBool());
                $bool.data('bool', arr.Bool).text(this.elements.search.$bool.children('li[data-bool="' + arr.Bool + '"]').text());
                $li.prepend($bool);
            }
            return $li;
        },
        /**
         * 将查询框中的条件转换成查询数组
         * @this Plugin
         * @returns {bool|string} 有返回代表异常信息
         */
        getSearchDialog: function () {
            var $li = this.elements.search.$block.children('li'),
                arr = [],
                i, j, li;
            for (i = 0, j = $li.length; i < j; i++) {
                li = this.getSearchDialogItem($($li[i]));
                if ($.type(li) !== 'object') {
                    return li;
                }
                arr.push(li);
            }
            this.searchConditions = arr;
            return false;
        },
        /**
         * 生成条件
         * @this Plugin
         * @param {jQuery} $li 画面上的li
         * @returns {searchCondition|string} 查询条件
         */
        getSearchDialogItem: function($li) {
            var arr = {}, col, opt, val, nullOpt, sub, i, j, subRet, valFormat,
                regional = $[_pluginName].regional,
                index = $li.index(),
                $col = $li.children('[data-col]'),
                $opt = $li.children('[data-opt]'),
                $val = $li.children('.kekTable-search-itemValue'),
                $bool = $li.children('[data-bool]'),
                $sub = $li.children('.kekTable-search-block-sub').children('li');
            //非子条件组
            if ($col.length) {
                col = $col.data('col');
                opt = $opt.data('opt');
                val = $val.val();
                nullOpt = opt.indexOf('null') !== -1;
                //转换opt,val
                if (!col) {
                    $col.addClass('btn-danger');
                    return regional.errNull;
                }
                else{
                    $col.removeClass('btn-danger');
                }
                if (!opt) {
                    $opt.addClass('btn-danger');
                    return regional.errNull;
                }
                else{
                    $opt.removeClass('btn-danger');
                }
                if (!nullOpt) {
                    if(val === ''){
                        $li.addClass('has-error');
                        $val.focus();
                        return regional.errNull;
                    }
                    if ($.inArray(opt, ['beg', 'end', 'like']) === -1){
                        valFormat = this.checkEditItemValue(col, val);
                        if (!valFormat.result) {
                            $li.addClass('has-error');
                            $val.focus();
                            return valFormat.val;
                        }
                        $val.val(valFormat.val);
                        val = valFormat.val;
                    }
                    $li.removeClass('has-error');
                }
                arr.Col = col;
                arr.Opt = opt;
                if(!nullOpt){
                    arr.Val = val;
                }
            }
            else{
                if (!$sub.length) {
                    return regional.searchErr;
                }
                sub = [];
                for (i = 0, j = $sub.length; i < j; i++) {
                    subRet = this.getSearchDialogItem($($sub[i]));
                    if ($.type(subRet) === 'string'){
                        return subRet;
                    }
                    sub.push(subRet);
                }
                arr.Child = sub;
            }
            if (index > 0) {
                if (!$bool.length){
                    return regional.searchErr;
                }
                arr.Bool = $bool.data('bool');
            }
            return arr;
        },
        /**
         * 将js中的查询条件转换为传送到后台的查询条件
         * @this Plugin
         * @param {searchCondition} conditions 查询条件
         * @returns {searchCondition} 转换后的查询条件
         */
        toSearchPost: function (conditions) {
            var that = this;
            $.each(conditions, function (i, condition) {
                that.toSearchPostItem(condition);
            });
            return conditions;
        },
        /**
         * 转换查询条件
         * Col变为colId，Opt变为=,>,<...，Val变为%val%
         * @this Plugin
         * @param {searchCondition} condition 查询条件
         * @returns {searchCondition} 转换后的查询条件
         */
        toSearchPostItem: function(condition){
            var col;
            if(condition.Child){
                this.toSearchPost(condition.Child);
            }
            else{
                col = this.options.columns[condition.Col];
                //col
                if (col){
                    condition.Col = col.colId;
                }
                else {
                    this.showAlert($[_pluginName].regional.processErr);
                    throw 'toSearchPostItem:' + condition.Col;
                }
                //opt val
                switch (condition.Opt) {
                    case 'eq':
                        condition.Opt = '=';
                        break;
                    case 'gt':
                        condition.Opt = '>';
                        break;
                    case 'lt':
                        condition.Opt = '<';
                        break;
                    case 'ge':
                        condition.Opt = '>=';
                        break;
                    case 'le':
                        condition.Opt = '<=';
                        break;
                    case 'ne':
                        condition.Opt = '<>';
                        break;
                    case 'beg':
                        condition.Opt = 'LIKE';
                        condition.Val += '%';
                        break;
                    case 'end':
                        condition.Opt = 'LIKE';
                        condition.Val = '%' + condition.Val;
                        break;
                    case 'like':
                        condition.Opt = 'LIKE';
                        condition.Val = '%' + condition.Val + '%';
                        break;
                    case 'isnull':
                        condition.Opt = 'IS NULL';
                        break;
                    case 'notnull':
                        condition.Opt = 'IS NOT NULL';
                        break;
                    default:
                        this.showAlert($[_pluginName].regional.processErr);
                        throw 'toSearchPostItem:无此符号 ' + condition.Opt;
                }
            }
        },
        //endregion===================查询框操作===================

        //region   ==================数据格式检查==================
        /**
         * 将字符串转换为date(yyyy/mm/dd)
         * @this Plugin
         * @param {string} str 值
         * @returns {bool|string} 异常返回false、格式化后的值
         */
        checkDate: function (str) {
            var match, newDate;
            str = $.trim(str);
            if (str) {
                match = str.match(/^(\d{4})[\/\\\-]?(0?[1-9]|1[012])[\/\\\-]?(0?[1-9]|[12][0-9]|3[01])$/);
                if (match) {
                    newDate = new Date(match[1], match[2] - 1, match[3]);
                    if ((newDate.getMonth() !== match[2] - 1) || (newDate.getFullYear() !== match[1] - 0)){
                        return false;
                    }
                    if (match[2].length === 1){
                        match[2] = '0' + match[2];
                    }
                    if (match[3].length === 1){
                        match[3] = '0' + match[3];
                    }
                    return match[1] + '/' + match[2] + '/' + match[3];
                }
                else{
                    return false;
                }
            }
            else{
                return str;
            }
        },
        /**
         * 将字符串转换为datetime(yyyy/mm/dd hh24:mi:ss
         * @this Plugin
         * @param {string} str 值
         * @returns {bool|string} 异常返回false、格式化后的值
         */
        checkDateTime: function (str) {
            var match, newDate;
            str = $.trim(str);
            if (str) {
                match = str.match(/^(\d{4})[\/\\\-]?(0?[1-9]|1[012])[\/\\\-]?(0?[1-9]|[12][0-9]|3[01])\s?([01]?[0-9]|2[0-3]):?([0-5]?[0-9]):?([0-5]?[0-9]?)$/);
                if (match) {
                    newDate = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
                    if ((newDate.getMinutes() !== match[5] - 0) || (newDate.getHours() !== match[4] - 0) || (newDate.getDate() !== match[3] - 0) || (newDate.getMonth() !== match[2] - 1) || (newDate.getFullYear() !== match[1] - 0)){
                        return false;
                    }
                    if (match[2].length === 1){
                        match[2] = '0' + match[2];
                    }
                    if (match[3].length === 1){
                        match[3] = '0' + match[3];
                    }
                    if (match[4].length === 1){
                        match[4] = '0' + match[4];
                    }
                    if (match[5].length === 1){
                        match[5] = '0' + match[5];
                    }
                    if (match[6].length === 1){
                        match[6] = '0' + match[6];
                    }
                    return match[1] + '/' + match[2] + '/' + match[3] + ' ' + match[4] + ':' + match[5] + ':' + (match[6] === '' ? '00' : match[6]);
                }
                else{
                    return false;
                }
            }
            else{
                return str;
            }
        },
        /**
         * 将字符串转换为数字
         * @this Plugin
         * @param {string|number} str 值
         * @returns {bool|string} 异常返回false、格式化后的值
         */
        checkNumber: function (str) {
            str = parseFloat(str);
            if(isNaN(str)){
                return false;
            }
            return str;
        },
        /**
         * 检查值字节数
         * @this Plugin
         * @param {string} colVal 值
         * @param {string} colLen 长度
         * @returns {string|void} 异常信息或者void
         */
        checkColLength: function(colVal, colLen){
            var lenSplit, valSplit, allLen, valLen, chBytes, j, l;
            if(colLen){
                colVal += '';
                lenSplit = (colLen + '').split('.');//将colLen转化成文字数组['3','2']
                valSplit = colVal.split('.');//将colVal转化成文字数组
                //总长度(整数+小数)
                allLen = 0;
                $.each(lenSplit, function(i, len){
                    allLen += parseInt(len, 10);
                });
                //数字格式
                if (lenSplit.length === 2) {
                    //数字超长
                    if (valSplit[0].length > lenSplit[0] || (valSplit[1] && valSplit[1].length > lenSplit[1])){
                        return $[_pluginName].regional.errNumLength.replace('/i', lenSplit[0]).replace('/f', lenSplit[1]);
                    }
                    //去掉.号
                    colVal = colVal.replace(/\.\-\+/g, '');
                }
                //计算colVal的总长度
                valLen = 0;
                chBytes = this.options.chBytes;
                //----按字节算长度的话，遍历每个值
                if (this.options.isByte) {
                    for (j = 0, l = colVal.length; j < l; j++) {
                        if (colVal.charCodeAt(j) > 256){
                            valLen += chBytes;
                        }
                        else{
                            valLen += 1;
                        }
                    }
                }
                //----非字节算长度
                else {
                    chBytes = 1;
                    valLen = colVal.length;
                }
                //超出总长度(colLen)
                if (valLen > allLen) {
                    if (lenSplit.length === 1){
                        return $[_pluginName].regional.errCharLength.replace('/a', colLen).replace('/c', chBytes);
                    }
                    else{
                        return $[_pluginName].regional.errNumLength.replace('/i', lenSplit[0]).replace('/f', lenSplit[1]);
                    }
                }
            }

        },
        //endregion==================数据格式检查==================

        //region   ==================加载遮罩操作==================
        /**
         * 显示加载遮罩
         * @this Plugin
         * @param {string} msg 显示信息
         * @param {string} el 遮罩[ 'list', 'edit' ]
         * @param {number} [delay] 延时时间
         * @returns {void}
         */
        showLoading: function (msg, el, delay) {
            var $el;
            el = el || this.curLoading || 'list';
            $el = el === 'edit' ? this.elements.edit.$loading : this.elements.$loading;
            $('.alert', $el).text(msg || $[_pluginName].regional.loadingTxt);
            if (el !== this.curLoading) {
                this.hideLoading(this.curLoading);
                delay = delay || this.options.loadingDelay;
                if(!this.loadingDelay){
                    this.loadingDelay = setTimeout(function () {
                        $el.show();
                    }, delay);
                }
            }
            this.curLoading = el;
        },
        /**
         * 隐藏加载遮罩
         * @this Plugin
         * @param {string} [el] 遮罩[ 'list', 'edit' ]
         * @returns {void}
         */
        hideLoading: function (el) {
            var $el;
            el = el || this.curLoading;
            $el = el === 'edit' ? this.elements.edit.$loading : this.elements.$loading;
            if(this.loadingDelay){
                clearTimeout(this.loadingDelay);
            }
            this.loadingDelay = null;
            $el.hide();
            this.curLoading = null;
        },
        //endregion==================加载遮罩操作==================

        //region   ===================提示框操作===================
        /**
         * 显示提示框
         * @this Plugin
         * @param {string} msg 提示信息
         * @returns {void}
         */
        showAlert: function (msg) {
            $('.modal-body p', this.elements.$alert).text(msg);
            this.elements.$alert.modal('show');
        },
        //endregion===================提示框操作===================

        //region   ====================Deferred====================
        /**
         * deferred流，按顺序执行
         * @this Plugin
         * @param {Array.<deferred>} deferreds createDeferred()返回值数组
         * @param {function} doneHandler 全部成功执行完毕回调
         * @param {function} failHandler 有失败后回调
         * @param {function} alwaysHandler 以上两种情况都会回调
         * @returns {void}
         */
        deferredFlow: function (deferreds, doneHandler, failHandler, alwaysHandler) {
            var that = this, firstDeferred;
            if (deferreds.length) {
                firstDeferred = deferreds.shift()();//取得第一个deferred，并将其从数组中去掉
                if ($.isFunction(firstDeferred.promise)) {
                    firstDeferred.done(function () {
                        that.deferredFlow(deferreds, doneHandler, failHandler, alwaysHandler);
                    }).fail(function (v) {
                        failHandler(v);
                    }, function (v) {
                        alwaysHandler(v);
                    });
                }
                else{
                    this.deferredFlow(deferreds, doneHandler, failHandler, alwaysHandler);
                }
            }
            else {
                if(doneHandler){
                    doneHandler();
                }
                if(alwaysHandler){
                    alwaysHandler();
                }
            }
        },
        /**
         * 创建deferred
         * @this Plugin
         * @param {function} handler 执行函数
         * @param {Object} handlerObject 执行函数的参数
         * @returns {Function} 建立deferred的匿名函数
         */
        createDeferred: function (handler, handlerObject) {
            var that = this;
            return function () {
                var def = $.Deferred();
                if (handler){
                    handler.call(that, ($.isFunction(handlerObject) ? handlerObject.call(that) : handlerObject), def);
                }
                else{
                    def.resolve();
                }
                return def.promise();
            };
        },
        /**
         * 当前页面上的一系列值
         * @this Plugin
         * @returns {deferredObject} 值
         */
        deferredObject: function () {
            return $.extend(true, {}, {
                curPageRecords: this.curPageRecords,
                curRecord: this.curPageRecords[this.curRecordNo - 1],
                editRecord: this.editRecord,
                tableStatus: this.tableStatus,
                curRecordNo: this.curRecordNo,
                curPageNo: this.curPageNo
            });
        },
        /**
         * 当前页面上的一系列值
         * @this Plugin
         * @returns {deferredObjectRef} 值
         */
        deferredObjectRef: function () {
            var obj = $.extend(true, {}, {
                pageRecords: this.curPageRecords,
                curRecord: this.curPageRecords[this.curRecordNo - 1],
                tableStatus: this.tableStatus,
                curRecordNo: this.curRecordNo,
                curPageNo: this.curPageNo
            });
            obj.editRecordRef = this.editRecord;
            return obj;
        },
        //endregion====================Deferred====================

        //region   ====================外部接口====================
        /**
         * 显示loading遮罩
         * @this Plugin
         * @name Plugin.showLoading
         * @param {string} msg 信息
         * @param {string} el 遮罩[ 'list', 'edit' ]
         * @param {number} delay 延时
         * @returns {void}
         */
        ShowLoading: function (msg, el, delay) {
            this.showLoading(msg, el, delay);
        },
        /**
         * 显示提示框
         * @this Plugin
         * @param {string} msg 信息
         * @returns {void}
         */
        ShowAlert: function (msg) {
            this.showAlert(msg);
        }
        //endregion====================外部接口====================
    };
    //endregion======================原型======================

    //region   ====================注册插件====================
    /**
     * @this jQuery
     * @param {kekOption|string} options 自定义插件配置参数
     * @returns {jQuery} jQuery插件
     */
    $.fn[_pluginName] = function (options) {
        var args = arguments;
        return this.each(
            /**
             * @this HTMLElement
             */
            function () {
                var data = $.data(this, 'plugin_' + _pluginName);
                //第一次调用。初始化
                if (!data) {
                    $.data(this, 'plugin_' + _pluginName, new Plugin(this, options));
                }
                else if (typeof options === 'string') {
                    if (typeof data[options] === 'function') {
                        //不允许外部调用
                        if ($.inArray(options, ['ShowLoading', 'ShowAlert']) !== -1){
                            data[options].apply(data, Array.prototype.slice.call(args, 1));
                        }
                        else{
                            throw $[_pluginName].regional.errApiPrivate + options;
                        }
                    }
                    else{
                        throw $[_pluginName].regional.errApiWithout + options;
                    }
                }

            }
        );
    };
    //endregion====================注册插件====================

    //region   =====================全球化=====================
    $[_pluginName] = {};
    /**
     * 语言
     * @namespace Regional
     * @example cn.js
     * $.kekTable.regional={}
     */
    $[_pluginName].regional = {
        /**
         * 提示框的标题文字
         * @name Regional.alertTitle
         * @type {string}
         */
        alertTitle: '提示',
        /**
         * 默认字段栏位的文字
         * @name Regional.defaultCol
         * @type {string}
         */
        defaultCol: '欄位',
        /**
         * 工具栏新增按钮的显示文字
         * @name Regional.toolbarAdd
         * @type {string}
         */
        toolbarAdd: '新增',
        /**
         * 工具栏刷新按钮的显示文字
         * @name Regional.toolbarRefresh
         * @type {string}
         */
        toolbarRefresh: '刷新',
        /**
         * 工具栏查询按钮的显示文字
         * @name Regional.toolbarSearch
         * @type {string}
         */
        toolbarSearch: '查詢',
        /**
         * 工具栏排序按钮的显示文字
         * @name Regional.toolbarSort
         * @type {string}
         */
        toolbarSort: '排序',
        /**
         * 工具栏修改按钮的显示文字
         * @name Regional.toolbarEdit
         * @type {string}
         */
        toolbarEdit: '修改',
        /**
         * 工具栏删除按钮的显示文字
         * @name Regional.toolbarDelete
         * @type {string}
         */
        toolbarDelete: '刪除',
        /**
         * 工具栏汇出按钮的显示文字
         * @name Regional.toolbarExport
         * @type {string}
         */
        toolbarExport: '匯出',
        /**
         * 非法调用内部方法时的错误信息
         * @name Regional.errApiPrivate
         * @type {string}
         */
        errApiPrivate: '此方法不公開使用:',
        /**
         * 没有此API的错误信息
         * @name Regional.errApiWithout
         * @type {string}
         */
        errApiWithout: '沒有提供此方法:',
        /**
         * 不能为空错误信息
         * @name Regional.errNull
         * @type {string}
         */
        errNull: '不能為空',
        /**
         * 日期格式错误信息
         * @name Regional.errDateFormat
         * @type {string}
         */
        errDateFormat: '日期格式错误(2014/01/01)',
        /**
         * 日期格式错误信息
         * @name Regional.errDateTimeFormat
         * @type {string}
         */
        errDateTimeFormat: '日期格式错误(2014/01/01 23:59:02)',
        /**
         * 数字格式错误
         * @name Regional.errNumberFormat
         * @type {string}
         */
        errNumberFormat: '數字格式錯誤',
        /**
         * 数字 值超出最大长度
         * @name Regional.errNumLength
         * @type {string}
         */
        errNumLength: '數字超長(/i位整數，/f位小數)',
        /**
         * 文字 值超出最大长度
         * @name Regional.errCharLength
         * @type {string}
         */
        errCharLength: '文字超長(/a個字符，中文占/c位)',
        /**
         * 必须要选择一行
         * @name Regional.errSelected
         * @type {string}
         */
        errSelected: '請先選取一行',
        /**
         * 查询框[布尔条件的AND]文字说明
         * @name Regional.searchBoolAnd
         * @type {string}
         */
        searchBoolAnd: '且',
        /**
         * 查询框[布尔条件的OR]文字说明
         * @name Regional.searchBoolOr
         * @type {string}
         */
        searchBoolOr: '或',
        /**
         * 查询框[关系运算符的等于]文字说明
         * @name Regional.searchOptEq
         * @type {string}
         */
        searchOptEq: '=',
        /**
         * 查询框[关系运算符的小于]文字说明
         * @name Regional.searchOptLt
         * @type {string}
         */
        searchOptLt: '<',
        /**
         * 查询框[关系运算符的小于等于]文字说明
         * @name Regional.searchOptLe
         * @type {string}
         */
        searchOptLe: '<=',
        /**
         * 查询框[关系运算符的大于]文字说明
         * @name Regional.searchOptGt
         * @type {string}
         */
        searchOptGt: '>',
        /**
         * 查询框[关系运算符的大于等于]文字说明
         * @name Regional.searchOptGe
         * @type {string}
         */
        searchOptGe: '>=',
        /**
         * 查询框[关系运算符的不等于]文字说明
         * @name Regional.searchOptNe
         * @type {string}
         */
        searchOptNe: '不等於',
        /**
         * 查询框[关系运算符的开始于]文字说明
         * @name Regional.searchOptBeg
         * @type {string}
         */
        searchOptBeg: '開始於',
        /**
         * 查询框[关系运算符的结束于]文字说明
         * @name Regional.searchOptEnd
         * @type {string}
         */
        searchOptEnd: '結束於',
        /**
         * 查询框[关系运算符的包含]文字说明
         * @name Regional.searchOptLike
         * @type {string}
         */
        searchOptLike: '包含',
        /**
         * 查询框[关系运算符的空]文字说明
         * @name Regional.searchOptNull
         * @type {string}
         */
        searchOptNull: '空',
        /**
         * 查询框[关系运算符的非空]文字说明
         * @name Regional.searchOptNNull
         * @type {string}
         */
        searchOptNNull: '非空',
        /**
         * 查询框[添加查询条件至前]文字说明
         * @name Regional.searchAddPreCond
         * @type {string}
         */
        searchAddPreCond: '添加條件至前',
        /**
         * 查询框[添加查询条件至后]文字说明
         * @name Regional.searchAddNxtCond
         * @type {string}
         */
        searchAddNxtCond: '添加條件至後',
        /**
         * 查询框[添加查询组至前]文字说明
         * @name Regional.searchAddPreGrp
         * @type {string}
         */
        searchAddPreGrp: '添加組至前',
        /**
         * 查询框[添加查询组至后]文字说明
         * @name Regional.searchAddNxtGrp
         * @type {string}
         */
        searchAddNxtGrp: '添加組至後',
        /**
         * 查询框[删除查询条件]文字说明
         * @name Regional.searchDelCond
         * @type {string}
         */
        searchDelCond: '刪除',
        /**
         * 查询框标题
         * @name Regional.searchTitle
         * @type {string}
         */
        searchTitle: '查詢',
        /**
         * 查询框执行查询的按钮文字
         * @name Regional.searchCommit
         * @type {string}
         */
        searchCommit: '查詢',
        /**
         * 查询框执行查询的按钮文字
         * @name Regional.editCommit
         * @type {string}
         */
        editCommit: '保存',
        /**
         * 编辑框新增标题
         * @name Regional.addTitle
         * @type {string}
         */
        addTitle: '新增',
        /**
         * 编辑框修改标题
         * @name Regional.editTitle
         * @type {string}
         */
        editTitle: '修改',
        /**
         * 取消按钮文字
         * @name Regional.buttonCancel
         * @type {string}
         */
        buttonCancel: '取消',
        /**
         * 确定按钮文字
         * @name Regional.buttonOk
         * @type {string}
         */
        buttonOk: '確定',
        /**
         * 总计公式[SUM]的文字
         * @name Regional.totalSUM
         * @type {string}
         */
        totalSUM: '总和',
        /**
         * 总计公式[AVG]的文字
         * @name Regional.totalAVG
         * @type {string}
         */
        totalAVG: '总均值',
        /**
         * 总计公式[MAX]的文字
         * @name Regional.totalMAX
         * @type {string}
         */
        totalMAX: '最大值',
        /**
         * 总计公式[MIN]的文字
         * @name Regional.totalMIN
         * @type {string}
         */
        totalMIN: '最小值',
        /**
         * 总计公式[COUNT]的文字
         * @name Regional.totalCOUNT
         * @type {string}
         */
        totalCOUNT: '总计数',
        /**
         * 总计公式[STDDEV]的文字
         * @name Regional.totalSTDDEV
         * @type {string}
         */
        totalSTDDEV: '总标准差',
        /**
         * 总计公式[VARIANCE]的文字
         * @name Regional.totalVARIANCE
         * @type {string}
         */
        totalVARIANCE: '总协方差',
        /**
         * 总计公式[MEDIAN]的文字
         * @name Regional.totalMEDIAN
         * @type {string}
         */
        totalMEDIAN: '中间值',
        /**
         * 排序框标题
         * @name Regional.sortTitle
         * @type {string}
         */
        sortTitle: '排序',
        /**
         * 排序框执行排序的按钮文字
         * @name Regional.sortCommit
         * @type {string}
         */
        sortCommit: '排序',
        /**
         * 排序框添加按钮title
         * @name Regional.sortAdd
         * @type {string}
         */
        sortAdd: '添加',
        /**
         * 排序框删除按钮title
         * @name Regional.sortDelete
         * @type {string}
         */
        sortDelete: '刪除',
        /**
         * 排序框上移按钮title
         * @name Regional.sortMoveUp
         * @type {string}
         */
        sortMoveUp: '上移',
        /**
         * 排序框下移按钮title
         * @name Regional.sortMoveDown
         * @type {string}
         */
        sortMoveDown: '下移',
        /**
         * 排序框从小到大按钮文字
         * @name Regional.sortAsc
         * @type {string}
         */
        sortAsc: '從小到大',
        /**
         * 排序框从大到小按钮文字
         * @name Regional.sortDesc
         * @type {string}
         */
        sortDesc: '從大到小',
        /**
         * 排序框空值在后按钮文字
         * @name Regional.sortNullsLast
         * @type {string}
         */
        sortNullsLast: '空值在後',
        /**
         * 排序框空值在前按钮文字
         * @name Regional.sortNullsFirst
         * @type {string}
         */
        sortNullsFirst: '空值在前',
        /**
         * 加载遮罩的显示文字
         * @name Regional.loadingTxt
         * @type {string}
         */
        loadingTxt: '請稍等片刻...',
        /**
         * 读取资料的遮罩显示文字
         * @name Regional.loadData
         * @type {string}
         */
        loadData: '正在讀取資料...',
        /**
         * list,lov遮罩显示文字
         * @name Regional.loadList
         * @type {string}
         */
        loadList: '正在刷新列表...',
        /**
         * 删除提示
         * @name Regional.deleteConfirm
         * @type {string}
         */
        deleteConfirm: '確定刪除？',
        /**
         * 读取资料异常的文字
         * @name Regional.loadDataErr
         * @type {string}
         */
        loadDataErr: '讀取資料異常',
        /**
         * 查詢條件異常
         * @name Regional.searchErr
         * @type {string}
         */
        searchErr: '查詢條件異常',
        /**
         * 事件操作成功后的状态信息
         * @name Regional.eventSuccess
         * @type {string}
         */
        eventSuccess: '操作成功',
        /**
         * 事件操作异常后的状态信息
         * @name Regional.eventFail
         * @type {string}
         */
        eventFail: '操作失敗',
        /**
         * 二次开发异常信息
         * @name Regional.processErr
         * @type {string}
         */
        processErr: '程式異常',
        /**
         * 匯出滿足條件的所有記錄
         * @name Regional.exportAll
         * @type {string}
         */
        exportAll: '全部記錄',
        /**
         * 匯出畫面上顯示的本頁記錄
         * @name Regional.exportPage
         * @type {string}
         */
        exportPage: '本頁記錄'
    };
    //endregion=====================全球化=====================
})(jQuery, window, document);

//region   =====================注解=====================
/**
 * 工具栏按钮
 * @name toolbarItem
 * @namespace
 */
/**
 * 标识(必需)
 * @type {string}
 * @name toolbarItem.id
 */
/**
 * 图标
 * bootstrap的glyphicon样式
 * @type {string}
 * @name toolbarItem.icon
 */
/**
 * 按钮上的文字
 * @type {string}
 * @name toolbarItem.label
 */
/**
 * 按钮上的提示文字title
 * @type {string}
 * @name toolbarItem.title
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
 * @property {object} [curRecord=null] - 选中的数据(值传递不可修改)，已转换为colEntity类
 * @property {object} [editRecord=null] - 修改框中的数据(值传递不可修改)，已转换为colEntity类
 * @property {Array.<object>} [pageRecords=null] - 当前页的数据(值传递不可修改)，已转换为colEntity类
 * @property {int} [curPageNo=null] - 当前页码
 * @property {int} [curRecordNo=null] - 当前行号，起始于1
 * @property {string} [tableStatus=null] - 表格狀態，一般為toolbarItem.id
 */

/**
 * 当前页面上的一系列值。供外部接口
 * @typedef {object} deferredObjectRef
 * @property {object} [curRecord=null] - 选中的数据(值传递不可修改)，已转换为colEntity类
 * @property {object} [editRecordRef=null] - 修改框中的数据(引用传递可修改)，已转换为colEntity类
 * @property {Array.<object>} [pageRecords=null] - 当前页的数据(值传递不可修改)，已转换为colEntity类
 * @property {int} [curPageNo=null] - 当前页码
 * @property {int} [curRecordNo=null] - 当前行号，起始于1
 * @property {string} [tableStatus=null] - 表格狀態，一般為toolbarItem.id
 */

/**
 * @typedef {Object} loadResult
 * @property {bool} Success 是否成功
 * @property {number} Total 一共有多少行数据
 * @property {Array.<Array.<string|number>>} Records 数据记录
 * @property {Array.<string|number>} Summary 摘要数据
 * @property {string} Message 信息
 */

/**
 * @typedef {Object} sortData
 * @property {string} col 字段属性名
 * @property {string} type [ 'ASC','DESC' ]
 * @property {string} nulls [ 'NULLS FIRST', 'NULLS LAST' ]
 */

/**
 * @typedef {Object} sortCondition
 * @property {string} Col 字段属性名
 * @property {string} Type [ 'ASC','DESC' ]
 * @property {string} Nulls [ 'NULLS FIRST', 'NULLS LAST' ]
 */

/**
 * @typedef {Object} searchCondition
 * @property {string} Col 字段属性名
 * @property {string} Opt 关系符
 * @property {string} Val 值
 * @property {string} Bool [ 'AND', 'OR' ]
 * @property {Array.<searchCondition>} Child 子条件
 */

/**
 * $.Deferred()返回值
 * @name deferred
 */
/**
 * @name deferred.always
 * @function
 */
/**
 * @name deferred.done
 * @function
 */
/**
 * @name deferred.fail
 * @function
 */
/**
 * @name deferred.isRejected
 * @function
 */
/**
 * @name deferred.isResolved
 * @function
 */
/**
 * @name deferred.notify
 * @function
 */
/**
 * @name deferred.notifyWith
 * @function
 */
/**
 * @name deferred.pipe
 * @function
 */
/**
 * @name deferred.progress
 * @function
 */
/**
 * @name deferred.promise
 * @function
 */
/**
 * @name deferred.reject
 * @function
 */
/**
 * @name deferred.rejectWith
 * @function
 */
/**
 * @name deferred.resolve
 * @function
 */
/**
 * @name deferred.resolveWith
 * @function
 */
/**
 * @name deferred.state
 * @function
 */
/**
 * @name deferred.then
 * @function
 */
/**
 * @name deferred.promise
 * @function
 */
//endregion=====================注解=====================
