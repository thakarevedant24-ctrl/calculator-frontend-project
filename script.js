// Grab the display element from the DOM
const display = document.getElementById('display');

// Variable to store the current calculation string
let currentInput = '';

/**
 * Appends a number or a decimal point to the display
 */
function appendNumber(number) {
    // Prevent multiple decimals in a single number
    if (number === '.' && currentInput.includes('.')) return;
    
    // If display is 0, replace it (unless adding a decimal)
    if (currentInput === '' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

/**
 * Appends an operator (+, -, *, /) to the display
 */
function appendOperator(operator) {
    // Prevent adding an operator if the input is empty
    if (currentInput === '') return;
    
    // Prevent adding multiple operators in a row
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
    display.innerText = '0';
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
        updateDisplay();
        
    } catch (error) {
        display.innerText = 'Error';
        currentInput = '';
    }
}

/**
 * Updates the screen with the current input string
 */
function updateDisplay() {
    display.innerText = currentInput || '0';
}