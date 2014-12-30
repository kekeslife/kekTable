checkDateTime = function(str) {
	var match = str.match(/^(\d{4})[\/\-]?(0?[1-9]|1[012])[\/\-]?(0?[1-9]|[12][0-9]|3[01])\s?([01]?[0-9]|2[0-3])\:?([0-5]?[0-9])\:?([0-5]?[0-9]?)$/);
	if (match) {
		var newDate = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
		if ((newDate.getMinutes() !== match[5]-0) || (newDate.getHours() !== match[4]-0) || (newDate.getDate() !== match[3]-0) || (newDate.getMonth() !== match[2] - 1) || (newDate.getFullYear() !== match[1]-0))
			return false;
		if (match[2].length === 1) match[2] = '0' + match[2];
		if (match[3].length === 1) match[3] = '0' + match[3];
		if (match[4].length === 1) match[4] = '0' + match[4];
		if (match[5].length === 1) match[5] = '0' + match[5];
		if (match[6].length === 1) match[6] = '0' + match[6];
		return match[1] + '/' + match[2] + '/' + match[3] + ' ' + match[4] + ':' + match[5] + ':' + (match[6] === '' ? '00' : match[6]);
	} else
		return false;
};