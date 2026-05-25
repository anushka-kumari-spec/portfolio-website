const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandText = document.querySelector('[data-previous-operand]');
const currentOperandText = document.querySelector('[data-current-operand]');

let currentOperand = "";
let previousOperand = "";
let operation = undefined;

function updateDisplay() {
    currentOperandText.textContent = currentOperand || "0";
    previousOperandText.textContent = previousOperand ? `${previousOperand} ${operation || ""}` : "";
}

function appendNumber(number) {
    if (number === "." && currentOperand.includes(".")) return;
    currentOperand = `${currentOperand}${number}`;
}

function chooseOperation(selectedOperation) {
    if (currentOperand === "" && previousOperand === "") return;
    if (currentOperand === "" && previousOperand !== "") {
        operation = selectedOperation;
        updateDisplay();
        return;
    }

    if (previousOperand !== "") {
        compute();
    }

    operation = selectedOperation;
    previousOperand = currentOperand;
    currentOperand = "";
}

function compute() {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    let result = "";
    switch (operation) {
        case "+":
            result = prev + current;
            break;
        case "-":
            result = prev - current;
            break;
        case "×":
            result = prev * current;
            break;
        case "÷":
            result = current === 0 ? "Error" : prev / current;
            break;
        default:
            return;
    }

    currentOperand = typeof result === "number" && !Number.isInteger(result) ? result.toFixed(8).replace(/\.0+$|(?<=\d)0+$/, "") : String(result);
    operation = undefined;
    previousOperand = "";
}

function clearCalculator() {
    currentOperand = "";
    previousOperand = "";
    operation = undefined;
}

function deleteLast() {
    currentOperand = currentOperand.toString().slice(0, -1);
}

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
        updateDisplay();
    });
});

operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        chooseOperation(button.dataset.operation);
        updateDisplay();
    });
});

equalsButton.addEventListener("click", () => {
    compute();
    updateDisplay();
});

allClearButton.addEventListener("click", () => {
    clearCalculator();
    updateDisplay();
});

deleteButton.addEventListener("click", () => {
    deleteLast();
    updateDisplay();
});

window.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea")) return;

    if (/[0-9]/.test(event.key)) {
        appendNumber(event.key);
        updateDisplay();
    }

    if (event.key === ".") {
        appendNumber(".");
        updateDisplay();
    }

    if (["+", "-", "*", "/"].includes(event.key)) {
        const keyOperation = event.key === "*" ? "×" : event.key === "/" ? "÷" : event.key;
        chooseOperation(keyOperation);
        updateDisplay();
    }

    if (event.key === "=" || event.key === "Enter") {
        compute();
        updateDisplay();
    }

    if (event.key === "Backspace") {
        deleteLast();
        updateDisplay();
    }

    if (event.key === "Delete") {
        clearCalculator();
        updateDisplay();
    }
});
