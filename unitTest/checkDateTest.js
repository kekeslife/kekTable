test('20140101~20141231', function() {
	var year='2014',month='01',day='01';
	while (year==='2014'){
		equal((year+'/'+month+'/'+day), checkDate(year+month+day));
		curDate=new Date(year,month-1,day+1);
		year=curDate.getYear().toString();
		month=(curDate.getMonth()+1).toString();
		day=curDate.getDate().toString();
		month.length===1 && (month='0'+month);
		day.length===1 && (day='0'+day);
	}
});

test('2014/01/01~2014/12/31', function() {
	var year='2014',month='01',day='01';
	while (year==='2014'){
		equal((year+'/'+month+'/'+day), checkDate(year+'/'+month+'/'+day));
		curDate=new Date(year,month-1,day+1);
		year=curDate.getYear().toString();
		month=(curDate.getMonth()+1).toString();
		day=curDate.getDate().toString();
		month.length===1 && (month='0'+month);
		day.length===1 && (day='0'+day);
	}
});

test('2014-01-01~2014-12-31', function() {
	var year='2014',month='01',day='01';
	while (year==='2014'){
		equal((year+'/'+month+'/'+day), checkDate(year+'-'+month+'-'+day));
		curDate=new Date(year,month-1,day+1);
		year=curDate.getYear().toString();
		month=(curDate.getMonth()+1).toString();
		day=curDate.getDate().toString();
		month.length===1 && (month='0'+month);
		day.length===1 && (day='0'+day);
	}
});
test('2014_01_01~2014_12_31', function() {
	var year='2014',month='01',day='01';
	while (year==='2014'){
		equal(false, checkDate(year+'_'+month+'_'+day));
		curDate=new Date(year,month-1,day+1);
		year=curDate.getYear().toString();
		month=(curDate.getMonth()+1).toString();
		day=curDate.getDate().toString();
		month.length===1 && (month='0'+month);
		day.length===1 && (day='0'+day);
	}
});

test('20140132~201401100', function() {
	var year='2014',month='01',day='32';
	while (day!=='101'){
		equal(false, checkDate(year+month+day));
		day=(day-0+1).toString();
	}
});

test('20140229~201402100', function() {
	var year='2014',month='02',day='29';
	while (day!=='101'){
		equal(false, checkDate(year+month+day));
		day=(day-0+1).toString();
	}
});

test('201411~20141231', function() {
	var year='2014',month='1',day='1';
	while (year==='2014'){
		equal((year+'/'+(month.length===1?('0'+month):month)+'/'+(day.length===1?('0'+day):day)), checkDate(year+month+day));
		curDate=new Date(year,month-1,day+1);
		year=curDate.getYear().toString();
		month=(curDate.getMonth()+1).toString();
		day=curDate.getDate().toString();
	}
});