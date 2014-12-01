_toolbarEvent=function(b,i,a){
			var promise=b?this._eventDefer(b):this._eventDefer(function(v,d){d.resolve();return d;});
			if(this._options.isDebug){
				if(!promise.done && !promise.fail)
					throw 'beforeEvent必需返回deferred对象';
			}
			var that=this;
			promise.done(function(){
				promise=that._eventDefer(i);
				if(that._options.isDebug){
					if(!promise.done && !promise.fail)
						throw 'beforeEvent必需返回deferred对象';
				}
				promise.done(function(v){
					if(a){
						promise=a?that._eventDefer(a):that._eventDefer(function(v,d){d.resolve()});
						if(that._options.isDebug){
							if(!promise.done && !promise.fail)
								throw 'beforeEvent必需返回deferred对象';
						}
						promise.done(function(v){that._showState(v?v:$[_pluginName].regional.eventSuccess);});
					}
					else
						that._showState(v?v:$[_pluginName].regional.eventSuccess);
				});
			});
			
};
_eventDefer=function(f){
			var d=$.Deferred(),
				that=this,
				p=d.then(f($.extend({},this._tableValues),d));
			p.fail(function(v){
				that._showState(v);
			});
			return p.promise();
};
_showState=function(msg){
			return(msg);
};