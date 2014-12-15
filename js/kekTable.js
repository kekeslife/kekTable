 /**
 * @fileOverview kekTable
 * @author keke
 */
 /**
 * @description 表格插件 
 * @namespace kekTable
 */
var $testDM;
(function($,window,document,undefined){
	'use strict';
	/**
	 * @var {string} kekTable~_pluginName
	 * @default 'kekTable'
	 * @desc 插件名称
	 */
	var _pluginName='kekTable',
		/**
		 * @namespace kekTable~_options
		 * @desc 默认配置参数
		 */
		_options={
			/**
			 * @desc 表格标题
			 * @default ''
			 * @var {?string} kekTable~_options#title
			 */
			title:'',
			/**
			 * @var {?bool} [kekTable~_options#showPaging=true] - 是否显示分页，false将查询出所有的记录
			 */
			showPaging:true,
			/**
			 * @summary 面板的颜色 - class - bootstrap的panel样式
			 * @desc 'panel-primary'(深蓝)、'panel-success'(浅绿)、'panel-info'(浅蓝)、'panel-warning'(浅黄)、'panel-danger'(浅灰)、'panel-default'(浅灰)
			 * @var {?string} [kekTable~_options#panelColor='panel-primary']
			 */
			panelColor:'panel-primary',
			/**
			 * @summary 表格总宽度需要加單位px - style的width属性。
			 * @var {?string} [kekTable~_options#tableWidth='100%'] - '100%'、'auto'(colgroup的和+3)
			 */
			tableWidth:'100%',
			/**
			 * @var {?bool} kekTable~_options#canRowHover=true - 是否可以鼠标悬停背景,冻结表格会影响性能
			 */
			canRowHover:true,
			/**
			 * @var {?bool} [kekTable~_options#isCollapse=false] - 表格是否可以折叠 同 bootstrap的collapse
			 */
			isCollapse:false,
			/**
			 * @var {?bool} [kekTable~_options#collapseExpanded=true] - collapse是否默认展开 同 bootstrap的collapse的aria-expanded属性
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
			 * @param {Plugin~_tableValues} tableValues - 当前页的值
			 * @example 判断是否有选中记录
			 * action:function(v){
			 *     if(v.curRecordNum===null)
			 *         alert('请先选择一行');
			 *     else if(v.curPageRecords[v.curRecordNum].weight<1000)
			 *         alert('重量小于1000');
			 * }
			 */
			/**
			 * @summary 工具条(按顺序显示)
			 * @desc 'refresh'(刷新)、'search'(查询)、'sort'(排序)、'add'(新增)、'edit'(修改)、'delete'(删除)、'mailAgent'(代理邮件)、'export'(导出)
			 * @default [[{id:'refresh'}],[{id:'search'},{id:'sort'}],[{id:'add'},{id:'edit'},{id:'delete'}]]
			 * @var {?Array.<__toolbarItem[]>} kekTable~_options#toolbar
			 * @example 自定义按钮
			 * toolbar=[[{id:'upload',icon:'glyphicon-upload',label:'上传',title:'上传图片',act:function(v){ }}]]
			 */
			toolbar:[[{id:'refresh'}],[{id:'search'},{id:'sort'}],[{id:'add'},{id:'edit'},{id:'delete'}]],
			/**
			 * @var {?bool} [kekTable~_options#isDebug=false] - 是否是调试模式。调试模式会检查各个参数是否设置正确。ie10+
			 */
			isDebug:false,
			/**
			 * @var {!string} [kekTable~_options#listURL=null] - 查询的ajax地址(必需)
			 */
			listURL:null,
			/**
			 * @var {?string} [kekTable~_options#insertURL=null] - 新增的ajax地址(设为null将通过adjustOptions调整为listURL)
			 */
			insertURL:null,
			/**
			 * @var {!Object.<Object.<_column>>} [kekTable~_options#columns=null] - 字段配置(必需)
			 */
			columns:null,
			/**
			 * @var {?int} [kekTable~options#editDialogWidth=600] - 修改編輯框的寬度
			 */
			editDialogWidth:600,
			/**
			 * @var {?Array.<Array.<int>>} [kekTable~options#tableRelations=null] - 多表间的关联(二维数组(后台数据库字段下标))
			 * @example 工号关联。
			 * // returns 后台下标1字段=后台下标4字段
			 * tableRelations:[[1,4]]
			 */
			tableRelations:null,
			/**
			 * @var {?int} [kekTable~options#frozenNum=null] - 冻结前几列,不包含序号列
			 */
			frozenNum:null,
			/**
			 * @var {?int} [kekTable~options#rowNum=20] - 显示多少笔。设为1的话，采用单笔显示方式
			 */
			rowNum:20,
			/**
			 * @var {?bool} [kekTable~options#showRowNo=false] - 是否显示行号
			 */
			showRowNo:false,
			/**
			 * @var {?string} [kekTable~options#detailTable=null] - 从表id。
			 */
			detailTable:null,
			/**
			 * @var {?string} [kekTable~options#detailTable=null] - 主表id。绘制主从表界面，要求先初始化主表。
			 */
			masterTable:null,
			/**
			 * @summary 主表修改删除时，从表的联级操作类型
			 * @var {?string} [kekTable~options#foreignType=default] - 'default'(按照数据库)、'cascade'(联级修改从表)、'restrict'(从表有资料禁止修改)
			 */
			foreignType:'default',
			/**
			 * @var {?Array.<object>} [kekTable~options#defaultSearch=null] - 默认的过滤条件。
			 * @example 过滤条件
			 * defaultSearch = [
			 * 		['empNo','=','14563'],
			 * 		['AND','state','IS NOT NULL'],
			 * 		['AND',[
			 * 			['deptNo','=','D02'],
			 * 			['OR','deptNo','=','D03']
			 * 		]]
			 * ]
			 */
			defaultSearch:null,
			/**
			 * @function kekTable~options#beforeRefresh
			 * @desc 点击刷新按钮前的自定义操作。必需要写d.resolve()或者d.reject()
			 * @param {Plugin~_tableValues} tableValues
			 * @param {$.Deferred} defer - deferred对象,d.reject()将组织事件,d.resolve()将继续执行。
			 * //@return {$.Deferred} 
			 * @example ajax
			 * beforeRefresh:function(v,d){
			 * 	var xx=$.ajax('test.html').done(function(){d.resolve('成功');$('tab').kekTable('showAlert','成功');}).fail(function(){d.reject('失败');$('tab').kekTable('showAlert','失败');});
			 * 	//return xx;
			 * }
			 * @example nomal
			 * beforeRefresh:function(v,d){
			 *  if(curRecordNum){
			 * 		if(v.curPageRecords(curRecordNum).empNo='14623')
			 * 			d.resolve('成功');
			 * 		else
			 * 			d.reject('失败');
			 *  }
			 * 	//return d;
			 * }
			 */
			beforeRefresh:null,
		},
		/**
		 * @namespace _column
		 * @desc 配置columns中的项
		 */
		_column={
			/**
			 * @var {?int} [_column#tableId=null] - 后台数据库表名数组的下标，该字段所属的表，不设置代表该栏位非数据库栏位
			 */
			tableId:null,
			/**
			 * @var {?int} [_column#colId=null] - 后台数据库字段数组的下标，不设置代表该栏位非数据库栏位
			 */
			colId:null,
			/**
			 * @var {?int} [_column#listIndex=null] - 给值后此栏位将置于Table中，顺序按此
			 */
			listIndex:null,
			/**
			 * @var {?string} [_column#listTitle=null] - 显示的表格栏位标题
			 */
			listTitle:null,
			/**
			 * @var {?int} [_column#listWidth=null] - table栏位的宽度，可带单位。纯数字会通过_adjustOptions添加单位px
			 */
			listWidth:null,
			/**
			 * @var {?bool} [_column#listInline=false] - 单笔记录显示时，此栏位是否和前一个栏位在同一行显示
			 */
			listInline:false,
			/**
			 * @var {?bool} [_column#canSearch=true] - 数据库栏位是否可以被自定义查询
			 */
			canSearch:true,
			/**
			 * @var {?string} [_column#editTitle=__column#listTitle] - 编辑框中栏位上面的标题
			 */
			editTitle:null,
			/**
			 * @var {?bool} [_column#editDisplay='block'] - 'block'(单独一行)、'inline'(与前一个栏位同一行)、'cling'(紧贴前一个栏位)
			 * @summary 编辑框中此栏位的显示方式
			 */
			editDisplay:'block',
			/**
			 * @var {?int} [_column#editIndex=null] - 给值后此栏位将置于编辑框中，编辑框的栏位顺序按此
			 */
			editIndex:null,
			/**
			 * @var {?int} [_column#editWidth=100] - 编辑框栏位的宽度，可带单位。纯数字会通过_adjustOptions添加单位px
			 */
			editWidth:100,
			/**
			 * @var {?string} [_column#editPlaceholder=null] - 编辑框栏位的placeholder属性
			 */
			editPlaceholder:null,
			/**
			 * @var {?string} [_column#editType=null] - ''(text)、'list'(下拉框)、'lov'、'textarea'
			 * @summary 编辑框栏位的类型
			 */
			editType:null,
			/**
			 * @var {?string} [_column#editAttr=null] - ''(正常)、'readonly'(只读)、'hidden'(隐藏)
			 * @summary 编辑框栏位的特性
			 */
			editAttr:null,
			/**
			 * @var {?bool} [_column#editPost=true] - 编辑框栏位是否更新至数据库
			 */
			editPost:null,
			/**
			 * @var {?string} [_column#colType=null] - ''(文本)、'number'、'date'
			 * @summary 栏位的数据类型
			 */
			colType:null,
			/**
			 * @var {?string} [_column#colFormat=null] - 栏位遮罩(暂只有date类型)
			 */
			colFormat:null,
			/**
			 * @var {?int} [_column#colLength=null] - 栏位的长度，null则为无限制，(3.2代表3位整数，2位小数)
			 */
			colLength:null,
			/**
			 * @var {?bool} [_column#colLengthByte=true] - 栏位的长度按byte计算,false将按char计算
			 */
			colLengthByte:true,
			/**
			 * @summary 表格栏位的合计公式(满足所有条件的数据，非单页数据)
			 * @var {?string} [_column#listPageSummary=null] - 'SUM'(求和)、'COUNT'(计数)、'AVG'(平均)、'MAX'(最大)、'MIN'(最小)、'STDDEV'(标准差)、'VARIANCE'(协方差)、'MEDIAN'(中间数)
			 */
			colTotalSummary:null,
			/**
			 * @var {?bool} [_column#colTotalAll=true] - 栏位合计公式是否统计所有值(oracle中聚合函数的DISTINCT、ALL)
			 */
			colTotalAll:true,
			/**
			 * @var {?int} [_column#detailKeyId=null] - 主表中设置此项。关联从表的字段(后台字段数组下标)
			 */
			detailKeyId:null,
		};
		
			
			
			
			
		
	/**
	 * @constructor Plugin
	 * @param {jQuery} element - jQUery对象
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
			 * @var {jQuery} _elements#$pagging - 分页ul
			 */
			$pagging:null,
			/**
			 * @typedef _elements#search - 查询框
			 * @prop {jQuery} [$dialog=null] - 查询框
			 * @prop {jQuery} [$col=null] - 字段
			 * @prop {jQuery} [$operator=null] - 关系运算符
			 * @prop {jQuery} [$bool=null] - 逻辑运算符
			 * @prop {jQuery} [$control=null] - 功能项
			 */
			search:{
				$dialog:null,
				$col:null,
				$operator:null,
				$bool:null,
				$control:null
			},
			edit:{
				$dialog:null
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
		 * @typedef Plugin~_tableValues
		 * @desc 当年页面上的一系列值。供外部接口（$.extend）
		 * @prop {object[]} [curPageRecords=null] - 当前页面上的所有数据库值
		 * @prop {int} [curRecordNum=null] - 当前选中的行号，1开头
		 * @prop {string} [tableStatus=null] - 表格狀態，一般為__toolbarIte.id
		 */
		this._tableValues={
			curPageRecords:null,
			curRecordNum:null,
			tableStatus:null
		};
		/**
		 * @typedef Plugin~_hasTool
		 * @desc 是否开启内建功能
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
		
		this._init();
	}
	/**
	 * @augments Plugin
	 */
	Plugin.prototype={
		//内部方法
		//插件初始化 this=Plugin
		_init:function(){
			this._adjustOptions();
			if(this._options.isDebug)
				this._debug();
			this._createPlugin();
		},
		//检核参数配置
		_debug:function(){
			var opt=this._options,
				that=this;
			//panelColor
			if($.inArray(opt.panelColor,['panel-primary','panel-success','panel-info','panel-warning','panel-danger','panel-default'])===-1)
				console.warn('panelColor非内建值，当然你可以使用自定义的css');
			//tableWidth
			if(!/^(\d+%|\d+px|\d+in|\d+cm|\d+mm|\d+em|\d+ex|\d+pt|\d+pc|auto)$/.test(opt.tableWidth))
				throw 'tableWidth请使用正确的宽度单位';
			//isCollapse && collapseExpanded
			if($.inArray(opt.isCollapse,[true,false])===-1)
				throw 'isCollapse类型错误';
			else if(!opt.isCollapse && this._options.collapseExpanded != _options.collapseExpanded)
				console.warn('未开启isCollapse，不用设置collapseExpanded');
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
			
			if(!opt.rowNum)
				throw 'rowNum必需大于0。否则你需要这个表来做什么';
			//singleTable
			else if(opt.rowNum===1 && opt.frozenNum)
				console.warn('rowNum设置为1代表是单笔显示模式，此模式下没有冻结功能，你可以去掉frozenNum');
			if(opt.rowNum===1 && opt.showRowNo)
				console.warn('rowNum设置为1代表是单笔显示模式，此模式下没有序号列，你可以去掉showRowNo');
			//detailTable
			if(opt.detailTable){
				if(!$('#'+opt.detailTable).length)
					throw '没有detailTable的id'+opt.detailTable;
			}
			//defaultSearch
			if(opt.defaultSearch)
				this._checkSearchCondition(opt.defaultSearch);
			//columns
			if(!opt.columns)
				throw '必需设置columns';
			else if($.type(opt.columns)!=='object')
				throw 'columns必需是object类型';
			//col
			$.each(opt.columns, function(colName,colObj) {
				if(colObj==null)
					throw colName+'不能设为Null，如需要请设置为{}';
				if(colObj.listIndex==null && colObj.listWidth)
					console.warn(colName+'没有设置listIndex代表非显示栏位，不用设置listWidth');
				if(colObj.listWidth===0)
					console.warn(colName+'的listWidth被设置为0，如果不需要显示，请设置listIndex=null');
				if(colObj.colId==null && colObj.canSearch)
					console.warn(colName+'没设置colId,代表非数据库栏位，canSearch设置将无效');
				if(!that._hasTool.search && colObj.canSearch)
					console.warn(colName+'没开启查询功能，canSearch设置将无效');
				if(!that._hasTool.edit && !that._hasTool.add){
					if(colObj.editTitle || colObj.editIndex || colObj.editPlaceholder)
						console.warn(colName+'没有开启新增修改功能，不用设置edit参数');
				}
				//editCols
				if($.inArray(colObj.editDisplay,['block','inline','cling']===-1)
					throw colName+'editDisplay只能设置为block,inline,cling';
				if(colObj.editIndex==null && colObj.editDisplay)
					console.warn(colName+'沒有設置editIndex,不用設置editDisplay')
			});
			//col array
			if(!this._listCols.length)
				throw '没有设置任何的listIndex';
			if(!this._dbCols.length)
				throw '没有设置任何的colId';
			if(this._hasTool.add && this._hasTool.edit && !this._editCols.length)
				console.warn('开启了新增修改功能却没有任何的editIndex');
			//editCols
			if(this._editCols.length && opt.columns[this._editCols[0]].editDisplay!=='block')
				console.warn(this._editCols[0]+'只能设置为block');
			//something...
		},
		//检核查询条件
		_checkSearchCondition:function(arr){
			var that=this,opt=this._options;
			if($.type(arr)!=='array' || !arr.length)
				throw 'defaultSearch项必需是有内容的数组';
			$.each(arr, function(i,condition) {
				if($.type(condition)!=='array')
					throw 'defaultSearch子项必需是数组';
				var len=condition.length;
				if(i){
					if($.inArray(condition[0],['AND','OR'])===-1)
						throw 'defaultSearch非第一个子项的第一个值必须是AND，OR';
					if($.inArray(len,[2,3,4])===-1)
						throw 'defaultSearch非第一个子项只能有2，3，4个值';
					//['AND',[]]
					if(len===2)
						that._checkSearchCondition(condition[1]);
					//['AND','empNo','IS NOT NULL']
					else{
						if(opt.columns[condition[1]]==null || opt.columns[condition[1]].colId==null)
							throw 'columns设置中没有'+condition[1]+'栏位，或没有设置colId';
						if($.inArray(condition[2],['IS NULL','IS NOT NULL','=','LIKE','>','>=','<','<=','!='])===-1)
							throw '3,4个值的defaultSearch子项的第三个值必需是IS NULL、IS NOT NULL、=、LIKE、>、>=、<、<=、!=';
						if($.inArray(condition[2],['IS NULL','IS NOT NULL'])!==-1 && condition[3] != null)
							throw 'defaultSearch子项的关系符为IS NULL、IS NOT NULL，不用设置第四个值';
						else if($.inArray(condition[2],['IS NULL','IS NOT NULL'])===-1 && condition[3] == null)
							throw 'defaultSearch子项的关系符不为IS NULL、IS NOT NULL，必需设置第四个值';
					}
				}
				else{
					if($.inArray(len,[2,3])===-1)
						throw 'defaultSearch第一个子项只能有2，3个值';
					if(opt.columns[condition[0]]==null || opt.columns[condition[0]].colId==null)
						throw 'columns设置中没有'+condition[0]+'栏位，或没有设置colId';
					if($.inArray(condition[1],['IS NULL','IS NOT NULL','=','LIKE','>','>=','<','<=','!='])===-1)
						throw 'defaultSearch子项的第2个值必需是IS NULL、IS NOT NULL、=、LIKE、>、>=、<、<=、!=';
					if($.inArray(condition[1],['IS NULL','IS NOT NULL'])!==-1 && condition[2] != null)
						throw 'defaultSearch子项的关系符为IS NULL、IS NOT NULL，不用设置第3个值';
					else if($.inArray(condition[1],['IS NULL','IS NOT NULL'])===-1 && condition[2] == null)
						throw 'defaultSearch子项的关系符不为IS NULL、IS NOT NULL，必需设置第3个值';
				}
			});
		},
		//初始化时调整参数
		_adjustOptions:function(){
			var opt=this._options,
				that=this;
			//hasTool
			$.each(opt.toolbar, function(i,g) {
				$.each(g, function(m,obj) {
					if($.inArray(obj.id,['refresh','search','sort','add','edit','delete','export'])!==-1)
						that._hasTool[obj.id]=true;
				});
			});
			//columns
			$.each(opt.columns,function(colName,colObj){
				colObj=$.extend({},_column, colObj);
				$.each(colObj, function(prop,val) {
		      		if(prop==='listIndex' && val != null){
		      			if(that._listCols[val])
							throw '有重复的listIndex';
		      			that._listCols[val]=colName;
		      		}
		      		else if(prop==='editIndex' && val != null){
		      			if(that._editCols[val])
							throw '有重复的editIndex';
		      			that._editCols[val]=colName;
		      		}
		      		else if(prop==='colId' && val != null){
		      			if(that._dbCols[val])
							throw '有重复的colId';
						that._dbCols[val]=colName;
		      		}
		      		else if((prop==='listWidth' || prop==='editWidth'))){
		      			if(val==null)
		      				val=100;
		      			(val-0==val-0) && (val-0) && (colObj[prop]+='px');
		      		}
		      		else if(prop==='colTotalSummary' && val != null)
		      			that._summaryCols.push(colName);
		      		else if(prop==='editPost' && colObj.colId !=null && colObj.editIndex !=null && val != null)
		      			colObj[prop]=true;
		      		//something...
				});
				//something...
				opt.columns[colName]=colObj;
			});
			//array
			this._listCols=$.map(this._listCols, function(v) {return v;});
			this._dbCols=$.map(this._dbCols, function(v) {return v;});
			this._editCols=$.map(this._editCols, function(v) {return v;});
			//editCols
			this._editCols.length && opt.columns[this._editCols[0]].editDisplay='block';
			//something...
		},
		/**==========建立插件==========
		 * Plugin
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
		 *         Pagging
		 *   Loading
		 * 	 Search
		 * 	 Edit
		 * 	 Sort
		 */
		_createPlugin:function(){
			var $frag=$(document.createDocumentFragment());
			$frag.append(this._createPlugin_panel())
				 .append(this._createPlugin_loading())
				 .append(this._createPlugin_search())
				 .append(this._createPlugin_edit());
			$(this._element).addClass('kekTable-listPanel panel-group')
							.css('width',this._options.tableWidth)
							.append($frag);
		},
		_createPlugin_panel:function(){
			this._elements.$plugin_panel=$('<div>');
			var $el=this._elements.$plugin_panel;
			$el.addClass('panel '+this._options.panelColor)
			  .append(this._createPanel_head())
			  .append(this._createPanel_collapse());
			return $el;
		},
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
		_createPanel_collapse:function(){
			var $el=$('<div>');
			$el.attr('id',this._element.id+'CollapseGroup')
			  .addClass('panel-collapse collapse'+(this._options.collapseExpanded?' in':''))
			  .append(this._createCollapse_toolbar())
			  .append(this._createCollapse_tableGroup())
			  .append(this._createCollapse_tableSummary())
			  .append(this._createCollapse_tableDetail())
			  .append(this._createCollapse_footer());
			
			
			//something...
			return $el;
			  
		},
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
			$el.click(function(){
				that._tableValues.tableStatus='refresh';
				that._toolbarEvent(that._options.beforeRefresh,that._refresh,that._options.afterRefresh,'list');
			});
			return $el;
		},
		_createTool_search:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarSearch+'"><span class="glyphicon glyphicon-search"></span><span>'+$[_pluginName].regional.toolbarSearch+'</span></span>');
			$el.click(function(){
				that._tableValues.tableStatus='search';
				that._toolbarEvent(that._options.beforeSearch,that._search,that._options.afterSearch);
			});
			return $el;
		},
		_createTool_sort:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarSort+'"><span class="glyphicon glyphicon-sort"></span><span>'+$[_pluginName].regional.toolbarSort+'</span></span>');
			$el.click(function(){
				that._tableValues.tableStatus='sort';
				that._toolbarEvent(that._options.beforeSort,that._sort,that._options.afterSort);
			});
			return $el;
		},
		_createTool_add:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarAdd+'"><span class="glyphicon glyphicon-plus"></span><span>'+$[_pluginName].regional.toolbarAdd+'</span></span>');
			$el.click(function(){
				that._tableValues.tableStatus='add';
				that._toolbarEvent(that._options.beforeAdd,that._add,that._options.afterAdd);
			});
			return $el;
		},
		_createTool_edit:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarEdit+'"><span class="glyphicon glyphicon-edit"></span><span>'+$[_pluginName].regional.toolbarEdit+'</span></span>');
			$el.click(function(){
				that._tableValues.tableStatus='edit';
				that._toolbarEvent(that._options.beforeEdit,that._edit,that._options.afterEdit);
			});
			return $el;
		},
		_createTool_delete:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarDelete+'"><span class="glyphicon glyphicon-minus"></span><span>'+$[_pluginName].regional.toolbarDelete+'</span></span>');
			$el.click(function(){
				that._tableValues.tableStatus='delete';
				that._toolbarEvent(that._options.beforeDelete,that._delete,that._options.afterDelete);
			});
			return $el;
		},
		_createTool_export:function(){
			var that=this, $el=$('<span class="btn btn-default" title="'+$[_pluginName].regional.toolbarExport+'"><span class="glyphicon glyphicon-export"></span><span>'+$[_pluginName].regional.toolbarExport+'</span></span>');
			$el.click(function(){
				that._tableValues.tableStatus='export';
				that._toolbarEvent(that._options.beforeExport,that._export,that._options.afterExport);
			});
			return $el;
		},
		_createTool_custom:function(btn){
			var that=this, $el=$('<span class="btn btn-default" title="'+(btn.title || btn.label || btn.id)+'"><span class="glyphicon '+(btn.icon || '')+'"></span><span>'+(btn.label || '')+'</span></span>');
			$el.click(function(){
				that._tableValues.tableStatus=btn.id;
				btn.action(that._tableValues);
			});
			return $el;
		},
		_createCollapse_tableGroup:function(){
			var $el=$('<div class="kekTable-table-group"></div>'),
				opt=this._options;
			$el.append((opt.rowNum===1 && this._createTable_single()) || (opt.frozenNum && this._createTable_frozen()) || this._createTable());
			return $el;
		},
		_createTable:function(){
			var $el=$('<table>'),
				colgroup=[],
				thead=[],
				cols=this._options.columns;
			$el.addClass('table table-bordered table-condensed'+(this._options.canRowHover?' table-hover':''));
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
				li.push('<div><b>'+cols[colName].listTitle+'</b><span class="kekTable-col"'+(cols[colName].listWidth?(' style="width:'+cols[colName].listWidth+';"'):'')+'></span></div>');
			});
			if(li.length)
				ul.push('<li>'+li.join('')+'</li>');
			$el.append(ul.join(''));
			return $el;
		},
		_createCollapse_tableSummary:function(){
			if(this._summaryCols.length){
				var $el=$('<div class="kekTable-table-summary"></div>'),
					cols=this._options.columns;
				$.each(this._summaryCols, function(i,colName) {
					$el.append('<h5>'+cols[colName].listTitle+': '+$[_pluginName].regional['total'+cols[colName].colTotalSummary]+'<b></b></h5>');
				});
				return $el;
			}
		},
		_createCollapse_tableDetail:function(){
			if(this._options.detailTable){
				var $el=$('<div class="kekTable-table-md"></div>');
				$('#'+this._options.detailTable).appendTo($el);
				return $el;
			}
		},
		_createCollapse_footer:function(){
			return $('<div class="panel-footer"></div>').append(this._createFooter_pagging(1));
		},
		_createFooter_pagging:function(recordCount){
			if(this._options.showPaging){
				var $el=this._elements.$pagging || (this._elements.$pagging = $('<nav><ul class="pagination"></ul></nav>'));
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
		        $el.children().append(pageArr.join(''));
		        return $el;
			}
		},
		_createPlugin_loading:function(el){
			return this._elements[el==='edit'?'$editLoading':'$loading']=$('<div class="loading" style="display: none;"><div class="bk-opacity"></div><p><span class="alert alert-info">'+$[_pluginName].regional.loadingTxt+'</span></p></div>');
		},
		_createPlugin_search:function(){
			if(this._hasTool.search){
				var regional=$[_pluginName].regional;
				this._elements.search.$dialog=$('<div class="modal fade kekTable-search" data-backdrop="static" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">'+
					regional.searchTitle+'</h4></div><div class="modal-body"><ul class="kekTable-search-block"></ul></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">'+
					regional.buttonCancel+'</button><button type="button" class="btn btn-primary">'+regional.searchCommit+'</button></div></div></div></div>');
				$('.modal-body',this._elements.search.$dialog).append(this._createSearch_col())
					.append(this._createSearch_operator())
					.append(this._createSearch_bool())
					.append(this._createSearch_control());
				return this._elements.search.$dialog;
			}
		},
		_createSearch_col:function(){
			this._elements.search.$col=$('<ul class="dropdown-menu kekTable-dropList" style="display: block;"></ul>');
			var li=[],cols=this._options.columns;
			$.each(this._dbCols, function(i,colName) {
				if(cols[colName].canSearch)
					li.push('<li data-col="'+colName+'"><span>'+cols[colName].listTitle+'</span></li>');
			});
			this._elements.search.$col.append(li.join(''));
			this._setSearchDialog();
			return this._elements.search.$col;
		},
		_createSearch_operator:function(){
			this._elements.search.$operator=$('<ul class="dropdown-menu kekTable-dropList" style="display: block;"></ul>');
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
				'<li data-opt="null"><span>'+regional.searchOptNull+'</span></li>',
				'<li data-opt="nnull"><span>'+regional.searchOptNNull+'</span></li>'
			);
			this._elements.search.$operator.append(li.join(''));
			return this._elements.search.$operator;
		},
		_createSearch_bool:function(){
			this._elements.search.$bool=$('<ul class="dropdown-menu kekTable-dropList" style="display: block;"></ul>');
			var li=[],regional=$[_pluginName].regional;
			li.push(
				'<li data-opt="and"><span>'+regional.searchBoolAnd+'</span></li>',
				'<li data-opt="or"><span>'+regional.searchBoolOr+'</span></li>'
			);
			this._elements.search.$bool.append(li.join(''));
			return this._elements.search.$bool;
		},
		_createSearch_control:function(){
			this._elements.search.$control=$('<ul class="dropdown-menu kekTable-dropList" style="display: block;"></ul>');
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
		_createPlugin_edit:function(){
			if(this._hasTool.edit){
				var regional=$[_pluginName].regional;
				this._elements.edit.$dialog=$('<div class="modal fade kekTable-search" data-backdrop="static" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">'+
					regional.editTitle+'</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">'+
					regional.buttonCancel+'</button><button type="button" class="btn btn-primary">'+regional.editCommit+'</button></div></div></div></div>');
				this._elements.edit.$block=$('<ul class="kekTable-edit-block">'+this._createEdit_block()+'</ul>');
				$('.modal-body',this._elements.edit.$dialog).append(this._elements.edit.$block);
				return this._elements.edit.$dialog;
			}
		},
		_createEdit_block:function(){
			var li=[],that=this,cols=this._options.columns,that=this,$l,$filed;
			$.each(this._editCols, function(i,colName) {
				if(cols[colName].editDisplay==='block'){
					$l && li.push($l);
					$filed=$l=$('<li><div class="form-group has-feedback"><label>'+cols[colName].editTitle+'</label><div class="input-group"></div></div></li>');
				}
				else if(cols[colName].editDisplay==='inline'){
					$filed=$('<div class="form-group has-feedback"><label>'+cols[colName].editTitle+'</label><div class="input-group"></div></div>');
					$l.append($filed);
				}
				$filed.append(that._createEdit_item(colName));
			});
			$l $$ li.push($l);
			return li.join('');
		},
		_createEdit_item:function(colName){
			var $el,col=this._options.columns[colName];
			if(col.editType==='textarea')
				$el=$('<textarea />')
			else
				$el=$('<input type="text" />');
			$el.data('col',colName).addClass('form-control');
			//hidden,readonly
			(col.editAttr==='hidden' && $el.style('display','none')) || (col.editAttr==='readonly' && $el.attr('readonly',''));
			//number,date
			col.colType && $el.addClass('kekTable-'+col.colType);
			col.editPlaceholder && $el.attr('placeholder',col.editPlaceholder);
			//lov
			if(!col.editAttr && col.editType==='lov')
				$el.addClass('kekTable-lov-input').attr('data-toggle','dropdown').attr('aria-expanded',false);
			return $el;
		},
		
		//==========end建立插件==========
		
		//==========工具栏内置功能==========
		_refresh:function(v,d){
			d.resolve('_refresh');
			//something...
		},
		_search:function(v,d){
			d.resolve('_search');
			//something...
		},
		_sort:function(v,d){
			d.resolve('_sort');
			//something...
		},
		_add:function(v,d){
			d.resolve('_add');
			//something...
		},
		_edit:function(v,d){
			d.resolve('_edit');
			//something...
		},
		_delete:function(v,d){
			d.resolve('_delete');
			//something...
		},
		_export:function(v,d){
			d.resolve('_export');
			//something...
		},
		//==========end工具栏内置功能==========
		
		/**
		 * @function Plugin~_setSearchDialog
		 * @desc 将排序条件列表数组显示到查询对话框中
		 * @param {Plugin~_sortConditions} sortConditions - 排序的条件列表
		 */
		_setSearchDialog:function(arr){
			var $block=$('.kekTable-search-block',this._elements.search.$dialog),
				regional=$[_pluginName].regional;
			if(!arr || !arr.length)
				$block.empty().append('<li><button class="btn btn-default dropdown-toggle kekTable-search-item-first" type="button" data-col=""><span>'+regional.defaultCol
									+'</span><span class="caret"></span></button><button class="btn btn-default dropdown-toggle" type="button" data-opt="">=<span class="caret"></span></button><input type="text" class="form-control kekTable-search-itemValue"><button class="btn btn-default dropdown-toggle" type="button"><span class="glyphicon glyphicon-cog"></span></button></li>');
			//something...
		},
		
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
				delay=delay||this._options._loadingDelay;
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
		//显示对话框
		_showAlert:function(msg){
			
		},
		//显示状态信息
		_showState:function(msg){
			console.log(msg);
		},
		
		//事件组。前，中，后。
		//el:显示加载遮罩的对象('list'、'edit')
		//回调函数必需执行d.resolve()或d.reject()
		_toolbarEvent:function(b,i,a,el){
			var promise=b?this._eventDefer(b):this._eventDefer(function(v,d){d.resolve();return d;});
			var that=this;
			promise.done(function(){
				promise=that._eventDefer(i);
				promise.done(function(v){
					if(a){
						promise=a?that._eventDefer(a):that._eventDefer(function(v,d){d.resolve()});
						promise.done(function(v){
							that._hideLoading();
							that._showState(v?v:$[_pluginName].regional.eventSuccess);
						});
					}
					else{
						that._hideLoading();
						that._showState(v?v:$[_pluginName].regional.eventSuccess);
					}
				});
			});
			
		},
		//event所使用的jQuery.deferred
		_eventDefer:function(f){
			var d=$.Deferred(),
				that=this,
				p=d.then(f($.extend({},this._tableValues),d));
			p.fail(function(v){
				that._hideLoading();
				that._showState(v);
			});
			return p.promise();
		},
		
		//外部接口
		
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
		 * @param {string} text - 提示文字
		 */
		showAlert:function(msg){
			
		},
	};
	
	//扩展jQuery插件
	$.fn[_pluginName]=function(options){
		var args=arguments;
		return this.each(function(){
			var $this=$(this),
				data=$.data(this,'plugin_'+_pluginName);
			//第一次调用。初始化
			if(!data)
				$.data(this,'plugin_'+_pluginName,new Plugin(this,options));
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
	
	$[_pluginName]={};
	/**
	 * @namespace Plugin#regional
	 * @desc 语言
	 * @example zh-TW.js
	 * $.kekTable.regional={}
	 */
	$[_pluginName].regional={
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
		 * @var {string} Plugin#regional#buttonCancel - 取消按钮文字
		 */
		buttonCancel:'取消',
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
		 * @var {string} Plugin#regional#eventSuccess - 事件操作成功后的状态信息
		 */
		eventSuccess:'操作成功',
		/**
		 * @var {string} Plugin#regional#eventFail - 事件操作异常后的状态信息
		 */
		eventFail:'操作失敗',
	};
	
})(jQuery,window,document);

