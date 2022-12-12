import Chart from "chart.js/auto";

let startX = 0;
let endX = 8;
let stepX = 1;

function generateDefaultLabels() {
  const labels = [];
  for (let i = 0; i <= endX; i += stepX) {
    labels.push(i.toFixed(1));
  }

  return labels;
}

function generateLabels() {
  const labels = [];
  for (let i = startX; i <= endX; i += stepX) {
    labels.push(i.toFixed(1));
  }
  chart.data.labels = labels;
  chart.update();
  return labels;
}

const labels = generateDefaultLabels();

const data = {
  labels: labels,
  datasets: [
    {
      label: "y=kx*b",
      type: "line",

      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [],
    },
    {
      label: "Шум",
      backgroundColor: "rgb(150, 58, 132)",
      borderColor: "rgb(150, 58, 132)",
      data: [],
      type: "scatter",
    },
    {
      label: "Лінійна регресія",
      type: "line",

      backgroundColor: "rgb(100, 77, 132)",
      borderColor: "rgb(100, 77, 132)",
      data: [],
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {},
};

const chart = new Chart(document.getElementById("chart"), config);
chart.canvas.parentNode.style.width = "800px";
chart.canvas.parentNode.style.height = "800px";

const kInput = document.getElementById("k");
kInput.value = 0;

const bInput = document.getElementById("b");
bInput.value = 0;

const startInput = document.getElementById("start");
startInput.value = startX;

const endInput = document.getElementById("end");
endInput.value = endX;

const stepInput = document.getElementById("step");
stepInput.value = stepX;

function renderPoints() {
  const k = getValue(kInput);
  const b = getValue(bInput);
  const points = [];

  let x = startX;
  let y = 0;

  while (x < endX + 1) {
    y = k * x + b;
    points.push({ x, y });
    x += stepX;
  }

  chart.data.datasets[0].data = points;
  chart.update();
}

function renderMush() {
  const a = chart.data.datasets[0].data;
  const points = [];

  for (let index = 0; index < endX - startX + 1; index += stepX) {
    const indexPoint = randomInteger(0, endX - startX);
    const x = a[indexPoint].x;
    const y = a[indexPoint].y;

    const mushX = x + Math.random() * (1 - -1) + -1;
    const mushY = y + Math.random() * (1 - -1) + -1;
    points.push({ x: mushX, y: mushY });
  }

  chart.data.datasets[1].data = points;
  chart.update();
  return points;
}

function renderLinearRegression() {
  let medX = 0;
  let medY = 0;

  let medPowX = 0;
  let medPowY = 0;

  let medXY = 0;

  let sPowX = 0;
  let sPowY = 0;

  let sX = 0;
  let sY = 0;

  let r = 0;

  const linePoints = chart.data.datasets[0].data;
  const mushPoints = chart.data.datasets[1].data;
  const mushPointsCount = mushPoints.length;

  let x;
  let y;

  for (let i = 0; i < mushPointsCount; i++) {
    x = mushPoints[i].x;
    y = mushPoints[i].y;

    medX += x;
    medY += y;

    medPowX += x ** 2;
    medPowY += y ** 2;

    medXY += x * y;
  }

  medX /= mushPointsCount;
  medY /= mushPointsCount;

  medPowX /= mushPointsCount;
  medPowY /= mushPointsCount;

  medXY /= mushPointsCount;

  sPowX = medPowX - medX ** 2;
  sPowY = medPowY - medY ** 2;

  sX = Math.sqrt(sPowX);
  sY = Math.sqrt(sPowY);

  let k = (medXY - medX * medY) / (medPowX - medX ** 2);
  let b = medY - k * medX;
  const points = [];

  let pointX = startX;
  let pointY = 0;

  while (pointX < endX + 1) {
    pointY = k * pointX + b;
    points.push({ x: pointX, y: pointY });
    pointX += stepX;
  }

  chart.data.datasets[2].data = points;
  chart.update();
  return points;
}

function render() {
  const k = getValue(kInput);
  const b = getValue(bInput);

  if (k && b) {
    renderPoints(endX);
    renderMush(endX);
    renderLinearRegression(endX);
  }
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getValue(input) {
  return Number(input.value);
}

function handleInputChange(e) {
  switch (e.target.getAttribute("id")) {
    case "start": {
      startX = +e.target.value;
      generateLabels();
      break;
    }
    case "end": {
      endX = +e.target.value;
      generateLabels();
      break;
    }
    case "step": {
      stepX = +e.target.value;
      generateLabels();
      break;
    }
  }

  render();
}

kInput.addEventListener("input", handleInputChange);
bInput.addEventListener("input", handleInputChange);

startInput.addEventListener("input", handleInputChange);
endInput.addEventListener("input", handleInputChange);
stepInput.addEventListener("input", handleInputChange);
