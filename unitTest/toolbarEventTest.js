var v={db:1,di:1,da:1};
var res=null;
var b=function(v,d){
	stop();
	setTimeout(function(){
		if(v.db)
			d.resolve();
		else
			d.reject('bErr');
		console.log('b');
		start();
	},100);
};
var i=function(v,d){
	stop();
	setTimeout(function(){
		if(v.di)
			d.resolve();
		else
			d.reject('iErr');
		console.log('i');
		start();
	},500);
};
var a=function(v,d){
	stop();
	setTimeout(function(){
		if(v.da)
			d.resolve('ok');
		else
			d.reject('aErr');
		console.log('a');
		start();
	},1000);
};
var bs=function(v,d){
	stop();
	$.ajax('InputMethodContext.html').done(function(){d.resolve();start();}).fail(function(){d.reject('bErr');start();});
};
var is=function(v,d){
	stop();
	$.ajax('InputMethodContext.html').done(function(){d.resolve();start();}).fail(function(){d.reject('iErr');start();});
};
var as=function(v,d){
	stop();
	$.ajax('InputMethodContext.html').done(function(){d.resolve('ok');start();}).fail(function(){d.reject('aErr');start();});
};
//test('t,t,t',function(){
//	v={db:1,di:1,da:1};
//	_toolbarEvent(b,i,a);
//	stop();
//	setTimeout(function(){
//		strictEqual('ok',$('#state').text());
//		start();
//	},2000);
//	
//});
//
//test('f,t,t',function(){
//	v={db:0,di:1,da:1};
//	_toolbarEvent(b,i,a);
//	stop();
//	setTimeout(function(){
//		strictEqual('bErr',$('#state').text());
//		start();
//	},2000);
//});
//
//test('t,f,t',function(){
//	v={db:1,di:0,da:1};
//	_toolbarEvent(b,i,a);
//	stop();
//	setTimeout(function(){
//		strictEqual('iErr',$('#state').text());
//		start();
//	},2000);
//});
//
//test('t,f,f',function(){
//	v={db:1,di:0,da:0};
//	_toolbarEvent(b,i,a);
//	stop();
//	setTimeout(function(){
//		strictEqual('iErr',$('#state').text());
//		start();
//	},2000);
//});
//
test('t,t,f',function(){
	v={db:1,di:1,da:0};
	_toolbarEvent(b,i,a);
	stop();
	setTimeout(function(){
		strictEqual('aErr',$('#state').text());
		start();
	},2000);
});

//test('f,f,t',function(){
//	v={db:0,di:0,da:1};
//	_toolbarEvent(b,i,a);
//	stop();
//	setTimeout(function(){
//		strictEqual('bErr',$('#state').text());
//		start();
//	},2000);
//});

//test('f,f,f',function(){
//	v={db:0,di:0,da:0};
//	_toolbarEvent(b,i,a);
//	stop();
//	setTimeout(function(){
//		strictEqual('bErr',$('#state').text());
//		start();
//	},2000);
//});
//test('f,t,f',function(){
//	v={db:0,di:1,da:0};
//	_toolbarEvent(b,i,a);
//	stop();
//	setTimeout(function(){
//		strictEqual('bErr',$('#state').text());
//		start();
//	},2000);
//});

//test('f,f,t',function(){
//	v={db:0,di:0,da:1};
//	_toolbarEvent(bs,is,as);
//	stop();
//	setTimeout(function(){
//		strictEqual('bErr',$('#state').text());
//		start();
//	},2000);
//});