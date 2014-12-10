var _checkSearchCondition = function(arr) {
	var that = this,
		opt = this._options,
		xx = 'ok';
	if ($.type(arr) !== 'array' || !arr.length)
		return 'defaultSearch项必需是有内容的数组';
	$.each(arr, function(i, condition) {
		if ($.type(condition) !== 'array') {
			xx = 'defaultSearch子项必需是数组';
			return false;
		}
		var len = condition.length;
		if (i) {
			if ($.inArray(condition[0], ['AND', 'OR']) === -1) {
				xx = 'defaultSearch非第一个子项的第一个值必须是AND，OR';
				return false;
			}
			if ($.inArray(len, [2, 3, 4]) === -1) {
				xx = 'defaultSearch非第一个子项只能有2，3，4个值';
				return false;
			}
			//['AND',[]]
			if (len === 2){
				var yy=that._checkSearchCondition(condition[1]);
				if(yy!=='ok'){
					xx=yy;
					return false;
				}
				//that._checkSearchCondition(condition[1]);
			}
			//['AND','empNo','IS NOT NULL']
			else {
				if (opt.columns[condition[1]] == null || opt.columns[condition[1]].colId == null) {
					xx = 'columns设置中没有' + condition[1] + '栏位，或没有设置colId';
					return false;
				}
				if ($.inArray(condition[2], ['IS NULL', 'IS NOT NULL', '=', 'LIKE', '>', '>=', '<', '<=', '!=']) === -1) {
					xx = '3,4个值的defaultSearch子项的第三个值必需是IS NULL、IS NOT NULL、=、LIKE、>、>=、<、<=、!=';
					return false;
				}
				if ($.inArray(condition[2], ['IS NULL', 'IS NOT NULL']) !== -1 && condition[3] != null) {
					xx = 'defaultSearch子项的关系符为IS NULL、IS NOT NULL，不用设置第四个值';
					return false;
				} else if ($.inArray(condition[2], ['IS NULL', 'IS NOT NULL']) === -1 && condition[3] == null) {
					xx = 'defaultSearch子项的关系符不为IS NULL、IS NOT NULL，必需设置第四个值';
					return false;
				}
			}
		} else {
			if ($.inArray(len, [2, 3]) === -1) {
				xx = 'defaultSearch第一个子项只能有2，3个值';
				return false;
			}
			if (opt.columns[condition[0]] == null || opt.columns[condition[0]].colId == null) {
				xx = 'columns设置中没有' + condition[0] + '栏位，或没有设置colId';
				return false;
			}
			if ($.inArray(condition[1], ['IS NULL', 'IS NOT NULL', '=', 'LIKE', '>', '>=', '<', '<=', '!=']) === -1) {
				xx = 'defaultSearch子项的第2个值必需是IS NULL、IS NOT NULL、=、LIKE、>、>=、<、<=、!=';
				return false;
			}
			if ($.inArray(condition[1], ['IS NULL', 'IS NOT NULL']) !== -1 && condition[2] != null) {
				xx = 'defaultSearch子项的关系符为IS NULL、IS NOT NULL，不用设置第3个值';
				return false;
			} else if ($.inArray(condition[1], ['IS NULL', 'IS NOT NULL']) === -1 && condition[2] == null) {
				xx = 'defaultSearch子项的关系符不为IS NULL、IS NOT NULL，必需设置第3个值';
				return false;
			}
		}
	});
	return xx;
};