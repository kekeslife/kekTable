_toolbarEvent=function(b,i,a){
			var promise=b?this._eventDefer(b):this._eventDefer(function(v,d){d.resolve();return d;});
			var that=this;
			var state;
			promise.done(function(){
				promise=that._eventDefer(i);
				promise.done(function(v){
					if(a){
						promise=a?that._eventDefer(a):that._eventDefer(function(v,d){d.resolve()});
						promise.done(function(v){_showState (v?v:$[_pluginName].regional.eventSuccess);});
					}
					else
						_showState (v?v:$[_pluginName].regional.eventSuccess);
				});
			});
			
};
_eventDefer=function(f){
			var d=$.Deferred(),
				that=this,
				p=d.then(f($.extend({},v),d));
			p.fail(function(v){
				_showState (v);
			});
			return p.promise();
};
_showState=function(msg){
			$('#state').text(msg);
};