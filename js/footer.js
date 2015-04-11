window.onresize = function(event) {
	if (window.innerHeight < (document.getElementById("page").offsetHeight + document.getElementById("footer").offsetHeight)) {
		$("#footer").removeClass("navbar-fixed-bottom");
		$("#footer").addClass("navbar-static-bottom");
	} else {
		$("#footer").addClass("navbar-fixed-bottom");
		$("#footer").removeClass("navbar-static-bottom");
	}
}

window.onload = function(event) {
	if (window.innerHeight < (document.getElementById("page").offsetHeight + document.getElementById("footer").offsetHeight)) {
		$("#footer").removeClass("navbar-fixed-bottom");
		$("#footer").addClass("navbar-static-bottom");
	} else {
		$("#footer").addClass("navbar-fixed-bottom");
		$("#footer").removeClass("navbar-static-bottom");
	}
}