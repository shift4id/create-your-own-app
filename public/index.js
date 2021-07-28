let art = [], hue = 0, socket, theme, userCount = 0;

const dark = { name: "dark", bg: "black", fg: "white", sat: 100, bright: 100 }; 
const light = { name: "light", bg: "white", fg: "black", sat: 100, bright: 70 }; 

function setup() {
  theme = dark;
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  colorMode(HSB, 360, 100, 100);

  socket = io.connect("http://localhost:3000");

  socket.on("art", data => art = data);
  socket.on("data", data => art.push(data));
  socket.on("userCount", data => userCount = data);
}

function draw() {
  background(theme.bg);

  noFill();
  strokeWeight(3);

  art.forEach(data => {
    stroke(data.hue, theme.sat, theme.bright);
    line(data.x1, data.y1, data.x2, data.y2);
  });

  noStroke();
  fill(theme.bg);
  rect(0, 0, width, 100);
  fill(theme.fg);
  textAlign(LEFT);
  text(`${userCount} Users`, 20, 20);
  text("Use the up and down arrow keys to change hue", 20, 35);
  text("Press backspace to clear the canvas", 20, 50);
  text("Press t to change theme", 20, 65);
  textAlign(RIGHT);
  fill(hue, theme.sat, theme.bright);
  text(`Hue: ${hue}`, width - 20, 20);
}

function mouseDragged() {
  noFill();
  stroke(255);
  strokeWeight(3);
  line(pmouseX, pmouseY, mouseX, mouseY);
  sendData(pmouseX, pmouseY, mouseX, mouseY);
}

function keyPressed() {
  if (keyCode === BACKSPACE) socket.emit("clear");
  if (keyCode === UP_ARROW) hue = (hue + 10) % 360;
  if (keyCode === DOWN_ARROW) hue = (hue - 10) % 360;
  if (keyCode === 84) theme = theme.name === "light" ? dark : light;
}

function sendData(x1, y1, x2, y2) {
  const data = { hue, x1, y1, x2, y2 };
  socket.emit("art", data);
}