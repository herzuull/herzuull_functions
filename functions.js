/**
 * function permettant de choisir un chiffre dans une liste le plus près par rapport à un chiffre donné
 */ 
var list = [5, 10, 15, 20, 25];
var numbertofound = 12 ;
previousSous = 12 ;
for (var i=0; i<list.length; i++) {
	currentSous = list[i] - numbertofound  ;
	indexfound = i ;
	if (Math.abs(previousSous) > currentSous) {
		console.log('found['+i+'] ! : '+list[i]) ;
	}
	previousSous = currentSous;
}

/**
 * Ajouter des styles en dynamique
 */

/*
 [modifier] Ajout de styles css dans le head d'un site
 Kévin Goualch le 11 février 2013
 Dans le cas où un style en ligne sur un élément soit supplanter par le site lui-même, il est possible d'ajouter une description css dans le head de la page. Il faudra alors ajouter !important à sa déclaration.
 */
var head = document.getElementsByTagName('head')[0],
    s = document.createElement('style'),
    css = 'tag.classe {attribut: "valeur"!important}' ;
s.setAttribute('type', 'text/css');
if (s.styleSheet) { // IE
    s.styleSheet.cssText = css;
} else { // the world
    s.appendChild(document.createTextNode(css));
}
head.appendChild(s);

/*
 Kévin Goualch le 21/03/2013
 Nouvelle version avec ajout dynamique de classe css
 Il faut ajouter un objet sous forme d'objet json : {'.maclass': {'margin-top': '5px', 'background-color': '#fff'}}
 **/
function addCssRuleToHead (cssRule) {
    var head = document.getElementsByTagName('head')[0],
        s = document.createElement('style') ;
    css =  ;
    for (var cssrulename in cssRule) {
        if (!cssRule.hasOwnProperty(cssrulename) || !cssrulename in cssRule) continue ;
        css += cssrulename+'{' ;
        for (var cssattributes in cssRule[cssrulename]) {
            css += cssattributes+': '+cssRule[cssrulename][cssattributes] ;
        }
        css+='}';
    }
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) { // IE
        s.styleSheet.cssText = css;
    } else { // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
}


addCssRuleToHead({
	'#lbSpacer': {
		'height': '0'
	},
	'.homeContHl': {
		'margin-top': '-14px'
	},
	'body': {
		'background-color': '#000'
	}
});

/*
Overlay new gen
Kevin Goualch Le 20 septembre 2012 - MAJ 29 novembre 2012
Voici une petite classe qui permet d'exploiter un overlay de taille / couleur / comportement en rapport avec les choix de l'utilisateur.
*/
document.body.style['overflow-x'] = 'hidden' ;

(function(window, undefined){

	var Overlay = function() {
	
		var domOverlay = document.createElement('div');
		domOverlay.style.width = '1px'  ;
		domOverlay.style.height = '1px'  ;
		domOverlay.style.cursor = 'pointer'  ;
		domOverlay.style.backgroundColor = '#000' ;
		domOverlay.style.opacity = '0.5';
		domOverlay.style.filter = 'alpha(opacity=50)';
		domOverlay.style.position = 'fixed' ;
		domOverlay.style.top = '0' ;
		domOverlay.style.left = '0' ;
		document.body.appendChild(domOverlay);
		this.domObject = domOverlay ;
		var divIndication = document.createElement('div') ;
		divIndication.innerHTML = 'Clickez pour fermer';
		divIndication.setAttribute('id', 'indication_overlay');
		document.body.appendChild(divIndication);
		var style = document.createElement('style') ,
			cssText = '#indication_overlay {background-color:#ddd;position:"absolute";top:0;left:0;width:200px;height:50px;border:1px solid #444;border-radius:5px;}' ;
		cssText = '#indication_overlay:after{content: "\\25be";color: #444}' ;
		style.setAttribute('type', 'text/css');
		if (style.styleSheet) { //For ie
			style.styleSheet.cssText = cssText ;
		} else {
			var textNode = document.createTextNode(cssText);
			style.appendChild(textNode);
		}
		var h = document.getElementsByTagName('head')[0];
			h.appendChild(style);
	};
	
	Overlay.prototype = {
		
		hide : function() {
			this.domObject.style.width = '1px' ;
			this.domObject.style.height = '1px';
			this.domObject.style.backgroudColor = 'transparent' ;
		},
		show : function() {
			this.domObject.style.width = '100%' ;
			this.domObject.style.height = '100%' ;
			this.domObject.style.backgroudColor = '#000' ;
		},
		click : function(callbackFunction) {
			this.addEvent('click', this.domObject, callbackFunction);
		},
		over : function(callbackFunction) {
			this.addEvent('mouseover', this.domObject, callbackFunction);
		},
		out : function(callbackFunction) {
			this.addEvent('mouseout', this.domObject, callbackFunction);
		},
		addEvent : function (event, eventHandler, callbackFunction) {
			if (eventHandler.addEventListener) {
				eventHandler.addEventListener(event, function(){ (callbackFunction)(event) }, false);
			} else if (eventHandler.attachEvent) {
				eventHandler.attachEvent('on'+event, function(){ (callbackFunction)(event) });
			} else {
				eventHandler['on'+event] = (callbackFunction)(event) ;
			}
		}
	}
	
	window.overlay = new Overlay() ;
	
})(window);

