//test('20140101 000000~20140101 235959', function() {
//	var year='2014',month='01',day='01',hours='00',min='00',sec='00';
//	while (day!=='02'){
//		equal((year+'/'+month+'/'+day+' '+hours+':'+min+':'+sec), checkDateTime(year+month+day+' '+hours+min+sec));
//		curDate=new Date(year,month-1,day,hours,min,sec-0+1);
//		month=(curDate.getMonth()+1).toString();
//		day=curDate.getDate().toString();
//		hours=curDate.getHours().toString();
//		min=curDate.getMinutes().toString();
//		sec=curDate.getSeconds().toString();
//		month.length===1 && (month='0'+month);
//		day.length===1 && (day='0'+day);
//		hours.length===1 && (hours='0'+hours);
//		min.length===1 && (min='0'+min);
//		sec.length===1 && (sec='0'+sec);
//	}
//});
//test('2014/01/01 000000~2014/01/01 235959', function() {
//	var year='2014',month='01',day='01',hours='00',min='00',sec='00';
//	while (day!=='02'){
//		equal((year+'/'+month+'/'+day+' '+hours+':'+min+':'+sec), checkDateTime(year+'/'+month+'/'+day+' '+hours+min+sec));
//		curDate=new Date(year,month-1,day,hours,min,sec-0+1);
//		month=(curDate.getMonth()+1).toString();
//		day=curDate.getDate().toString();
//		hours=curDate.getHours().toString();
//		min=curDate.getMinutes().toString();
//		sec=curDate.getSeconds().toString();
//		month.length===1 && (month='0'+month);
//		day.length===1 && (day='0'+day);
//		hours.length===1 && (hours='0'+hours);
//		min.length===1 && (min='0'+min);
//		sec.length===1 && (sec='0'+sec);
//	}
//});
//test('2014-01-01 000000~2014-01-01 235959', function() {
//	var year='2014',month='01',day='01',hours='00',min='00',sec='00';
//	while (day!=='02'){
//		equal((year+'/'+month+'/'+day+' '+hours+':'+min+':'+sec), checkDateTime(year+'-'+month+'-'+day+' '+hours+min+sec));
//		curDate=new Date(year,month-1,day,hours,min,sec-0+1);
//		month=(curDate.getMonth()+1).toString();
//		day=curDate.getDate().toString();
//		hours=curDate.getHours().toString();
//		min=curDate.getMinutes().toString();
//		sec=curDate.getSeconds().toString();
//		month.length===1 && (month='0'+month);
//		day.length===1 && (day='0'+day);
//		hours.length===1 && (hours='0'+hours);
//		min.length===1 && (min='0'+min);
//		sec.length===1 && (sec='0'+sec);
//	}
//});
//test('20140101 0000~20140101 2359', function() {
//	var year='2014',month='01',day='01',hours='00',min='00',sec='';
//	while (day!=='02'){
//		equal((year+'/'+month+'/'+day+' '+hours+':'+min+':'+'00'), checkDateTime(year+month+day+' '+hours+min+sec));
//		curDate=new Date(year,month-1,day,hours,min-0+1,sec);
//		month=(curDate.getMonth()+1).toString();
//		day=curDate.getDate().toString();
//		hours=curDate.getHours().toString();
//		min=curDate.getMinutes().toString();
//		sec=curDate.getSeconds().toString();
//		month.length===1 && (month='0'+month);
//		day.length===1 && (day='0'+day);
//		hours.length===1 && (hours='0'+hours);
//		min.length===1 && (min='0'+min);
//		sec.length===1 && (sec='0'+sec);
//	}
//});
//test('20140101 00:00~20140101 23:59', function() {
//	var year='2014',month='01',day='01',hours='00',min='00',sec='';
//	while (day!=='02'){
//		equal((year+'/'+month+'/'+day+' '+hours+':'+min+':'+'00'), checkDateTime(year+month+day+' '+hours+':'+min+':'+sec));
//		curDate=new Date(year,month-1,day,hours,min-0+1,sec);
//		month=(curDate.getMonth()+1).toString();
//		day=curDate.getDate().toString();
//		hours=curDate.getHours().toString();
//		min=curDate.getMinutes().toString();
//		sec=curDate.getSeconds().toString();
//		month.length===1 && (month='0'+month);
//		day.length===1 && (day='0'+day);
//		hours.length===1 && (hours='0'+hours);
//		min.length===1 && (min='0'+min);
//		sec.length===1 && (sec='0'+sec);
//	}
//});
//test('2014-01-01 00:00:00~2014-01-01 23:59:59', function() {
//	var year='2014',month='01',day='01',hours='00',min='00',sec='00';
//	while (day!=='02'){
//		equal((year+'/'+month+'/'+day+' '+hours+':'+min+':'+sec), checkDateTime(year+'-'+month+'-'+day+' '+hours+':'+min+':'+sec));
//		curDate=new Date(year,month-1,day,hours,min,sec-0+1);
//		month=(curDate.getMonth()+1).toString();
//		day=curDate.getDate().toString();
//		hours=curDate.getHours().toString();
//		min=curDate.getMinutes().toString();
//		sec=curDate.getSeconds().toString();
//		month.length===1 && (month='0'+month);
//		day.length===1 && (day='0'+day);
//		hours.length===1 && (hours='0'+hours);
//		min.length===1 && (min='0'+min);
//		sec.length===1 && (sec='0'+sec);
//	}
//});
test('201411 12101~201411 121059', function() {
	var year='2014',month='1',day='1',hours='12',min='10',sec='1';
	while (sec!=='59'){
		equal(('2014/01/01 12:10:'+(sec.length===1?('0'+sec):sec)), checkDateTime(year+month+day+hours+min+sec));
		curDate=new Date(year,month-1,day,hours,min,sec-0+1);
		sec=curDate.getSeconds().toString();
	}
});
test('20140101 000060~20140101 000099', function() {
	var year='2014',month='01',day='01',hours='00',min='00',sec='60';
	while (sec!=='100'){
		equal(false, checkDateTime(year+month+day+' '+hours+':'+min+':'+sec));
		sec=(sec-0+1).toString();
	}
});
test('20140101 0060~20140101 0099', function() {
	var year='2014',month='01',day='01',hours='00',min='60',sec='';
	while (min!=='100'){
		equal(false, checkDateTime(year+month+day+' '+hours+':'+min+':'+sec));
		min=(min-0+1).toString();
	}
});