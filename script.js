const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".buttons button");

let expression = "";

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

function toggleMenu() {
    document.getElementById("modeMenu").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches(".mode-btn")) {
        const menu = document.getElementById("modeMenu");

        if (menu && menu.classList.contains("show")) {
            menu.classList.remove("show");
        }
    }
};