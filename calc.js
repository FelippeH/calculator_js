const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".buttons button");

let currentNumber = "";
let firstOperand = null;
let operator = null;
let restart = false;

function updateResult(originClear = false) {
    result.innerText = originClear ? "0" : currentNumber.replace(".", ",");
}

function addDigit(digit) {
    if (digit === "." && (currentNumber.includes(".") || !currentNumber))
        return;

    if (restart) {
        currentNumber = digit;
        restart = false;
    } else {
        currentNumber += digit;
    }

    updateResult();
}

function setOperator(newOperator) {
    if (currentNumber) {
        firstOperand = parseFloat(currentNumber);
        currentNumber = "";
    }
    operator = newOperator;
}

function calculate() {
    if (operator === null || firstOperand === null) return;

    let secondOperand = parseFloat(currentNumber);
    let resultValue;

    switch (operator) {
        case "+":
            resultValue = firstOperand + secondOperand;
            break;
        case "-":
            resultValue = firstOperand - secondOperand;
            break;
        case "x":
            resultValue = firstOperand * secondOperand;
            break;
        case "÷":
            resultValue = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    currentNumber = resultValue.toFixed(6).replace(/\.?0+$/, ""); // Remove zeros desnecessários
    operator = null;
    firstOperand = null;
    restart = true;
    updateResult();
}

function clearCalculator() {
    currentNumber = "";
    firstOperand = null;
    operator = null;
    updateResult(true);
}

function setPercentage() {
    if (!currentNumber) return;
    
    let result = parseFloat(currentNumber) / 100;
    if (["+", "-"].includes(operator) && firstOperand !== null) {
        result *= firstOperand;
    }

    currentNumber = result.toFixed(6).replace(/\.?0+$/, "");
    updateResult();
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const buttonText = button.innerText;
        if (/^[0-9.]+$/.test(buttonText)) {
            addDigit(buttonText);
        } else if (["+", "-", "x", "÷"].includes(buttonText)) {
            setOperator(buttonText);
        } else if (buttonText === "=") {
            calculate();
        } else if (buttonText === "C") {
            clearCalculator();
        } else if (buttonText === "±") {
            if (currentNumber) {
                currentNumber = (parseFloat(currentNumber) * -1).toString();
            } else if (firstOperand !== null) {
                firstOperand *= -1;
                currentNumber = firstOperand.toString();
            }
            updateResult();
        } else if (buttonText === "%") {
            setPercentage();
        }
    });
});

    document.addEventListener("keydown", (event) => {
        const key = event.key;
    
        if (/^[0-9.]$/.test(key)) {
            addDigit(key);
        } else if (["+", "-", "*", "/"].includes(key)) {
            setOperator(key === "*" ? "x" : key === "/" ? "÷" : key);
        } else if (key === "Enter" || key === "=") {
            event.preventDefault();
            calculate();
        } else if (key === "Backspace") {
            currentNumber = currentNumber.slice(0, -1);
            updateResult();
        } else if (key === "Escape") {
            clearCalculator();
        } else if (key === "%") {
            setPercentage();
        }
});
