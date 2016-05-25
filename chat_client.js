var socket = io();

$(function() {
    $("body").prepend("<hr style='height:3px;color:#bbb;background-color:#bbb;border:none;'>");
	$("body").prepend("<h1 id='chat_name'>" + localStorage.getItem("pkChat") + "</h1>");
});

socket.on("serve names", function(names) {
	var valid = true;
	for (var i = 0; i < names.length; i++) {
		if (names[i] == $("#n").val()) {
			valid = false;
		}
	}
	if (valid) {
		socket.emit("user joined", $("#chat_name").html() + ":" + $("#n").val());
		$("#name_textfield_identifier").css("display", "none");
		$("#name_textfield").css("display", "none");
		$("h2").css("display", "none");
		$("#chat_textfield").css("display", "block");
		$("figcaption").css("display", "block");
		$("#names").css("display", "block");
	} else {
		$("body").append($("<h2>").html("<span style='float: left;color:red;position:absolute;top:75px;left:6px'>Invalid Name</span>"));
	}
});

$("#name_textfield").submit(function() {
	socket.emit("request names");
	return false;
});

$("#name_textfield").onkeypress = function(e) {
	if (e.which == 13 && $(this).is(":focus")) {
		socket.emit("request names");
	}
}

socket.on("update list", function(userdata) {
	$("#names li").remove();
	for (var i = 0; i < userdata.length; i++) {
		split = userdata[i].split(":");
		curChat = split[0];
		curName = split[1];
		if ($("#chat_name").html() == curChat) {
			$("#names").append("<li>" + curName + "</li>");
		}
	}
});

//

function sendMessage(val) {
	if (val == "") {
		return;
	}
	socket.emit("chat message", val);
	$("#m").val("");
}

$("#chat_textfield").submit(function() {
	sendMessage($("#m").val());
	return false;
});

$("#chat_textfield").onkeypress = function(e) {
	if (e.which == 13 && $(this).is(":focus")) {
		sendMessage($("#m").val());
	}
}

socket.on("chat message", function(msg) {
	split = msg.split(":");
	chat = split[0];
	name = split[1];
	message = split[2];
	if (chat == $("#chat_name").html()) {
		$("#messages").append($("<li>").html("<span style='color: rgb(0, 50, 230)'>" + name + "</span>" + ": " + message));
	}
});