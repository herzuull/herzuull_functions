!function(win) {

	var axatkroot ,
		doc = win.document ,
		loc = win.location ,
		axatk = function(selector) {
			return new axatk.pr.init(selector) ;
		};

	axatk.pr = axatk.prototype = {
		init : function(selector, axatkroot) {
			if (typeof selector == 'undefined' || selector == null) return this ;
			if (selector.nodeType||selector == win) { this[0] = selector ; return this ; }
			if (typeof selector == 'string') return axatk(axatk.selector(selector, doc));
			if (axatk.classof(selector) == '[object Array]') { this[0] = selector ; return this ; }
			return selector ;
		},
		attr: function() {
			if (typeof arguments[0] == 'string' && typeof arguments[1] != 'undefined')
				this[0].setAttribute(arguments[0], arguments[1]) ;
			if (typeof arguments[0] == 'string' && typeof arguments[1] == 'undefined')
				return this[0].getAttribute(arguments[0]) ;
			if (typeof arguments[0] == 'object' && typeof arguments[1] == 'undefined')
				for (var attrName in arguments[0]) {
					if (!arguments[0][attrName]) continue ;
					this[0].setAttribute(attrName, arguments[0][attrName]);
				}
			return this ;
		},
		css: function(property) {
			if (typeof this[0]=='undefined'||this[0]==null) return this ;
			var action = 'get' ;
			if (typeof arguments[1]!='undefined'||typeof property=='object') action='set' ;

			if (action == 'get') {
				if (this[0] == null) return this ;
				if ('currentStyle' in win) return this[0].currentStyle[property] ;
				else if ('getComputedStyle' in win) return win.getComputedStyle(this[0], null).getPropertyValue(property) ;
				else return this[0].style[property] ;
			} else
			if (typeof property == 'object')
				for (var propName in property) {
					if (typeof property[propName] == 'undefined') continue ;
					this[0].style[propName] = property[propName] ;
				}
			else this[0].style[property] = arguments[1] ;
			return this ;
		},
		hasClass: function(classname) {
			return this[0].className.match(new RegExp('(\\s|^)'+classname+'(\\s|$)'));
			return this ;
		},
		addClass: function(classname) {
			if (!this.hasClass(classname)) this[0].className += " "+classname ;
			return this ;
		},
		removeClass: function(classname) {
			if (this.hasClass(classname)) {
				var reg = new RegExp('(\\s|^)'+classname+'(\\s|$)');
				this[0].className = this[0].className.replace(reg,' ');
			}
			return this ;
		},
		html: function() {
			if (!axatk.isUndefined(arguments[0])) {
				this[0].innerHTML = arguments[0] ;
				return this ;
			}
			if (typeof this[0] == 'undefined') {
				return '' ;
			}
			return this[0].innerHTML ;
		},
		text: function() {
			if (typeof this[0] == 'undefined' || this[0] == null) return '' ;
			if (!(typeof document.getElementsByTagName("body")[0].innerText != 'undefined'))
				if (typeof arguments[0] != 'undefined')
					this[0].textContent = arguments[0] ;
				else
					return this[0].textContent ;
			else
			if (typeof arguments[0] != 'undefined')
				this[0].innerText = arguments[0] ;
			else
				return this[0].innerText ;
			return this ;
		},
		parent: function(strict) {
			if (strict) return this[0].parentNode ;
			return axatk(this[0].parentNode) ;
		},
		getChildren: function() {
			if (arguments[0] && typeof arguments[0] == 'string') {
				var childrenList = this[0].childNodes ,
					childList = [] ;
				for (var childId in childrenList) {
					if (childrenList[childId].nodeType == 1
						&& childrenList[childId].nodeName.toLowerCase() == arguments[0])
						childList.push(axatk(childrenList[childId]));
				}
				return childList ;
			}
			return this[0].childNodes ;
		},
		appendTo: function(targetSelector) {
			axatk(targetSelector)[0].appendChild(this[0]);
			return this ;
		},
		remove: function() {
			if (axatk.classof(this[0]) != '[object Array]')
				this[0].parentNode.removeChild(this[0]);
			else
				AXAtk(this).each(function(i,e){
					e.parentNode.removeChild(e);
				});
		},
		nodeName: function() {
			return this[0].nodeName.toLowerCase() ;
		},
		sizeOf: function() {
			return axatk.sizeOf(this[0]);
		},
		offset: function() {
			if (typeof arguments[0] == 'object') {
				if (axatk.gotOwnProperty(arguments[0],'w')||axatk.gotOwnProperty(arguments[0],'h')||axatk.gotOwnProperty(arguments[0],'x')||axatk.gotOwnProperty(arguments[0],'y'))
					for (var propName in arguments[0]) {
						if (!axatk.gotOwnProperty(arguments[0],propName)) continue ;
						switch (propName) {
							case'w': this[0].style.width+=arguments[0][propName];break;
							case'h': this[0].style.height+=arguments[0][propName];break;
							case'x': this[0].style.left+=arguments[0][propName];break;
							case'y': this[0].style.top+=arguments[0][propName];break;
						}
					}
				else axatk.log.warning('You must enter a correct value for setting dom object. ex: axatk(object).offset({x:10});');
				return this ;
			}
			if (typeof arguments[0] == 'boolean') {
				var xy = axatk.getRelativePosition(this[0]) ;
				return {w:this[0].offsetWidth, h:this[0].offsetHeight, x:xy[0], y:xy[1]} ;
			}
			var xy = axatk.getAbsolutePosition(this[0]);
			return {w:this[0].offsetWidth, h:this[0].offsetHeight, x:xy[0], y:xy[1]} ;
		},
		width: function() {
			return axatk(this[0]).innerWidth();
		},
		height: function() {
			return axatk(this[0]).innerHeight();
		},
		innerWidth: function() {
			if (this[0] == win)
				if (typeof win.innerWidth == 'number') return win.innerWidth ;
				else if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth ;
				else if (document.body && document.body.clientWidth) return document.body.clientWidth ;
				else return this[0].clientWidth ;
		},
		innerHeight: function() {
			if (this[0] == win)
				if (typeof win.innerHeight == 'number') return win.innerHeight ;
				else if (document.documentElement && document.documentElement.clientHeight)	return document.documentElement.clientHeight ;
				else if (document.body && document.body.clientHeight) return document.body.clientHeight ;
				else return this[0].clientHeight ;
		},
		scrollLeft: function() {
			if (this[0] == win)
				if (typeof win.pageXOffset == 'number') return win.pageXOffset ;
				else if (document.body && document.body.scrollLeft)	return document.body.scrollLeft ;
				else if (document.documentElement && document.documentElement.scrollLeft) return document.documentElement.scrollLeft ;
			return 0 ;
		},
		scrollTop: function() {
			if (this[0])
				if (typeof win.pageYOffset == 'number') return win.pageYOffset ;
				else if (document.body && document.body.scrollTop) return document.body.scrollTop ;
				else if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop ;

			return 0 ;
		},
		hide: function() {
			axatk(this[0]).css('display', 'none');
		},
		show: function() {
			axatk(this[0]).css('display', 'block');
		},
		on: function(eventName, eventHandler, eventParameters) {
			AXAtkEm.RegisterSystemEvent(this, eventName, eventHandler, eventParameters);
		},
		click: function() {
			if (!arguments[0])
				this.simulateEvent('click');
			else
				AXAtkEm.RegisterSystemEvent(this, 'click', arguments[0], arguments[1]);
		},
		change: function() {
			if (!arguments[0])
				this.simulateEvent('change');
			else
				AXAtkEm.RegisterSystemEvent(this, 'change', arguments[0], arguments[1]);
		},
		submit: function() {
			if (this[0].submit)
				this[0].submit();
		},
		truncate: function(nbChar, endOfString) {
			var string = axatk(this[0]).html();
			if (string.length > nbChar + endOfString.length) {
				var cutstring = string.substr(0, nbChar);
				var lastSpaceChar = cutstring.lastIndexOf(' ');
				cutstring = cutstring.substr(0, lastSpaceChar);
				axatk(this[0]).html(cutstring+endOfString)
			} else
				axatk(this[0]).html(axatk(this[0]).html());
		},
		each: function(callback, options) {
			for (var i in this[0]) callback(i, this[0][i], options);
		},
		length: function() {
			return this[0].length || axatk.sizeOf(this[0]);
		},
		val: function() {
			if (this[0].value)
				return this[0].value ;
			if (AXAtk(this[0]).attr('value'))
				return AXAtk(this[0]).attr('value') ;
			if (this[0].nodeName.toLowerCase() == 'select')
				return AXAtk(this[0]).attr('selectedIndex') ;
			return null ;
		},
		simulateEvent: function(eventName) {
			if ('fireEvent' in this[0] && !document.addEventListener) {
				this[0].fireEvent('on'+eventName);
			} else {
				var evt = document.createEvent('HTMLEvents');
				evt.initEvent(eventName, false, true);
				this[0].dispatchEvent(evt);
			}
		}
	};
	// Selector
	axatk.selector = function(slctr, cntxt) {
		var sls=slctr.split(','),el,op,s;
		for (var x=0;x<sls.length;x++) {
			// trim spaces
			var sl = sls[x].replace(/ /g,'');
			if (typeof sl=='string') {
				op = sl.substr(0,1); s = sl.substr(1);
				if (op == '#') {
					el = document.getElementById( s );
					if (el==null) return null ; }
				else if (op=='.') el = axatk.getElementsByClassName(s, cntxt);
				else if (op=='<') el = document.createElement(s.substr(0, s.indexOf('>')));
				else el = cntxt.getElementsByTagName(sl);
			} else if (typeof sl == 'object' && sl.nodeType == 1) el = sl ;
		}
		return el;
	};
	// Is Descendant
	axatk.isDecendant = function(d,a){ return ((d.parentNode==a)||(d.parentNode!=document)&&axatk.isDecendant(d.parentNode,a)); };
	// getElementsByClassName
	axatk.getElementsByClassName = function( c, p ) {
		var a=[],r=new RegExp('\\b'+c+'\\b'),els=p.getElementsByTagName('*');
		p = p||document.getElementsByTagName('body')[0];
		for (var i=0,j=els.length;i<j;i++) {
			if (r.test(els[i].className)) a.push( els[i] );
		}
		return a;
	};
	axatk.ajax = function(options) {
		if (!options.url)
			throw new Error('options.url is mandatory !');
		if (!options.success)
			throw new Error('options.success is mandatory !');
		var method = 'GET' ;
		if (!options.method)
			method = 'GET' ;
		var data = null ;
		if (!options.data)
			data = null ;
		var xhr = axatk.getXmlHTTPRequest();
		xhr.open(method, options.url);
		xhr.send(data);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
				options.success(xhr.responseText);
			}
		};
	};
	axatk.getXmlHTTPRequest = function() {
		var xhr = null;

		if (window.XMLHttpRequest || window.ActiveXObject) {
			if (window.ActiveXObject) {
				try {
					xhr = new ActiveXObject("Msxml2.XMLHTTP");
				} catch(e) {
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
			} else {
				xhr = new XMLHttpRequest();
			}
		} else {
			alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
			return;
		}
		return xhr ;
	};
	axatk.gotOwnProperty = function (o, p){
		try	{
			if (!o.hasOwnProperty) return Object.prototype.hasOwnProperty.call(o, p);
			else return (p in o);
		} catch(e) { return false; }
	};
	axatk.isUndefined 	= function (o) { return !o } ;
	axatk.isNull 		= function (o) { return o == null ;	} ;
	axatk.isOn 			= function (i, a, b) {
		for (var x in a) {
			if (!axatk.gotOwnProperty(a, x)) continue ;
			if (!!b)
				if (i == a[x][b]) return true ;
				else
				if (i == a[x]) return true ;
		}
		return false ;
	} ;
	axatk.classof = function(object) {
		return Object.prototype.toString.call(object) ;
	};
	axatk.log = {
		dg: 	axatk.tkdbg ,
		log: 	function(ms){this.ms=ms;this.ds('log');},
		info: 	function(ms){this.ms=ms;this.ds('info');},
		warning:function(ms){this.ms=ms;this.ds('warn');},
		error: 	function(ms){this.ms=ms;this.ds('error');},
		ds: 	function(mo){if (this.tt(mo) && this.dg) win.console[mo](this.ms);},
		tt: 	function(mo){return win.console&&win.console[mo]&&this.ds;}
	} ;
	axatk.keySort = function(ia) {
		var ta={},keys=[],i,k,that=this,sfi=false,ppa=ia ,
			sorter=function(a,b){
				var af = parseFloat(a),
					bf = parseFloat(b),
					an = af+'' === a,
					bn = bf+'' === b;
				if (an && bn) return af > bf ? 1 : af < bf ? -1 : 0;
				else if(an&&!bn)return 1;
				else if(!an&&bn)return -1;
				return a>b?1:a<b?-1:0;
			};
		for (k in ia) if (ia.hasOwnProperty(k)) keys.push(k);
		keys.sort(sorter);
		for (i = 0; i < keys.length; i++) {
			k = keys[i];
			ta[k] = ia[k];
			if (sfi) delete ia[k];
		}
		for (i in ta) if (ta.hasOwnProperty(i)) ppa[i] = ta[i];
		return sfi || ppa;
	};
	axatk.getAbsolutePosition = function(object) {
		if (document.getBoxObjectFor) return [document.getBoxObjectFor(object).x, document.getBoxObjectFor(object).y ] ;
		return [Math.round(object.getBoundingClientRect().left), Math.round(object.getBoundingClientRect().top) ] ;
	}
	axatk.getRelativePosition = function(obj) {
		var x = obj.offsetLeft || 0 ,
			y  = obj.offsetTop || 0 ;
		while (obj = obj.offsetParent) {
			x += obj.offsetLeft ;
			y  += obj.offsetTop ;
		}
		return [x,y];
	};
	axatk.now = function() { return Date.now(); };
	axatk.indexOf = function(array, index) {
		if (window.addEventListener) { return (array.indexOf(index) > -1) ;	} else { return index in array ; }
	};
	axatk.sizeOf = function(o) { var s=0 ; for (var k in o) if (axatk.gotOwnProperty(o, k))s++ ; return s ; };
	axatk.getValueOfIndex = function(object, index) {
		var counter = 0;
		for (var i in object) {
			if (counter == index)
				return object[i] ;
			counter ++ ;
		}
	};
	axatk.pr.init.prototype = axatk.pr ;
	axatkroot = axatk(doc) ;
	axatk.proxy = function(object, funct, params) {
		if (object[funct] && typeof object[funct] == 'function') {
			object[funct](params);
			return true ;
		}
		return false ;
	};
	axatk.setContextData = function(dataName, value, usablePrefix) {
		var prefix = (typeof usablePrefix != 'undefined') ? ((usablePrefix === true) ? '' : usablePrefix) : 'AXAgs_' ;
		if (window.sessionStorage)
			sessionStorage.setItem(prefix+dataName, value);
		else if (document.body.addBehavior){
			document.body.setAttribute(prefix+dataName, value);
			document.body.save(prefix+dataName);
		}
	};
	axatk.getContextData = function(dataName, usablePrefix) {
		var prefix = (typeof usablePrefix != 'undefined') ? ((usablePrefix === true) ? '' : usablePrefix) : 'AXAgs_' ;
		if (window.sessionStorage)
			return sessionStorage.getItem(prefix+dataName);
		else if (document.body.addBehavior) {
			document.body.load(prefix+dataName);
			return document.body.getAttribute(prefix+dataName);
		}
	};
	axatk.removeContextData = function(dataName, dontuseprefix) {
		var prefix = (!dontuseprefix) ? 'AXAgs_' : '' ;
		if (window.sessionStorage)
			sessionStorage.removeItem(prefix+dataName);
	};
	axatk.clearContextData = function() {
		var sessRegExp = /^AXAgs_(.*)$/ ;
		if (window.sessionStorage) {
			for (var i in sessionStorage) {
				if (i.match(sessRegExp)) {
					delete sessionStorage[i] ;
				}
			}
		}
	};
	axatk.thousandSep = function (number, decimals, dec_point, thousands_sep) {
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ' ' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? ',' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec);
				return '' + Math.round(n * k) / k;
			};
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	}
	axatk.getUniqueId = function() {
		var alpha = ['a','b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		letter = alpha[Math.round(Math.random()*alpha.length)-1] ;
		unikid = (new Date()).getTime()+(letter || 'a')+'_'+Math.round(Math.random()*99)+(letter || 'b')+'_' +Math.round(Math.random()*9999)+(letter || 'c') ;
		return unikid ;
	};
	win.AXAtk = axatk ;

}(window);