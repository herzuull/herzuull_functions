/**
	Résumé
	------------------------------------------------------
	Classe Javascript de gestion d'évènements personnalisé.
	Singleton. Creation, appel, destruction des évènements.
	Fonction de callBack sur création, passage de paramètres à la création.
	EM est l'instance de EventManager, attachée sur window. 
	Il est donc disponible partout après sa création.
	Plusieurs fonctions de callback peuvent être définies pour un seul évènement.
	
	Syntaxe 
	------------------------------------------------------
	EM.registerEvent(type, callBack_function(options){}, options);
	EM.callEvent(type);
	EM.removeEvent(type);
	
	Paramètres
	------------------------------------------------------
	type
		Une chaine de caractère représentant le nom de l'évènement personnalisé.
	callBack_function
		Une fonction / objet qui recevra la notification lorsque l'évènement sera levé.
		Un objet facultatif est passé en paramètre de cette fonction, défini par le paramètre options ci-après.
	options
		L'objet facultatif linéaire déclarant les options.
		Si la valeur false(Boolean) est passée en paramètre, 
		la fonction passée en callback ne sera pas ajoutée dans la pile de l'évènement.
		
	Exemple
	------------------------------------------------------
	- Step 1 / declare event - déclarer l'évènement
		EM.registerEvent('MyOwnEvent', function(params){
			console.log(params.id); // 1
			console.log(params.type); // text
		}, {
			id: 1,
			type: 'text'
		});
	- Step 2 / call anywhere the event - Appeler l'évènement n'importe où dans la page.
		EM.callEvent('myOwnEvent');
	- Step 3 / destruct if necessary, your event. Beware ! The event is definitely destroyed.
		Desctruction de l'évènement. Attention ! L'évènement est définitivement détruit.
		EM.removeEvent('MyOwnEvent');
		
	Note
	------------------------------------------------------
	Raisons d'utiliser cette classe :
	- Elle permet d'avoir un comportement similaire à la gestion d'évènement système de javascript.
	- Elle permet une souplesse d'utilisation par le biais de passage de paramètres optionnels, 
	permettant ainsi de ne pas perdre le scope d'utilisation.
	
*/
(function(win, undefined) {

	win.EventManager = win.EventManager || {
		/** event manager section **/
		eventsPool : {} , // event pool
		eventCalled : {} , // event allready called
		callbackParameters : {} , // callback parameters
		// Ajouter un event personalisé
		RegisterUserEvent : function(eventName, callbackFunction, callbackParameters) {

			if (typeof this.eventsPool[eventName] == 'undefined') {
				//console.warn('EM >> REGISTER '+eventName+' for the first time ');
				this.eventsPool[eventName] = [] ;
			} else {
				//console.warn('EM >> REGISTER '+eventName+' exists, must call it once !');
			}

			if (callbackParameters && typeof callbackParameters != 'boolean') {
				if (!this.callbackParameters[eventName]) {
					this.callbackParameters[eventName] = [] ;
				}
				this.callbackParameters[eventName][this.callbackParameters[eventName].length] = callbackParameters ;
			}

			if (typeof callbackParameters == 'boolean'
				&& callbackParameters === false
				&& this.eventsPool[eventName].length > 0)
				return ;

			this.eventsPool[eventName].push(callbackFunction) ;

			if (this.eventCalled[eventName]) {
				//console.warn('EM >> CALL '+eventName+' was allready called, then, call once ! ');
				this.CallUserEvent(eventName) ;
			}
		},
		// Appeller un event personalisé
		CallUserEvent : function(eventName, facultativeParameters) {
			//console.log('EM >> CALL : '+eventName);
			this.eventCalled[eventName] = true ;
			if (!this.eventsPool[eventName]) {
				//console.warn('EM >> CALL '+eventName+' but wasnt registered, tip it to be auto called when it will be registered ');
				return true ;
			} else {
				//console.warn('EM >> CALL '+eventName+' exists, treat it normaly ');
			}

			var scope = null ;
			for (var fnIndex in this.eventsPool[eventName]) {

				if (!this.eventsPool[eventName][fnIndex])
					continue ;

				else
				if (this.eventsPool[eventName][fnIndex]
					&& this.callbackParameters[eventName]
					&& this.callbackParameters[eventName][fnIndex])
					scope = this.callbackParameters[eventName][fnIndex] ;

				if (typeof this.eventsPool[eventName][fnIndex] == 'function')
					this.eventsPool[eventName][fnIndex](scope, eventName, facultativeParameters);
			}
		},
		// Supprimer un event personalisé
		DeleteEventTkEvent : function(eventName) { this.eventsPool[eventName] = null ; this.callbackParameters[eventName] = null ; },
		// Ajouter un event système
		RegisterSystemEvent : function(objectHandler, eventName, callbackFunction, callbackParameters) {
			if (eventName == 'load' && document.body && document.readyState == 'complete') { (callbackFunction)(callbackParameters); }
			else {
				var object = objectHandler[0] || objectHandler ;
				if (object.addEventListener) object.addEventListener(eventName, function(e){(callbackFunction)(callbackParameters, e);}, false);
				else if (object.attachEvent) object.attachEvent('on'+eventName, function(e){(callbackFunction)(callbackParameters, e);});
				else if (object['on'+eventName]) object['on'+eventName](object, callbackFunction, callbackParameters);
				else if (window.console && window.console.warn) window.console.warn('No '+eventName+' on '+objectHandler.toString());
			}
		}
	} ;
	
})(window);

var isNull = function(param) {
	return (param == null) ;
};

var isUndefined = function(param) {
	return (typeof param == 'undefined') ;
};

var hasOwnProperty = function(obj, prop){
	try{
		if (typeof obj.hasOwnProperty != 'undefined') {
			return Object.prototype.hasOwnProperty.call(obj, prop);
		} else {
			return (prop in obj);
		}
	}catch(e){return false;}
};