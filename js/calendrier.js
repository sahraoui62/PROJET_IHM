'use strict';

var AppZone = angular.module('telApp', [
	'telModule'
]);

angular.module('telModule',[]).controller('telCtrl', ['$scope',function ($scope) {
	$scope.jours = [
		{"court" : "lun 13", "long" : "Lundi 13"},
		{"court" : "mar 14", "long" : "Mardi 14"},
		{"court" : "mer 15", "long" : "Mercredi 15"},
		{"court" : "jeu 16", "long" : "Jeudi 16"},
		{"court" : "ven 17", "long" : "Vendredi 17"},
		{"court" : "sam 18", "long" : "Samedi 18"},
		{"court" : "dim 19", "long" : "Dimanche 19"}
	];	

	$scope.newEventTitle1 = "";
	$scope.newEventPlace1 = "";
	$scope.newEventDescription1 = "";
	$scope.newEventLength1 = 1;

	$scope.newEventTitle2 = "";
	$scope.newEventPlace2 = "";
	$scope.newEventDescription2 = "";
	$scope.newEventLength2 = 1;

	$scope.newEvent = {
		"tel1" : {
			"jour" : null,
			"heure" : null,
			"lieu" : null,
			"duree" : null,
			"titre" : null,
			"description" : null
		}, 
		"tel2" : {
			"jour" : null,
			"heure" : null,
			"lieu" : null,
			"duree" : null,
			"titre" : null,
			"description" : null
		}
	}

	$scope.selectedCell = {
		"tel1" : null,
		"tel2" : null
	}

	$scope.eventList = {
		"tel1" : [],
		"tel2" : []
	}
	
	$scope.generateCalendar = function(telId) {
		var telContent = $("#"+telId).find(".telcontent");

		/* Création du "header", qui contient le mois et l'année */
		var topContent = $('<div>', {class : "topcontent",});
		$('<span>',{class : "h3"}).html("Avril 2015").appendTo(topContent);
		topContent.appendTo(telContent);

		/* Création du tableau qui représente le calendrier de la semaine */
		var calendrier = $("<table>", {
			class : "calendrier semaine"
		});

		/* Header du calendrier */
		var calendrier_header = $("<thead>+<tr>+<td>");
		for (var i=0; i < $scope.jours.length; i++) {
			calendrier_header.find("tr").append($("<td>",{
				text: $scope.jours[i]["court"]
			}));
		}
		calendrier_header.appendTo(calendrier);

		/* Corps du calendrier */
		var calendrier_corps = $("<tbody>");
		for (var i=0; i< 24; i++) {
			var tr = $("<tr>");
			/* case contenant l'heure */
			var td = $("<td>");
			td.html(((i>=10) ? ""+i : "0"+i )+"h");
			td.appendTo(tr);
			/* cases contenant les créneaux */
			for (var j=0; j<$scope.jours.length; j++) {
				td = $("<td>");
				td.attr("data-occupee","false");
				td.attr("data-jour", j);
				td.attr("data-heure", ((i>=10) ? ""+i : "0"+i) );
				td.attr("class","drop-"+telId);
				td.attr("ondragover","return false");
				td.attr("ondrop","OnDropTarget(this, event);");
				td.click(function(){$scope.display_infos($(this),telId);});
				td.appendTo(tr);
			}
			tr.appendTo(calendrier_corps);
		}
		calendrier_corps.appendTo(calendrier);
		calendrier.appendTo(telContent);

		/* Fenêtre auxiliaire */
		var aux = $("<div>",{class: "aux"});
		$("<div>",{class:"close-aux"})
		.click(function(){$scope.hide_infos(telId)})
		.appendTo(aux);
		$("<h3>").appendTo(aux);
		$("<div>",{class:"rdv-infos"}).appendTo(aux);
		$("<div>",{class:"btn btn-default btn-add-event",text:"Ajouter un évènement"})
		.click(function(){$scope.formAddEvent(telId)})
		.appendTo(aux);
		$("<div>",{class:"btn btn-default btn-add-event-commun",text:"Ajouter un évènement"})
		.click(function(){$scope.displayModalCommun(telId)})
		.css("display","none")
		.appendTo(aux);
		aux.appendTo(telContent);
	}

	$scope.display_infos = function(cell, telId) {
	    cell.addClass("selected");
	    if ($scope.selectedCell[telId] != null)
	    	$scope.selectedCell[telId].removeClass("selected");

	    $scope.selectedCell[telId] = cell;
	    cell.addClass("selected");

	    $("#"+telId+" tbody").addClass("collapsed");

	    var info_div = $("#"+telId+" .aux");
	    info_div.find("h3").html($scope.getDate(cell));
	    info_div.find(".btn-add-event").attr("data-cell",cell);

	    if (cell.attr("data-occupee") == "true") {
	    	$("#"+telId+" .btn-add-event").css("display","none");
	    	$("#"+telId+" .rdv-infos").html(""+
				"<div class='col-lg-12'>"+cell.find(".rdv").attr("data-titre")+"</div>"+
				"<div class='col-lg-12'>"+cell.find(".rdv").attr("data-lieu")+"</div>"+
				"<div class='col-lg-12'>"+cell.find(".rdv").attr("data-description")+"</div>"+
	    	"");
	    } else {
	    	$("#"+telId+" .btn-add-event").css("display","inline-block");
	    	$("#"+telId+" .rdv-infos").html("Aucun évènement n'est prévu pour cette date.");
	    }
	}

	$scope.getDate = function(cell) {
		return $scope.jours[parseInt(cell.attr("data-jour"))]["long"]+" Avril 2015, "+cell.attr("data-heure")+"h";
	}

	$scope.hide_infos = function(telId) {
	    $("#"+telId+" tbody").removeClass("collapsed");
	    $scope.selectedCell[telId].removeClass("selected");
	    $scope.selectedCell[telId] = null;
	}

	$scope.show_menu = function(telId) {
		$("#"+telId+" .bottom-menu").addClass("visible");
	}

	$scope.hide_menu = function(telId) {
		$("#"+telId+" .bottom-menu").removeClass("visible");
	}

	$scope.toggle_menu = function(telId) {
		$("#"+telId+" .bottom-menu").toggleClass("visible");
	}

	$scope.formAddEvent = function(telId) {
		$("#"+telId+" .modal-new-event.modal-container").css("display","block");
	}

	$scope.addEvent = function(telId, duree, lieu, titre, description) {
		var cell = $scope.selectedCell[telId];
		var evnmt = {
			"jour" : cell.attr("data-jour"),
			"heure" : cell.attr("data-heure"),
			"lieu" : lieu,
			"duree" : duree,
			"titre" : titre,
			"description" : description
		};

		/* Ajout dans la liste des évènements du téléphone */

		$scope.eventList[telId].push(evnmt);

		/* Affichage sur le calendrier */
		var evnmt_div = $("<div>",{
			class              : "rdv vert",
			draggable          : "true",
			ondragstart        : "OnDragStart(this, event);",
			"data-nb-hours"    : evnmt["duree"],
			"data-titre"       : evnmt["titre"],
			"data-lieu"        : evnmt["lieu"],
			"data-description" : evnmt["description"],
			text               : evnmt["titre"]
		}).css("height",(evnmt["duree"]*45)+"px");

		cell.attr("rowspan",evnmt["duree"]);
		cell.attr("data-occupee","true");
		evnmt_div.appendTo(cell);
		for (var i=1; i< evnmt["duree"]; i++) {
			var heure = parseInt(evnmt["heure"])+i;
			var dheure = heure>=10 ? ""+heure : "0"+heure;
			$("#"+telId+" td[data-jour='"+evnmt["jour"]+"'][data-heure='"+dheure+"']").addClass("hidden");
		}
	}	

	$scope.addEventWithoutSelectedCell = function(telId, jour, heure, duree, lieu, titre, description) {
		$scope.selectedCell[telId] = $("#"+telId+" td[data-jour='"+jour+"'][data-heure='"+heure+"']");
		$scope.addEvent(telId, duree, lieu, titre, description);
	}

	$scope.addEventFromModal = function(telId) {
		if (telId = "tel1") {
			var titre = $scope.newEventTitle1;
			var lieu = $scope.newEventPlace1;
			var description = $scope.newEventDescription1;
			var duree = $scope.newEventLength1;

			$scope.newEventTitle1 = "";
			$scope.newEventPlace1 = "";
			$scope.newEventDescription1 = "";
			$scope.newEventLength1 = 1;
		} else {
			var titre = $scope.newEventTitle2;
			var lieu = $scope.newEventPlace2;
			var description = $scope.newEventDescription2;
			var duree = $scope.newEventLength2;

			$scope.newEventTitle2 = "";
			$scope.newEventPlace2 = "";
			$scope.newEventDescription2 = "";
			$scope.newEventLength2 = 1;
		}
		var cell = $scope.selectedCell[telId];
		$("#"+telId+" .modal-new-event.modal-container").css("display","none");
	    $("#"+telId+" tbody").removeClass("collapsed");
	    $scope.addEvent(telId, duree, lieu, titre, description)
	}

	$scope.abortEventFromModal = function(telId) {
		if (telId = "tel1") {
			$scope.newEventTitle1 = "";
			$scope.newEventPlace1 = "";
			$scope.newEventDescription1 = "";
			$scope.newEventLength1 = 1;
		} else {
			$scope.newEventTitle2 = "";
			$scope.newEventPlace2 = "";
			$scope.newEventDescription2 = "";
			$scope.newEventLength2 = 1;
		}
		$("#"+telId+" .modal-new-event.modal-container").css("display","none");
	}

	$scope.creneauxEnCommun = function(telId) {
		var source = $("#"+telId);
		var cible = (telId == "tel1") ? $("#tel2") : $("#tel1");

		$scope.selectDevice(source, cible);

	}

	$scope.selectDevice = function(source,cible) {
		source.find(".modal-container.modal-appareils-proches").css("display","block");
	}



	$scope.abortDeviceSelection = function(telId) {
		$("#"+telId).find(".modal-container.modal-appareils-proches").css("display","none");
	}

	$scope.demandeConfirmation = function(telId) {
		var source = $("#"+telId);
		var cible = (telId == "tel1") ? $("#tel2") : $("#tel1");

		source.find(".modal-container.modal-appareils-proches").css("display","none");
		cible.find(".notification.notification-demande").css("display","block");
	}

	$scope.lireNotification = function(telId) {
		$("#"+telId).find(".notification.notification-demande").css("display","none");
		$("#"+telId).find(".modal-container.modal-confirmation").css("display","block");
	}

	$scope.confirmationKO = function(telId) {
		var source = $("#"+telId);
		var cible = (telId == "tel1") ? $("#tel2") : $("#tel1");

		source.find(".modal-container.modal-confirmation").css("display","none");
		cible.find(".modal-container.modal-confirmation-refused").css("display","block");
	}

	$scope.confirmationRefused = function(telId) {
		$("#"+telId).find(".modal-container.modal-confirmation-refused").css("display","none");
	}

	$scope.confirmationOK = function(telId) {
		var source = $("#"+telId);
		var cible = (telId == "tel1") ? $("#tel2") : $("#tel1");

		source.find(".modal-container.modal-confirmation").css("display","none");
		source.find(".notification.notification-action").css("display","block");
		cible.find(".notification.notification-action").css("display","block");

		setTimeout(function(){
			source.find(".notification.notification-action").css("display","none");
			cible.find(".notification.notification-action").css("display","none");
			$scope.afficherCreneauxEnCommun();
		},"1500");
	}

	$scope.afficherCreneauxEnCommun = function() {
		var tel1 = $("#tel1");
		var tel2 = $("#tel2");


		/* On parcours tous les créneaux pour trouver ceux libres dans les deux téléphones */
		for (var i=0; i< 24; i++) {
			var heure = (i>=10) ? ""+i : "0"+i;
			for (var j=0; j<$scope.jours.length; j++) {
				var jour = j;
				var cellTel1 = tel1.find("td[data-jour='"+jour+"'][data-heure='"+heure+"']");
				var cellTel2 = tel2.find("td[data-jour='"+jour+"'][data-heure='"+heure+"']");


				if ((cellTel1.attr('data-occupee') == "false") && (cellTel2.attr('data-occupee') == "false") && (cellTel1.css('display') != "none") && (cellTel2.css('display') != "none")) {
					cellTel1.addClass("commune commune-proposition");
				 	cellTel2.addClass("commune commune-proposition");
				}
			}
		}

		$(".commune.commune-proposition").each(function(){
			$(this).click(function(){
				tel1.find(".btn-add-event-commun").css("display","block");
				tel1.find(".btn-add-event").css("display","none");
				tel2.find(".btn-add-event-commun").css("display","block");
				tel2.find(".btn-add-event").css("display","none");
			})
		});
	}

	$scope.addEventCommun = function(telId) {
		var tel1 = $("#tel1");
		var tel2 = $("#tel2");

		$("#"+telId).find(".modal-container.modal-new-event-commun").css("display","none");
		$("#"+telId).find("tbody").removeClass("collapsed");
		var jour = $scope.selectedCell[telId].attr("data-jour");
		var heure = $scope.selectedCell[telId].attr("data-heure");
		console.log(telId);
		var titre = $scope.newEventTitle1;
		var lieu = $scope.newEventPlace1;
		var description = $scope.newEventDescription1;
		var duree = $scope.newEventLength1;
		$scope.addEventWithoutSelectedCell("tel1",jour,heure,duree,lieu,titre,description);
		$scope.addEventWithoutSelectedCell("tel2",jour,heure,duree,lieu,titre,description);

		for (var i=0; i< 24; i++) {
			var heure = (i>=10) ? ""+i : "0"+i;
			for (var j=0; j<$scope.jours.length; j++) {
				var jour = j;
				var cellTel1 = tel1.find("td[data-jour='"+jour+"'][data-heure='"+heure+"']");
				var cellTel2 = tel2.find("td[data-jour='"+jour+"'][data-heure='"+heure+"']");


				cellTel1.removeClass("commune commune-proposition commune-attente commune-validee");
			 	cellTel2.removeClass("commune commune-proposition commune-attente commune-validee");
			}
		}

	}

	$scope.displayModalCommun = function(telId) {
		$("#"+telId).find(".modal-container.modal-new-event-commun").css("display","block");
	}


	$scope.test = function(){
		alert("test OK");
	}

	$scope.initialize = function() {
		$scope.generateCalendar("tel1");
		$scope.generateCalendar("tel2");
		$("#tel1 .icon-menu").click(function(){$scope.toggle_menu("tel1")});
		$("#tel2 .icon-menu").click(function(){$scope.toggle_menu("tel2")});
		$("#tel1 .item-bottom-menu").click(function(){$scope.hide_menu("tel1")});
		$("#tel2 .item-bottom-menu").click(function(){$scope.hide_menu("tel2")});
	}

	$scope.initializeEvents = function() {
		$scope.addEventWithoutSelectedCell("tel1","0","08",4,"M5 A12","ASE++","TP d'ASE++ - Architecture avancée des Systèmes d'exploitation");
		$scope.addEventWithoutSelectedCell("tel1","1","08",2,"SUP 113","IHM","Cours d'IHM - Interactions Homme Machine");
		$scope.addEventWithoutSelectedCell("tel1","1","10",2,"M5 A12","IHM","TP d'IHM - Interactions Homme Machine");
		$scope.addEventWithoutSelectedCell("tel1","1","13",2,"M1 CAUCHY","CAR","Cours de CAR - Construction d'applications réparties");
		$scope.addEventWithoutSelectedCell("tel1","2","13",4,"M5 A11","PPD","TP de PPD - Programmation parallèle et distribuée");
		$scope.addEventWithoutSelectedCell("tel1","3","08",2,"SUP 113","LABD","Cours de LABD - Langages avancée des bases de donnée");
		$scope.addEventWithoutSelectedCell("tel1","3","10",2,"M5 A16","LABD","TP de LABD - Langages avancée des bases de donnée");
		$scope.addEventWithoutSelectedCell("tel1","4","08",2,"M5 A8","CAR","TD de CAR - Construction d'applications réparties");
		$scope.addEventWithoutSelectedCell("tel1","4","10",2,"M5 A15","CAR","TP de CAR - Construction d'applications réparties");

		$scope.addEventWithoutSelectedCell("tel1","4","13",2,"12 rue Toto, 59650 Tutu","stage","Entretien de stage chez la société Titi");


		$scope.addEventWithoutSelectedCell("tel2","0","08",4,"M5 A12","ASE++","TP d'ASE++ - Architecture avancée des Systèmes d'exploitation");
		$scope.addEventWithoutSelectedCell("tel2","1","08",2,"SUP 113","IHM","Cours d'IHM - Interactions Homme Machine");
		$scope.addEventWithoutSelectedCell("tel2","1","10",2,"M5 A12","IHM","TP d'IHM - Interactions Homme Machine");
		$scope.addEventWithoutSelectedCell("tel2","1","13",2,"M1 CAUCHY","CAR","Cours de CAR - Construction d'applications réparties");
		$scope.addEventWithoutSelectedCell("tel2","2","13",4,"M5 A11","PPD","TP de PPD - Programmation parallèle et distribuée");
		$scope.addEventWithoutSelectedCell("tel2","3","08",2,"SUP 113","LABD","Cours de LABD - Langages avancée des bases de donnée");
		$scope.addEventWithoutSelectedCell("tel2","3","10",2,"M5 A16","LABD","TP de LABD - Langages avancée des bases de donnée");
		$scope.addEventWithoutSelectedCell("tel2","4","08",2,"M5 A8","CAR","TD de CAR - Construction d'applications réparties");
		$scope.addEventWithoutSelectedCell("tel2","4","10",2,"M5 A15","CAR","TP de CAR - Construction d'applications réparties");

		$scope.addEventWithoutSelectedCell("tel2","5","09",3,"Piscine","Piscine","Sortie piscine");
		$scope.addEventWithoutSelectedCell("tel2","5","15",2,"Cinema","Cine","Sortie Cine : Fast & Furious 7");
		$scope.addEventWithoutSelectedCell("tel2","6","13",4,"Tennis","Tennis","Séance de Tennis hebdomadaire");
	}

	$scope.initialize();
	$scope.initializeEvents();


}]);




