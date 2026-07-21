// Grab the display element from the DOM
const display = document.getElementById('display');

// Actual expression used for calculation (real * and / characters)
let currentInput = '';

// Tracks whether the last action was pressing "="
let justCalculated = false;

/**
 * Appends a number or a decimal point to the display
 */
function appendNumber(number) {
    justCalculated = false;

    // Prevent multiple decimals in a single number
    if (number === '.' && lastNumberSegment().includes('.')) return;

    // If display is empty, start fresh (unless adding a decimal)
    if (currentInput === '' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

/**
 * Appends an operator (+, -, *, /) to the expression
 */
function appendOperator(operator) {
    justCalculated = false;

    // Prevent adding an operator if the input is empty
    if (currentInput === '') return;

    // Prevent adding multiple operators in a row (replace the last one)
    const lastChar = currentInput.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }
    updateDisplay();
}

/**
 * Clears the display and resets the input
 */
function clearDisplay() {
    currentInput = '';
    justCalculated = false;
    display.innerText = '0';
}

/**
 * Deletes the last character from the current input.
 * If a calculation was just completed, backspace clears
 * the result entirely instead of editing it digit by digit.
 */
function backspace() {
    if (justCalculated) {
        clearDisplay();
        return;
    }
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

/**
 * Calculates the expression in the display
 */
function calculate() {
    try {
        // Evaluate the mathematical expression
        // Note: Function('return ...')() is a safer alternative to direct eval()
        const result = new Function('return ' + currentInput)();

        // Handle division by zero or invalid math
        if (!isFinite(result)) {
            throw new Error("Math Error");
        }

        // Format to avoid long floating point issues (e.g. 0.1 + 0.2)
        currentInput = parseFloat(result.toFixed(10)).toString();
        justCalculated = true;
        updateDisplay();

    } catch (error) {
        display.innerText = 'Error';
        currentInput = '';
        justCalculated = false;
    }
}

/**
 * Returns the portion of currentInput after the last operator,
 * i.e. the number currently being typed. Used to check for
 * duplicate decimal points within just that number.
 */
function lastNumberSegment() {
    const parts = currentInput.split(/[+\-*/]/);
    return parts[parts.length - 1];
}

/**
 * Updates the screen: keeps currentInput as the real expression
 * for calculation, but shows * as "x" and / as "÷" on display.
 */
function updateDisplay() {
    const formatted = currentInput
        .replace(/\*/g, ' x ')
        .replace(/\//g, ' ÷ ')
        .replace(/\+/g, ' + ')
        .replace(/-/g, ' - ');

    display.innerText = formatted.trim() || '0';
}