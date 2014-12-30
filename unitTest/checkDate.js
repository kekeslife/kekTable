checkDate = function(str) {
	var match = str.match(/^(\d{4})[\/\-]?(0?[1-9]|1[012])[\/\-]?(0?[1-9]|[12][0-9]|3[01])$/);
	if (match) {
		var newDate = new Date(match[1], match[2]-1, match[3]);
		if ((newDate.getMonth() !== match[2] - 1)||(newDate.getFullYear() !== match[1] - 0))
			return false;
		if (match[2].length === 1) match[2] = '0' + match[2];
		if (match[3].length === 1) match[3] = '0' + match[3];
		return match[1] + '/' + match[2] + '/' + match[3];
	} else
		return false;
};