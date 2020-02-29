var width = 500;
var height = 400;
var nodes = [];
var toggle_house = 0;
var start_pos = {};
var goal_pos = {};

function start() {
	recthouse();
}

function house(toggle=true) {
	if (toggle) toggle_house++;
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
	start_pos = {"x": m - 20, "y": m + 20};
	nodes.push({"x": m + 20, "y": m + 20});
	goal_pos = {"x": width - m + 20, "y": height - m - 20};
	nodes.push({"x": width - m - 20, "y": height - m - 20});
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
	start_pos = {"x": width/2 - height/2 + m - 20, "y": height/2};
	nodes.push({"x": width/2 - height/2 + m + 20, "y": height/2});
	goal_pos = {"x": width/2 + height/2 - m + 20, "y": height/2};
	nodes.push({"x": width/2 + height/2 - m - 20, "y": height/2});
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
	start_pos = {"x": width/2 - 40, "y": m + 40};
	nodes.push({"x": width/2, "y": m + 40});
	goal_pos = {"x": width - m, "y": height - m - 20};
	nodes.push({"x": width - m - 40, "y": height - m - 20});
	putnodes(ctx);

	ctx.fillStyle = 'red';
	ctx.fillRect(start_pos["x"] - 2, start_pos["y"] - 2, 4, 4);
	ctx.fillStyle = 'blue';
	ctx.fillRect(goal_pos["x"] - 2, goal_pos["y"] - 2, 4, 4);
}

