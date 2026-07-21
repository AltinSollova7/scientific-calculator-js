const display = document.querySelector(".display");
const buttonsContainer = document.querySelector(".buttons");
const normalButtonsHTML = buttonsContainer.innerHTML;

let expression = "";
let currentMode = "basic";
let matrixTarget = null;
let matrixA = null;
let matrixB = null;

function connectCalculatorButtons() {
    const buttons = document.querySelectorAll(".buttons button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.textContent.trim();

            if (value === "AC") {
                expression = "";
                display.value = "0";
                return;
            }

            if (value === "DEL") {
                expression = expression.slice(0, -1);
                display.value = expression || "0";
                return;
            }

            if (value === "=") {
                try {
                    let result = expression
                        .replaceAll("×", "*")
                        .replaceAll("÷", "/");

                    display.value = eval(result);
                    expression = display.value;
                } catch {
                    display.value = "Error";
                    expression = "";
                }
                return;
            }

            if (value === "√") {
                display.value = Math.sqrt(Number(expression));
                expression = display.value;
                return;
            }

            if (value === "x²") {
                display.value = Math.pow(Number(expression), 2);
                expression = display.value;
                return;
            }

            if (value === "sin") {
                display.value = Math.sin(Number(expression) * Math.PI / 180);
                expression = display.value;
                return;
            }

            if (value === "cos") {
                display.value = Math.cos(Number(expression) * Math.PI / 180);
                expression = display.value;
                return;
            }

            if (value === "tan") {
                display.value = Math.tan(Number(expression) * Math.PI / 180);
                expression = display.value;
                return;
            }

            expression += value;
            display.value = expression;
        });
    });
}

function toggleMenu() {
    document.getElementById("modeMenu").classList.toggle("show");
}

function setMode(mode) {
    currentMode = mode;
    document.getElementById("modeMenu").classList.remove("show");

    if (mode === "matrix") {
        openMatrixMode();
        return;
    }

    backToCalculator();
    display.value = mode.toUpperCase() + " mode";
}

function openMatrixMode() {
    expression = "";
    matrixTarget = null;
    currentMode = "matrix";
    display.disabled = false;
    display.readOnly = true;
    display.placeholder = "Matrix: 1,2,3,4";
    display.value = "Matrix mode";

    buttonsContainer.innerHTML = `
        <button class="matrix-btn" onclick="startMatrixInput('A')">Mat A</button>
        <button class="matrix-btn" onclick="startMatrixInput('B')">Mat B</button>
        <button class="matrix-btn" onclick="matrixAdd()">A + B</button>
        <button class="matrix-btn" onclick="matrixSubtract()">A - B</button>

        <button class="matrix-btn" onclick="matrixMultiply()">A × B</button>
        <button class="matrix-btn" onclick="matrixDeterminant('A')">det A</button>
        <button class="matrix-btn" onclick="matrixDeterminant('B')">det B</button>
        <button class="matrix-btn" onclick="matrixClear()">AC</button>

        <button onclick="matrixType('7')">7</button>
        <button onclick="matrixType('8')">8</button>
        <button onclick="matrixType('9')">9</button>
        <button onclick="matrixType(',')">,</button>

        <button onclick="matrixType('4')">4</button>
        <button onclick="matrixType('5')">5</button>
        <button onclick="matrixType('6')">6</button>
        <button onclick="matrixDelete()">DEL</button>

        <button onclick="matrixType('1')">1</button>
        <button onclick="matrixType('2')">2</button>
        <button onclick="matrixType('3')">3</button>
        <button class="matrix-btn" onclick="saveMatrix()">Save</button>

        <button onclick="matrixType('0')">0</button>
        <button onclick="matrixType('-')">-</button>
        <button onclick="matrixType('.')">.</button>
        <button class="matrix-btn" onclick="backToCalculator()">Back</button>
    `;
}

function startMatrixInput(name) {
    matrixTarget = name;
    display.value = "";
    display.placeholder = `Matrix ${name}: 1,2,3,4`;
}

function matrixType(value) {
    if (!matrixTarget) {
        display.value = "Choose Mat A/B";
        return;
    }

    if (display.value === "Choose Mat A/B") {
        display.value = "";
    }

    display.value += value;
}

function matrixDelete() {
    if (!matrixTarget) return;
    display.value = display.value.slice(0, -1);
}

function saveMatrix() {
    if (!matrixTarget) {
        display.value = "Choose Mat A/B";
        return;
    }

    const numbers = display.value.split(",").map(Number);

    if (numbers.length !== 4 || numbers.some(isNaN)) {
        display.value = "Use: 1,2,3,4";
        return;
    }

    const matrix = [
        [numbers[0], numbers[1]],
        [numbers[2], numbers[3]]
    ];

    if (matrixTarget === "A") {
        matrixA = matrix;
        display.value = "Matrix A saved";
    } else {
        matrixB = matrix;
        display.value = "Matrix B saved";
    }

    matrixTarget = null;
}

function matrixAdd() {
    if (!hasBothMatrices()) return;

    const result = [
        [matrixA[0][0] + matrixB[0][0], matrixA[0][1] + matrixB[0][1]],
        [matrixA[1][0] + matrixB[1][0], matrixA[1][1] + matrixB[1][1]]
    ];

    display.value = formatMatrix(result);
}

function matrixSubtract() {
    if (!hasBothMatrices()) return;

    const result = [
        [matrixA[0][0] - matrixB[0][0], matrixA[0][1] - matrixB[0][1]],
        [matrixA[1][0] - matrixB[1][0], matrixA[1][1] - matrixB[1][1]]
    ];

    display.value = formatMatrix(result);
}

function matrixMultiply() {
    if (!hasBothMatrices()) return;

    const result = [
        [
            matrixA[0][0] * matrixB[0][0] + matrixA[0][1] * matrixB[1][0],
            matrixA[0][0] * matrixB[0][1] + matrixA[0][1] * matrixB[1][1]
        ],
        [
            matrixA[1][0] * matrixB[0][0] + matrixA[1][1] * matrixB[1][0],
            matrixA[1][0] * matrixB[0][1] + matrixA[1][1] * matrixB[1][1]
        ]
    ];

    display.value = formatMatrix(result);
}

function matrixDeterminant(name) {
    const matrix = name === "A" ? matrixA : matrixB;

    if (!matrix) {
        display.value = `Save Mat ${name}`;
        return;
    }

    display.value = `det ${name} = ${matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]}`;
}

function hasBothMatrices() {
    if (!matrixA || !matrixB) {
        display.value = "Save A and B";
        return false;
    }

    return true;
}

function formatMatrix(matrix) {
    return `[${matrix[0][0]}, ${matrix[0][1]}] [${matrix[1][0]}, ${matrix[1][1]}]`;
}

function matrixClear() {
    matrixA = null;
    matrixB = null;
    matrixTarget = null;
    display.value = "Matrix mode";
}

function backToCalculator() {
    currentMode = "basic";
    expression = "";
    matrixTarget = null;
    display.disabled = true;
    display.readOnly = false;
    display.placeholder = "";
    display.value = "0";
    buttonsContainer.innerHTML = normalButtonsHTML;
    connectCalculatorButtons();
}

window.onclick = function(event) {
    if (!event.target.matches(".mode-btn")) {
        const menu = document.getElementById("modeMenu");

        if (menu && menu.classList.contains("show")) {
            menu.classList.remove("show");
        }
    }
};

connectCalculatorButtons();
