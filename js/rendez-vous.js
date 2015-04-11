var dragged_rdv_size = 0;
var dragged_rdv = null;

function OnDragStart (target, evt){
	evt.dataTransfer.setData("IdElement", target.id);
	dragged_rdv_size = parseInt(target.getAttribute("data-nb-hours"));
	target.parentNode.setAttribute("rowspan","1");
	for (var i=1; i<dragged_rdv_size; i++) {
		var jour = target.parentNode.getAttribute("data-jour");
		var heure = parseInt(target.parentNode.getAttribute("data-heure"))+i;
		var heure_display = (heure > 10 ) ? heure : "0"+heure;
		$("td[data-jour='"+jour+"'][data-heure='"+heure_display+"']").removeClass("hidden");
	}
	dragged_rdv = target;
	target.style.height = "45px";
}

function OnDropTarget (target, evt) {
	var id = evt.dataTransfer.getData("IdElement");
	target.appendChild(dragged_rdv);
	evt.preventDefault();

	dragged_rdv.style.height = (dragged_rdv_size*45)+"px";
	target.setAttribute("rowspan",dragged_rdv_size);
	for (var i=1; i< dragged_rdv_size; i++) {
		var jour = dragged_rdv.parentNode.getAttribute("data-jour");
		var heure = parseInt(target.getAttribute("data-heure"))+i;
		var heure_display = (heure >= 10 ) ? ""+heure : "0"+heure;
		$("td[data-jour='"+jour+"'][data-heure='"+heure_display+"']").addClass("hidden");
	}
}