function putnodes(ctx) {
	var i = 0;
	while (i < 500) {
		i++;
		px = random_px();
		if (!is_in_house(ctx, px, 10) || is_near_by(ctx, px, 25)) {
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
	// get rect around the pixel
	var p = ctx.getImageData(px["x"] - distance, px["y"] - distance, 2*distance, 2*distance);
	// Check all alpha
	var i = 3;
	var x = -distance;
	var y = -distance;
	var dd = distance*distance;
	while (i < p.data.length) {
		if (x*x + y*y <= dd && p.data[i] == 0) {
			return false;
		}
		i += 4;
		x++;
		if (x == distance) {
			y++;
			x = -distance;
		}
	}
	return true;
}

function is_near_by(ctx, px, distance, update=false) {
	for (i = 0; i < nodes.length; i++) {
		if (nodes[i]) {
			dx = nodes[i]["x"] - px["x"];
			dy = nodes[i]["y"] - px["y"];
			if (dx*dx + dy*dy < distance*distance) {
				if (update && i >= 2) {
					delete nodes[i];
				}
				return true;
			}
		}
	}
	return false;
}

var direction = {"x":1, "y":1};
var curr = {"x":0, "y":0};
var lookfwd = 2.1;
var digstep = 10;
var digarea = 12;
var spiral = 0;
var xings = [];
var dig_cnt = 0;
var ongoal = false;

function set_direction(from, to, d) {
	dx = to["x"] - from["x"];
	dy = to["y"] - from["y"];
	var length = Math.sqrt(dx*dx + dy*dy);
	direction = {"x":d*dx/length, "y":d*dy/length};
}

function dig(ctx) {
	var next = {"x":curr["x"] + direction["x"], "y":curr["y"] + direction["y"]};
	var nextnext = {"x":curr["x"] + lookfwd*direction["x"], "y":curr["y"] + lookfwd*direction["y"]};
	if (is_in_house(ctx, nextnext, digstep)) {
		ctx.beginPath();
		ctx.moveTo(curr["x"], curr["y"]);
		ctx.lineTo(next["x"], next["y"]);
		ctx.stroke();
		curr = {"x":next["x"], "y":next["y"]};
		return true;
	}
	return false;
}

function rotate(ctx) {
	var rad = 0;
	while (rad < Math.PI*2) {
		rad += Math.PI/120;
		var r = rad;
		if (spiral < 0 || (spiral == 0 && Math.floor(Math.random() * Math.floor(2)) == 0)) {
			r = -rad;
		}
		var rot_direction = {
			"x":Math.cos(r)*direction["x"] - Math.sin(r)*direction["y"],
			"y":Math.sin(r)*direction["x"] + Math.cos(r)*direction["y"],
		};
		var nextnext = {"x":curr["x"] + lookfwd*rot_direction["x"], "y":curr["y"] + lookfwd*rot_direction["y"]};
		if (is_in_house(ctx, nextnext, digarea)) {
			direction = {"x":rot_direction["x"], "y":rot_direction["y"]};
			return true;
		}
	}
	return false;
}

function turns(ctx) {
	var sel = [];
	var sub = [];
	// straight
	var next = {"x":curr["x"] + lookfwd*direction["x"], "y":curr["y"] + lookfwd*direction["y"]};
	if (is_in_house(ctx, next, digarea)) {
		sel.push(direction);
	}
	// turnleft
	var turnleft = {
		"x":Math.cos(Math.PI/2)*direction["x"] - Math.sin(Math.PI/2)*direction["y"],
		"y":Math.sin(Math.PI/2)*direction["x"] + Math.cos(Math.PI/2)*direction["y"],
	}
	next = {"x":curr["x"] + lookfwd*turnleft["x"], "y":curr["y"] + lookfwd*turnleft["y"]};
	if (is_in_house(ctx, next, digarea)) {
		if (spiral >=0)	sel.push(turnleft);
		else sub.push(turnleft);
	}
	// turnright
	var turnright = {
		"x":Math.cos(-Math.PI/2)*direction["x"] - Math.sin(-Math.PI/2)*direction["y"],
		"y":Math.sin(-Math.PI/2)*direction["x"] + Math.cos(-Math.PI/2)*direction["y"],
	}
	next = {"x":curr["x"] + lookfwd*turnright["x"], "y":curr["y"] + lookfwd*turnright["y"]};
	if (is_in_house(ctx, next, digarea)) {
		if (spiral <=0) sel.push(turnright);
		else sub.push(turnright);
	}
	// select
	var selected = {};
	if (sel.length == 0) {
		if (sub.length == 0) return false;
		selected = sub[Math.floor(Math.random() * Math.floor(sub.length))]
	} else {
		selected = sel[Math.floor(Math.random() * Math.floor(sel.length))]
	}
	if (selected["x"] == turnleft["x"] && selected["y"] == turnleft["y"]) spiral--;
	if (selected["x"] == turnright["x"] && selected["y"] == turnright["y"]) spiral++;
	direction = {"x":selected["x"], "y":selected["y"]};
	return true;
}

function is_goal(ctx) {
	dx = nodes[1]["x"] - curr["x"];
	dy = nodes[1]["y"] - curr["y"];
	if (dx*dx + dy*dy < 400) {
		ctx.beginPath();
		ctx.moveTo(curr["x"], curr["y"]);
		ctx.lineTo(nodes[1]["x"], nodes[1]["y"]);
		ctx.stroke();
		ongoal = true;
		return false;
	}
	return true;
}

function route() {
	var done = false;
	var try_cnt = 0;
	while(!done) {
		try_cnt++;
		if (try_cnt > 100) break;
		done = try_route();
		if (!done) house(false);
	}
	if (done) {
		document.getElementById("status").innerHTML = "OK";
		document.getElementById("message").innerHTML = "Digs:" + dig_cnt + " / Xings:" + xings.length + " / try:" + try_cnt;
	} else {
		document.getElementById("status").innerHTML = "NG";
		document.getElementById("message").innerHTML = "Undone / try:" + try_cnt;
	}
}

function try_route() {
	var canvas = document.getElementById('board');
	if (canvas.getContext == null) return
	var ctx = canvas.getContext('2d');

	ctx.globalCompositeOperation = 'destination-out';
	ctx.lineWidth = 14;
	ctx.lineCap = 'round';

	ctx.beginPath();
	ctx.moveTo(start_pos["x"], start_pos["y"]);
	ctx.lineTo(nodes[0]["x"], nodes[0]["y"]);
	ctx.stroke();
	curr = {"x":nodes[0]["x"], "y":nodes[0]["y"]};
	set_direction(start_pos, nodes[0], digstep);

	var digable = true;
	dig_cnt = 0;
	ongoal = false;
	var spiral = 0;
	xings = [];
	while (digable) {
		digable = dig(ctx);
		if (digable) dig_cnt++;
		else if (rotate(ctx)) {
			digable = dig(ctx);
		}
		if (digable) digable = is_goal(ctx);
		if (is_near_by(ctx, curr, 10, true)) {
			if (turns(ctx)) {
				xings.push(curr);
			}
		}
	}

	ctx.moveTo(nodes[1]["x"], nodes[1]["y"]);
	ctx.lineTo(goal_pos["x"], goal_pos["y"]);
	ctx.stroke();

	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = 'orange';
	for (i = 0; i < xings.length; i++) {
		ctx.fillRect(xings[i]["x"] - 2, xings[i]["y"] - 2, 4, 4);
	}

	return (ongoal && xings.length > nodes.length/4);
}
