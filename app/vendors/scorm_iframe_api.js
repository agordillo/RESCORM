/*
 * SCORM Gateway
 * @version 1.0
 */

SCORM_IFRAME_API = (function(undefined){

	var _initialized = false;
	var _connected = false;
	var _options;
	var _mode = "EXTERNAL"; //default
	var _origin = "?";
	var _originId = "?";
	var _listeners;
	var _wapplisteners;
	// _listeners['event'] = callback;

	//Constants
	var VALID_TYPES = ["PROTOCOL","WAPP"];


	///////////////
	// CORE
	//////////////

	var init = function(initOptions){
		_connected = false;

		if(_initialized===false){
			try {
				_origin = window.location.href;
			} catch (e){}
			_originId = _generateOriginId();

			if (window.addEventListener){
				window.addEventListener("message", _onIframeMessageReceived, false);
			} else if (window.attachEvent){
				window.attachEvent("message", _onIframeMessageReceived);
			}
		}
		_initialized = true;

		_options = initOptions || {};

		if(["EXTERNAL","INTERNAL"].indexOf(_options.mode)!=-1){
			_mode = _options.mode;
		}

		_listeners = new Array();
		_wapplisteners = new Array();

		registerCallback("onConnect", function(origin){
			//Communication stablished
			// _print(_origin + ": Communication stablished with: " + origin);
			if((_options)&&(typeof _options.callback === "function")){
				_options.callback(origin);
			}
		});

		_initHelloExchange();
	};


	// Messages

	function IframeMessage(type,request,data,destination,destinationId){
		this.IframeMessage = true;
		this.mode = _mode;
		this.type = type;
		this.request = ((request===false) ? false : true);
		this.data = data || {};
		this.origin = _origin;
		this.originId = _originId;
		this.destination = destination || "*";
		if(destinationId){
			this.destinationId = destinationId;
		}
	};

	var _createMessage = function(type,request,data,destination,destinationId){
		var iframeMessage = new IframeMessage(type,request,data,destination,destinationId);
		return JSON.stringify(iframeMessage);
	};

	var _validateWrapperedIframeMessage = function(wrapperedIframeMessage){
		if((typeof wrapperedIframeMessage != "object")||(typeof wrapperedIframeMessage.data != "string")){
			return false;
		}
		return _validateIframeMessage(wrapperedIframeMessage.data);
	};

	var _validateIframeMessage = function(iframeMessage){
		try {
			var iframeMessage = JSON.parse(iframeMessage);
			if((iframeMessage.IframeMessage!==true)||(VALID_TYPES.indexOf(iframeMessage.type)==-1)){
				return false;
			}
		} catch (e){
			return false;
		}
		return true;
	};


	// Events and callbacks

	var registerCallback = function(listenedEvent,callback){
		if(callback){
			_listeners[listenedEvent] = callback;
		}
	};

	var unregisterCallback = function(listenedEvent){
		if((listenedEvent in _listeners)){
			_listeners[listenedEvent] = null;
		}
	};

	// Iframe communication methods

	var sendMessage = function(iframeMessage,iframeId){
		if(!_connected){
			return "Not connected";
		}
		return _sendMessage(iframeMessage,iframeId);
	};

	var _sendMessage = function(iframeMessage,iframeId){
		if(!_validateIframeMessage(iframeMessage)){
			return "Invalid message";
		}
		switch(_mode){
			case "EXTERNAL":
				return _sendInternalMessage(iframeMessage,iframeId);
			case "INTERNAL":
				return _sendExternalMessage(iframeMessage);
			default:
				return;
		}
	};

	var _sendExternalMessage = function(iframeMessage){
		window.parent.postMessage(iframeMessage,'*');
	};

	var _sendInternalMessage = function(iframeMessage,iframeId){
		if(typeof iframeId == "undefined"){
			_broadcastInternalMessage(iframeMessage);
		} else {
			if(typeof iframeId === "string"){
				var iframe = document.getElementById(iframeId);
				_sendMessageToIframe(iframeMessage,iframe);
			} else if((iframeId instanceof Array)&&(iframeId.length > 0)){
				for(var i=0; i<iframeId.length; i++){
					if(typeof iframeId[i] == "string"){
						var iframe = document.getElementById(iframeId[i]);
						_sendMessageToIframe(iframeMessage,iframe);
					}
				}
			}
		}
	};

	var _broadcastInternalMessage = function(iframeMessage){
		var allIframes = document.querySelectorAll("iframe");
		for(var i=0; i<allIframes.length; i++){
			_sendMessageToIframe(iframeMessage,allIframes[i]);
		}
	};

	var _sendMessageToIframe = function(iframeMessage,iframe){
		if((iframe)&&(iframe.contentWindow)){
			iframe.contentWindow.postMessage(iframeMessage,'*');
		}
	};

	var _onIframeMessageReceived = function(wrapperedIframeMessage){
		if(_validateWrapperedIframeMessage(wrapperedIframeMessage)){
			var iframeMessage = JSON.parse(wrapperedIframeMessage.data);
			if((iframeMessage.destination!=_origin)&&(iframeMessage.destination!=="*")){
				return;
			}
			if((typeof iframeMessage.destinationId != "undefined")&&(iframeMessage.destinationId != _originId)){
				return;
			}
			//Do not process own messages
			if((iframeMessage.origin===_origin)&&(iframeMessage.originId===_originId)){
				return false;
			}
			switch(iframeMessage.type) {
				case "PROTOCOL":
					return _processProtocolMessage(iframeMessage);
				case "WAPP":
					return _processWAPPMessage(iframeMessage);
				default:
					return;
			}
		}
	};

	var _generateOriginId = function(){
		var timestamp = ((new Date()).getTime()).toString();
		var random = (parseInt(Math.random()*1000000)).toString();
		return parseInt(timestamp.substr(timestamp.length-7,timestamp.length-1) + random);
	};


	///////////////
	// PROTOCOL
	//////////////

	var _helloAttempts;
	var MAX_HELLO_ATTEMPTS = 40;
	var _helloTimeout;

	var _initHelloExchange = function(){
		registerCallback("stopHelloExchange", function(){
			if(_helloTimeout){
				clearTimeout(_helloTimeout);
			}
		});

		_helloAttempts = 0;
		_helloTimeout = setInterval(function(){
			_sayHello();
		},1250);

		_sayHello();
	};

	var _sayHello = function(){
		var helloMessage = _createProtocolMessage("onIframeMessengerHello");
		_sendMessage(helloMessage);
		_helloAttempts++;
		if((_helloAttempts>=MAX_HELLO_ATTEMPTS)&&(_helloTimeout)){
			clearTimeout(_helloTimeout);
		}
	};

	var _createProtocolMessage = function(protocolMessage,destination,destinationId){
		var data = {};
		data.message = protocolMessage;
		return _createMessage("PROTOCOL",true,data,destination,destinationId);
	};

	var _processProtocolMessage = function(protocolMessage){
		if((protocolMessage.data)&&(protocolMessage.data.message === "onIframeMessengerHello")){
			if(!_connected){
				_connected = true;
				if(typeof _listeners["stopHelloExchange"] == "function"){
					_listeners["stopHelloExchange"]();
				}
				if(typeof _listeners["onConnect"] == "function"){
					_listeners["onConnect"](protocolMessage.origin);
				}
			}
		}
	};


	///////////////
	// WAPP Messages
	//////////////

	var _createWAPPMessage = function(request,method,params,origin,destination,destinationId){
		var data = {};
		data.method = method;
		data.params = params;
		return _createMessage("WAPP",request,data,destination,destinationId);
	};

	var _processWAPPMessage = function(WAPPMessage){
		if(WAPPMessage.request===true){
			return _processRequest(WAPPMessage);
		} else {
			return _processResponse(WAPPMessage);
		}
	};

	var _processResponse = function(WAPPMessage){
		var data = WAPPMessage.data;
		if(typeof _wapplisteners[data.method] == "function"){
			_wapplisteners[data.method](data.params,WAPPMessage.origin);
			_wapplisteners[data.method] = undefined;
		};
	};

	var _processRequest = function(WAPPMessage){
		var data = WAPPMessage.data;
		switch(data.method){
			case "setSuccessStatus":
			case "setScore":
			case "setCompletionStatus":
			case "setProgress":
				if(typeof _listeners[data.method] == "function"){
					_listeners[data.method](data.params,WAPPMessage.origin);
				};
				break;
			case "getUser":
				if(typeof _listeners[data.method] == "function"){
					var user = _listeners[data.method](data.params,WAPPMessage.origin);
					if(typeof user != "undefined"){
						//Send a response
						var WAPPMessage = _createWAPPMessage(false,"getUser",user);
						sendMessage(WAPPMessage);
					}
				};
				break;
			default:
				return;
		}
	};

	///////////////
	// WAPP API
	//////////////

	var getUser = function(callback){
		_callWAPPMethod("getUser",{},callback);
	};

	var setScore = function(score,callback){
		_callWAPPMethod("setScore",score,callback);
	};

	var setProgress = function(progress,callback){
		_callWAPPMethod("setProgress",progress,callback);
	};

	var setSuccessStatus = function(status,callback){
		_callWAPPMethod("setSuccessStatus",status,callback);
	};

	var setCompletionStatus = function(status,callback){
		_callWAPPMethod("setCompletionStatus",status,callback);
	};

	var _callWAPPMethod = function(methodName,params,callback){
		if(typeof params == "undefined"){
			params = {};
		}
		_wapplisteners[methodName] = callback;
		var WAPPMessage = _createWAPPMessage(true,methodName,params);
		sendMessage(WAPPMessage);
	};


	///////////
	// Utils
	///////////

	var _print = function(objectToPrint){
		if((console)&&(console.log)){
			console.log(objectToPrint);
		}
	};

	var isConnected = function(){
		return _connected;
	};


	return {
			init 							: init,
			getUser							: getUser,
			setScore						: setScore,
			setProgress						: setProgress,
			setSuccessStatus				: setSuccessStatus,
			setCompletionStatus				: setCompletionStatus,
			registerCallback				: registerCallback,
			unregisterCallback 				: unregisterCallback,
			isConnected						: isConnected
	};

})();