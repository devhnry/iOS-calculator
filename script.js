const btnLight = document.querySelector(".btn-sun");
const btnDark = document.querySelector(".btn-moon");
const output1 = document.getElementById("result1");
const output2 = document.getElementById("result2");
const container = document.querySelector(".container");
const body = document.querySelector("body");
const display = document.getElementById("inputDisplay");
const numberButtons = document.querySelectorAll(".number");
const btnClear = document.querySelector(".clear");
const operatorButtons = document.querySelectorAll(".operator");
const label = document.querySelector(".label");
const btnCalculate = document.querySelector(".calculate");
const historyLabels = document.querySelectorAll(".history");
const percentBtn = document.querySelector(".percent");
const inverseBtn = document.querySelector(".inverse");

let calculationPerformed = false;
let input = "";
let negative = false;

function applyColorScheme(darkMode) {
  const bgColor = darkMode ? "hsl(0, 0%, 11%)" : "hsl(225, 40%, 98%)";
  const textColor = darkMode ? "hsl(60, 2%, 83%)" : "hsl(0, 0%, 11%)";

  if (darkMode) {
    btnDark.classList.add("hidden");
    btnLight.classList.remove("hidden");
  } else {
    btnDark.classList.remove("hidden");
    btnLight.classList.add("hidden");
  }

  body.style.backgroundColor = darkMode
    ? "hsl(202, 12%, 13%)"
    : "hsl(71, 7%, 69%)";
  container.style.backgroundColor = bgColor;
  container.style.boxShadow = `0 8px 32px 0 hsla(0, 0%, ${
    darkMode ? 18 : 51
  }%, 0.67)`;
  display.style.color = textColor;
  output1.style.color = textColor;
  output2.style.color = textColor;
}

function updateLabel(value) {
  label.textContent += ` ${value}`;
}

function clearInput() {
  input = "";
  display.value = input;
}

for (const numButton of numberButtons) {
  numButton.addEventListener("click", (e) => {
    if (calculationPerformed) {
      updateAndClear();
    }

    if (input.includes(".") && numButton.textContent === ".") {
      e.preventDefault();
    } else if (input === "0" && numButton.textContent !== ".") {
      input = numButton.textContent;
    } else {
      input += numButton.textContent;
    }
    display.value = input;
    btnClear.textContent = "C";
  });
}

inverseBtn.addEventListener("click", () => {
  if (display.value !== "" && display.value !== "0") {
    if (!negative) {
      input = "-" + display.value;
      display.value = input;
      negative = true;
    } else {
      input = display.value.slice(1);
      display.value = input;
      negative = false;
    }
  }
});

percentBtn.addEventListener("click", () => {
  if (display.value !== "" && display.value !== "0") {
    const currentValue = parseFloat(display.value);
    const percentValue = currentValue / 100;
    input = percentValue;
    display.value = input;
  }
});

document.addEventListener("keydown", function (e) {
  if (/^[0-9]/.test(e.key) || e.key === ".") {
    if (input.includes(".") && e.key === ".") {
      e.preventDefault();
    } else if (input === "0" && e.key !== ".") {
      input = e.key;
    } else {
      input += e.key;
    }
    display.value = input;
    btnClear.textContent = "C";
  }
});

for (const opBtn of operatorButtons) {
  opBtn.addEventListener("click", () => {
    if (input !== "") {
      updateLabel(`${input} ${opBtn.textContent}`);
      clearInput();
    }
  });
}

document.addEventListener("keydown", function (e) {
  if (["*", "/", "+", "-"].includes(e.key)) {
    const op = e.key.replace("*", "x").replace("/", "÷");
    if (input !== "") {
      updateLabel(`${input} ${op}`);
      clearInput();
    }
  }
});

function performCalculation() {
  updateLabel(input);
  const string = label.textContent
    .replace(/\t/g, " ")
    .replace(/x/g, "*")
    .replace(/÷/g, "/");
  const result = eval(string);
  const roundedResult = result.toFixed(2);
  const decimalPortion = parseFloat(roundedResult) - Math.floor(result);
  display.value = decimalPortion > 0 ? roundedResult : Math.floor(result);
  input = "";
  return true;
}

btnCalculate.addEventListener("click", () => {
  performCalculation();
  calculationPerformed = true;
});
document.addEventListener("keydown", function (e) {
  if (e.key.toLowerCase() === "enter" || e.key === "=") {
    e.preventDefault();
    performCalculation();
    calculationPerformed = true;
  }
});

function updateAndClear() {
  const opeators = ["x", "/", "+", "-"];
  btnClear.textContent = "AC";
  function hasOperator(string) {
    for (const op of opeators) {
      if (string.includes(op)) {
        return true;
      }
    }
    return false;
  }
  if (
    label.textContent.trim() !== "" &&
    display.value !== "" &&
    hasOperator(label.textContent) &&
    calculationPerformed
  ) {
    history.push([
      label.textContent
        .replace(/\*/g, "x")
        .replace(/\//g, "÷")
        .replace(/\t/g, " ")
        .trim(),
      display.value,
    ]);
  }

  if (history.length > 2) {
    history.shift();
  }

  if (history.length === 1) {
    historyLabels[0].textContent = history[0][0];
    output1.textContent = history[0][1];
  } else if (history.length === 2) {
    historyLabels[0].textContent = history[0][0];
    output1.textContent = history[0][1];
    historyLabels[1].textContent = history[1][0];
    output2.textContent = history[1][1];
  }

  clearInput();
  label.textContent = "";
  calculationPerformed = false;
}

const history = [];
btnClear.addEventListener("click", function (e) {
  e.stopPropagation();
  updateAndClear();
});

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "c") {
    updateAndClear();
  }
});

const prefersDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;
applyColorScheme(prefersDarkMode);
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addListener((e) => applyColorScheme(e.matches));

btnDark.addEventListener("click", () => applyColorScheme(true));
btnLight.addEventListener("click", () => applyColorScheme(false));
