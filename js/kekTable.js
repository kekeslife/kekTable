 /**
 * @fileOverview kekTable
 * @author keke
 */
 /**
 * @description 表格插件 
 * @namespace kekTable
 */
(function($,window,document,undefined){
	'use strict';
    //region   ====================默认配置====================
	/**
	 * @var {string} [kekTable~_pluginName='kekTable'] - 插件名称
	 */
	var _pluginName='kekTable',
    /**
     * @namespace kekTable~_options
     * @desc 默认配置参数
     */
		_options={
			/**
			 * @var {?string} [kekTable~_options#title=''] - 表格标题
			 */
			title:'',
            /**
             * @summary 面板的颜色
             * @desc bootstrap的panel样式：'panel-primary'(深蓝)、'panel-success'(浅绿)、'panel-info'(浅蓝)、'panel-warning'(浅黄)、'panel-danger'(浅灰)、'panel-default'(浅灰)
             * @var {?string} [kekTable~_options#panelColor='panel-primary']
             */
            panelColor:'panel-primary',
            /**
             * @summary 表格总宽度。
             * @desc .kekTable-listPanel的width样式，要加單位，冻结情况下确保和字段总宽度一样。'100%'、'auto'(colgroup的和+3)
             * @var {?string} [kekTable~_options#tableWidth='100%']
             */
            tableWidth:'100%',
            /**
             * @var {?string} [kekTable~options#editDialogWidth='600px'] - 編輯框的寬度
             */
            editDialogWidth:null,
            /**
             * @var {?string} [kekTable~options#sortDialogWidth='600px'] - 排序框的寬度
             */
            sortDialogWidth:null,
            /**
             * @var {?string} [kekTable~options#searchDialogWidth='600px'] - 查询框的寬度
             */
            searchDialogWidth:null,
			/**
			 * @var {?bool} [kekTable~_options#showPaging=true]
             * @summary 是否显示分页
             * @desc false将查询出所有的记录
			 */
			showPaging:true,
            /**
             * @var {?int} [kekTable~options#rowNum=20]
             * @summary 行数
             * @desc 显示多少行记录。设为1的话，采用单记录显示方式
             */
            rowNum:20,
            /**
             * @var {?int} [kekTable~options#frozenNum=null]
             * @summary 冻结字段数
             * @desc 冻结前几列,1起始(无论是否开启序号列)。如果为0则冻结序号列
             */
            frozenNum:null,
            /**
             * @var {?bool} [kekTable~options#showRowNo=false] - 是否显示行号
             */
            showRowNo:false,
			/**
			 * @var {?bool} [kekTable~_options#autoLoad=true] - 初始化后是否自动读取数据
			 */
			autoLoad:true,
			/**
			 * @var {?number} [kekTable~_options#loadingDelay=500]
             * @summary 延时时间
             * @desc 显示加载遮罩的延时时间，单位毫秒
			 */
			loadingDelay:500,
			/**
			 * @var {?bool} [kekTable~_options#canRowHover=true]
             * @summary 是否启用鼠标悬停
             * @desc 鼠标hover的样式。冻结型表格会影响性能
			 */
			canRowHover:true,
			/**
			 * @var {?bool} [kekTable~_options#isCollapse=false]
             * @summary 表格是否可以折叠
             * @desc bootstrap的collapse
			 */
			isCollapse:false,
			/**
			 * @var {?bool} [kekTable~_options#collapseExpanded=true]
             * @summary 表格是否默认展开
             * @desc bootstrap的collapse的aria-expanded属性
			 */
			collapseExpanded:true,
			/**
			 * @namespace __toolbarItem
			 * @desc 工具栏按钮
			 */
			/**
			 * @var {!string} __toolbarItem#id - id标识(必需)
			 */
			/**
			 * @var {string} __toolbarItem#icon - 图标,bootstrap的glyphicon样式
			 */
			/**
			 * @var {string} __toolbarItem#label - 按钮上的文字
			 */
			/**
			 * @var {string} __toolbarItem#title - 按钮上的提示文字title
			 */
			/**
			 * @function __toolbarItem#action
			 * @desc 点击按钮执行的自定义操作
			 * @param {Plugin~_deferredObject} object - 当前页的值
             * @param {$.Deferred} deferred - 延时对象。函数中必需执行deferred.resolve()、deferred.reject()
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
			 * @summary 工具条(按顺序显示，需二维数组)
			 * @desc 'refresh'(刷新)、'search'(查询)、'sort'(排序)、'add'(新增)、'edit'(修改)、'delete'(删除)、'export'(导出)
			 * @default [[{id:'refresh'}],[{id:'search'},{id:'sort'}],[{id:'add'},{id:'edit'},{id:'delete'}]]
			 * @var {?Array.<__toolbarItem[]>} kekTable~_options#toolbar
			 * @example 自定义按钮
			 * toolbar=[[{id:'upload',icon:'glyphicon-upload',label:'上传',title:'上传图片',act:function(o,d){ }}]]
			 */
			toolbar:[[{id:'refresh'}],[{id:'search'},{id:'sort'}],[{id:'add'},{id:'edit'},{id:'delete'}]],
			/**
			 * @var {?bool} [kekTable~_options#isDebug=false]
             * @summary 是否调试
             * @desc 调试模式会检查各个参数是否设置正确。ie10+
			 */
			isDebug:false,
			/**
			 * @var {!string} [kekTable~_options#listURL=null]
             * @summary 查询URL(必需)
             * @desc 触发查询Ajax的URL参数
			 */
			listURL:null,
			/**
			 * @var {?string} [kekTable~_options#insertURL=listURL]
             * @summary 新增URL
             * @desc 设为null将调整为listURL
			 */
			insertURL:null,
            /**
             * @var {?string} [kekTable~_options#updateURL=listURL]
             * @summary 更新URL
             * @desc 设为null将调整为listURL
             */
            updateURL:null,
            /**
             * @var {?string} [kekTable~_options#deleteURL=listURL]
             * @summary 删除URL
             * @desc 设为null将调整为listURL
             */
            deleteURL:null,
            /**
             * @var {?string} [kekTable~_options#exportURL=listURL]
             * @summary 汇出URL
             * @desc 设为null将调整为listURL
             */
            exportURL:null,
			/**
			 * @var {!Object.<_column>} [kekTable~_options#columns=null] - 字段配置(必需)
			 */
			columns:null,
			/**
			 * @var {?Array.<Array.<int>>} [kekTable~options#tableRelations=null] - 多表间的关联(二维数组(后台数据库字段下标))
			 * @example 后台下标1字段=后台下标4字段
			 * tableRelations:[[1,4,0]]
             * @example 后台下标1字段=后台下标4字段(+)
             * tableRelations:[[1,4,1]]
			 */
			tableRelations:null,
			/**
			 * @var {?string} [kekTable~options#detailTable=null] - 从表id
			 */
			detailTable:null,
			/**
			 * @var {?string} [kekTable~options#detailTable=null]
             * @summary 主表id
             * @desc 绘制主从表界面，要求先初始化主表。
			 */
			masterTable:null,
			/**
			 * @summary 主表修改删除时，从表的联级操作类型
			 * @var {?string} [kekTable~options#foreignType=default]
             * @desc 'default'(按照数据库)、'cascade'(联级修改从表)、'restrict'(从表有资料禁止修改)
			 */
			foreignType:'default',
			/**
			 * @var {?Array.<Array>} [kekTable~options#defaultSearch=null] - 初始的查询条件。
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
			defaultSearch:null,
			/**
			 * @var {?Array.<Array>} [kekTable~options#defaultSort=null] - 初始的排序条件。
			 * @example 排序条件
			 * defaultSort = [
			 * 		['empNo','ASC','NULLS FIRST'],
			 * 		['empName','DESC','NULLS LAST']
			 * ]
			 */
			defaultSort:null,
            /**
             * @var {?Array.<int>} [kekTable~options#defaultInsertCols=null]
             * @summary 新增初始字段
             * @desc 新增数据时有初始值的栏位(后台Cols下标)，如果在columns.editIndex中定义了该字段，此设置将无效
             */
            defaultInsertCols:null,
            /**
             * @var {?Array.<object>} [kekTable~options#defaultInsertVals=null]
             * @summary 新增初始值
             * @desc defaultInsertCols对应的值。特殊字符为['KEKSYSDATEKEK'(DB的系统时间),'KEKUSERIDKEK'(Session用户ID)]
             */
            defaultInsertVals:null,
            /**
             * @var {?Array.<int>} [kekTable~options#defaultUpdateCols=null]
             * @summary 更新初始字段
             * @desc 更新数据时有初始值的栏位(后台Cols下标)，如果在columns.editIndex中定义了该字段，此设置无效
             */
            defaultUpdateCols:null,
            /**
             * @var {?Array.<object>} [kekTable~options#defaultUpdateVals=null]
             * @summary 更新初始值
             * @desc defaultUpdateCols对应的值。特殊字符为['KEKSYSDATEKEK'(DB的系统时间),'KEKUSERIDKEK'(Session用户ID)]
             */
            defaultUpdateVals:null,
			/**
			 * @function kekTable~options#beforeRefresh
			 * @desc 点击刷新按钮，刷新数据之前。必需要写d.resolve()或者d.reject()
			 * @param {Plugin~_deferredObject} object - 当前页上的值
			 * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
			 */
			beforeRefresh:null,
			/**
			 * @function kekTable~options#afterRefresh
			 * @desc 点击刷新按钮，刷新数据之后。必需要写d.resolve()或者d.reject()
             * @param {Plugin~_deferredObject} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             * @example 没有查询出数据
             * afterRefresh:function(object,deferred){
             *      if(!curPageRecords.length)
             *          deferred.resolve('没有查询到任何数据');
             * }
			 */
			afterRefresh:null,
			/**
			 * @function kekTable~options#beforeEdit
			 * @desc 点击修改按钮，数据填入编辑框之前。可以在这里改变editRecord(editRecordRef)的值
             * @param {Plugin~_deferredObjectRef} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             * @example 修改数据呈现前取得员工姓名，类D2K的post-change
             * beforeEdit:function(object,deferred){
             *      $.post('getEmpName.ashx',{empNo:object.editRecordRef.empNo}).done(function(res){
             *          object.editRecordRef.empName=res;
             *      }).always(function(){
             *          deferred.resolve();
             *      });
             * }
			 */
			beforeEdit:null,
            /**
             * @function kekTable~options#afterEdit
             * @desc 点击修改按钮，数据填入编辑框之后，显示编辑框之前。
             * @param {Plugin~_deferredObject} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             * @example 不允许修改
             * afterEdit:function(object,deferred){
             *      if(object.curRecord.empNo='99999')
             *          d.reject('不允许修改');
             *      else
             *          d.resolve();
             * }
             */
            afterEdit:null,
            /**
             * @function kekTable~options#beforeAdd
             * @desc 点击新增按钮，数据填入编辑框之前。可以在这里改变editRecord(editRecordRef)的值
             * @param {Plugin~_deferredObjectRef} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             * @example 设置新增时的初始值
             * beforeAdd:function(object,deferred){
             *      object.editRecordRef.inStock='Y';
             *      deferred.resolve();
             * }
             */
            beforeAdd:null,
            /**
             * @function kekTable~options#afterAdd
             * @desc 点击新增按钮，数据填入编辑框之后，显示编辑框之前。
             * @param {Plugin~_deferredObject} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             * @example 不允许新增
             * afterAdd:function(object,deferred){
             *      deferred.reject('不允许新增');
             * }
             */
            afterAdd:null,
            /**
             * @function kekTable~options#beforeDelete
             * @desc 点击删除按钮，显示删除确认框之前
             * @param {Plugin~_deferredObject} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             * @example 不允许删除
             * beforeDelete:function(object,deferred){
             *      if(object.curRecord.inStock='Y')
             *          deferred.reject('已入库不允许删除');
             *      else
             *          deferred.resolve();
             * }
             */
            beforeDelete:null,
            /**
             * @function kekTable~options#afterDelete
             * @desc 点击删除按钮，显示删除确认框之后
             * @param {Plugin~_deferredObject} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             */
            afterDelete:null,
            /**
             * @function kekTable~options#beforeExport
             * @desc 点击汇出按钮，显示汇出选项框之前
             * @param {Plugin~_deferredObject} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             */
            beforeExport:null,
            /**
             * @function kekTable~options#afterExport
             * @desc 点击汇出按钮，显示汇出选项框之后
             * @param {Plugin~_deferredObject} object - 当前页上的值
             * @param {$.Deferred} deferred - d.reject()将停止事件,d.resolve()将继续执行。
             */
            afterExport:null
		},
		/**
		 * @namespace _column
		 * @desc 配置columns中的项
		 */
		_column={
			/**
			 * @var {?int} [_column#tableId=null]
             * @summary 后台Tables的下标
             * @desc 该字段所属的表，不设置代表该栏位非数据库字段
			 */
			tableId:null,
			/**
			 * @var {?int} [_column#colId=null]
             * @summary 后台Cols的下标
             * @desc 不设置代表该栏位非数据库字段
			 */
			colId:null,
            /**
             * @var {?bool} [_column#isKey=null]
             * @summary 是否为主键字段
             * @desc 用于修改删除。如果table中没有主键，请设置ROWID字段。一个插件实例只能同时更新一个table的数据
             */
            isKey:null,
            /**
             * @var {?bool} [_column#isRequire=null]
             * @summary 是否为必要字段
             */
            isRequire:null,
            /**
             * @var {?string} [_column#colType=null]
             * @desc 用于验证资料的有效性，包括：null(文本)、'number'、'date'(YYYY/MM/DD)、'datetime'(YYYY/MM/DD HH24:MI:SS)
             * @summary 字段的数据类型
             */
            colType:null,
            /**
             * @var {?string} [_column#colLength=null]
             * @summary 字段的数据长度
             * @desc null表示无限制，('3.2'代表3位整数，2位小数)。
             */
            colLength:null,
            /**
             * @var {?bool} [_column#isByte=true]
             * @summary 是否按byte计数
             * @desc 字段的长度按byte计算,false将按char计算
             */
            isByte:true,
            /**
             * @var {?bool} [_column#chBytes=2] - 中文占的字节数
             */
            chBytes:2,
			/**
			 * @var {?int} [_column#listIndex=null]
             * @summary 显示顺序
             * @desc 设置后此字段会显示于<table>中。显示顺序按值从小到大，不同字段不可设置重复的值
			 */
			listIndex:null,
			/**
			 * @var {?string} [_column#listTitle=null]
             * @summary 显示名称
             * @desc 字段的描述名称<thead>。null将被调整为colName。如果不需要显示listTitle请设置为''
			 */
			listTitle:null,
			/**
			 * @var {?int} [_column#listWidth=null]
             * @summary 显示宽度
             * @desc <colgroup>.<col>的width属性，可带单位。纯数字会自动添加单位px
			 */
			listWidth:null,
			/**
			 * @var {?bool} [_column#listInline=false]
             * @summary 是否行内显示
             * @desc 单笔记录显示模式时，此栏位是否和前一个栏位在同一行显示
			 */
			listInline:false,
            /**
             * @var {?Object} [_column#listList=null]
             * @summary 显示键值对
             * @desc 数据显示的时候将值转化为显示文字，固定列表，不提供Ajax用法。和editList类似
             */
            listList:null,
			/**
			 * @var {?bool} [_column#canFilter=null]
             * @summary 是否可筛选
             * @desc 该字段是否出现在查询框的字段列表中。只对数据库字段有效
			 */
			canFilter:null,
			/**
			 * @var {?bool} [_column#canSort=true]
             * @summary 是否可排序
             * @desc 该字段是否出现在排序框的字段列表中。只对数据库字段有效
			 */
			canSort:null,
			/**
			 * @var {?string} [_column#editTitle=__column#listTitle]
             * @summary 编辑名称
             * @desc 编辑框中字段上面的标题。null将被调整为listTitle。不显示编辑名称请设置为''
			 */
			editTitle:null,
			/**
			 * @var {?bool} [_column#editDisplay='block'] - 'block'(单独一行)、'inline'(与前一个栏位同一行)、'cling'(紧贴前一个栏位)
			 * @summary 编辑字段的显示方式
			 */
			editDisplay:'block',
			/**
			 * @var {?int} [_column#editIndex=null]
             * @summary 编辑顺序
             * @desc 设置后此字段会显示在编辑框中，编辑框的栏位顺序按值从小到大
			 */
			editIndex:null,
			/**
			 * @var {?int} [_column#editWidth=100]
             * @summary 编辑宽度
             * @desc 该字段在编辑框中的width属性，可带单位。纯数字会自动添加单位px
			 */
			editWidth:100,
			/**
			 * @var {?string} [_column#editPlaceholder=null]
             * @summary 编辑占位
             * @desc 该字段的placeholder属性
			 */
			editPlaceholder:null,
			/**
			 * @var {?string} [_column#editType=null] - ''(text)、'list'(下拉框插件)、'lov(下拉表格插件)'、'textarea'
			 * @summary 编辑字段的类型
			 */
			editType:null,
            /**
             * @var {?string} [_column#editAttr=null]
             * @desc null(正常默认，回传)、'readonly'(只读，回传)、'hidden'(隐藏，回传)、'disabled'(只读，不回传)
             * @summary 编辑框栏位的特性
             */
            editAttr:null,
			/**
			 * @var {?string} [_column#lovCols=null]
             * @desc 下拉表格中的字段名(.kekTable-lov下的thead)。如果字段名是columns中的字段名，会联动修改editRecord字段的值，否则只用于普通显示
             * @summary lov字段名
			 * @example empNo下拉框
			 * lovCols:['empNo','员工姓名'] //empNo为columns.empNo,选取后会修改editRecord.empNo。'员工姓名'只是普通的显示
			 */
			lovCols:null,
			/**
			 * @function _column#editList
             * @summary 下拉选项
			 * @desc list、lov类型的下拉选项。必需要写d.resolve('列表')或者d.reject('异常提示')。list类型请返回对象{值:文字}，lov类型请返回数组[[值,文字],[值,文字],[值,文字]]
			 * @param {{curRecord,editRecord}} object - 该行的数据
			 * @param {$.Deferred} deferred - deferred对象,d.reject()将停止事件,d.resolve()将继续执行。
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
			editList:null,
			///**
			// * @var {?bool} [_column#editPost=true] - 编辑框栏位是否更新至数据库
			// */
			//editPost:null,
			///**
			// * var {?string} [_column#colFormat=null] - 栏位遮罩(暂只有date类型，需引用datetimepicker.js),具体参照php date format。("Y/m/d H:i")
			// */
			//colFormat:null,
			/**
			 * @summary 栏位聚合
			 * @var {?string} [_column#colTotalSummary=null]
             * @desc 聚合所有的数据，非单页的数据。'SUM'(求和)、'COUNT'(计数)、'AVG'(平均)、'MAX'(最大)、'MIN'(最小)、'STDDEV'(标准差)、'VARIANCE'(协方差)、'MEDIAN'(中间数)
			 */
			colTotalSummary:null,
			/**
			 * @var {?bool} [_column#colTotalAll=true]
             * @summary 聚合所有值
             * @desc oracle中聚合函数的DISTINCT、ALL
			 */
			colTotalAll:true,
			/**
			 * @var {?int} [_column#detailKeyId=null] - 主表中设置此项。关联从表的字段(后台字段数组下标)
			 */
			detailKeyId:null,
			/**
			 * @function _column#beforeGetValue
			 * @desc 查询出数据之后，显示数据之前的自定义操作。所有字段都可以有此回调，非数据库字段可当作临时字段。必需要写d.resolve('将要显示的文字或HTML，非数据库栏位将保存text至curPageRecords中')或者d.reject()
			 * @param {Plugin~_deferredObject} object - 页面上的数据
			 * @param {$.Deferred} deferred - deferred对象,d.reject()将停止事件,d.resolve()将继续执行。
			 * @example ajax显示员工姓名(写在empName字段中)
			 * beforeGetValue:function(object,deferred){
			 *      $.post('getEmpName.ashx',{empNo:object.curRecord.empNo})
			 *       .done(function(res){
			 *          d.resolve(res.EmpName);
			 *       })
			 *       .fail(function(){
			 *          d.reject();
			 *       });
			 * }
			 * @example 按 工号+姓名 显示
			 * beforeGetValue:function(object,deferred){
	 		 * 		d.resolve(object.curRecord.empNo+' - '+object.curRecord.empName);
			 * }
			 */
			beforeGetValue:null,
			/**
			 * @function _column#afterChange
			 * @desc 编辑框中的字段改变值以后发生的操作。必需要写d.resolve('将要填入的值')或者d.reject('错误框提示文字')
			 * @param {Plugin~_deferredObject} object - 页面上的数据
			 * @param {$.Deferred} deferred - deferred对象,d.reject()将停止事件,d.resolve()将继续执行。
			 * @return [['empNo','11111'],['empName','xxxxx']] - 将要连动更改的栏位和值。
             * @example ajax编辑框显示员工姓名
             * //写在empNo字段中
             * afterChange:function(object,deferred){
             *      deferred.resolve();
             *      return [['empName','']];
             * }
             * //写在empName字段中
             * afterChange:function(object,deferred){
             *      $.post('getEmpName.ashx',{empNo:object.editRecord.empNo})
             *       .done(function(res){
             *          deferred.resolve(res.EmpName);
             *       })
             *       .fail(function(res){
             *          deferred.reject(res.Message);
             *       });
             * }
			 */
			afterChange:null
			
		};
	//endregion====================默认配置====================
	//region   =====================JS扩展=====================
	//ie bind
	if (!Function.prototype.bind) {
        Function.prototype.bind = function (obj) {
            var _self = this;
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                _self.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
            }
        }
    }
    /**
     * @function jQuery~_whenAll
     * @desc $.Deferred扩展。类似于$.when，详细请参阅jQuery的Deferred使用说明。区别:whenAll将等待所有deferred执行完毕
     * @param subordinate 保存$.Deferred实例的数组
     * @returns {$.Deferred.promise}
     * @example
     * $.whenAll.apply($,defArr);
     * $.whenAll(defArr);
     */
	$.whenAll=function(subordinate) {
		var i = 0,fails,
			slice=Array.prototype.slice,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,
			remaining = length !== 1 || ( subordinate && $.isFunction( subordinate.promise ) ) ? length : 0,
			deferred = remaining === 1 ? subordinate : $.Deferred(),
			updateFunc = function( i, contexts, values,isDone ) {
				!isDone && fails++;
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},
			progressValues, progressContexts, resolveContexts;
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && $.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues,true ) )
						.fail( updateFunc( i, resolveContexts, resolveValues,false ) )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}
		if ( !remaining )
			fails?deferred.reject():deferred.resolveWith( resolveContexts, resolveValues );
		return deferred.promise();
	};
	//endregion=====================JS扩展=====================
	//region   ====================构造函数====================
	/**
	 * @constructor Plugin
	 * @param {jQuery} element - jQuery对象
	 * @param {kekTable~_options} options - 插件的配置参数
	 */
	function Plugin(element,options){
		/**
		 * @name Plugin~_element
		 * @desc 插件的id
		 * @type {string} 
		 */
		this._element=element;
		/**
		 * @namespace _elements
		 * @desc 内部的jQuery对象
		 */
		this._elements={
			/**
			 * @var {jQuery} _elements#$plugin_panel - Plugin->panel
			 */
			$plugin_panel:null,
			/**
			 * @var {jQuery} _elements#$loading - 表格loading遮罩
			 */
			$loading:null,
			/**
			 * @var {jQuery} _elements#$editLoading - 修改框loading遮罩
			 */
			$editLoading:null,
			/**
			 * @var {jQuery} _elements#$alert - 提示框
			 */
			$alert:null,
			/**
			 * @var {jQuery} _elements#$state - 状态栏
			 */
			$state:null,
			/**
			 * @var {jQuery} _elements#$paging - 分页ul
			 */
			$paging:null,
			/**
			 * @typedef _elements#search - 查询框
			 * @prop {jQuery} [$dialog=null] - 查询框
             * @prop {jQuery} [$block=null] - 条件区域
			 * @prop {jQuery} [$col=null] - 字段
			 * @prop {jQuery} [$operator=null] - 关系运算符
			 * @prop {jQuery} [$bool=null] - 逻辑运算符
			 * @prop {jQuery} [$control=null] - 功能项
			 */
			search:{
//				$dialog:null,
//				$block:null,
//				$col:null,
//				$operator:null,
//				$bool:null,
//				$control:null,
//              $alert
			},
            /**
             * @typedef _elements#edit - 编辑框
             * @prop {jQuery} [$dialog=null] - 编辑框
             * @prop {jQuery} [$block=null] - 字段区域
             * @prop {jQuery} [$list=null] - list类型字段的选项列表
             * @prop {jQuery} [$lov=null] - lov类型字段的选项列表
             */
			edit:{
//				$dialog:null,
//				$block:null,
//				$list:null,
//				$lov:null,
//              $alert:null
			},
            /**
             * @typedef _elements#sort - 排序框
             * @prop {jQuery} [$dialog=null] - 排序框
             * @prop {jQuery} [$block=null] - 排序区域
             * @prop {jQuery} [$ctrl=null] - 排序条件设定区
             */
			sort:{
//				$dialog:null,
//				$block:null,
//				$ctrl:null
			}
		};
		/**
		 * @name Plugin~_options
		 * @desc 插件的配置参数
		 * @type {kekTable~_options}
		 */
		this._options=$.extend({}, _options,options);
		/**
		 * @name Plugin~_pluginName
		 * @desc 插件名称
		 * @type {kekTable~_pluginName}
		 */
		this._pluginName=_pluginName;
		/**
		 * @name Plugin~_colEntity
		 * @desc 字段实体类(curPageRecords[0]=new _colEntity())
		 */
		this._colEntity=null;
		/**
		 * @typedef Plugin~_hasTool
		 * @desc 内建功能是否开启
		 */
		this._hasTool={
			'search':null,
			'edit':null,
			'add':null,
			'refresh':null,
			'sort':null,
			'delete':null,
			'export':null
		};
		//显示loading用的setTimeout返回值
		this._loadingDelay=null;
		//当前画面上显示的是哪个遮罩'list'、'edit'
		this._curLoading=null;
        //columns设置里面用到了哪些tableId
		this._tablesId=[];
        //主键栏位
        this._keyCols=[];
		//显示栏位['empNo','empName']
		this._listCols=[];
		//编辑栏位
		this._editCols=[];
		//数据库栏位['empNo','empName']
		this._dbCols=[];
		//合计栏位
		this._summaryCols=[];
		//当前页码
		this._currentPageNo=1;
		//当前页面上的所有数据(所有columns)，已转换为colEntity类
		this._curPageRecords=[];
		//当前选中的行号，起始1
		this._curRecordNo=null;
		//表格狀態，一般為__toolbarIte.id
		this._tableStatus=null;
        //新增、修改的数据
        this._editRecord=null;
		//排序条件
		this._sortConditions=null;
		//查询条件
		this._searchConditions=null;
		
		this._init();
		this._registEvents();
		
	}
    //endregion====================构造函数====================
    //region   ======================原型======================
    /**
	 * @augments Plugin
	 */
	Plugin.prototype={
		//内部方法
        //region   =====================初始化=====================
		//插件初始化 this=Plugin
		_init:function(){
            var that=this;
			this._adjustOptions();
			if(this._options.isDebug)
				this._debug();
			this._createPlugin();
            if(this._options.autoLoad){
                this._deferredsFlow(
                    [this._createDeferred(this._loadData,null)],
                    null,
                    function(v){
                        that._showState(v?v:$[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail,'danger');
                    },
                    function(v){
                        that._hideLoading();
                    }
                );
            }
			this._tableStatus='init';
		},
        //初始化时调整参数
        _adjustOptions:function(){
            var opt=this._options,
                that=this,
                vKeyTable;
            //hasTool
            if(opt.toolbar) {
                $.each(opt.toolbar, function (i, toolGroup) {
                    $.each(toolGroup, function (j, tool) {
                        if ($.inArray(tool.id, ['refresh', 'search', 'sort', 'add', 'edit', 'delete', 'export']) !== -1)
                            that._hasTool[tool.id] = true;
                    });
                });
            }
            //editDialogWidth
            if((this._hasTool['add'] || this._hasTool['edit']) && opt.editDialogWidth==null)
                opt.editDialogWidth='600px';
            //sortDialogWidth
            if(this._hasTool['sort'] && opt.sortDialogWidth==null)
                opt.sortDialogWidth='600px';
            //searchDialogWidth
            if(this._hasTool['search'] && opt.searchDialogWidth==null)
                opt.searchDialogWidth='600px';
            //tableWidth
            if(opt.tableWidth!=null)
                (opt.tableWidth-0==opt.tableWidth-0) && (opt.tableWidth-0) && (opt.tableWidth+='px');


            //产生column类
            eval((function(){
                var str='that._colEntity=function(){';
                $.each(opt.columns, function(colName,colObj) {
                    str=str+'this.'+colName+'=null;';
                });
                return str+'}'})());
            //URL
            if(that._hasTool['add'] && opt.insertURL==null)
                opt.insertURL=opt.listURL;
            if(that._hasTool['edit'] && opt.updateURL==null)
                opt.updateURL=opt.listURL;
            if(that._hasTool['delete'] && opt.deleteURL==null)
                opt.deleteURL=opt.listURL;
            //columns
            $.each(opt.columns,function(colName,colObj){
                colObj=$.extend(true,{},_column, colObj);
                $.each(colObj, function(prop,val) {
                    //this._listCols: 最终产生['empNo',undefined,'empName']，后面会将undefined去掉
                    if(prop==='listIndex' && val != null){
                        if(that._listCols[val])
                            throw colName+' 有重复的listIndex';
                        that._listCols[val]=colName;
                    }
                    //column.listTitle: null值初始化为colName
                    else if(prop==='listTitle' && val==null)
                        colObj[prop]=colName;
                    //this._tablesId: 整理所用到的tableId
                    else if(prop==='tableId' && val != null){
                        if($.inArray(val,that._tablesId)===-1)
                            that._tablesId.push(val);
                    }
                    //this._editCols，column.editTitle
                    else if(prop==='editIndex' && val != null){
                        //this._editCols: 最终产生['empNo',undefined,'empName']，后面会将undefined去掉
                        if(that._editCols[val])
                            throw colName+'有重复的editIndex';
                        that._editCols[val]=colName;
                        //column.editTitle: ''值将初始化为listTitle或'&nbsp;'。不设置'&nbsp;'的话，编辑框的字段会向上移位
                        if(colObj.editTitle !=null){
                            if(!$.trim(colObj.editTitle))
                                colObj.editTitle='&nbsp;';
                        }
                        else
                            colObj.editTitle=colObj.listTitle || '&nbsp;';
                    }
                    //this._dbCols: 最终产生['empNo',undefined,'empName']，后面会将undefined去掉
                    else if(prop==='colId' && val != null){
                        if(that._dbCols[val])
                            throw colName+'有重复的colId';
                        that._dbCols[val]=colName;
                    }
                    //this._keyCols: 最终产生['empNo','empName']
                    else if(prop==='isKey' && val == true){
                        if(vKeyTable==null)
                            vKeyTable=colObj.tableId;
                        else if(vKeyTable!=colObj.tableId)
                            throw colName+' 字段中的主键设置涉及到不同的表';
                        that._keyCols.push(colName);
                    }
//		      		else if(prop==='colType' && val != null){
//		      			if(colObj[prop]==='date' && colObj.colFormat==null)
//		      				colObj.colFormat='Y/m/d';
//		      		}
                    //column.listWidth，column.editWidth 默认为100px
                    else if(((prop==='listWidth' && colObj.listIndex!=null ) || (prop==='editWidth' && colObj.editIndex!=null))){
                        if(val==null)
                            val=100;
                        (val-0==val-0) && (val-0) && (colObj[prop]=val+'px');
                    }
                    //this._summaryCols: 最终产生['empNo','empName']
                    else if(prop==='colTotalSummary' && val != null)
                        that._summaryCols.push(colName);
                    //column.canSort: 数据库字段 且 显示字段，初始化为true
                    else if(prop==='canSort'){
                        if(that._hasTool.sort && val==null){
                            if(colObj.colId != null && colObj.listIndex != null)
                                colObj[prop]=true;
                        }
                    }
                    //column.canFilter: 数据库字段，初始化为true
                    else if(prop==='canFilter'){
                        if(that._hasTool.search && val==null && colObj.colId != null)
                            colObj[prop]=true;
                    }
                    //something...
                });
                //something...
                opt.columns[colName]=colObj;
            });
            //去掉数组中的undefined
            this._listCols=$.map(this._listCols, function(v) {return v;});
            this._dbCols=$.map(this._dbCols, function(v) {return v;});
            this._editCols=$.map(this._editCols, function(v) {return v;});
            //第一个编辑字段初始化为 'block'
            this._editCols.length && (opt.columns[this._editCols[0]].editDisplay='block');
            //sortConditions
            this._sortConditions=opt.defaultSort || [];
            //searchConditions
            this._searchConditions=opt.defaultSearch || [];
        },
		//检核参数配置
		_debug:function(){
			var opt=this._options,
				that=this,
                totListWidth=0;
			//panelColor
			if($.inArray(opt.panelColor,['panel-primary','panel-success','panel-info','panel-warning','panel-danger','panel-default'])===-1)
				console.warn('panelColor非内建值，当然你可以使用自定义的css');
			//tableWidth
			if(!/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.tableWidth))
				throw 'tableWidth请使用正确的宽度单位';
			if(opt.tableWidth=='100%' && opt.frozenNum!=null)
				console.warn('frozen表格请确保在画面上为固定宽度，否则屏幕过长后会导致非冻结栏位溢出');
			//editDialogWidth
			if(!/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.editDialogWidth))
				throw 'editDialogWidth请使用正确的宽度单位';
			//sortDialogWidth
			if(!/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.sortDialogWidth))
				throw 'sortDialogWidth请使用正确的宽度单位';
			//searchDialogWidth
			if(!/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.searchDialogWidth))
				throw 'searchDialogWidth请使用正确的宽度单位';
            //rowNum
            if(!opt.rowNum)
                throw 'rowNum必需大于0。否则你需要这个表来做什么';
            //单笔显示
            else if(opt.rowNum===1){
                if(opt.frozenNum!=null)
                    console.warn('rowNum设置为1代表是单笔显示模式，此模式下没有冻结功能，你可以去掉frozenNum');
                if(opt.showRowNo)
                    console.warn('rowNum设置为1代表是单笔显示模式，此模式下没有序号列，你可以去掉showRowNo');
            }
            //冻结
            if(!opt.showRowNo && opt.frozenNum===0)
                console.warn('frozenNum=0代表冻结行号，但是你并没有显示行号');
			//toolbar
			if(!opt.toolbar || opt.toolbar.length===0)
				console.log('未开启工具栏');
			else{
				if($.type(opt.toolbar)!=='array')
					throw 'toolbar必需是数组';
				for(var i=0,j=opt.toolbar.length;i<j;i++){
					if($.type(opt.toolbar[i])!=='array')
						throw 'toolbar按钮组必需是数组';
					for(var m=0,n=opt.toolbar[i].length;m<n;m++){
						if($.inArray(opt.toolbar[i][m].id,['refresh','search','sort','add','edit','delete','export'])===-1){
							if(!opt.toolbar[i][m].id || $.type(opt.toolbar[i][m].id)!=='string')
								throw 'toolbar.id必需要有(string类型)';
							if(opt.toolbar[i][m].icon && $.type(opt.toolbar[i][m].icon)!=='string')
								throw 'toolbar.icon必需是string类型';
							if(opt.toolbar[i][m].label && $.type(opt.toolbar[i][m].label)!=='string')
								throw 'toolbar.label必需是string类型';
							if(opt.toolbar[i][m].title && $.type(opt.toolbar[i][m].title)!=='string')
								throw 'toolbar.title必需是string类型';
							if(opt.toolbar[i][m].action && $.type(opt.toolbar[i][m].action)!=='function')
								throw 'toolbar.action必需是function类型';
							if(!opt.toolbar[i][m].icon && !opt.toolbar[i][m].label)
								console.warn(opt.toolbar[i][m].id+'按钮没有icon也没有label');
							if(!opt.toolbar[i][m].action)
								throw 'toolbar.'+opt.toolbar[i][m].id+'没有action';
						}
						else{
							if(opt.toolbar[i][m].action || opt.toolbar[i][m].icon || opt.toolbar[i][m].title)
								console.warn(opt.toolbar[i][m].id+'内建按钮无法改变其action,label,title');
						}
					}
				}
			}
            //URL
            if(!opt.listURL)
                throw '没有listURL';
            if(this._hasTool['add'] && opt.insertURL==null)
                throw '没有insertURL';
            if(this._hasTool['edit'] && opt.updateURL==null)
                throw '没有updateURL';
            if(this._hasTool['delete'] && opt.deleteURL==null)
                throw '没有deleteURL';
            //columns
            if(!opt.columns)
                throw '必需设置columns';
            else if($.type(opt.columns)!=='object')
                throw 'columns必需是object类型';
            //tableRelations
            if(this._tablesId.length>1){
                if(opt.tableRelations==null || opt.tableRelations.length==0)
                    console.warn('有多表，却没有设置tableRelations');
                else if($.type(opt.tableRelations)!='array'){
                    throw 'tableRelations必须是数组';
                }
                else{
                    $.each(opt.tableRelations,function(i,relation){
                        if($.type(relation)!='array')
                            throw 'tableRelations必须是二维数组';
                        if(relation.length!==3)
                            throw 'tableRelation数组长度必需为3';
                        if(relation[2]!==0 && relation[2]!==1)
                            throw 'tableRelation数组第三位必需是0,1';
                    });
                }
            }
			//detailTable
			if(opt.detailTable){
				if(!$('#'+opt.detailTable).length)
					throw '没有detailTable的id'+opt.detailTable;
			}
			//defaultSearch
			if(opt.defaultSearch)
				this._checkSearchCondition(opt.defaultSearch);
			if(opt.defaultSort)
				this._checkSortCondition(opt.defaultSort);
			//col
			$.each(opt.columns, function(colName,colObj) {
                if(colObj==null)
                    throw colName+'不能设为Null';
				if(colObj.colId<0 || colObj.listIndex<0 || colObj.editIndex<0 || colObj.tableId<0)
					throw colName+'不能设为负数(colId,listIndex,editIndex,tableId)';
                if((colObj.colId!=null && colObj.tableId==null) || (colObj.colId==null && colObj.tableId!=null))
                    throw colName+'必需同时设置colId，tableId';
                if(colObj.colId==null && colObj.isKey)
                    throw colName+'没有设置colId，代表是非数据库字段，不能设置isKey';
                if(colObj.colType && $.inArray(colObj.colType,['number','date','datetime'])===-1)
                    throw colName+' colType必需是number、date、datetime';
                if(colObj.colLength!=null){
                    if(parseFloat(colObj.colLength).toString()!=colObj.colLength)
                        throw colName+' colLength格式错误';
                }
                if(colObj.listIndex==null){
                    if(colObj.listWidth)
                        console.warn(colName+'没有设置listIndex代表非显示栏位，不用设置listWidth');
                    if(colObj.listTitle && colObj.listTitle!==colName)
                        console.warn(colName+'没有设置listIndex代表非显示栏位，不用设置listTitle');
                }
				if(colObj.listWidth===0)
					console.warn(colName+'的listWidth被设置为0，如果不需要显示，请设置listIndex=null');
                if(colObj.listWidth)
                    totListWidth+=parseInt(colObj.listWidth);
				if(colObj.colId==null && colObj.canFilter)
					console.warn(colName+'没设置colId,代表非数据库栏位，canFilter设置将无效');
				if(!that._hasTool.search && colObj.canFilter)
					console.warn(colName+'没开启查询功能，canFilter设置将无效');
                if(colObj.colId==null && colObj.canSort)
                    console.warn(colName+'没设置colId,代表非数据库栏位，canSort设置将无效');
                if(!that._hasTool.sort&& colObj.canSort)
                    console.warn(colName+'没开启排序功能，canSort设置将无效');
				if(!that._hasTool.edit && !that._hasTool.add){
					if(colObj.editTitle || colObj.editIndex || colObj.editPlaceholder)
						console.warn(colName+'没有开启新增修改功能，不用设置editTitle、editIndex、editPlaceholder、afterChange');
				}
				//editCols
				if(colObj.editDisplay && $.inArray(colObj.editDisplay,['block','inline','cling'])===-1)
					throw colName+' editDisplay只能设置为block,inline,cling';
				if(colObj.editIndex==null && (colObj.afterChange))
					console.warn(colName+'沒有設置editIndex,不用設置afterChange');
                if(colObj.editType!=='lov' && colObj.lovCols)
                    console.warn(colName+'不是lov类型，不用设置lovCols');
                if(colObj.editType!=='lov' && colObj.editType!=='list' && colObj.editList)
                    console.warn(colName+'不是lov、list类型，不用设置editList');
                else if(colObj.editType==='list' && !colObj.listList) {
                    if(!colObj.editList)
                        throw colName + '是list类型，没设置listList、editList';
                    else
                        console.warn(colName + '是list类型，应设置editList');
                }
                //colTotal
                if(colObj.colTotalSummary && $.inArray(colObj.colTotalSummary,['SUM','COUNT','AVG','MAX','MIN','STDDEV','VARIANCE','MEDIAN'])===-1)
                    throw colName+' colTotalSummary只能设置为SUM,COUNT,AVG,MAX,MIN,STDDEV,VARIANCE,MEDIAN';
			});
			//col array
			if(!this._listCols.length)
				throw '没有设置任何的listIndex';
			if(!this._dbCols.length)
				throw '没有设置任何的colId';
			if(this._hasTool['add'] && this._hasTool['edit'] && !this._editCols.length)
				console.warn('开启了新增修改功能却没有任何的editIndex');
            if(!this._keyCols.length && (this._hasTool['add'] || this._hasTool['edit'] || this._hasTool['delete']))
                throw '没有设置任何的isKey，如果table没有主键请设置ROWID为主键';
			//editCols
			if(this._editCols.length && opt.columns[this._editCols[0]].editDisplay!=='block')
				console.warn(this._editCols[0]+'只能设置为block');
            //totListWidth
            if(opt.frozenNum !=null && totListWidth<parseInt(opt.tableWidth))
                throw '字段总宽度'+totListWidth+'小于表宽度'+opt.tableWidth+'，冻结情况下会产生单元格对齐问题。你不需要开启冻结';
		},
		//检核查询条件
		_checkSearchCondition:function(arr){
			var that=this,opt=this._options;
			if($.type(arr)!=='array')
				throw '_searchConditions项必需是数组';
			$.each(arr, function(i,condition) {
				if($.type(condition)!=='array')
					throw '_searchConditions子项必需是数组';
				var len=condition.length;
				if(i){
					if($.inArray(condition[0],['AND','OR'])===-1)
						throw '_searchConditions非第一个子项的第一个值必须是AND、OR';
					if($.inArray(len,[2,3,4])===-1)
						throw '_searchConditions非第一个子项只能有2，3，4个值';
					//['AND',[]]
					if(len===2)
						that._checkSearchCondition(condition[1]);
					//['AND','empNo','IS NOT NULL']
					else{
						if(opt.columns[condition[1]]==null || opt.columns[condition[1]].colId==null)
							throw '_searchConditions:columns设置中没有'+condition[1]+'栏位，或没有设置colId';
						if($.inArray(condition[2],['eq','gt','lt','ge','le','ne','beg','end','like','isnull','notnull'])===-1)
							throw '3,4个值的_searchConditions子项的第三个值必需是eq、gt、lt、ge、le、ne、beg、end、like、isnull、notnull';
						if($.inArray(condition[2],['isnull','notnull'])!==-1 && condition[3] != null)
							throw '_searchConditions子项的关系符为isnull、notnull，不用设置第四个值';
						else if($.inArray(condition[2],['isnull','notnull'])===-1 && condition[3] == null)
							throw '_searchConditions子项的关系符不为isnull、notnull，必需设置第四个值';
					}
				}
				else{
					if($.inArray(len,[2,3])===-1)
						throw '_searchConditions第一个子项只能有2，3个值';
					if(opt.columns[condition[0]]==null || opt.columns[condition[0]].colId==null)
						throw '_searchConditions:columns设置中没有'+condition[0]+'栏位，或没有设置colId';
					if($.inArray(condition[1],['eq','gt','lt','ge','le','ne','beg','end','like','isnull','notnull'])===-1)
						throw '_searchConditions子项的第2个值必需是eq、gt、lt、ge、le、ne、beg、end、like、isnull、notnull';
					if($.inArray(condition[1],['isnull','notnull'])!==-1 && condition[2] != null)
						throw '_searchConditions子项的关系符为isnull、notnull，不用设置第3个值';
					else if($.inArray(condition[1],['isnull','notnull'])===-1 && condition[2] == null)
						throw '_searchConditions子项的关系符不为isnull、notnull，必需设置第3个值';
				}
			});
		},
		//檢核排序條件
		_checkSortCondition:function(arr){
			var that=this,opt=this._options;
			if($.type(arr)!=='array')
				throw '_sortConditions项必需是数组';
			$.each(arr, function(i,condition) {
				if($.type(condition)!=='array')
					throw '_sortConditions子项必需是数组';
				if(condition.length!==3)
					throw '_sortConditions子项数组长度必需是3';
				if(opt.columns[condition[0]]==null)
					throw '_sortConditions无此栏位'+condition[0];
				if(opt.columns[condition[0]].colId==null)
					throw '_sortConditions非数据库栏位'+condition[0];
				if(!opt.columns[condition[0]].canSort)
					throw '_sortConditions非排序栏位'+condition[0];
				if($.inArray(condition[1],['ASC','DESC'])===-1)
					throw '_sortConditions第二个值必需是ASC，DESC';
				if($.inArray(condition[2],['NULLS FIRST','NULLS LAST'])===-1)
					throw '_sortConditions第三个值必需是NULLS FIRST，NULLS LAST';
			});
		},

        //endregion=====================初始化=====================
		//region   ====================建立插件====================
		/** Plugin
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
		 */
		_createPlugin:function(){
			var $frag=$(document.createDocumentFragment());
			$frag.append(this._createPlugin_panel())
				 .append(this._createPlugin_loading())
				 .append(this._createPlugin_alert())
				 .append(this._createPlugin_confirm())
				 .append(this._createPlugin_search())
				 .append(this._createPlugin_edit())
				 .append(this._createPlugin_sort());
			$(this._element).addClass('kekTable-listPanel panel-group')
							.css('width',this._options.tableWidth)
							.append($frag);
		},
        //region   ==================Plugin Panel==================
		_createPlugin_panel:function(){
			this._elements.$plugin_panel=$('<div>');
			var $el=this._elements.$plugin_panel;
			$el.addClass('panel '+this._options.panelColor)
			  .append(this._createPanel_head())
			  .append(this._createPanel_collapse());
			return $el;
		},
        //region   ===================Panel Head===================
		_createPanel_head:function(){
			var $el=$('<div>');
			$el.addClass('panel-heading');
			//展开
			if(this._options.isCollapse)
				$el.attr({
					'data-toggle':'collapse',
					'data-target':'#'+this._element.id+'CollapseGroup'
				}).append('<h5 class="glyphicon glyphicon-chevron-down pull-right"></h5>');
			$el.append($('<h3 class="pull-left">'+this._options.title+'</h3>'));
			return $el;
		},
        //endregion===================Panel Head===================
        //region   =================Panel Collapse=================
		_createPanel_collapse:function(){
			var $el=$('<div>');
			$el.attr('id',this._element.id+'CollapseGroup')
			  .addClass('panel-collapse collapse'+(this._options.collapseExpanded?' in':''))
			  .append(this._createCollapse_toolbar())
			  .append(this._createCollapse_tableGroup())
			  .append(this._createCollapse_tableSummary())
			  .append(this._createCollapse_tableDetail())
			  .append(this._createCollapse_footer());
			return $el;
			  
		},
        //region   ================Collapse Toolbar================
		_createCollapse_toolbar:function(){
			var $el=$('<div>'),tb=this._options.toolbar;
			$el.addClass('panel-body');
			if(tb && tb.length>0){
				var $tb=$('<div>');
				$tb.addClass('btn-toolbar');
				for(var i=0,j=tb.length;i<j;i++){
					//分组
					var $btnGroup=$('<div class="btn-group btn-group-sm"></div>');
					for(var m=0,n=tb[i].length;m<n;m++){
						if(typeof this['_createTool_'+tb[i][m].id] === 'function')
							$btnGroup.append(this['_createTool_'+tb[i][m].id]());
						else
							$btnGroup.append(this._createTool_custom(tb[i][m]));
					}
					$tb.append($btnGroup);
				}
				$el.append($tb);
			}
			return $el;
		},
		_createTool_refresh:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarRefresh+'"><span class="glyphicon glyphicon-refresh"></span><span>'+$[_pluginName].regional.toolbarRefresh+'</span></span>');
			$el.click(function(){that._refresh()});
			return $el;
		},
		_createTool_search:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarSearch+'"><span class="glyphicon glyphicon-search"></span><span>'+$[_pluginName].regional.toolbarSearch+'</span></span>');
			$el.click(function(){that._search();});
			return $el;
		},
		_createTool_sort:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarSort+'"><span class="glyphicon glyphicon-sort"></span><span>'+$[_pluginName].regional.toolbarSort+'</span></span>');
			$el.click(function(){that._sort();});
			return $el;
		},
		_createTool_add:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarAdd+'"><span class="glyphicon glyphicon-plus"></span><span>'+$[_pluginName].regional.toolbarAdd+'</span></span>');
			$el.click(function(){that._add();});
			return $el;
		},
		_createTool_edit:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarEdit+'"><span class="glyphicon glyphicon-edit"></span><span>'+$[_pluginName].regional.toolbarEdit+'</span></span>');
			$el.click(function(){that._edit();});
			return $el;
		},
		_createTool_delete:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarDelete+'"><span class="glyphicon glyphicon-minus"></span><span>'+$[_pluginName].regional.toolbarDelete+'</span></span>');
			$el.click(function(){that._delete();});
			return $el;
		},
		_createTool_export:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarExport+'"><span class="glyphicon glyphicon-export"></span><span>'+$[_pluginName].regional.toolbarExport+'</span></span>');
			$el.click(function(){that._export();});
			return $el;
		},
		_createTool_custom:function(btn){
			var that=this, $el=$('<span class="btn btn-default" title="'+(btn.title || btn.label || btn.id)+'"><span class="glyphicon '+(btn.icon || '')+'"></span><span>'+(btn.label || '')+'</span></span>');
			$el.click(function(){
				that._tableStatus=btn.id;
                that._showLoading('','list');
                that._deferredsFlow(
                    [
                        that._createDeferred(that._options['before'+btn.id.substr(0,1).toUpperCase()+btn.id.substr(1)], $.extend(true,{},{pageRecords:that._curPageRecords,pageNo:that._currentPageNo,recordNo:that._curRecordNum})),
                        that._createDeferred(btn.action,$.extend(true,{},{pageRecords:that._curPageRecords,pageNo:that._currentPageNo,recordNo:that._curRecordNum})),
                        that._createDeferred(that._options['after'+btn.id.substr(0,1).toUpperCase()+btn.id.substr(1)],$.extend(true,{},{pageRecords:that._curPageRecords,pageNo:that._currentPageNo,recordNo:that._curRecordNum}))
                    ],
                    null,
                    function(v){
                        that._showState(v?v:btn.label + $[_pluginName].regional.eventFail,'danger');
                    },
                    function(v){
                        that._hideLoading('list');
                    }
                );
			});
			return $el;
		},
        //endregion================Collapse Toolbar================
        //region   ==============Collapse TableGroup===============
		_createCollapse_tableGroup:function(){
			var $el,opt=this._options;
			this._elements.$tableGroup=$el=$('<div class="kekTable-table-group"></div>');
			$el.append((opt.rowNum===1 && this._createTable_single()) || (opt.frozenNum !=null && this._createTable_frozen()) || this._createTable());
			return $el;
		},
		_createTable:function(){
			var $el=$('<table>'),
				colgroup=[],
				thead=[],
				cols=this._options.columns;
			$el.addClass('table table-bordered table-condensed'+(this._options.canRowHover?(this._options.frozenNum!=null?'':' table-hover'):''));
			if(this._options.showRowNo){
				colgroup.push('<col style="width:50px;">');
				thead.push('<th>#</th>');
			}
			$.each(this._listCols, function(i,v) {
				colgroup.push('<col'+(cols[v].listWidth?(' style="width:'+cols[v].listWidth+';"'):'')+' />');
				thead.push('<th>'+cols[v].listTitle+'</th>');
			});
			$el.append('<colgroup>'+colgroup.join('')+'</colgroup>')
			   .append('<thead><tr>'+thead.join('')+'</tr></thead>')
			   .append('<tbody></tbody>');
			return $el;
		},
		_createTable_frozen:function(){
			var $el=$(document.createDocumentFragment()),
				$fTable=$('<table class="table table-bordered table-condensed kekTable-table-frozen"></table>'),
				colgroup=[],
				thead=[],
				cols=this._options.columns;
			//frozen
			if(this._options.showRowNo){
				colgroup.push('<col style="width:50px;">');
				thead.push('<th>#</th>');
			}
			for(var i=0;i<this._options.frozenNum;i++){
				colgroup.push('<col'+(cols[this._listCols[i]].listWidth?(' style="width:'+cols[this._listCols[i]].listWidth+';"'):'')+' />');
				thead.push('<th>'+cols[this._listCols[i]].listTitle+'</th>');
			}
			$fTable.append('<colgroup>'+colgroup.join('')+'</colgroup>')
			   	   .append('<thead><tr>'+thead.join('')+'</tr></thead>')
			   	   .append('<tbody></tbody>');
			$el.append($fTable).append(this._createTable());
			return $el;
		},
		_createTable_single:function(){
			var $el=$('<ul class="kekTable-single-table"></ul>'),
				ul=[],
				li=[],
				cols=this._options.columns;
			$.each(this._listCols, function(i,colName) {
				if(li.length && !cols[colName].listInline){
					ul.push('<li>'+li.join('')+'</li>');
					li.length=0;
				}
				li.push('<div><b>'+cols[colName].listTitle+'</b><span class="kekTable-col" data-col="'+colName+'"'+(cols[colName].listWidth?(' style="width:'+cols[colName].listWidth+';"'):'')+'></span></div>');
			});
			if(li.length)
				ul.push('<li>'+li.join('')+'</li>');
			$el.append(ul.join(''));
			return $el;
		},
        //endregion==============Collapse TableGroup===============
        //region   =============Collapse TableSummary==============
		_createCollapse_tableSummary:function(){
			if(this._summaryCols.length){
				var $el=$('<div class="kekTable-table-summary"></div>'),
					cols=this._options.columns;
				$.each(this._summaryCols, function(i,colName) {
					$el.append('<h5 data-col="'+colName+'">'+cols[colName].listTitle+'('+$[_pluginName].regional['total'+cols[colName].colTotalSummary]+'): <b></b></h5>');
				});
				return this._elements.$summary=$el;
			}
		},
        //endregion=============Collapse TableSummary==============
        //region   ==============Collapse TableDetail==============
		_createCollapse_tableDetail:function(){
			if(this._options.detailTable){
				var $el=$('<div class="kekTable-table-md"></div>');
				$('#'+this._options.detailTable).appendTo($el);
				return $el;
			}
		},
        //endregion==============Collapse TableDetail==============
        //region   =================Collapse Footer================
		_createCollapse_footer:function(){
			return $('<div class="panel-footer"></div>').append(this._createFooter_paging(1)).append(this._createFooter_state());
		},
		_createFooter_paging:function(recordCount){
			if(this._options.showPaging){
				var $el=this._elements.$paging || (this._elements.$paging = $('<nav><ul class="pagination"></ul></nav>'));
				if(recordCount==null)
					throw '没有记录数';
				var curPageBA=1;//当前页前后的按钮数量
				var intactPages=curPageBA*2+5;//一共有多少个按钮  1 .. 10 11 12 .. 20
				var pageCount=Math.ceil(recordCount / this._options.rowNum);//总页
				var pageArr=[];//分页按钮组
				pageArr[0]='<li><a href="#">1</a></li>';
				//最後頁
		        if (pageCount > 1)
		            pageArr[(intactPages > pageCount ? pageCount : intactPages) - 1] = '<li><a href="#">' + pageCount + '</a></li>';
		        var i = 0;
		        if (pageCount <= intactPages) {
		            for (i = 2; i <= pageCount - 1; i++)
		                pageArr[i - 1] = '<li><a href="#">' + i + '</a></li>';
		            pageArr[this._currentPageNo - 1] = '<li class="active"><span>' + this._currentPageNo + '</span></li>';
		        }
		        else {
		            //1 2 3 4 5 ... 8
		            if (this._currentPageNo <= curPageBA + 3) {
		                for (i = 2; i <= curPageBA + 4; i++)
		                    pageArr[i - 1] = '<li><a href="#">' + i + '</a></li>';
		                pageArr[this._currentPageNo - 1] = '<li class="active"><span>' + this._currentPageNo + '</span></li>';
		                pageArr[intactPages - 2] = '<li class="disabled"><span>...</span></li>';
		            }
		                //1 ... 4 5 6 7 8
		            else if (this._currentPageNo >= pageCount - curPageBA - 2) {
		                for (i = 2; i <= curPageBA + 4; i++)
		                    pageArr[intactPages - i] = '<li><a href="#">' + (pageCount - i + 1) + '</a></li>';
		                pageArr[intactPages - (pageCount - this._currentPageNo) - 1] = '<li class="active"><span>' + this._currentPageNo + '</span></li>';
		                pageArr[1] = '<li class="disabled"><span>...</span></li>';
		            }
		                //1 ... 4 5 6 ... 9
		            else {
		                pageArr[1] = '<li class="disabled"><span>...</span></li>';
		                pageArr[intactPages - 2] = '<li class="disabled"><span>...</span></li>';
		                for (i = 1; i <= curPageBA; i++) {
		                    pageArr[i + 1] = '<li><a href="#">' + (this._currentPageNo - i) + '</a></li>';
		                }
		                for (i = 1; i <= curPageBA; i++) {
		                    pageArr[intactPages - 2 - i] = '<li><a href="#">' + (this._currentPageNo - i + 1 + curPageBA) + '</a></li>';
		                }
		                pageArr[Math.ceil(intactPages / 2) - 1] = '<li class="active"><span>' + this._currentPageNo + '</span></li>';
		            }
		        }
		        $el.children().empty().append(pageArr.join(''));
		        return $el;
			}
		},
		_createFooter_state:function(){
			return this._elements.$state = $('<div class="alert alert-success"></div>');
		},
        //endregion=================Collapse Footer================
        //endregion=================Panel Collapse=================
        //endregion==================Plugin Panel==================
        //region   =================Plugin Loading=================
		_createPlugin_loading:function(el){
			return this._elements[el==='edit'?'$editLoading':'$loading']=$('<div class="kekTable-loading" style="display: none;"><div class="bk-opacity"></div><p><span class="alert alert-info">'+$[_pluginName].regional.loadingTxt+'</span></p></div>');
		},
        //endregion=================Plugin Loading=================
        //region   ==================Plugin Alert==================
		_createPlugin_alert:function(el){
			return this._elements.$alert=$('<div class="modal fade" data-backdrop="static" tabindex="-1" style="z-index:2000"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">'+
				$[_pluginName].regional.alertTitle+'</h4></div><div class="modal-body"><p></p></div></div></div></div>');
		},
        //endregion==================Plugin Alert==================
        //region   =================Plugin Confirm=================
		_createPlugin_confirm:function(el){
			var regional=$[_pluginName].regional;
			return this._elements.$confirm=$('<div class="modal fade" data-backdrop="static" tabindex="-1" style="z-index:2000"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">'+
				$[_pluginName].regional.alertTitle+'</h4></div><div class="modal-body"><p>'+regional.deleteConfirm+'</p></div><div class="modal-footer"><button class="btn btn-primary">'+regional.buttonOk+'</button><button class="btn btn-default" data-dismiss="modal">'+regional.buttonCancel+'</button></div></div></div></div>');
		},
        //endregion=================Plugin Confirm=================
        //region   =================Plugin Search==================
		_createPlugin_search:function(){
			if(this._hasTool.search){
				var regional=$[_pluginName].regional;
				this._elements.search.$dialog=$('<div class="modal fade kekTable-search" style="display:none;" data-backdrop="static" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">'+
					regional.searchTitle+'</h4></div><div class="modal-body"></div><div class="modal-footer"><div class="alert alert-danger">'+regional.searchErr+'</div><button type="button" class="btn btn-default" data-dismiss="modal">'+
					regional.buttonCancel+'</button><button type="button" class="btn btn-primary">'+regional.searchCommit+'</button></div></div></div></div>');
				this._elements.search.$dialog.find('.modal-body').append(this._elements.search.$block=$('<ul class="kekTable-search-block"></ul>'));
				$('.modal-body',this._elements.search.$dialog).append(this._createSearch_col())
					.append(this._createSearch_operator())
					.append(this._createSearch_bool())
					.append(this._createSearch_control());
				$('.modal-dialog',this._elements.search.$dialog).css('width',this._options.searchDialogWidth);
                this._elements.search.$alert=this._elements.search.$dialog.find('.modal-footer .alert');
				return this._elements.search.$dialog;
			}
		},
		_createSearch_col:function(){
			this._elements.search.$col=$('<ul class="dropdown-menu kekTable-dropList"></ul>');
			var li=[],cols=this._options.columns;
			$.each(this._dbCols, function(i,colName) {
				if(cols[colName].canFilter)
					li.push('<li data-col="'+colName+'"><span>'+(cols[colName].listTitle || colName)+'</span></li>');
			});
			this._elements.search.$col.append(li.join(''));
			this._setSearchDialog();
			return this._elements.search.$col;
		},
		_createSearch_operator:function(){
			this._elements.search.$operator=$('<ul class="dropdown-menu kekTable-dropList"></ul>');
			var li=[],regional=$[_pluginName].regional;
			li.push(
				'<li data-opt="eq"><span>'+regional.searchOptEq+'</span></li>',
				'<li data-opt="gt"><span>'+regional.searchOptGt+'</span></li>',
				'<li data-opt="lt"><span>'+regional.searchOptLt+'</span></li>',
				'<li data-opt="ge"><span>'+regional.searchOptGe+'</span></li>',
				'<li data-opt="le"><span>'+regional.searchOptLe+'</span></li>',
				'<li data-opt="ne"><span>'+regional.searchOptNe+'</span></li>',
				'<li data-opt="beg"><span>'+regional.searchOptBeg+'</span></li>',
				'<li data-opt="end"><span>'+regional.searchOptEnd+'</span></li>',
				'<li data-opt="like"><span>'+regional.searchOptLike+'</span></li>',
				'<li data-opt="isnull"><span>'+regional.searchOptNull+'</span></li>',
				'<li data-opt="notnull"><span>'+regional.searchOptNNull+'</span></li>'
			);
			this._elements.search.$operator.append(li.join(''));
			return this._elements.search.$operator;
		},
		_createSearch_bool:function(){
			this._elements.search.$bool=$('<ul class="dropdown-menu kekTable-dropList"></ul>');
			var li=[],regional=$[_pluginName].regional;
			li.push(
				'<li data-bool="AND"><span>'+regional.searchBoolAnd+'</span></li>',
				'<li data-bool="OR"><span>'+regional.searchBoolOr+'</span></li>'
			);
			this._elements.search.$bool.append(li.join(''));
			return this._elements.search.$bool;
		},
		_createSearch_control:function(){
			this._elements.search.$control=$('<ul class="dropdown-menu kekTable-dropList"></ul>');
			var li=[],regional=$[_pluginName].regional;
			li.push(
				'<li data-ctrl="pc"><span>'+regional.searchAddPreCond+'</span></li>',
				'<li data-ctrl="nc"><span>'+regional.searchAddNxtCond+'</span></li>',
				'<li class="divider"></li>',
				'<li data-ctrl="pg"><span>'+regional.searchAddPreGrp+'</span></li>',
				'<li data-ctrl="ng"><span>'+regional.searchAddNxtGrp+'</span></li>',
				'<li class="divider"></li>',
				'<li data-ctrl="del"><span>'+regional.searchDelCond+'</span></li>'
			);
			this._elements.search.$control.append(li.join(''));
			return this._elements.search.$control;
		},
        //endregion=================Plugin Search==================
        //region   ==================Plugin Edit===================
		_createPlugin_edit:function(){
			if(this._hasTool.edit || this._hasTool.add){
				var regional=$[_pluginName].regional;
				this._elements.edit.$dialog=$('<div class="modal fade kekTable-edit" data-backdrop="static" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">'+
					regional.editTitle+'</h4></div><div class="modal-body"></div><div class="modal-footer"><div class="alert alert-danger"></div><button type="button" class="btn btn-default" data-dismiss="modal">'+
					regional.buttonCancel+'</button><button type="button" class="btn btn-primary">'+regional.editCommit+'</button></div></div></div></div>');
				$('.modal-body',this._elements.edit.$dialog).append(this._createEdit_block(),this._createEdit_list(),this._createEdit_lov());
				$('.modal-dialog',this._elements.edit.$dialog).append(this._elements.$editLoading=this._createPlugin_loading('edit'));
				$('.modal-dialog',this._elements.edit.$dialog).css('width',this._options.editDialogWidth);
                this._elements.edit.$alert=this._elements.edit.$dialog.find('.modal-footer .alert');
				return this._elements.edit.$dialog;
			}
		},
		//editType list
		_createEdit_list:function(){
			return this._elements.edit.$list=$('<ul class="dropdown-menu kekTable-dropList"></ul>');
		},
		//editType lov
		_createEdit_lov:function(){
			return this._elements.edit.$lov=$('<div class="dropdown-menu kekTable-lov"><table class="table table-hover table-condensed"><thead></thead><tbody></tbody></table></div>');
		},
		_createEdit_block:function(){
			var $el=$('<ul class="kekTable-edit-block"></ul>'), li=[],that=this,cols=this._options.columns,that=this,$l,$filed,atr;
			$.each(this._editCols, function(i,colName) {
				if(cols[colName].editDisplay==='block'){
					$l && $el.append($l);
					$l=$('<li><div class="form-group"><label class="control-label'+(cols[colName].isRequire?' text-danger':'')+($.inArray(cols[colName].editType,['list','lov'])!=-1?' kekTable-edit-listLabel':'')+'">'+cols[colName].editTitle+'</label></div></li>');
					$filed=$('.form-group',$l);
					$($filed).append(that._createEdit_item(colName));
				}
				else if(cols[colName].editDisplay==='inline'){
					$filed=$('<div class="form-group has-feedback"><label>'+cols[colName].editTitle+'</label></div>');
					$l.append($filed);
					$($filed).append(that._createEdit_item(colName));
				}
				else if(cols[colName].editDisplay==='cling'){
					if(!$('.input-group',$filed).length)
						$('.form-control',$filed).wrap('<div class="input-group"></div>');
					$('.input-group',$filed).append(that._createEdit_item(colName));
				}
				//if(cols[colName].editAttr==='hidden')
				//	$filed.css('display','none');
			});
			$l && $el.append($l);
			return this._elements.edit.$block=$el;
		},
		//data-col
		_createEdit_item:function(colName){
			var $el,col=this._options.columns[colName];
			if(col.editType==='textarea')
				$el=$('<textarea />')
			else
				$el=$('<input type="text" />');
			$el.attr('data-col',colName).addClass('form-control').css('width',col.editWidth);
			//hidden,readonly
			(col.editAttr==='hidden' && $el.css('display','none')) || ($el.attr(col.editAttr,true));
			//number,date
			col.colType && $el.addClass('kekTable-'+col.colType);
			col.editPlaceholder && $el.attr('placeholder',col.editPlaceholder);
			//list、lov
			if(col.editType==='list' || col.editType==='lov'){
				$el.addClass('kekTable-'+col.editType+'-input').attr('readonly','readonly');
			}
//			if(!col.editAttr && col.editType==='list'){
//				var $input=$el,
//					$lov=$('<ul class="dropdown-menu kekTable-dropList" data-for="'+colName+'"></ul>');
//				$input.addClass('kekTable-list-input').attr({
//					'data-toggle':'dropdown',
//					'aria-expanded':false,
//					readonly:'readonly'
//				});
//				$el=$(document.createDocumentFragment());
//				$el.append($input,$lov);
//			}
			return $el;
		},
        //endregion==================Plugin Edit===================
        //region   ==================Plugin Sort===================
		_createPlugin_sort:function(){
			if(this._hasTool.sort){
				var regional=$[_pluginName].regional;
				this._elements.sort.$dialog=$('<div class="modal fade kekTable-sort" data-backdrop="static" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">'+
					regional.sortTitle+'</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">'+
					regional.buttonCancel+'</button><button type="button" class="btn btn-primary">'+regional.sortCommit+'</button></div></div></div></div>');
				$('.modal-body',this._elements.sort.$dialog).append(this._createSort_list()).append(this._createSort_ctrl());
				$('.modal-dialog',this._elements.sort.$dialog).css('width',this._options.sortDialogWidth);
				return this._elements.sort.$dialog;
			}
		},
		_createSort_list:function(){
			var $el=$('<div class="kekTable-sort-list"></div>');
			this._elements.sort.$block=$('<ul class="kekTable-sort-block list-group"></ul>');
			$el.append(this._elements.sort.$block);
			return $el;
		},
		_createSort_ctrl:function(){
			var $el=$('<div class="kekTable-sort-ctrl"></div>'),
				regional=$[_pluginName].regional,
				cols=[],that=this;
			$.each(this._listCols, function(i,colName) {
				if(that._options.columns[colName].canSort)
					cols.push('<li data-col="'+colName+'"><span>'+(that._options.columns[colName].listTitle||colName)+'</span></li>');
			});
			$el.append('<div class="btn-group"><div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" title="'+regional.sortAdd+
					'" data-toggle="dropdown"><span class="glyphicon glyphicon-plus"></span></button>'+
					'<ul class="dropdown-menu dropdown-menu-right kekTable-dropList">'+cols.join('')+'</ul></div>'+
					'<button type="button" class="btn btn-default" title="'+regional.sortDelete+'"><span class="glyphicon glyphicon-remove"></span></button></div>')
				.append('<div class="btn-group"><button type="button" class="btn btn-default" title="'+regional.sortMoveUp+'"><span class="glyphicon glyphicon-chevron-up"></span></button>'+
					'<button type="button" class="btn btn-default" title="'+regional.sortMoveDown+'"><span class="glyphicon glyphicon-chevron-down"></span></button></div>')
				.append('<div class="btn-group-vertical" data-toggle="buttons"><label class="btn btn-default active"><input type="radio" name="sort-type" autocomplete="off" value="ASC" checked />'+regional.sortAsc+'</label>'+
					'<label class="btn btn-default"><input type="radio" name="sort-type" autocomplete="off" value="DESC" />'+regional.sortDesc+'</label></div>')
				.append('<div class="btn-group-vertical" data-toggle="buttons"><label class="btn btn-default active"><input type="radio" name="sort-nulls" autocomplete="off" value="NULLS FIRST" checked />'+regional.sortNullsFirst+'</label>'+
					'<label class="btn btn-default"><input type="radio" name="sort-nulls" autocomplete="off" value="NULLS LAST" />'+regional.sortNullsLast+'</label></div>');
			this._elements.sort.$ctrl=$el;
			return $el;
		},
        //endregion==================Plugin Sort===================
		//endregion====================建立插件====================
		//region   ===================工具栏方法===================
		_refresh:function(){
            var that=this;
            this._tableStatus='refresh';
            this._showLoading('','list');
            this._deferredsFlow(
                [
                    this._createDeferred(this._options.beforeRefresh,this._deferredObject),
                    this._createDeferred(this._loadData,null),
                    this._createDeferred(this._options.afterRefresh, this._deferredObject)
                ],
                function(){
                    that._showState($[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventSuccess);
                },
                function(v){
                    that._showAlert(v?v:$[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail);
                    that._showState(v?v:$[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail,'danger');
                },
                function(){
                    that._hideLoading('list');
                }
            );
		},
		_search:function(){
            var that=this;
            this._tableStatus='search';
            this._showLoading('','list');
            this._deferredsFlow(
                [
                    this._createDeferred(this._options.beforeSearch,this._deferredObject),
                    this._createDeferred(function(o,d){
                        try {
                            that._setSearchDialog(that._searchConditions);
                            d.resolve();
                        }
                        catch(ex){
                            d.reject();
                            console.log('searchError',ex);
                        }
                    },null),
                    this._createDeferred(this._options.afterSearch,this._deferredObject),
                    this._createDeferred(function(o,d){
                        that._elements.search.$dialog.modal('show');
                        d.resolve();
                    },null)
                ],
                null,
                function(v){
                    that._showAlert(v?v:$[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventFail);
                    that._showState(v?v:$[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventFail,'danger');
                },
                function(){
                    that._hideLoading('list');
                }
            );
		},
		_sort:function(){
            var that=this;
            this._tableStatus='sort';
            this._showLoading('','list');
            this._deferredsFlow(
                [
                    this._createDeferred(this._options.beforeSort,this._deferredObject),
                    this._createDeferred(function(o,d){
                        try {
                            that._setSortDialog(that._sortConditions);
                            d.resolve();
                        }
                        catch(ex){
                            d.reject();
                            console.log('sortError',ex);
                        }
                    },null),
                    this._createDeferred(this._options.afterSort,this._deferredObject),
                    this._createDeferred(function(o,d){
                        that._elements.sort.$dialog.modal('show');
                        d.resolve();
                    },null)
                ],
                null,
                function(v){
                    that._showAlert(v?v:$[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventFail);
                    that._showState(v?v:$[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventFail,'danger');
                },
                function(){
                    that._hideLoading('list');
                }
            );
		},
		_add:function(){
            var that=this;
            this._tableStatus='add';
            this._showLoading('','list');
            this._editRecord={};
            this._elements.edit.$alert.hide();
            this._deferredsFlow(
                [
                    this._createDeferred(this._options.beforeAdd,this._deferredObjectRef),//可以被修改
                    this._createDeferred(function(o,d){
                        try {
                            var $block = that._elements.edit.$block;
                            $('.modal-title',that._elements.edit.$dialog).text($[_pluginName].regional.addTitle);
                            //$('[data-col]',that._elements.edit.$block).val('').data('status',0).parents('.form-group').removeClass('has-error has-success').attr('title',null);
                            $.each(that._editCols, function (i, colName) {
                                $('[data-col="' + colName + '"]', $block).val(that._editRecord[colName]);
                                that._editItemChange(colName,that._editRecord[colName],[],null,true);
                                //$('[data-col="' + colName + '"]', $block).val(that._editRecord[colName]).data('status', 0).parents('.form-group').removeClass('has-error has-success').attr('title', null);
                                //that._editInit(colName);
                            });
                            d.resolve();
                        }
                        catch(ex){
                            d.reject();
                            console.log('addError',ex);
                        }
                    },null),
                    this._createDeferred(this._options.afterAdd, this._deferredObject),
                    this._createDeferred(function(o,d){
                        that._elements.edit.$dialog.modal('show');
                        d.resolve();
                    },null)
                ],
                null,
                function(v){
                    that._showAlert(v?v:$[_pluginName].regional.toolbarAdd + $[_pluginName].regional.eventFail);
                    that._showState(v?v:$[_pluginName].regional.toolbarAdd + $[_pluginName].regional.eventFail,'danger');
                },
                function(){
                    that._hideLoading('list');
                }
            );
		},
		_edit:function(){
            var that=this,
                curRec=this._curPageRecords[this._curRecordNo-1];
            if(this._curPageRecords.length && this._curRecordNo) {
                this._tableStatus = 'edit';
                this._showLoading('','list');
                this._editRecord = {};
                this._elements.edit.$alert.hide();
                $.each(this._editCols, function (i, colName) {
                    that._editRecord[colName] = curRec[colName];
                });
                this._deferredsFlow(
                    [
                        this._createDeferred(this._options.beforeEdit, this._deferredObjectRef),//可修改
                        this._createDeferred(function (o, d) {
                            try {
                                var $block = that._elements.edit.$block;
                                $('.modal-title', that._elements.edit.$dialog).text($[_pluginName].regional.editTitle);
                                $.each(that._editCols, function (i, colName) {
                                    $('[data-col="' + colName + '"]', $block).val(that._editRecord[colName])
                                    that._editItemChange(colName,that._editRecord[colName],[],null,true);
                                    //$('[data-col="' + colName + '"]', $block).val(that._editRecord[colName]).data('status', 0).parents('.form-group').removeClass('has-error has-success').attr('title', null);
                                });
                                d.resolve();
                            }
                            catch (ex) {
                                d.reject();
                                console.log('editError', ex);
                            }
                        }, null),
                        this._createDeferred(this._options.afterEdit, this._deferredObject),
                        this._createDeferred(function (o, d) {
                            that._elements.edit.$dialog.modal('show');
                            d.resolve();
                        }, null)
                    ],
                    null,
                    function (v) {
                        that._showAlert(v?v:$[_pluginName].regional.toolbarEdit + $[_pluginName].regional.eventFail);
                        that._showState(v ? v : $[_pluginName].regional.toolbarEdit + $[_pluginName].regional.eventFail, 'danger');
                    },
                    function () {
                        that._hideLoading('list');
                    }
                );
            }
            else {
                this._showAlert($[_pluginName].regional.errSelected);
                this._showState($[_pluginName].regional.errSelected, 'danger');
            }
		},
		_delete:function(){
            var that=this;
            if(this._curPageRecords.length && this._curRecordNo) {
                this._tableStatus = 'delete';
                this._showLoading('','list');
                this._deferredsFlow(
                    [
                        this._createDeferred(this._options.beforeDelete, this._deferredObject),
                        this._createDeferred(function (o, d) {
                            try {
                                that._elements.$confirm.off('click.' + _pluginName, '.modal-footer .btn-primary');
                                that._elements.$confirm.off('click.' + _pluginName, '.modal-footer .btn-default');
                                that._elements.$confirm.on('click.' + _pluginName, '.modal-footer .btn-primary', function () {
                                    that._deleteRecord(d);
                                });
                                that._elements.$confirm.on('click.' + _pluginName, '.modal-footer .btn-default', function () {
                                    d.reject();
                                });
                                that._elements.$confirm.modal('show');
                            }
                            catch (ex) {
                                d.reject();
                                console.log('deleteError', ex);
                            }
                        }, null),
                        this._createDeferred(this._options.afterDelete, this._deferredObject),
                    ],
                    function () {
                        //that._showAlert($[_pluginName].regional.toolbarDelete + $[_pluginName].regional.eventSuccess);
                        that._showState($[_pluginName].regional.toolbarDelete + $[_pluginName].regional.eventSuccess);
                    },
                    function (v) {
                        if(v) {
                            that._showAlert(v ? v : $[_pluginName].regional.toolbarDelete + $[_pluginName].regional.eventFail);
                            that._showState(v ? v : $[_pluginName].regional.toolbarDelete + $[_pluginName].regional.eventFail, 'danger');
                        }
                    },
                    function () {
                        that._hideLoading('list');
                        that._elements.$confirm.modal('hide');
                    }
                );
            }
            else {
                this._showAlert($[_pluginName].regional.errSelected);
                this._showState($[_pluginName].regional.errSelected, 'danger');
            }
		},
		_export:function(){
            this._tableStatus='export';
			//something...
		},
		//endregion===================工具栏方法===================
		//region   ==================读取后台数据==================
		//将后台返回的数组数据转换为类,供回调函数使用
		_recordToEntity:function(arr){
			var newArr=[],that=this;
			$.each(arr, function(i,record) {
				var r=new that._colEntity();
				$.each(record, function(j,val) {
					r[that._dbCols[j]]=val;
				});
				newArr.push(r);
			});
			return newArr;
		},
		
		/**
		 * @function Plugin~_loadData
		 * @desc 后台数据格式 { Success=true , Total=100 , Records=[['a1','b1','c1'],['a2','b2','c2']],Summary=[100,230],Message=''}
		 * @summary 读取数据
		 */
		_loadData:function(handlerData,d){
			var colsId=[],that=this,cols=this._options.columns,sorts=[],searchs=[],summary=[];
			this._showLoading($[_pluginName].regional.loadData,'list');
			//colsId
			$.each(this._dbCols, function(i,colName) {
				colsId.push(cols[colName].colId);
			});
			//sortConditions
			$.each(this._sortConditions, function(i,cond) {
				sorts.push($.extend(true, {}, cond,{Col:cols[cond.Col].colId}));
			});
			//searchConditions
			searchs=$.extend(true,{},that._searchConditions);
			searchs=$.map(searchs,function(c){return [c];});
			//summaryCols
			$.each(this._summaryCols, function(i,colName) {
				var col=that._options.columns[colName];
				summary.push({Col:col.colId,Mode:col.colTotalSummary,IsAll:col.colTotalAll});
			});
			$.post(this._options.listURL,{
				act:'Search',
				test:Math.random() ,
				searchPars:JSON.stringify({
					ColsId:colsId,
					TablesId:that._tablesId,
					SortConditions:sorts,
					SearchConditions:that._toSearchPost(searchs),
					SummaryConditions:summary,
					Range:that._options.showPaging?[(that._currentPageNo - 1) * that._options.rowNum,that._currentPageNo* that._options.rowNum]:null,
					Relations:that._options.tableRelations
				})
			}).done(function(res){
				if(!res)
					d.reject(that._options.isDebug?'后台未返回数据':$[_pluginName].regional.loadDataErr);
				else{
					var obj=$.parseJSON(res);
					if(obj.Success==undefined)
						d.reject(that._options.isDebug?'后台未返回Success值': $[_pluginName].regional.loadDataErr);
					else if(obj.Success){
						if(obj.Total==null || obj.Records==null)
							d.reject(that._options.isDebug?'后台返回数据结构错误':$[_pluginName].regional.loadDataErr);
						else if(obj.Total && that._summaryCols.length && (obj.Summary==null || obj.Summary.length != that._summaryCols.length))
							d.reject(that._options.isDebug?'后台返回Summary值异常': $[_pluginName].regional.loadDataErr);
						else{
							that._curPageRecords=that._recordToEntity(obj.Records);
							that._listSummary(obj.Summary);
							that._createFooter_paging(obj.Total);
							if(that._options.rowNum===1)
								that._listData_single(obj.Records,d);
							else if(that._options.frozenNum != null)
								that._listData_frozen(obj.Records,d);
							else
								that._listData(obj.Records,d);
							that._selectRow(1);
						}
					}
					else
						d.reject(obj.Message || $[_pluginName].regional.loadDataErr);
				}
			}).fail(function(){
				d.reject($[_pluginName].regional.loadDataErr);
			})
		},
		//显示字段的值
		//$el:$td
		//recIndex:记录行(_curPageRecords下标)
		//b:栏位beforeGetValue回调函数
		_listColData:function($el,colName,recIndex,b){
            var def=this._createDeferred(b, this._deferredObject)(),
                col=this._options.columns[colName],
                that=this;
            def.done(function(v){
                v==null && (v=that._curPageRecords[recIndex][colName]);
                if(col.listList){
                    if(col.listList[v]==undefined)
                        $el.html(v);
                    else
                        $el.html(col.listList[v]);
                }
                else
                    $el.html(v);
                //非数据库字段将赋值
                if(that._options.columns[colName].colId==null)
                    that._curPageRecords[recIndex][colName]=$el.text();
            }).fail(function () {
                $el.text('');
            });
            return def.promise();
		},
		//将数据显示到table里面。修改的话要同时修改_listData_frozen
		//def:刷新事件的deferred
		_listData:function(data,def){
			var cols=this._options.columns,that=this,dbCols=this._dbCols,listCols=this._listCols,
				$block=$('tbody',this._elements.$tableGroup),
				defArr=[],$frg=$(document.createDocumentFragment());
			$.each(data,function(i,d){
				var $tr=$('<tr />',{'data-index':i}),tr=[];
				//that._selectRow(i+1);
                that._curRecordNo=i+1;
                //遍历所有字段。非数据库字段会被暂存于_curPageRecords
				$.each(cols, function(colName,colObj) {
					var listIndex=$.inArray(colName,listCols),
						$td=$('<td />');
					if(listIndex!==-1)
						tr[listIndex]=$td;
					defArr.push(that._listColData($td,colName,i,colObj.beforeGetValue));
				});
				that._options.showRowNo && tr.unshift($('<td>'+(i+1)+'</td>'));
				$frg.append($tr.append(tr));
			});
			$.whenAll.apply($,defArr)
				.fail(function(){
			  		console.log('_listData有异常');
			  	})
				.always(function(){
					$block.empty().append($frg);
					that._selectRow(that._curRecordNo);
                    if(def)
                        def.resolve();
                    else
                        that._hideLoading('list');
				});
		},
		//将数据显示到frozen-table里面。修改的话要同时修改_listData
		//def:刷新事件的deferred
		_listData_frozen:function(data,def){
			var cols=this._options.columns,that=this,dbCols=this._dbCols,listCols=this._listCols,
				defArr=[],$frg=$(document.createDocumentFragment()),
				$frgF=$(document.createDocumentFragment());
			$.each(data,function(i,d){
				var $tr=$('<tr />',{'data-index':i}),
					$trF=$('<tr />',{'data-index':i}),
					tr=[],trF=[];
                that._curRecordNo=i+1;
				$.each(cols, function(colName,colObj) {
					var listIndex=$.inArray(colName,listCols),
						$td=$('<td />');
					if(listIndex!==-1){
						tr[listIndex]=$td;
						if(listIndex<that._options.frozenNum)
							trF[listIndex]=$td;
					}
					defArr.push(that._listColData($td,colName,i,colObj.beforeGetValue));
				});
				that._options.showRowNo && (tr.unshift($('<td>'+(i+1)+'</td>')) && trF.unshift($('<td>'+(i+1)+'</td>')) );
				$frg.append($tr.append(tr)[0].outerHTML);
				$frgF.append($trF.append(trF)[0].outerHTML);
			});
			$.whenAll.apply($,defArr)
				.fail(function(){
                    console.log('_listData_frozen有异常');
			  	})
				.always(function(){
					$('table:not(.kekTable-table-frozen) tbody',that._elements.$tableGroup).empty().append($frg);
					$('.kekTable-table-frozen tbody',that._elements.$tableGroup).empty().append($frgF);
					that._selectRow(that._curRecordNo);
					that._selectRowFrozen(that._curRecordNo);
                    if(def)
                        def.resolve();
                    else
                        that._hideLoading('list');
				});
		},
		//将数据显示到single-table里面
		//def:刷新事件的deferred
		_listData_single:function(data,def){
			var cols=this._options.columns,that=this,dbCols=this._dbCols,listCols=this._listCols,
				d=data.length?data[0]:new Array(cols.length),
				$block=$('.kekTable-single-table',this._elements.$tableGroup),
				defArr=[];
            that._curRecordNo=1;
			$.each(cols, function(colName,colObj) {
				var listIndex=$.inArray(colName,listCols),
					$col=listIndex===-1?$('<span/>'):$('span[data-col="'+colName+'"]',$block);
				defArr.push(that._listColData($col,colName,0,colObj.beforeGetValue));
			});	
			$.whenAll.apply($, defArr)
                .fail(function() {
                    console.log('_listData_single有异常');
                })
                .always(function(){
                    if(def)
                        def.resolve();
                    else
                        that._hideLoading('list');
                });
		},
        //显示摘要数据
        //data: 后台返回的Summary数组
        _listSummary:function(data){
            if(this._summaryCols.length)
            {
                var that=this;
                $.each(this._summaryCols,function(i,colName){
                    $('h5[data-col="'+colName+'"] b',that._elements.$summary).text(data[i]==null?'':data[i]);
                });
            }
        },
		//endregion==================读取后台数据==================
		//region   ==================新增后台数据==================
        _insertRecord:function(handlerData,d){
            var colsId=[],that=this,cols=this._options.columns,colsVal=[],defCols=[],defVals=[],vQuit;
            //是否有未通过检核的值
            var errs=this._elements.edit.$block.find('.has-error');
            if(errs.length) {
                d.reject(errs.attr('title'));
                return;
            }
            //colsId
            $.each(this._editCols, function(i,colName) {
                if(cols[colName].editAttr != 'disabled' && cols[colName].colId!=null){
                    var $editInput=that._elements.edit.$block.find('[data-col="'+colName+'"]');
                    if($editInput.data('status')==1){
                        colsId.push(cols[colName].colId);
                        colsVal.push(that._editRecord[colName]);
                        if(that._options.columns[colName].editType==='list') {
                            var list = that._options.columns[colName].listList;
                        }
                    }
                }
                //检查值
                var valCheck=that._checkEditItemValue(colName,that._editRecord[colName]);
                if(!valCheck.result){
                    var errMsg=cols[colName].editTitle + valCheck.val;
                    that._elements.edit.$block.find('[data-col="'+colName+'"]').data('status',-1).parents('.form-group').removeClass('has-success').addClass('has-error').attr('title',errMsg);
                    d.reject(errMsg);
                    vQuit=true;
                    return false;
                }
            });
            if(vQuit) return;
            //defaultCols
            if(this._options.defaultInsertCols) {
                $.each(this._options.defaultInsertCols, function (i, colId) {
                    if ($.inArray(colId, colsId) == -1) {
                        defCols.push(colId);
                        defVals.push(that._options.defaultInsertVals[i]);
                    }
                });
            }
            $.post(this._options.insertURL,{
                act:'Insert',
                insertPars:JSON.stringify({
                    ColsId:colsId,
                    TablesId:cols[that._keyCols[0]].tableId,
                    ColsVal:colsVal,
                    DefaultCols:defCols,
                    DefaultVals:defVals
                })
            }).done(function(res){
                if(!res)
                    d.reject(that._options.isDebug?'后台未返回数据':$[_pluginName].regional.loadDataErr);
                else {
                    var obj = $.parseJSON(res);
                    if (obj.Success == undefined)
                        d.reject(that._options.isDebug ? '后台未返回Success值' : $[_pluginName].regional.loadDataErr);
                    else if (obj.Success) {
                        that._deferredsFlow(
                            [that._createDeferred(that._loadData,null)],
                            null,
                            function(v){
                                that._showState(v?v:$[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail,'danger');
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
        _updateRecord:function(handlerData,d){
            var colsId=[],that=this,cols=this._options.columns,colsVal=[],defCols=[],defVals=[],keysId=[],keysVal=[],vQuit;
            //是否有未通过检核的值
            var errs=this._elements.edit.$block.find('.has-error');
            if(errs.length) {
                d.reject(errs.attr('title'));
                return;
            }
            //colsId
            $.each(this._editCols, function(i,colName) {
                if(cols[colName].editAttr != 'disabled' && cols[colName].colId!=null){
                    var $editInput=that._elements.edit.$block.find('[data-col="'+colName+'"]');
                    if($editInput.data('status')==1){
                        colsId.push(cols[colName].colId);
                        colsVal.push(that._editRecord[colName]);
                    }
                }
                //检查值
                var valCheck=that._checkEditItemValue(colName,that._editRecord[colName]);
                if(!valCheck.result){
                    d.reject(cols[colName].editTitle + valCheck.val);
                    vQuit=true;
                    return false;
                }
            });
            if(vQuit) return;
            //keys
            var curRec=this._curPageRecords[this._curRecordNo-1];
            $.each(this._keyCols, function (i,colName) {
                keysId.push(cols[colName].colId);
                keysVal.push(curRec[colName]);
            });
            //defaultCols
            if(this._options.defaultUpdateCols) {
                $.each(this._options.defaultUpdateCols, function (i, colId) {
                    if ($.inArray(colId, colsId) == -1) {
                        defCols.push(colId);
                        defVals.push(that._options.defaultUpdateVals[i]);
                    }
                });
            }
            //if colsId.length......
            $.post(this._options.updateURL,{
                act:'Update',
                updatePars:JSON.stringify({
                    ColsId:colsId,
                    TablesId:cols[that._keyCols[0]].tableId,
                    ColsVal:colsVal,
                    DefaultCols:defCols,
                    DefaultVals:defVals,
                    KeysId:keysId,
                    KeysVal:keysVal
                })
            }).done(function(res){
                if(!res)
                    d.reject(that._options.isDebug?'后台未返回数据':$[_pluginName].regional.eventFail);
                else {
                    var obj = $.parseJSON(res);
                    if (obj.Success == undefined)
                        d.reject(that._options.isDebug ? '后台未返回Success值' : $[_pluginName].regional.eventFail);
                    else if (obj.Success) {
                        that._deferredsFlow(
                            [that._createDeferred(that._loadData,null)],
                            null,
                            function(v){
                                that._showState(v?v:$[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail,'danger');
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
		_deleteRecord:function(d){
            var that=this,cols=this._options.columns,keysId=[],keysVal=[];
            //keys
            var curRec=this._curPageRecords[this._curRecordNo-1];
            $.each(this._keyCols, function (i,colName) {
                keysId.push(cols[colName].colId);
                keysVal.push(curRec[colName]);
            });
            $.post(this._options.deleteURL,{
                act:'Delete',
                deletePars:JSON.stringify({
                    TablesId:cols[that._keyCols[0]].tableId,
                    KeysId:keysId,
                    KeysVal:keysVal
                })
            }).done(function(res){
                if(!res)
                    d.reject(that._options.isDebug?'后台未返回数据':$[_pluginName].regional.eventFail);
                else {
                    var obj = $.parseJSON(res);
                    if (obj.Success == undefined)
                        d.reject(that._options.isDebug ? '后台未返回Success值' : $[_pluginName].regional.eventFail);
                    else if (obj.Success) {
                        that._deferredsFlow(
                            [that._createDeferred(that._loadData,null)],
                            null,
                            function(v){
                                that._showState(v?v:$[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail,'danger');
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
		_registEvents:function(){
			var that=this;
			//table tr click
			this._elements.$tableGroup.on('click.'+_pluginName,'tbody tr',function(){
				var index = $(this).data('index') - 0;
				if (index !== that._curRecordNo - 1) {
					that._selectRow(index+1);
					if (that._options.frozenNum != null)
						that._selectRowFrozen(index+1);
				}
			});
			//frozen hover
			if(this._options.frozenNum != null && this._options.canRowHover){
				this._elements.$tableGroup.on('mouseover.'+_pluginName,'tbody tr',function(){
					$('tbody tr',that._elements.$tableGroup).removeClass('active');
					$('tbody tr[data-index="'+$(this).data('index')+'"]:not(.info)',that._elements.$tableGroup).addClass('active');
				});
				this._elements.$tableGroup.on('mouseleave.'+_pluginName,'tbody tr',function(){
					$('tbody tr[data-index="'+$(this).data('index')+'"]:not(.info)',that._elements.$tableGroup).removeClass('active');
				});
			}
			//paging click
			if(this._elements.$paging){
				this._elements.$paging.on('click.'+_pluginName,'li a',function(e){
					//that._selectRow(1);
                    that._showLoading('','list');
					that._currentPageNo=$(this).text()-0;
                    that._deferredsFlow(
                        [
                            that._createDeferred(that._options.beforePaging, $.extend(true,{},{pageRecords:that._curPageRecords,pageNo:that._currentPageNo})),
                            that._createDeferred(that._loadData,null),
                            that._createDeferred(that._options.afterPaging, $.extend(true,{},{pageRecords:that._curPageRecords,pageNo:that._currentPageNo}))
                        ],
                        null,
                        function(v){
                            that._showAlert(v?v:$[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail);
                            that._showState(v?v:$[_pluginName].regional.toolbarRefresh + $[_pluginName].regional.eventFail,'danger');
                        },
                        function(){
                            that._hideLoading('list');
                        }
                    );
					e.preventDefault();
				});
			}
			//search dialog
			if(this._hasTool.search){
				//search col-btn
				this._elements.search.$block.on('click.'+_pluginName,'button[data-col]',function(){
					var $btn=$(this),$ul=that._elements.search.$col,mgTop=$ul.outerHeight(true)-$ul.outerHeight(),mgLeft=$btn.outerWidth(true)-$btn.outerWidth();
					$ul.css('top',$btn.position().top+$btn.outerHeight()-mgTop);
					$ul.css('left',$btn.position().left+mgLeft);
					$ul.data('target',$btn);
					$ul.show();
				});
				this._elements.search.$block.on('blur.'+_pluginName,'button[data-col]',function(){
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					if(!that._elements.search.$col.data('cancelBlur')){
						that._elements.search.$col.hide();
						that._elements.search.$col.data('cancelBlur',false);
					}
					else
						$(this).focus();
				});
				//search col-ul
				this._elements.search.$col.mousedown(function(e){
					e.preventDefault();
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					$(this).data('cancelBlur',true);
					setTimeout(function(){that._elements.search.$col.data('cancelBlur',false);});
				});
				this._elements.search.$col.on('click.'+_pluginName,'li',function(){
					var $this=$(this),
						$btn=that._elements.search.$col.data('target');
//						colType=that._options.columns[$this.data('col')].colType,
//						$itemValue=$btn.nextAll('.kekTable-search-itemValue');
					$btn.text($this.text()).data('col',$this.data('col'));
//					if($.inArray(colType,['number','date'])===-1)
//						$itemValue.removeClass('kekTable-number').removeClass('kekTable-date');
//					else if($.inArray($btn.nextAll('[data-opt]').data('opt'),['eq','gt','lt','ge','le','ne'])!==-1)
//						$itemValue.addClass('kekTable-'+colType);
					that._elements.search.$col.hide();
				});
				//search opt-btn
				this._elements.search.$block.on('click.'+_pluginName,'button[data-opt]',function(){
					var $btn=$(this),$ul=that._elements.search.$operator,mgTop=$ul.outerHeight(true)-$ul.outerHeight(),mgLeft=$btn.outerWidth(true)-$btn.outerWidth();
					$ul.css('top',$btn.position().top+$btn.outerHeight()-mgTop);
					$ul.css('left',$btn.position().left+mgLeft);
					$ul.data('target',$btn);
					$ul.show();
				});
				this._elements.search.$block.on('blur.'+_pluginName,'button[data-opt]',function(){
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					if(!that._elements.search.$operator.data('cancelBlur')){
						that._elements.search.$operator.hide();
						that._elements.search.$operator.data('cancelBlur',false);
					}
					else
						$(this).focus();
				});
				//search opt-ul
				this._elements.search.$operator.on('mousedown.'+_pluginName,function(e){
					e.preventDefault();
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					$(this).data('cancelBlur',true);
					setTimeout(function(){that._elements.search.$operator.data('cancelBlur',false);});
				});
				this._elements.search.$operator.on('click.'+_pluginName,'li',function(){
					var $this=$(this),
						$btn=that._elements.search.$operator.data('target'),
						//colType=that._options.columns[$btn.prevAll('[data-col]').data('col')].colType,
						$itemValue=$btn.nextAll('.kekTable-search-itemValue');
					$btn.text($this.text()).data('opt',$this.data('opt'));
//					if($.inArray($this.data('opt'),['eq','gt','lt','ge','le','ne'])===-1)
//						$itemValue.removeClass('kekTable-number').removeClass('kekTable-date');
//					else if($.inArray(colType,['number','date'])!==-1)
//						$itemValue.addClass('kekTable-'+colType);
					if($.inArray($this.data('opt'),['isnull','notnull'])===-1)
						$itemValue.attr('readonly',null);
					else
						$itemValue.attr('readonly','readonly').val('');
					that._elements.search.$operator.hide();
				});
				//search ctrl-btn
				this._elements.search.$block.on('click.'+_pluginName,'button[data-ctrl]',function(){
					var $btn=$(this),$ul=that._elements.search.$control,mgTop=$ul.outerHeight(true)-$ul.outerHeight(),mgLeft=$btn.outerWidth(true)-$btn.outerWidth();
					$ul.css('top',$btn.position().top+$btn.outerHeight()-mgTop);
					$ul.css('left',$btn.position().left+mgLeft);
					$ul.data('target',$btn);
					$ul.show();
				});
				this._elements.search.$block.on('blur.'+_pluginName,'button[data-ctrl]',function(){
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					if(!that._elements.search.$control.data('cancelBlur')){
						that._elements.search.$control.hide();
						that._elements.search.$control.data('cancelBlur',false);
					}
					else
						$(this).focus();
				});
				//search ctrl-ul
				this._elements.search.$control.on('mousedown.'+_pluginName,function(e){
					e.preventDefault();
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					$(this).data('cancelBlur',true);
					setTimeout(function(){that._elements.search.$control.data('cancelBlur',false);});
				});
				this._elements.search.$control.on('click.'+_pluginName,'li[data-ctrl]',function(){
					var $this=$(this),$btn=that._elements.search.$control.data('target');
					that['_searchCtrl_'+$this.data('ctrl')]($btn);
					that._elements.search.$control.hide();
				});
				//search bool-btn
				this._elements.search.$block.on('click.'+_pluginName,'button[data-bool]',function(){
					var $btn=$(this),$ul=that._elements.search.$bool,mgTop=$ul.outerHeight(true)-$ul.outerHeight();
					$ul.css('top',$btn.position().top+$btn.outerHeight()-mgTop);
					$ul.css('left',$btn.position().left);
					$ul.data('target',$btn);
					$ul.show();
				});
				this._elements.search.$block.on('blur.'+_pluginName,'button[data-bool]',function(){
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					if(!that._elements.search.$bool.data('cancelBlur')){
						that._elements.search.$bool.hide();
						that._elements.search.$bool.data('cancelBlur',false);
					}
					else
						$(this).focus();
				});
				//search bool-ul
				this._elements.search.$bool.on('mousedown.'+_pluginName,function(e){
					e.preventDefault();
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					$(this).data('cancelBlur',true);
					setTimeout(function(){that._elements.search.$bool.data('cancelBlur',false);});
				});
				this._elements.search.$bool.on('click.'+_pluginName,'li[data-bool]',function(){
					var $this=$(this),$btn=that._elements.search.$bool.data('target');
					$btn.text($this.text()).data('bool',$this.data('bool'));
					that._elements.search.$bool.hide();
				});
				//search value
				this._elements.search.$block.on('blur.'+_pluginName,'.kekTable-search-itemValue',function(){
					var $this=$(this),$opt=$this.prevAll('[data-opt]'),$col=$this.prevAll('[data-col]');
					if($.inArray($opt.data('opt'),['eq','gt','lt','ge','le','ne'])!==-1){
						var format=that._checkEditItemValue($col.data('col'),$this.val());
						if(format.result){
							$this.val(format.val);
							$this.parent().removeClass('has-error');
							that._elements.search.$alert.hide();
						}
						else{
							$this.parent().addClass('has-error');
							$this.focus();
							that._elements.search.$alert.text(format.val).show();
						}
					}
					else{
						$this.parent().removeClass('has-error');
						that._elements.search.$alert.hide();
					}
				});
				//search commit
				this._elements.search.$dialog.on('click.'+_pluginName,'.modal-footer .btn-primary',function(){
					var err=that._getSearchDialog();
					if(err)
						that._elements.search.$alert.text(err).show();
					else{
						that._elements.search.$alert.hide();
                        that._elements.search.$dialog.modal('hide');
                        that._currentPageNo=1;
                        that._deferredsFlow(
                            [that._createDeferred(that._loadData,null)],
                            function(){
                                that._showState($[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventSuccess);
                            },
                            function(v){
                                that._showAlert(v?v:$[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventFail);
                                that._showState(v?v:$[_pluginName].regional.toolbarSearch + $[_pluginName].regional.eventFail,'danger');
                            },
                            function(){
                                that._hideLoading('list');
                            }
                        );
					}
				});
			}
			//sort dialog
			if(this._hasTool.sort){
				//sort addlist
				this._elements.sort.$ctrl.on('click.'+_pluginName,'.kekTable-dropList li:not(.disabled)',function(){
					var $this=$(this),
						col=$this.data('col'),
						$li=$('<li class="list-group-item">'+$this.text()+'<span class="glyphicon glyphicon-sort-by-attributes pull-right"></span></li>');
					$li.data('col',col).data('type','ASC').data('nulls','NULLS FIRST');
					that._elements.sort.$block.append($li);
					$this.addClass('disabled');
				});
				//sort delete
				this._elements.sort.$ctrl.on('click.'+_pluginName,'.btn:has(.glyphicon-remove)',function(){
					var $li=that._elements.sort.$block.children('.active');
					that._elements.sort.$ctrl.find('.kekTable-dropList li[data-col="'+$li.data('col')+'"]').removeClass('disabled');
					$li.remove();
				});
				//sort up
				this._elements.sort.$ctrl.on('click.'+_pluginName,'.btn:has(.glyphicon-chevron-up)',function(){
					var $li=that._elements.sort.$block.children('.active');
					$li.prev().before($li);
				});
				//sort down
				this._elements.sort.$ctrl.on('click.'+_pluginName,'.btn:has(.glyphicon-chevron-down)',function(){
					var $li=that._elements.sort.$block.children('.active');
					$li.next().after($li);
				});
				//sort type
				this._elements.sort.$ctrl.on('change.'+_pluginName,'[name=sort-type]',function(){
					var type=$(this).val(),$li=that._elements.sort.$block.children('.active');
					$li.data('type',type).children('.glyphicon')
						.removeClass(type==='ASC'?'glyphicon-sort-by-attributes-alt':'glyphicon-sort-by-attributes')
						.addClass(type==='ASC'?'glyphicon-sort-by-attributes':'glyphicon-sort-by-attributes-alt');
				});
				//sort nulls
				this._elements.sort.$ctrl.on('change.'+_pluginName,'[name=sort-nulls]',function(){
					var type=$(this).val(),$li=that._elements.sort.$block.children('.active');
					$li.data('nulls',type);
				});
				//sort block
				this._elements.sort.$block.on('click.'+_pluginName,'li',function(){
					var $this=$(this);
					that._elements.sort.$block.children('li.active').removeClass('active');
					$this.addClass('active');
					that._elements.sort.$ctrl.find('input[name="sort-type"][value="'+$this.data('type')+'"]').click();
					that._elements.sort.$ctrl.find('input[name="sort-nulls"][value="'+$this.data('nulls')+'"]').click();
				});
				//sort commit
				this._elements.sort.$dialog.on('click.'+_pluginName,'.modal-footer .btn-primary',function(){
					that._sortConditions.length=0;
					that._elements.sort.$block.children('li').each(function(i,li){
						var data=$(li).data();
						that._sortConditions.push({Col:data.col,Type:$.inArray(data.type,['ASC','DESC'])===-1?'ASC':data.type ,Nulls:$.inArray(data.nulls,['NULLS FIRST','NULLS LAST'])===-1?'NULLS FIRST':data.nulls});
					});
                    that._elements.sort.$dialog.modal('hide');
                    that._currentPageNo=1;
                    that._deferredsFlow(
                        [that._createDeferred(that._loadData,null)],
                        function(){
                            that._showState($[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventSuccess);
                        },
                        function(v){
                            that._showAlert(v?v:$[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventFail);
                            that._showState(v?v:$[_pluginName].regional.toolbarSort + $[_pluginName].regional.eventFail,'danger');
                        },
                        function(){
                            that._hideLoading('list');
                        }
                    );
				});
				
			}
			//edit dialog
			if(this._hasTool.add || this._hasTool.edit){
				//edit item
				this._elements.edit.$block.on('change.'+_pluginName,'[data-col]',function(e,defs){
					var deferreds=defs||[],$this=$(this);
					that._editItemChange($this.data('col'),$this.val(),deferreds);
					$.whenAll.apply($,deferreds)
							 .always(function(){
								that._hideLoading('edit');
                                var errs=that._elements.edit.$block.find('.has-error');
                                if(errs.length)
                                    that._elements.edit.$alert.text(errs.attr('title')).show();
                                else
                                    that._elements.edit.$alert.hide();
							 });
				});
				this._elements.edit.$block.on('focus.'+_pluginName,'[data-col]',function(){
					var $group=$(this).parents('.form-group');
					if($group.hasClass('has-error'))
						that._elements.edit.$alert.text($group.attr('title')).show();
				});
				//date
				this._elements.edit.$block.on('keypress.'+_pluginName,'.kekTable-date,.kekTable-datetime',function(e){
					var c=e.which;
					if (!((c >= 47 && c <= 58) || c == 45|| c == 92|| c == 32))
                    	e.preventDefault();
				});
				//number
				this._elements.edit.$block.on('keypress.'+_pluginName,'.kekTable-numbere',function(e){
					var c = e.which;
	                if (!((c >= 48 && c <= 57) || (c == 46)))
	                    e.preventDefault();
				});
				//list type input
				this._elements.edit.$block.on('click.'+_pluginName,'.kekTable-list-input',function(){
					var li=[],$this=$(this),colName=$this.data('col'),
                        def=that._createDeferred(that._options.columns[colName].editList,that._deferredObject)();
					that._showLoading($[_pluginName].regional.loadList,'edit');
					def.done(function(v){
						//$.each(v, function(i,liItem) {
						//	li.push($('<li />').data('val',liItem[0]).append($('<span />').text(liItem[1])));
						//});
                        if(v==null)
                            v=that._options.columns[colName].listList;
                        $.each(v,function(name,val){
                            li.push($('<li />').data('val',name).append($('<span />').html($.trim(val)===''?'&nbsp':val)));
                        });
					}).always(function(){
						var $ul=that._elements.edit.$list,
							$btn=$this.parents('.form-group'),
							mgTop=$ul.outerHeight(true)-$ul.outerHeight(),
							mgLeft=$btn.outerWidth(true)-$btn.outerWidth();
						$ul.css('top',$btn.position().top+$btn.outerHeight()-mgTop);
						$ul.css('left',$btn.position().left+mgLeft);
						$ul.data('target',colName);
						$ul.empty().append(li).show();
						$this.focus();
						that._hideLoading('edit');
					});
				});
				this._elements.edit.$block.on('blur.'+_pluginName,'.kekTable-list-input',function(){
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					if(!that._elements.edit.$list.data('cancelBlur')){
						that._elements.edit.$list.hide();
						that._elements.edit.$list.data('cancelBlur',false);
					}
					else
						$(this).focus();
				});
				//$list
				this._elements.edit.$list.on('mousedown.'+_pluginName,function(e){
					e.preventDefault();
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					$(this).data('cancelBlur',true);
					setTimeout(function(){that._elements.edit.$list.data('cancelBlur',false);});
				});
				this._elements.edit.$list.on('click.'+_pluginName,'li',function(){
					var $this=$(this),
						$btn=$('[data-col="'+that._elements.edit.$list.data('target')+'"]',that._elements.edit.$block);
					$btn.val($this.data('val'));
					$btn.change();
					that._elements.edit.$list.hide();
				});
				//lov type input
				this._elements.edit.$block.on('click.'+_pluginName,'.kekTable-lov-input',function(){
					var thead=[],tbody=[],$this=$(this),colName=$this.data('col'),
						cols=that._options.columns,
                        def=that._createDeferred(that._options.columns[colName].editList,that._deferredObject)();
					that._showLoading($[_pluginName].regional.loadList,'edit');
					$.each(cols[colName].lovCols, function(i,col) {
						thead.push('<td>'+(cols[col]?cols[col].editTitle:col)+'</td>');
					});
					def.done(function(v){
						$.each(v, function(i,record) {
							var tr=[];
							for(var j=0,k=cols[colName].lovCols.length;j<k;j++)
								tr.push('<td>'+record[j]+'</td>');
							tbody.push('<tr>'+tr.join('')+'</tr>');
						});
					}).always(function(){
						var $ul=that._elements.edit.$lov,
							$btn=$this.parents('.form-group'),
							mgTop=$ul.outerHeight(true)-$ul.outerHeight(),
							mgLeft=$btn.outerWidth(true)-$btn.outerWidth();
						$ul.css('top',$btn.position().top+$btn.outerHeight()-mgTop);
						$ul.css('left',$btn.position().left+mgLeft);
						$ul.data('target',colName);
						$ul.children('table').empty().append('<thead>'+thead.join('')+'</thead><tbody>'+tbody.join('')+'</tbody>');
						$ul.show();
						$this.focus();
						that._hideLoading('edit');
					});
				});
				this._elements.edit.$block.on('blur.'+_pluginName,'.kekTable-lov-input',function(){
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					if(!that._elements.edit.$lov.data('cancelBlur')){
						that._elements.edit.$lov.hide();
						that._elements.edit.$lov.data('cancelBlur',false);
					}
					else
						$(this).focus();
				});
				//$lov
				this._elements.edit.$lov.on('mousedown.'+_pluginName,function(e){
					e.preventDefault();
					//ie在mousedown滚动条的时候e.preventDefault无效，会触发blur
					$(this).data('cancelBlur',true);
					setTimeout(function(){that._elements.edit.$lov.data('cancelBlur',false);});
				});
				this._elements.edit.$lov.on('click.'+_pluginName,'tr',function(){
					var $tds=$('td',$(this)),
						deferreds=[],//lov每个字段afterChange
						colName=that._elements.edit.$lov.data('target'),
						cols=that._options.columns,
						lovCols=cols[colName].lovCols;
					that._elements.edit.$lov.hide();
					that._showLoading('','edit');
					$tds.each(function(i) {
						var col=cols[lovCols[i]];
						if(col){
							var defs=[],//字段afterChange的返回
                                $btn=$('[data-col="'+lovCols[i]+'"]',that._elements.edit.$block),
								d=$.Deferred();
							deferreds.push(d);
                            $btn.val($(this).text());
                            $btn.trigger('change',[defs]);
							//that._editItemChange(lovCols[i],$(this).text(),defs);
							$.whenAll.apply($,defs)
								 .always(function(){
									d.resolve();
								 });
						}
					});
					$.whenAll.apply($,deferreds)
						 .always(function(){
							that._hideLoading('edit');
						 });
				});
				//edit commit
				this._elements.edit.$dialog.on('click.'+_pluginName,'.modal-footer .btn-primary',function(){
					var errs=that._elements.edit.$block.find('.has-error');
					if(errs.length)
						that._elements.edit.$alert.text(errs.attr('title')).show();
					else{
                        that._showLoading('','edit');
                        if(that._tableStatus=='add'){
                            that._deferredsFlow(
                                [
                                    that._createDeferred(that._options.beforeInsert, that._deferredObject),
                                    that._createDeferred(that._insertRecord,null),
                                    that._createDeferred(that._options.afterInsert, that._deferredObject)
                                ],
                                function(){
                                    that._showState($[_pluginName].regional.toolbarAdd + $[_pluginName].regional.eventSuccess);
                                    that._elements.edit.$dialog.modal('hide');
                                },
                                function(v){
                                    that._elements.edit.$alert.text(v?v:$[_pluginName].regional.toolbarAdd + $[_pluginName].regional.eventFail,'danger').show();
                                },
                                function(){
                                    that._hideLoading('edit');
                                }
                            );
                        }
                        else if(that._tableStatus=='edit'){
                            that._deferredsFlow(
                                [
                                    that._createDeferred(that._options.beforeUpdate, that._deferredObject),
                                    that._createDeferred(that._updateRecord,null),
                                    that._createDeferred(that._options.afterUpdate, that._deferredObject)
                                ],
                                function(){
                                    that._showState($[_pluginName].regional.toolbarEdit + $[_pluginName].regional.eventSuccess);
                                    that._elements.edit.$dialog.modal('hide');
                                },
                                function(v){
                                    that._elements.edit.$alert.text(v?v:$[_pluginName].regional.toolbarEdit + $[_pluginName].regional.eventFail,'danger').show();
                                },
                                function(){
                                    that._hideLoading('edit');
                                }
                            );
                        }
					}
				})
			}
		},
        //endregion==================注册插件事件==================
		//region   ===================查询框事件===================
		//查询添加条件至前
		//$btn:ctrl按钮
		_searchCtrl_pc:function($btn){
			var $li=$btn.parent();
			if($li.index()===0){
				$li.before(this._searchAdd_itemFirst());
				$li.prepend(this._searchAdd_bool());
			}
			else
				$li.before(this._searchAdd_item());
		},
		//查询添加条件至后
		//$btn:ctrl按钮
		_searchCtrl_nc:function($btn){
			$btn.parent().after(this._searchAdd_item());
		},
		//查询添加条件组至前
		//$btn:ctrl按钮
		_searchCtrl_pg:function($btn){
			var $li=$btn.parent();
			if($li.index()===0)
				this._searchCtrl_ng($btn);
			else
				$li.before(this._searchAdd_subBlock());
		},
		//查询添加条件组至后
		//$btn:ctrl按钮
		_searchCtrl_ng:function($btn){
			$btn.parent().after(this._searchAdd_subBlock());
		},
		//查询删除条件
		//$btn:ctrl按钮
		_searchCtrl_del:function($btn){
			var $li=$btn.parent(),$ul=$li.parent(),index=$li.index();
			if($ul.hasClass('kekTable-search-block-sub') && $ul.children().length==1)
				$ul.parent().remove();
			else{
				if($li.index()===0)
					$li.next().children('[data-bool]').remove();
				$li.remove();
			}
		},
		//添加第一个条件 (search-itemValue have data-col)
		_searchAdd_itemFirst:function(){
			return ('<li><button class="btn btn-default dropdown-toggle kekTable-search-item-first" type="button" data-col="">'+$[_pluginName].regional.defaultCol
									+'</button><button class="btn btn-default dropdown-toggle" type="button" data-opt="eq">=</button><input type="text" class="form-control kekTable-search-itemValue"><button class="btn btn-default dropdown-toggle" type="button" data-ctrl=""><span class="glyphicon glyphicon-cog"></span></button></li>');
		},
		//添加and、or按钮
		_searchAdd_bool:function(){
			return ('<button class="btn btn-default dropdown-toggle" type="button" data-bool="AND">'+$[_pluginName].regional.searchBoolAnd+'</button>');
		},
		//添加ctrl按钮
		_searchAdd_ctrl:function(){
			return ('<button class="btn btn-default dropdown-toggle" type="button" data-ctrl=""><span class="glyphicon glyphicon-cog"></span></button>');
		},
		//添加非第一个条件
		_searchAdd_item:function(){
			return $(this._searchAdd_itemFirst()).prepend(this._searchAdd_bool());
		},
		//添加条件组
		_searchAdd_subBlock:function(){
			var $li=$('<li />');
			$li.append(this._searchAdd_bool()).append($('<ul class="kekTable-search-block-sub"></ul>').append(this._searchAdd_itemFirst())).append(this._searchAdd_ctrl());
			return $li;
		},
		//endregion===================查询框事件===================
		//region   ===================编辑框事件===================
		//改变值之后。检核值，afterChange()，_setEditItemValue()
        //isInit是否打开对话框时的初始化操作
		_editItemChange:function(colName,val,deferreds,itemTriggered,isInit){
			this._showLoading('','edit');
			this._editRecord[colName]=val;
			var regional=$[_pluginName].regional,
				def,setItems,
				that=this,
				valFormat=this._checkEditItemValue(colName,val),
                $editInput=this._elements.edit.$block.find('[data-col="'+colName+'"]'),
                oldVal=this._tableStatus=='add'?'':this._curPageRecords[this._curRecordNo-1][colName];
            if(!itemTriggered)
                itemTriggered=[];
            if($.inArray(colName,itemTriggered)!==-1){
                this._showAlert(regional.processErr);
                throw 'afterChange有循环引用'+colName;
            }
            //格式化值成功
			if(valFormat.result){
                var lenErr=this._checkColLength(valFormat.val,this._options.columns[colName].colLength);
                if(!lenErr) {
                    this._editRecord[colName] = valFormat.val;
                    if (!isInit && that._options.columns[colName].afterChange) {
                        def = this._createDeferred(function (o, d) {
                                setItems = that._options.columns[colName].afterChange(o, d);
                            },
                            that._deferredObject
                        )().fail(function (v) {
                            $editInput.val(val);
                            that._setEditStatus(colName,-1,(that._options.columns[colName].editTitle || colName) + ':' + v);
                            //var errMsg = (that._options.columns[colName].editTitle || colName) + ':' + v;
                            //$editInput.val(val).data('status', -1).parents('.form-group').removeClass('has-success').addClass('has-error').attr('title', errMsg);
                            //that._elements.edit.$alert.text(errMsg).show();
                        }).done(function (v) {
                            v=v==null?'':v;
                            var afterFormat=that._checkEditItemValue(colName,v);
                            if(afterFormat.result){
                                if(afterFormat.val===oldVal)
                                    that._setEditStatus(colName,0);
                                else
                                    that._setEditStatus(colName,1);
                                //$editInput.val(v).data('status', v === oldVal ? 0 : 1).parents('.form-group').removeClass('has-error' + (v === oldVal ? ' has-success' : '')).addClass(v === oldVal ? '' : 'has-success').attr('title', null);
                                that._editRecord[colName] = afterFormat.val;
                                $editInput.val(afterFormat.val);
                                //list将$input的val改成显示文字，将值存入data('val');
                                if(that._options.columns[colName].editType==='list'){
                                    var list=that._options.columns[colName].listList,
                                        listVal=$editInput.val();
                                    $editInput.data('val',listVal);
                                    if(list[listVal]!=undefined)
                                        $editInput.val(list[listVal]);
                                }
                            }
                            else{
                                $editInput.val(v);
                                that._setEditStatus(colName,-1,(that._options.columns[colName].editTitle || colName) + ':' + afterFormat.val);
                            }
                            that._elements.edit.$alert.text('').hide();
                        });
                        deferreds.push(def);
                        itemTriggered.push(colName);
                        if (setItems) {
                            if ($.type(setItems) !== 'array') {
                                this._showAlert(regional.processErr);
                                throw 'afterChange的返回值必需是二维数组';
                            }
                            $.each(setItems, function (i, item) {
                                that._elements.edit.$block.find('[data-col="' + item[0] + '"]').val(item[1]);
                                that._editItemChange(item[0], item[1], deferreds, itemTriggered);
                            });
                        }
                    }
                    else {
                        $editInput.val(valFormat.val);
                        if(oldVal === valFormat.val)
                            that._setEditStatus(colName,0);
                        else
                            that._setEditStatus(colName,1);
                        //data('status', oldVal === valFormat.val ? 0 : 1).parents('.form-group').removeClass('has-error' + (oldVal === valFormat.val ? ' has-success' : '')).addClass(oldVal === valFormat.val ? '' : 'has-success').attr('title', null);
                    }
                }
                else{
                    that._setEditStatus(colName,-1,(that._options.columns[colName].editTitle||colName)+':'+valFormat.val);
                    $editInput.val(val);
                    //var errMsg=(that._options.columns[colName].editTitle||colName)+':'+valFormat.val;
                    //$editInput.val(val).data('status',-1).parents('.form-group').removeClass('has-success').addClass('has-error').attr('title',errMsg);
                    //that._elements.edit.$alert.text(errMsg).show();
                }
			}
			else{
				//var errMsg=(that._options.columns[colName].editTitle||colName)+':'+valFormat.val;
                $editInput.val(val);
                that._setEditStatus(colName,-1,(that._options.columns[colName].editTitle||colName)+':'+valFormat.val);
                //$editInput.val(val).data('status',-1).parents('.form-group').removeClass('has-success').addClass('has-error').attr('title',errMsg);
				//that._elements.edit.$alert.text(errMsg).show();
			}
		},
		//检核输入的值
		//返回{result:true or false,val:'formatValue or errMsg'}
		_checkEditItemValue:function(colName,val){
            val=val==null?'':val;
			var res={result:true,val:val},
                regional=$[_pluginName].regional,
                col=this._options.columns[colName];
            //不能为空
            if(col.isRequire && (val==null || val=='')){
                res.result=false;
                res.val=regional.errNull;
                return res;
            }
			switch (col.colType){
				case 'date':
					res.val=this._checkDate(val);
					res.val===false && ((res.result=false) || (res.val=regional.errDateFormat));
					return res;
				case 'datetime':
					res.val=this._checkDateTime(val);
					res.val===false && ((res.result=false) || (res.val=regional.errDateTimeFormat));
					return res;
                case 'number':
                    res.val=this._checkNumber(val);
                    res.val===false && ((res.result=false) || (res.val=regional.errNumberFormat));
                    return res;
				default:
					return res;
			}
		},
        //status:-1Error,0NoChange,1Success
        _setEditStatus:function(colName,status,msg){
            var $editInput=this._elements.edit.$block.find('[data-col="'+colName+'"]');
            $editInput.data('status',status);
            if(status===-1) {
                $editInput.parents('.form-group').removeClass('has-success').addClass('has-error').attr('title', msg||'');
                this._elements.edit.$alert.text(msg||'').show();
            }
            else if(status===0){
                $editInput.parents('.form-group').removeClass('has-success has-error').attr('title', null);
                this._elements.edit.$alert.hide();
            }
            else if(status===1){
                $editInput.parents('.form-group').removeClass('has-error').addClass('has-success').attr('title', null);
                this._elements.edit.$alert.hide();
            }
        },
		//endregion===================编辑框事件===================
		//region   ====================表格事件====================
		//选中一行,起始1
		_selectRow:function(num){
			var $tbody=$('table:not(".kekTable-table-frozen") tbody',this._elements.$tableGroup);
			$tbody.children('tr').removeClass('info');
			$tbody.children('[data-index="'+(num-1)+'"]').addClass('info');
            this._curRecordNo=num;
			//this._tableValues.curRecord=this._curPageRecords[this._curRecordNo-1];
		},
		//选中frozen表
		_selectRowFrozen:function(num){
			var $tbody=$('.kekTable-table-frozen tbody',this._elements.$tableGroup);
			$tbody.children('tr').removeClass('info');
			$tbody.children('[data-index="'+(num-1)+'"]').addClass('info');
		},
        //endregion====================表格事件====================
        //region   ===================排序框转换===================
		/**
		 * 将排序条件列表数组显示到排序对话框中
		 * arr: sortConditions - 排序的条件列表
		 */
		_setSortDialog:function(arr){
			var $block=this._elements.sort.$block,
				regional=$[_pluginName].regional,
				$df=$(document.createDocumentFragment()),
				that=this;
			that._elements.sort.$ctrl.find('.kekTable-dropList li.disabled').removeClass('disabled');
			$.each(arr, function(i,data) {
				var $colLi=that._elements.sort.$ctrl.find('.kekTable-dropList li[data-col="'+data.Col+'"]'),
					$li=$('<li />')
						.addClass('list-group-item')
						.text($colLi.text())
						.data('col',data.Col).data('type',data.Type).data('nulls',data.Nulls)
						.append('<span class="glyphicon '+(data.Type==='ASC'?'glyphicon-sort-by-attributes':'glyphicon-sort-by-attributes-alt')+' pull-right"></span>');
				$df.append($li);
				$colLi.addClass('disabled');
			});
			$block.empty().append($df);
		},
		//endregion===================排序框转换===================
        //region   ===================查询框转换===================
		/**
		 * 将查询条件列表数组显示到查询对话框中
		 * arr: searchConditions - 查询的条件列表
		 */
		_setSearchDialog:function(arr){
			var $block=this._elements.search.$block,
				regional=$[_pluginName].regional,
				that=this,
				$df=$(document.createDocumentFragment());
			if(!arr || !arr.length)
				$block.empty().append(this._searchAdd_itemFirst());
			else{
				$.each(arr, function(i,condition) {
					var $li=that._setSearchDialog_item(i,condition);
					$df.append($li);
				});
				$block.empty().append($df);
			}
		},
		_setSearchDialog_item:function(i,arr){
			var j=i?1:0,$li=$('<li></li>'),that=this;
			if(arr.Child){
				var $ul=$('<ul class="kekTable-search-block-sub"></ul>');
				$.each(arr.Child, function(index,condition) {
					$ul.append(that._setSearchDialog_item(index,condition))
				});
				$li.append($ul).append(this._searchAdd_ctrl());
			}
			else{
				$li=$(this._searchAdd_itemFirst());
				//col
				$li.children('[data-col]').data('col',arr.Col).text(this._elements.search.$col.children('li[data-col="'+arr.Col+'"]').text());
				//opt
				$li.children('[data-opt]').data('opt',arr.Opt).text(this._elements.search.$operator.children('li[data-opt="'+arr.Opt+'"]').text());
				//val
				if($.inArray(arr.Opt,['isnull','notnull'])===-1)
					$li.children('.kekTable-search-itemValue').val(arr.Val);
				else
					$li.children('.kekTable-search-itemValue').attr('readonly','readonly');
			}
			//bool
			if(j){
				var $bool=$(this._searchAdd_bool());
				$bool.data('bool',arr.Bool).text(this._elements.search.$bool.children('li[data-bool="'+arr.Bool+'"]').text());
				$li.prepend($bool);
			}
			return $li;
		},
		/**
		 * 将查询框中的条件转换成查询数组(_searchConditions赋值)
		 * return 异常信息
		 */
		_getSearchDialog:function(){
			var $li=this._elements.search.$block.children('li'),arr=[];
			for(var i=0,j=$li.length;i<j;i++){
				var li=this._getSearchDialog_item($($li[i]));
				if($.type(li)!=='object') {
					//this._elements.search.$dialog.find('.modal-footer .alert').show();
					return li;
				}
				arr.push(li);
			}
			this._searchConditions=arr;
			return false;
		},
		//生成查询条件一位数组
		_getSearchDialog_item: function($li) {
			var arr = {},col,opt,val,bool,nullOpt,sub,
				regional=$[_pluginName].regional,
				index=$li.index(),
				$col = $li.children('[data-col]'),
				$opt = $li.children('[data-opt]'),
				$val = $li.children('.kekTable-search-itemValue'),
				$bool=$li.children('[data-bool]'),
				$sub=$li.children('.kekTable-search-block-sub').children('li');
			//非子条件组
			if ($col.length) {
				col=$col.data('col');
				opt=$opt.data('opt');
				val=$val.val();
				nullOpt=opt.indexOf('null') != -1;
				//转换opt,val
				if (!col) {
					$col.addClass('btn-danger');
					return regional.errNull;
				} else
					$col.removeClass('btn-danger');
				if (!opt) {
					$opt.addClass('btn-danger');
					return regional.errNull;
				} else
					$opt.removeClass('btn-danger');
				if (!nullOpt) {
					if(val === ''){
						$li.addClass('has-error');
						$val.focus();
						return regional.errNull;
					}
					if($.inArray(opt,['beg','end','like'])===-1){
						var valFormat=this._checkEditItemValue(col,val);
						if(!valFormat.result){
							$li.addClass('has-error');
							$val.focus();
							return valFormat.val;
						}
						$val.val(valFormat.val);
						val=valFormat.val;
//						//日期格式
//						if(this._options.columns[col].colType==='date'){
//							var valFormat=this._checkDate(val);
//							if(!valFormat ){
//								$li.addClass('has-error');
//								$val.focus();
//								return regional.errDateFormat;
//							}
//							$val.val(valFormat);
//							val=valFormat;
//						}
//						else if(this._options.columns[col].colType==='datetime'){
//							var valFormat=this._checkDateTime(val);
//							if(!valFormat ){
//								$li.addClass('has-error');
//								$val.focus();
//								return regional.errDateTimeFormat;
//							}
//							$val.val(valFormat);
//							val=valFormat;
//						}
					}
					$li.removeClass('has-error');
				}
				arr.Col = col;
				arr.Opt = opt;
				!nullOpt && (arr.Val=val);
			}
			else{
				if(!$sub.length)
					return regional.searchErr;
				sub=[];
				for(var i=0,j=$sub.length;i<j;i++){
					var subRet=this._getSearchDialog_item($($sub[i]));
					if($.type(subRet)==='string') return subRet;
					sub.push(subRet);
				}
				arr.Child=sub;
			}
			if(index>0){
				if(!$bool.length)
					return regional.searchErr;
				arr.Bool=$bool.data('bool');
			}
			return arr;
		},
		//将_searchCondigions转换为供ajax的参数(将colName转成colId)
		_toSearchPost:function(conditions){
			var that=this;
			$.each(conditions, function(i,condition) {
				that._toSearchPostItem(i,condition);
			});
			return conditions;
		},
		//将_searchCondigion转换为供ajax的参数(将colName转成colId)
		//i:searchConditions下标
		//condition:searchConditions中的项
		_toSearchPostItem:function(i,condition){
			if(condition.Child)
				this._toSearchPost(condition.Child);
			else{
				var col=this._options.columns[condition.Col];
				//col
				if(col)
					condition.Col=col.colId;
				else{
					this._showAlert($[_pluginName].regional.processErr);
					throw '_toSearchPostItem:'+condition.Col;
				}
				//opt val
				switch (condition.Opt){
					case 'eq':
						condition.Opt='=';
						break;
					case 'gt':
						condition.Opt='>';
						break;
					case 'lt':
						condition.Opt='<';
						break;
					case 'ge':
						condition.Opt='>=';
						break;
					case 'le':
						condition.Opt='<=';
						break;
					case 'ne':
						condition.Opt='<>';
						break;
					case 'beg':
						condition.Opt='LIKE';
						condition.Val+='%';
						break;
					case 'end':
						condition.Opt='LIKE';
						condition.Val='%'+condition.Val;
						break;
					case 'like':
						condition.Opt='LIKE';
						condition.Val='%'+condition.Val+'%';
						break;
					case 'isnull':
						condition.Opt='IS NULL';
						break;
					case 'notnull':
						condition.Opt='IS NOT NULL';
						break;
					default:
						this._showAlert($[_pluginName].regional.processErr);
						throw '_toSearchPostItem:无此符号 '+condition.Opt;
						break;
				}
			}
		},
        //endregion===================查询框转换===================
        //region   ==================数据格式检查==================
		//将字符串转换为date(yyyy/mm/dd)，异常返回false
		_checkDate:function(str){
            str=$.trim(str);
            if(str) {
                var match = str.match(/^(\d{4})[\/\\\-]?(0?[1-9]|1[012])[\/\\\-]?(0?[1-9]|[12][0-9]|3[01])$/);
                if (match) {
                    var newDate = new Date(match[1], match[2] - 1, match[3]);
                    if ((newDate.getMonth() !== match[2] - 1) || (newDate.getFullYear() !== match[1] - 0))
                        return false;
                    if (match[2].length === 1) match[2] = '0' + match[2];
                    if (match[3].length === 1) match[3] = '0' + match[3];
                    return match[1] + '/' + match[2] + '/' + match[3];
                }
                else
                    return false;
            }
            else
                return str;
		},
		//将字符串转换为datetime(yyyy/mm/dd hh24:mi:ss)，异常返回false
		_checkDateTime:function(str){
            str=$.trim(str);
            if(str) {
                var match = str.match(/^(\d{4})[\/\\\-]?(0?[1-9]|1[012])[\/\\\-]?(0?[1-9]|[12][0-9]|3[01])\s?([01]?[0-9]|2[0-3])\:?([0-5]?[0-9])\:?([0-5]?[0-9]?)$/);
                if (match) {
                    var newDate = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
                    if ((newDate.getMinutes() !== match[5] - 0) || (newDate.getHours() !== match[4] - 0) || (newDate.getDate() !== match[3] - 0) || (newDate.getMonth() !== match[2] - 1) || (newDate.getFullYear() !== match[1] - 0))
                        return false;
                    if (match[2].length === 1) match[2] = '0' + match[2];
                    if (match[3].length === 1) match[3] = '0' + match[3];
                    if (match[4].length === 1) match[4] = '0' + match[4];
                    if (match[5].length === 1) match[5] = '0' + match[5];
                    if (match[6].length === 1) match[6] = '0' + match[6];
                    return match[1] + '/' + match[2] + '/' + match[3] + ' ' + match[4] + ':' + match[5] + ':' + (match[6] === '' ? '00' : match[6]);
                }
                else
                    return false;
            }
            else
                return str;
		},
        //将字符串转换为数字，异常返回false
        _checkNumber:function(str){
            str=parseFloat(str);
            if(str==str)
                return str;
            else
                return false;
        },
        /**
         * @function Plugin~_checkColLength
         * @desc 检查值字节数
         * @param {?string} [colVal] - 值
         * @param {?string} [colLen] - 最大字节数
         * @returns {?string|undefined} - 异常信息或者undefined
         */
        _checkColLength:function(colVal,colLen){
            if(colLen){
                colVal+='';
                var lenSplit=(colLen+'').split('.');//将colLen转化成文字数组['3','2']
                var valSplit=colVal.split('.');//将colVal转化成文字数组
                //总长度(整数+小数)
                var allLen=0;
                for(var i in lenSplit)
                    allLen+=parseInt(lenSplit[i]);
                //数字格式
                if(lenSplit.length===2){
                    //数字超长
                    if(valSplit[0].length>lenSplit[0] || (valSplit[1] && valSplit[1].length>lenSplit[1]))
                        return $[_pluginName].regional.errNumLength.replace('/i',lenSplit[0]).replace('/f',lenSplit[1]);
                    //去掉.号
                    colVal=colVal.replace(/\.\-\+/g,'');
                }
                //计算colVal的总长度
                var valLen= 0,chBytes=this._options.chBytes;
                //----按字节算长度的话，遍历每个值
                if(this._options.isByte){
                    for(var j= 0,l=colVal.length;j<l;j++){
                        if(colVal.charCodeAt(j)>256)
                            valLen+=chBytes;
                        else
                            valLen+=1;
                    }
                }
                //----非字节算长度
                else {
                    chBytes=1;
                    valLen = colVal.length;
                }
                //超出总长度(colLen)
                if(valLen>allLen){
                    if(lenSplit.length===1)
                        return $[_pluginName].regional.errCharLength.replace('/a',colLen).replace('/c',chBytes);
                    else
                        return $[_pluginName].regional.errNumLength.replace('/i',lenSplit[0]).replace('/f',lenSplit[1]);
                }
            }

        },
        //endregion==================数据格式检查==================
        //region   ==================加载遮罩开闭==================
        /**
		 * @function Plugin~_showLoading
		 * @desc 显示加载遮罩
		 * @param {?string} [msg=regional.loadingTxt] - 加载提示文字
		 * @param {?string} [el='list'] - 哪个对象要显示加载遮罩('list'、'edit')，两者不可同时显示。空为当前遮罩
		 * @param {?int} [delay=this._options._loadingDelay] - 延时(毫秒)
		 */
		_showLoading:function(msg,el,delay){
			el=el||this._curLoading||'list';
			var $el=el==='edit'?this._elements.$editLoading:this._elements.$loading;
			$('.alert',$el).text(msg||$[_pluginName].regional.loadingTxt);
			if(el!==this._curLoading){
				this._hideLoading(this._curLoading);
				delay=delay||this._options.loadingDelay;
				this._loadingDelay || (this._loadingDelay=setTimeout(function(){$el.show();},delay));
			}
			this._curLoading=el;
		},
		/**
		 * @function Plugin~_hideLoading
		 * @desc 隐藏加载遮罩(从loading列中去除)
		 * @param {?string} [el='list'] - 哪个对象要显示加载遮罩('list'、'edit')，两者不可同时显示
		 */
		_hideLoading:function(el){
			el=el||this._curLoading;
			var $el=el==='edit'?this._elements.$editLoading:this._elements.$loading;
			this._loadingDelay && clearTimeout(this._loadingDelay);
			this._loadingDelay=null;
			$el.hide();
			this._curLoading=null;
		},
        //endregion==================加载遮罩开闭==================
        //region   ===================显示提示框===================
		_showAlert:function(msg){
			$('.modal-body p',this._elements.$alert).text(msg);
			this._elements.$alert.modal('show');
		},
        //endregion===================显示提示框===================
        //region   ==================显示状态信息==================
		//显示table-foot状态信息
		//type:alert样式(danger、success)
		_showState:function(msg,type){
			if(msg){
				this._elements.$state.text(msg).removeClass(type=='danger'?'alert-success':'alert-danger').addClass(type=='danger'?'alert-danger':'alert-success');
				this._elements.$state.show();
			}
		},
        //endregion==================显示状态信息==================
        //region   ====================Deferred====================
        /**
         * @function Plugin~_deferredsFlow
         * @desc deferreds流，按顺序执行
         * @param deferreds _createDeferred()数组
         * @param doneHandler 全部成功执行完毕回调
         * @param failHandler 有失败后回调
         * @param alwaysHandler 以上两种情况都会回调
         */
        _deferredsFlow: function (deferreds,doneHandler,failHandler,alwaysHandler) {
            var that=this;
            if(deferreds.length){
                var firstDeferred=deferreds.shift()();//取得第一个deferred，并将其从数组中去掉
                if($.isFunction(firstDeferred.promise)){
                    firstDeferred.done(function(){
                        that._deferredsFlow(deferreds,doneHandler,failHandler,alwaysHandler);
                    }).fail(function (v) {
                        failHandler(v);
                    }, function (v) {
                        alwaysHandler(v);
                    });
                }
                else
                    this._deferredsFlow(deferreds,doneHandler,failHandler,alwaysHandler);
            }
            else{
                doneHandler && doneHandler();
                alwaysHandler && alwaysHandler();
            }
        },
        //handlerObject是类或者返回类的函数
        _createDeferred: function (handler,handlerObject) {
            var that=this;
            return function() {
                var def = $.Deferred();
                if(handler)
                    handler.call(that,($.isFunction(handlerObject)?handlerObject.call(that):handlerObject), def);
                else
                    def.resolve();
                return def.promise();
            };
        },
        /**
         * @typedef Plugin~_deferredObject
         * @desc 当前页面上的一系列值。供外部接口
         * @prop {object.<colEntity>} [curRecord=null] - 选中的数据(值传递不可修改)，已转换为colEntity类
         * @prop {object.<colEntity>} [editRecord=null] - 修改框中的数据(值传递不可修改)，已转换为colEntity类
         * @prop {Array.<object.<colEntity>>} [pageRecords=null] - 当前页的数据(值传递不可修改)，已转换为colEntity类
         * @prop {int} [curPageNo=null] - 当前页码
         * @prop {int} [curRecordNo=null] - 当前行号，起始于1
         * @prop {string} [tableStatus=null] - 表格狀態，一般為__toolbarItem.id
         */
        _deferredObject:function(){
            return $.extend(true,{},{
                curPageRecords:this._curPageRecords,
                curRecord:this._curPageRecords[this._curRecordNo-1],
                editRecord:this._editRecord,
                tableStatus:this._tableStatus,
                curRecordNo:this._curRecordNo,
                curPageNo:this._currentPageNo
            });
        },
        /**
         * @typedef Plugin~_deferredObjectRef
         * @desc 当前页面上的一系列值。供外部接口
         * @prop {object.<colEntity>} [curRecord=null] - 选中的数据(值传递不可修改)，已转换为colEntity类
         * @prop {object.<colEntity>} [editRecordRef=null] - 修改框中的数据(引用传递可修改)，已转换为colEntity类
         * @prop {Array.<object.<colEntity>>} [pageRecords=null] - 当前页的数据(值传递不可修改)，已转换为colEntity类
         * @prop {int} [curPageNo=null] - 当前页码
         * @prop {int} [curRecordNo=null] - 当前行号，起始于1
         * @prop {string} [tableStatus=null] - 表格狀態，一般為__toolbarItem.id
         */
        _deferredObjectRef:function(){
            var obj= $.extend(true,{},{
                pageRecords:this._curPageRecords,
                curRecord:this._curPageRecords[this._curRecordNo-1],
                tableStatus:this._tableStatus,
                curRecordNo:this._curRecordNo,
                curPageNo:this._currentPageNo
            });
            obj.editRecordRef=this._editRecord;
            return obj;
        },
        //endregion====================Deferred====================
        //region   ====================外部接口====================
		/**
		 * @function Plugin#showLoading
		 * @desc 显示loading遮罩
		 * @param {?string} [msg=regional.loadingTxt] - 加载提示文字
		 * @param {?string} [el='list'] - 哪个对象要显示加载遮罩('list'、'edit')，两者不可同时显示。空为当前遮罩
		 * @param {?int} [delay=this._options._loadingDelay] - 延时(毫秒)
		 */
		showLoading:function(msg,el,delay){
			this._showLoading(msg,el,delay);
		},
		/**
		 * @function Plugin#showAlert
		 * @desc 显示提示框
		 * @param {string} msg - 提示文字
		 */
		showAlert:function(msg){
			this._showAlert(msg);
		}
        //endregion====================外部接口====================
	};
	//endregion======================原型======================
	//region   ====================注册插件====================
	//扩展jQuery插件
	$.fn[_pluginName]=function(options){
		var args=arguments;
		return this.each(function(){
			var $this=$(this),
				data=$.data(this,'plugin_'+_pluginName);
			//第一次调用。初始化
			if(!data){
				var thisData=$.data(this,'plugin_'+_pluginName,new Plugin(this,options));
				//if(thisData._options.autoLoad)
					//thisData._toolbarEvent(thisData._options.beforeRefresh,thisData._refresh,thisData._options.afterRefresh,'list');
			}
			//_开头的方法是内部方法，不允许外部调用
			else if(typeof options ==='string'){
				if(typeof data[options]=== 'function'){
					if(options.substr(0,1)!=='_')
						data[options].apply(data,Array.prototype.slice.call(args,1));
					else
						throw $[_pluginName].regional.errApiPrivate + options;
				}
				else
					throw $[_pluginName].regional.errApiWithout + options;
			}
				
		});
	};
	//endregion====================注册插件====================
	//region   =====================全球化=====================
    $[_pluginName]={};
	/**
	 * @namespace Plugin#regional
	 * @desc 语言
	 * @example zh-TW.js
	 * $.kekTable.regional={}
	 */
	$[_pluginName].regional={
		/**
		 * @var {string} Plugin#regional#alertTitle - 提示框的标题文字
		 */
		alertTitle:'提示',
		/**
		 * @var {string} Plugin#regional#defaultCol - 默认字段栏位的文字
		 */
		defaultCol:'欄位',
		/**
		 * @var {string} Plugin#regional#toolbarAdd - 工具栏新增按钮的显示文字
		 */
		toolbarAdd:'新增',
		/**
		 * @var {string} Plugin#regional#toolbarRefresh - 工具栏刷新按钮的显示文字
		 */
		toolbarRefresh:'刷新',
		/**
		 * @var {string} Plugin#regional#toolbarSearch - 工具栏查询按钮的显示文字
		 */
		toolbarSearch:'查詢',
		/**
		 * @var {string} Plugin#regional#toolbarSort - 工具栏排序按钮的显示文字
		 */
		toolbarSort:'排序',
		/**
		 * @var {string} Plugin#regional#toolbarEdit - 工具栏修改按钮的显示文字
		 */
		toolbarEdit:'修改',
		/**
		 * @var {string} Plugin#regional#toolbarDelete - 工具栏删除按钮的显示文字
		 */
		toolbarDelete:'刪除',
		/**
		 * @var {string} Plugin#regional#toolbarExport - 工具栏汇出按钮的显示文字
		 */
		toolbarExport:'匯出',
		/**
		 * @var {string} Plugin#regional#errApiPrivate - 非法调用内部方法时的错误信息
		 */
		errApiPrivate:'此方法不公開使用:',
		/**
		 * @var {string} Plugin#regional#errApiWithout - 没有此API的错误信息
		 */
		errApiWithout:'沒有提供此方法:',
		/**
		 * @var {string} Plugin#regional#errNull - 不能为空错误信息
		 */
		errNull:'不能為空',
		/**
		 * @var {string} Plugin#regional#errDateFormat - 日期格式错误信息
		 */
		errDateFormat:'日期格式错误(2014/01/01)',
		/**
		 * @var {string} Plugin#regional#errDateTimeFormat - 日期格式错误信息
		 */
		errDateTimeFormat:'日期格式错误(2014/01/01 23:59:02)',
        /**
         * @var {string} Plugin#regional#errNumberFormat - 数字格式错误
         */
        errNumberFormat:'數字格式錯誤',
        /**
         * @var {string} Plugin#regional#errNumLength - 数字 值超出最大长度
         */
        errNumLength:'數字超長(/i位整數，/f位小數)',
        /**
         * @var {string} Plugin#regional#errCharLength - 文字 值超出最大长度
         */
        errCharLength:'文字超長(/a個字符，中文占/c位)',
		/**
		 * @var {string} Plugin#regional#errSelected - 必须要选择一行
		 */
		errSelected:'請先選取一行',
		/**
		 * @var {string} Plugin#regional#searchBoolAnd - 查询框[布尔条件的AND]文字说明
		 */
		searchBoolAnd:'且',
		/**
		 * @var {string} Plugin#regional#searchBoolOr - 查询框[布尔条件的OR]文字说明
		 */
		searchBoolOr:'或',
		/**
		 * @var {string} Plugin#regional#searchOptEq - 查询框[关系运算符的等于]文字说明
		 */
		searchOptEq:'=',
		/**
		 * @var {string} Plugin#regional#searchOptLt - 查询框[关系运算符的小于]文字说明
		 */
		searchOptLt:'<',
		/**
		 * @var {string} Plugin#regional#searchOptLe - 查询框[关系运算符的小于等于]文字说明
		 */
		searchOptLe:'<=',
		/**
		 * @var {string} Plugin#regional#searchOptGt - 查询框[关系运算符的大于]文字说明
		 */
		searchOptGt:'>',
		/**
		 * @var {string} Plugin#regional#searchOptGt - 查询框[关系运算符的大于等于]文字说明
		 */
		searchOptGe:'>=',
		/**
		 * @var {string} Plugin#regional#searchOptNe - 查询框[关系运算符的不等于]文字说明
		 */
		searchOptNe:'不等於',
		/**
		 * @var {string} Plugin#regional#searchOptBeg - 查询框[关系运算符的开始于]文字说明
		 */
		searchOptBeg:'開始於',
		/**
		 * @var {string} Plugin#regional#searchOptEnd - 查询框[关系运算符的结束于]文字说明
		 */
		searchOptEnd:'結束於',
		/**
		 * @var {string} Plugin#regional#searchOptLike - 查询框[关系运算符的包含]文字说明
		 */
		searchOptLike:'包含',
		/**
		 * @var {string} Plugin#regional#searchOptNull - 查询框[关系运算符的空]文字说明
		 */
		searchOptNull:'空',
		/**
		 * @var {string} Plugin#regional#searchOptNNull - 查询框[关系运算符的非空]文字说明
		 */
		searchOptNNull:'非空',
		/**
		 * @var {string} Plugin#regional#searchAddPreCond - 查询框[添加查询条件至前]文字说明
		 */
		searchAddPreCond:'添加條件至前',
		/**
		 * @var {string} Plugin#regional#searchAddNxtCond - 查询框[添加查询条件至后]文字说明
		 */
		searchAddNxtCond:'添加條件至後',
		/**
		 * @var {string} Plugin#regional#searchAddPreGrp - 查询框[添加查询组至前]文字说明
		 */
		searchAddPreGrp:'添加組至前',
		/**
		 * @var {string} Plugin#regional#searchAddNxtGrp - 查询框[添加查询组至后]文字说明
		 */
		searchAddNxtGrp:'添加組至後',
		/**
		 * @var {string} Plugin#regional#searchDelCond - 查询框[删除查询条件]文字说明
		 */
		searchDelCond:'刪除',
		/**
		 * @var {string} Plugin#regional#searchTitle - 查询框标题
		 */
		searchTitle:'查詢',
		/**
		 * @var {string} Plugin#regional#searchCommit - 查询框执行查询的按钮文字
		 */
		searchCommit:'查詢',
		/**
		 * @var {string} Plugin#regional#searchCommit - 查询框执行查询的按钮文字
		 */
		editCommit:'保存',
		/**
		 * @var {string} Plugin#regional#addTitle - 编辑框新增标题
		 */
		addTitle:'新增',
		/**
		 * @var {string} Plugin#regional#editTitle - 编辑框修改标题
		 */
		editTitle:'修改',
		/**
		 * @var {string} Plugin#regional#buttonCancel - 取消按钮文字
		 */
		buttonCancel:'取消',
		/**
		 * @var {string} Plugin#regional#buttonOk - 确定按钮文字
		 */
		buttonOk:'確定',
		/**
		 * @var {string} Plugin#regional#totalSum - 总计公式[SUM]的文字
		 */
		totalSUM:'总和',
		/**
		 * @var {string} Plugin#regional#totalAvg - 总计公式[AVG]的文字
		 */
		totalAVG:'总均值',
		/**
		 * @var {string} Plugin#regional#totalMax - 总计公式[MAX]的文字
		 */
		totalMAX:'最大值',
		/**
		 * @var {string} Plugin#regional#totalMin - 总计公式[MIN]的文字
		 */
		totalMIN:'最小值',
		/**
		 * @var {string} Plugin#regional#totalCount - 总计公式[COUNT]的文字
		 */
		totalCOUNT:'总计数',
		/**
		 * @var {string} Plugin#regional#totalStddev - 总计公式[STDDEV]的文字
		 */
		totalSTDDEV:'总标准差',
		/**
		 * @var {string} Plugin#regional#totalVariance - 总计公式[VARIANCE]的文字
		 */
		totalVARIANCE:'总协方差',
		/**
		 * @var {string} Plugin#regional#totalMedian - 总计公式[MEDIAN]的文字
		 */
		totalMEDIAN:'中间值',
		/**
		 * @var {string} Plugin#regional#sortTitle - 排序框标题
		 */
		sortTitle:'排序',
		/**
		 * @var {string} Plugin#regional#sortCommit - 排序框执行排序的按钮文字
		 */
		sortCommit:'排序',
		/**
		 * @var {string} Plugin#regional#sortAdd - 排序框添加按钮title
		 */
		sortAdd:'添加',
		/**
		 * @var {string} Plugin#regional#sortDelete - 排序框删除按钮title
		 */
		sortDelete:'刪除',
		/**
		 * @var {string} Plugin#regional#sortMoveUp - 排序框上移按钮title
		 */
		sortMoveUp:'上移',
		/**
		 * @var {string} Plugin#regional#sortMoveDown - 排序框下移按钮title
		 */
		sortMoveDown:'下移',
		/**
		 * @var {string} Plugin#regional#sortAsc - 排序框从小到大按钮文字
		 */
		sortAsc:'從小到大',
		/**
		 * @var {string} Plugin#regional#sortDesc - 排序框从大到小按钮文字
		 */
		sortDesc:'從大到小',
		/**
		 * @var {string} Plugin#regional#sortNullsLast - 排序框空值在后按钮文字
		 */
		sortNullsLast:'空值在後',
		/**
		 * @var {string} Plugin#regional#sortNullsFirst - 排序框空值在前按钮文字
		 */
		sortNullsFirst:'空值在前',
		/**
		 * @var {string} Plugin#regional#loadingTxt - 加载遮罩的显示文字
		 */
		loadingTxt:'請稍等片刻...',
		/**
		 * @var {string} Plugin#regional#loadData - 读取资料的遮罩显示文字
		 */
		loadData:'正在讀取資料...',
		/**
		 * @var {string} Plugin#regional#loadList - list,lov遮罩显示文字
		 */
		loadList:'正在刷新列表...',
		/**
		 * @var {string} Plugin#regional#deleteConfirm - 删除提示
		 */
		deleteConfirm:'確定刪除？',
		/**
		 * @var {string} Plugin#regional#loadDataErr - 读取资料异常的文字
		 */
		loadDataErr:'讀取資料異常',
		/**
		 * @var {string} Plugin#regional#searchErr - 查詢條件異常
		 */
		searchErr:'查詢條件異常',
		/**
		 * @var {string} Plugin#regional#eventSuccess - 事件操作成功后的状态信息
		 */
		eventSuccess:'操作成功',
		/**
		 * @var {string} Plugin#regional#eventFail - 事件操作异常后的状态信息
		 */
		eventFail:'操作失敗',
		/**
		 * @var {string} Plugin#regional#processErr - 二次开发异常信息
		 */
		processErr:'程式異常'
	};
	//endregion=====================全球化=====================
})(jQuery,window,document);

