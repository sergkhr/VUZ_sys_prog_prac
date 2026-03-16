function handleCalculate() {
    const inputValue = document.getElementById("inputValue").value;
    try {
        const result = calculate(inputValue);
        document.getElementById("result").textContent = "Результат: " + result;
    } catch (error) {
        document.getElementById("result").textContent = "Ошибка: " + error;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document
        .getElementById("calculateBtn")
        .addEventListener("click", handleCalculate);
});







const OPERATORS = {
    "+":  { precedence: 1, associativity: "Left",  arity: 2 },
    "-":  { precedence: 1, associativity: "Left",  arity: 2 },
    "*":  { precedence: 2, associativity: "Left",  arity: 2 },
    "/":  { precedence: 2, associativity: "Left",  arity: 2 },

    "u-": { precedence: 3, associativity: "Right", arity: 1 } // унарный минус
};

function isOperator(token) {
    return Object.prototype.hasOwnProperty.call(OPERATORS, token);
}

function isDigit(ch) {
    return /\d/.test(ch);
}

/* ===== Parser: Infix → Postfix (RPN) ===== */

function parseInput(input) {
    input = input.replace(/\s+/g, "");

    const outputQueue = [];
    const operatorStack = [];

    let i = 0;

    while (i < input.length) {
        const ch = input[i];

        // Number (multi-digit + decimal)
        if (isDigit(ch) || ch === ".") {
            let number = ch;
            i++;

            while (
                i < input.length &&
                (isDigit(input[i]) || input[i] === ".")
            ) {
                number += input[i];
                i++;
            }

            outputQueue.push(number);
            continue;
        }

        if (ch === "-") {
            const prev = input[i - 1];

            if (
                i === 0 ||
                prev === "(" ||
                isOperator(prev)
            ) {
                operatorStack.push("u-");
                i++;
                continue;
            }
        }

        // Operator
        if (isOperator(ch)) {
            while (
                operatorStack.length > 0 &&
                isOperator(operatorStack[operatorStack.length - 1])
            ) {
                const topOp = operatorStack[operatorStack.length - 1];

                if (
                    (OPERATORS[ch].associativity === "Left" &&
                        OPERATORS[ch].precedence <= OPERATORS[topOp].precedence) ||
                    (OPERATORS[ch].associativity === "Right" &&
                        OPERATORS[ch].precedence < OPERATORS[topOp].precedence)
                ) {
                    outputQueue.push(operatorStack.pop());
                } else {
                    break;
                }
            }

            operatorStack.push(ch);
            i++;
            continue;
        }

        // Left parenthesis
        if (ch === "(") {
            operatorStack.push(ch);
            i++;
            continue;
        }

        // Right parenthesis
        if (ch === ")") {
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== "("
            ) {
                outputQueue.push(operatorStack.pop());
            }

            if (operatorStack.length === 0) {
                throw new Error("Mismatched parentheses");
            }

            operatorStack.pop(); // remove "("
            i++;
            continue;
        }

        throw new Error("Invalid character: " + ch);
    }

    while (operatorStack.length > 0) {
        const op = operatorStack.pop();
        if (op === "(" || op === ")") {
            throw new Error("Mismatched parentheses");
        }
        outputQueue.push(op);
    }

    return outputQueue;
}

/* ===== Postfix evaluator ===== */

function calculate(input) {
    const postfix = parseInput(input);
    const stack = [];

    for (let i = 0; i < postfix.length; i++) {
        const token = postfix[i];

        // Число
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
            continue;
        }

        // Оператор
        if (isOperator(token)) {
            const operator = OPERATORS[token];
            let result;

            // Бинарный оператор
            if (operator.arity === 2) {
                const b = stack.pop();
                const a = stack.pop();

                if (a === undefined || b === undefined) {
                    throw new Error("Invalid expression");
                }

                switch (token) {
                    case "+":
                        result = a + b;
                        break;
                    case "-":
                        result = a - b;
                        break;
                    case "*":
                        result = a * b;
                        break;
                    case "/":
                        if (b === 0) {
                            throw new Error("Division by zero");
                        }
                        result = a / b;
                        break;
                    default:
                        throw new Error("Unknown operator: " + token);
                }
            }

            // Унарный оператор
            else if (operator.arity === 1) {
                const a = stack.pop();

                if (a === undefined) {
                    throw new Error("Invalid expression");
                }

                switch (token) {
                    case "u-":
                        result = -a;
                        break;
                    default:
                        throw new Error("Unknown unary operator: " + token);
                }
            }

            stack.push(result);
            continue;
        }

        throw new Error("Unknown token: " + token);
    }

    if (stack.length !== 1) {
        throw new Error("Invalid expression");
    }

    return stack[0];
}