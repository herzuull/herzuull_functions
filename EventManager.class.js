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
(function(window) {

	if (typeof window.mmmAdTkEM != 'undefined') return ;
	/** event object **/
	var EventManager = function() {
		this.instance = null ;
		if (EventManager.caller != EventManager.i) {
			throw new Error("Can't instanciate this way !");
		}
		this.eventPool = [] ;
		this.eventParameters = [] ;
	};

	EventManager.i = function() {
		if (this.instance == null) {
			this.instance = new EventManager();
		}
		return this.instance ;
	};

	EventManager.prototype.registerEvent = function(eventName, fn, eventParameters) {

		if (typeof this.eventPool[eventName] == 'undefined') {
			this.eventPool[eventName] = [] ;
		}

		if (isUndefined(eventParameters) == false
		 && typeof eventParameters != 'boolean') {
			if (!hasOwnProperty(this.eventParameters,eventName)) {
				this.eventParameters[eventName] = [] ;
			}
			var fnId = (this.eventParameters[eventName].length + 1) - 1  ;
			this.eventParameters[eventName][fnId] = eventParameters ;
		}

		// avoid stack function for an event
		if (typeof eventParameters == 'boolean'
			&& eventParameters === false
			&& this.eventPool[eventName].length > 0) {
			return ;
		}

		this.eventPool[eventName].push(fn) ;
	};

	EventManager.prototype.callEvent = function(eventName) {
		
		if (!this.eventPool[eventName]) {
			return ;
		}
		
		var params = null ;
		for (var fnId in this.eventPool[eventName]) {
			if (!isUndefined(eventName) 
			&& hasProperty(this.eventParameters[eventName], fnId)) {
				params = this.eventParameters[eventName][fnId] ;
			}
			if (typeof this.eventPool[eventName][fnId] == 'function')
				this.eventPool[eventName][fnId](params, eventName);
		}
	};

	EventManager.prototype.removeEvent = function(eventName) {
		this.eventPool[eventName] = null ;
		this.eventParameters[eventName] = null ;
	};

	window.EM = EventManager.i() ;
	
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