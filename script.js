// var gateway = "ws://192.168.1.184/ws";
// var websocket;

// window.addEventListener("load", initWebSocket);

// function initWebSocket() {
//   console.log("Trying to open a WebSocket connection...");
//   websocket = new WebSocket(gateway);
//   websocket.onopen = () => console.log("Connection opened");
//   websocket.onclose = () => {
//     console.log("Connection closed");
//     setTimeout(initWebSocket, 2000);
//   };
// }

// function changeState(state) {
//   websocket.send(state);
// }

let activeTouches = {};
let speed = 0;
let isForwardPressed = false; // Flag to track if forward is pressed
let isBackwardPressed = false; // Flag to track if forward is pressed
const level1 = document.querySelector(".speed-1");
const level2 = document.querySelector(".speed-2");
const level3 = document.querySelector(".speed-3");
const roadLine = document.querySelector(".road-line");
const lightOn = document.querySelector(".light-on");
const lightOff = document.querySelector(".light-off");
const carOff = document.querySelector(".car-off");
const carOn = document.querySelector(".car-on");
const body = document.querySelector("body");
const road = document.querySelector(".road");

const buttons = {
  left: document.querySelector(".left-dir"),
  right: document.querySelector(".right-dir"),
  reverse: document.querySelector(".reverse"),
  forward: document.querySelector(".drive"),
  lights: document.querySelector(".lights"),
  speedUp: document.querySelector(".speed-up"),
  speedDown: document.querySelector(".speed-down"),
};

const states = {
  left: "left",
  right: "right",
  reverse: "reverse",
  forward: "forward",
  straight: "straight",
  off: "stop",
  lights: "on",
};

// Function to update animation speed dynamically
function updateRoadSpeed(speed) {
  const speedMap = {
    1: "3s",
    2: "1.5s",
    3: "0.5s",
  };
  if (isForwardPressed && speed > 0) {
    roadLine.style.animation = `highway ${speedMap[speed]} linear infinite`;
  }
}

function updateReverseRoadSpeed(speed) {
  const speedMap = {
    1: "3s",
    2: "1.5s",
    3: "0.5s",
  };
  if (isBackwardPressed) {
    roadLine.style.animation = `reverse-highway ${speedMap[speed]} linear infinite`;
  }
}

function speedBar() {
  if (speed === 1) {
    level1.style.backgroundColor = "#C64902";
    level2.style.backgroundColor = "#Cdcdcd";
    level3.style.backgroundColor = "#CDCDCD";
  } else if (speed === 2) {
    level1.style.backgroundColor = "#C64902";
    level2.style.backgroundColor = "#C64902";
    level3.style.backgroundColor = "#CDCDCD";
  } else if (speed === 3) {
    level1.style.backgroundColor = "#C64902";
    level2.style.backgroundColor = "#C64902";
    level3.style.backgroundColor = "#C64902";
  } else {
    level1.style.backgroundColor = "#Cdcdcd";
    level2.style.backgroundColor = "#CDCDCD";
    level3.style.backgroundColor = "#CDCDCD";
  }
}

function handleTouchStart(event, button) {
  const touchId = event.changedTouches[0].identifier;
  const container = event.target.closest("button");
  if (container) {
    container.style.transform = "scale(1.5)";
  }
  activeTouches[touchId] = setTimeout(
    () => console.log(`${button} button is being held`),
    500
  );

//   console.log(button);
  if (button === "left" && (isForwardPressed || isBackwardPressed)) {
    carOff.classList.add("move-left");
    carOn.classList.add("move-left");
  } else if (button === "right" && (isForwardPressed || isBackwardPressed)) {
    carOn.classList.add("move-right");
    carOff.classList.add("move-right");
  }

  //  event.target.style.pointerEvents = "none";
  // Handle the "forward" button press
  if (button === "forward") {
    isForwardPressed = true;
    speed++;
    speedBar();
    updateRoadSpeed(speed); // Start road animation if forward is pressed
  }

  // Handle the "reverse" button press
  if (button === "reverse") {
    isBackwardPressed = true;
    speed++;
    speedBar();
    updateReverseRoadSpeed(speed); // Start reverse animation
  }

  // Handle speed changes
  if (button === "speedUp" && speed < 3) {
    speed++;
    speedBar();
    // console.log(`Speeding up: speed${speed}`);
    if (isForwardPressed) {
      updateRoadSpeed(speed); // Update road speed only if forward is pressed
    }
    if (isBackwardPressed) {
      updateReverseRoadSpeed(speed); // Update road speed only if forward is pressed
    }
  } else if (button === "speedDown" && speed > 1) {
    speed--;
    speedBar();
    console.log(`Slowing down: speed${speed}`);
    if (isForwardPressed) {
      updateRoadSpeed(speed); // Update road speed only if forward is pressed
    }
    if (isBackwardPressed) {
      updateReverseRoadSpeed(speed); // Update road speed only if forward is pressed
    }
  }

  if (button !== "speedUp" && button !== "speedDown") {
    console.log(`Action: ${states[button]}`);
  }

  // Handle lights toggle
  if (button === "lights") {
    carOff.classList.toggle("hidden");
    carOn.classList.toggle("hidden");
    lightOn.classList.toggle("hidden");
    lightOff.classList.toggle("hidden");
    body.classList.toggle("theme");
    road.classList.toggle("road-color");
  }
}

function handleTouchEnd(event, button) {
  const touchId = event.changedTouches[0].identifier;
  if (activeTouches[touchId]) {
    clearTimeout(activeTouches[touchId]);
    delete activeTouches[touchId];
  }
  const container = event.target.closest("button");
  if (container) {
    container.style.transform = "scale(1)";
    // console.log(container);
  }
  if (button === "left") {
    carOff.classList.remove("move-left");
    carOn.classList.remove("move-left");
  }
  if (button === "right") {
    carOff.classList.remove("move-right");
    carOn.classList.remove("move-right");
  }
  // Stop the road animation if forward or reverse is released
  if (button === "forward") {
    speed = 0;
    speedBar();
    isForwardPressed = false; // Reset the forward flag
    roadLine.style.animation = ""; // Stop the road animation
  } else if (button === "reverse") {
    speed = 0;
    speedBar();
    isBackwardPressed = false; // Reset the forward flag
    roadLine.style.animation = ""; // Stop the reverse animation
  }
}

Object.keys(buttons).forEach((button) => {
  buttons[button].addEventListener("touchstart", (event) =>
    handleTouchStart(event, button)
  );
  buttons[button].addEventListener("touchend", (event) =>
    handleTouchEnd(event, button)
  );
});
