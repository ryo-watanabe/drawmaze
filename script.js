var width = 500;
var height = 400;
var nodes = [];
var toggle_house = 0;
var start_pos = {};
var goal_pos = {};

function start() {
	recthouse();
}

function house() {
	toggle_house++;
	if (toggle_house == 3) {
		toggle_house = 0;
	}
	if (toggle_house == 0) {
		recthouse();
	} else if (toggle_house == 1) {
		roundhouse();
	} else {
		trihouse();
	}
}

function deadends() {

}

function recthouse() {
	var canvas = document.getElementById('board');
	if (canvas.getContext == null) return
	var ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, width, height);
	var m = 30;
	ctx.fillStyle = 'black';
	ctx.fillRect(m, m, width - m*2, height - m*2);

	nodes = [];
	start_pos = {"x": m - 10, "y": m + 20};
	nodes.push({"x": m + 10, "y": m + 20});
	goal_pos = {"x": width - m + 10, "y": height - m - 20};
	nodes.push({"x": width - m - 10, "y": height - m - 20});
	putnodes(ctx);

	ctx.fillStyle = 'red';
	ctx.fillRect(start_pos["x"] - 2, start_pos["y"] - 2, 4, 4);
	ctx.fillStyle = 'blue';
	ctx.fillRect(goal_pos["x"] - 2, goal_pos["y"] - 2, 4, 4);
}

function roundhouse() {
	var canvas = document.getElementById('board');
	if (canvas.getContext == null) return
	var ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, width, height);
	var m = 30;
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc(width/2, height/2, height/2 - m, 0, Math.PI*2);
	ctx.fill();

	nodes = [];
	start_pos = {"x": width/2 - height/2 + m - 10, "y": height/2};
	nodes.push({"x": width/2 - height/2 + m + 10, "y": height/2});
	goal_pos = {"x": width/2 + height/2 - m + 10, "y": height/2};
	nodes.push({"x": width/2 + height/2 - m - 10, "y": height/2});
	putnodes(ctx);

	ctx.fillStyle = 'red';
	ctx.fillRect(start_pos["x"] - 2, start_pos["y"] - 2, 4, 4);
	ctx.fillStyle = 'blue';
	ctx.fillRect(goal_pos["x"] - 2, goal_pos["y"] - 2, 4, 4);
}

function trihouse() {
	var canvas = document.getElementById('board');
	if (canvas.getContext == null) return
	var ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, width, height);
	var m = 30;
	ctx.fillStyle = 'black';
	ctx.beginPath();
        ctx.moveTo(m, height - m);
        ctx.lineTo(width/2, m);
        ctx.lineTo(width - m, height - m);
        ctx.fill();

	nodes = [];
	start_pos = {"x": m, "y": height - m - 20};
	nodes.push({"x": m + 20, "y": height - m - 20});
	goal_pos = {"x": width - m, "y": height - m - 20};
	nodes.push({"x": width - m - 20, "y": height - m - 20});
	putnodes(ctx);

	ctx.fillStyle = 'red';
	ctx.fillRect(start_pos["x"] - 2, start_pos["y"] - 2, 4, 4);
	ctx.fillStyle = 'blue';
	ctx.fillRect(goal_pos["x"] - 2, goal_pos["y"] - 2, 4, 4);
}

function putnodes(ctx) {
	var i = 0;
	while (i < 200) {
		i++;
		px = random_px();
		if (!is_in_house(ctx, px, 10) || is_near_by(ctx, px, 20)) {
			continue;
		}
		nodes.push(px);
	}

	ctx.fillStyle = 'pink';
	for (i = 0; i < nodes.length; i++) {
		ctx.fillRect(nodes[i]["x"] - 2, nodes[i]["y"] - 2, 4, 4);
	}

	document.getElementById("status").innerHTML = "OK";
	document.getElementById("message").innerHTML = "Nodes:" + nodes.length;
}

function random_px() {
	var px = {};
	px["x"] = Math.floor(Math.random() * Math.floor(width));
	px["y"] = Math.floor(Math.random() * Math.floor(height));
	return px;
}

function is_in_house(ctx, px, distance) {
	// just the point
	var p = ctx.getImageData(px["x"], px["y"], 1, 1);
	if (p.data[3] == 0) {
		return false;
	}
	// left margin
	if (px["x"] - distance < 0) {
		return false;
	} else {
		var p = ctx.getImageData(px["x"] - distance, px["y"], 1, 1);
		if (p.data[3] == 0) {
			return false;
		}
	}
	// right margin
	if (px["x"] + distance >= width) {
		return false;
	} else {
		var p = ctx.getImageData(px["x"] + distance, px["y"], 1, 1);
		if (p.data[3] == 0) {
			return false;
		}
	}
	// top margin
	if (px["y"] - distance < 0) {
		return false;
	} else {
		var p = ctx.getImageData(px["x"], px["y"] - distance, 1, 1);
		if (p.data[3] == 0) {
			return false;
		}
	}
	// bottom margin
	if (px["y"] + distance >= height) {
		return false;
	} else {
		var p = ctx.getImageData(px["x"], px["y"] + distance, 1, 1);
		if (p.data[3] == 0) {
			return false;
		}
	}
	return true;
}

function is_near_by(ctx, px, distance) {
	for (i = 0; i < nodes.length; i++) {
		dx = nodes[i]["x"] - px["x"];
		dy = nodes[i]["y"] - px["y"];
		if (dx*dx + dy*dy < distance*distance) {
			return true;
		}
	}
	return false;
}

function route() {
	var canvas = document.getElementById('board');
	if (canvas.getContext == null) return
	var ctx = canvas.getContext('2d');

	ctx.strokeStyle = 'white';
	ctx.lineWidth = 20;
	ctx.lineCap = 'round';

	ctx.beginPath();
	ctx.moveTo(start_pos["x"], start_pos["y"]);
	ctx.lineTo(nodes[0]["x"], nodes[0]["y"]);
	ctx.stroke();

	ctx.moveTo(nodes[1]["x"], nodes[1]["y"]);
	ctx.lineTo(goal_pos["x"], goal_pos["y"]);
	ctx.stroke();
}
