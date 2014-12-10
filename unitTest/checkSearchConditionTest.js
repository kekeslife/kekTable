var _options = {
	columns: {
		empNo: {
			colId: 0
		},
		state: {
			colId: 1
		},
		deptNo: {
			colId: 2
		},
		sex: {}
	}
};

var arr = [
	['empNo', '=', '14563'],
	['AND', 'state', 'IS NOT NULL'],
	['AND', [
		['deptNo', '=', 'D02'],
		['OR', 'deptNo', '=', 'D03']
	]]
];

test('1', function() {
	equal('ok', _checkSearchCondition(arr));
});

test('2', function() {
	arr = [
		['empNo', '='],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch子项的关系符不为IS NULL、IS NOT NULL，必需设置第3个值', _checkSearchCondition(arr));
});
test('3', function() {
	arr = [
		['empNo'],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch第一个子项只能有2，3个值', _checkSearchCondition(arr));
	arr = [
		[],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch第一个子项只能有2，3个值', _checkSearchCondition(arr));
	arr = [
		['empNo','=','',''],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch第一个子项只能有2，3个值', _checkSearchCondition(arr));
});
test('4', function() {
	arr = [
		['empNo', 'like','1'],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch子项的第2个值必需是IS NULL、IS NOT NULL、=、LIKE、>、>=、<、<=、!=', _checkSearchCondition(arr));
	arr = [
		['empNo', []],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch子项的第2个值必需是IS NULL、IS NOT NULL、=、LIKE、>、>=、<、<=、!=', _checkSearchCondition(arr));
});
test('5', function() {
	arr = [
		['empno', 'like','1'],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('columns设置中没有empno栏位，或没有设置colId', _checkSearchCondition(arr));
	arr = [
		['sex', '=','1'],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('columns设置中没有sex栏位，或没有设置colId', _checkSearchCondition(arr));
});
test('6', function() {
	arr = [
		['empNo', 'IS NULL','1'],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch子项的关系符为IS NULL、IS NOT NULL，不用设置第3个值', _checkSearchCondition(arr));
	arr = [
		['empNo', 'IS NOT NULL'],
		['AND', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('ok', _checkSearchCondition(arr));
});
test('7', function() {
	arr = [
		['empNo', 'IS NULL'],
		['and', 'state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch非第一个子项的第一个值必须是AND，OR', _checkSearchCondition(arr));
	arr = [
		['empNo', 'IS NOT NULL'],
		['state', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch非第一个子项的第一个值必须是AND，OR', _checkSearchCondition(arr));
});
test('8', function() {
	arr = [
		['empNo', 'IS NULL'],
		['AND'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch非第一个子项只能有2，3，4个值', _checkSearchCondition(arr));
});
test('9', function() {
	arr = [
		['empNo', 'IS NULL'],
		['AND','State', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('columns设置中没有State栏位，或没有设置colId', _checkSearchCondition(arr));
	arr = [
		['empNo', 'IS NULL'],
		['AND','sex', 'IS NOT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('columns设置中没有sex栏位，或没有设置colId', _checkSearchCondition(arr));
});
test('10', function() {
	arr = [
		['empNo', 'IS NULL'],
		['AND','state'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch项必需是有内容的数组', _checkSearchCondition(arr));
	arr = [
		['empNo', 'IS NULL'],
		['AND',[]],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch项必需是有内容的数组', _checkSearchCondition(arr));
});
test('11', function() {
	arr = [
		['empNo', 'IS NULL'],
		['AND','state','='],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('defaultSearch子项的关系符不为IS NULL、IS NOT NULL，必需设置第四个值', _checkSearchCondition(arr));
	arr = [
		['empNo', 'IS NULL'],
		['AND','state','IS NoT NULL'],
		['AND', [
			['deptNo', '=', 'D02'],
			['OR', 'deptNo', '=', 'D03']
		]]
	];
	equal('3,4个值的defaultSearch子项的第三个值必需是IS NULL、IS NOT NULL、=、LIKE、>、>=、<、<=、!=', _checkSearchCondition(arr));
});