overlay.show(); // Displays overlay on the whole page.
overlay.hide(); // hide current overlay.
overlay.click(function(e){console.log(e.target);}); // make a click event over the overlay, and execute a callback function
overlay.over(function(e){console.log(e.target);}); // Make an mouseover event over the overlay,  and execute a callback function
overlay.out(function(e){console.log(e.target);}); // Make an mouseout event over the overlay,  and execute a callback function

/*
[modifier] Récupération de style calculé (via les classes css)
Kévin Goualch le 11 février 2013
Si vous avez besoin de récupérer une valeur calculée en css, c'est possible grâce à la fonction mmmGetCssStyle(domObject, property)
Utile par exemple pour annuler un padding.
*/
function getCssStyle (domobject, property) {
	if ('currentStyle' in window) return domobject.currentStyle[property] ;
	else if ('getComputedStyle' in window) return window.getComputedStyle(domobject, null).getPropertyValue(property) ; 
	else return domobject.style[property] ;
}

/*
[modifier] Créer un bouton play en CSS3 pour un player video HTML5
Kévin Goualch le 22 février 2013
Objectif : Créer un bouton play "àla youtube" en CSS3 sur un player video html5

Deux choses : un deux classes css + une fonction javascript

La css :
.circle {
	left: 50% ;
	width: 100px ;
	margin-left: -50px ;
	top: 50% ;
	height: 100px ;
	margin-top: -50px ;
	border-radius: 50% ;
	border: 10px solid #fff;
	box-shadow : 0 0 0 5px #999 ;
	position: absolute ;
	opacity: .8 ;
}

.triangle {
	border-color: #FFFFFF transparent transparent;
	border-style: solid;
	border-width: 50px 34px 0 ;
	cursor: pointer;
	height: 0;
	width: 0;
	margin: 25px 0 0 20px;
	position: absolute;
	-webkit-transform: rotate(-90deg);
}
la fonction js :
*/
function createGlobalPlayButton (playerObject) {
	var overlay = document.createElement('div') ,
		circle = document.createElement('div') ,
		triangle = document.createElement('div') ;

	circle.appendChild(triangle);
	overlay.appendChild(circle);
	playerObject.parentNode.appendChild(overlay);

	overlay.setAttribute('id', 'hls_overlay');
	overlay.style.width = playerObject.offsetWidth + 'px' ;
	overlay.style.height = playerObject.offsetHeight + 'px';
	overlay.style.position = 'absolute';
	overlay.style.cursor = 'pointer' ;
	overlay.style.top = 0 ;
	overlay.style.left = 0 ;

	circle.setAttribute('id', 'btnPlay');
	circle.setAttribute('class', 'circle');	
	triangle.setAttribute('class', 'triangle');

	overlay.addEventListener('click', function(e) {
	this.style.display = 'none' ;
		playerObject.play();
	}, false);
	return overlay ;
};
/*
l'appel de la fonction js :
*/
createGlobalPlayButton(document.getElementById('id_player_video'));