'use strict';

(function() {

    const buttonsContainer = document.querySelector('.container');
    // Store numbers and operators inside calculation array.
    let calculationArr = [];
    const operationsArr = [
        {operator: '/',  operation: (num1, num2) => num1 / num2},
        {operator: '*',  operation: (num1, num2) => num1 * num2},
        {operator: '+',  operation: (num1, num2) => num1 + num2},
        {operator: '-',  operation: (num1, num2) => num1 - num2},
        {operator: '**', operation: (num1, num2) => Math.pow(num1, num2)},
    ];

    /**
     * Return the result of a mathematical operation.
     * @param  {string} operator - Operation to perform i.e '+', '/', etc.
     * @param  {number} numX     - First operand in operation.
     * @param  {number} numY     - Second operand in operation.
     * @return {number}          - Result of math operation.
     */
    function operate(operator, num1, num2) {
        const object = operationsArr.find(obj => (obj.operator === operator));
        return object.operation(num1, num2);
    }

    /**
     * Return a boolean indicating if the provided item is an operator.
     * @param  {(number|string)} item - An operator, bracket, or number.
     * @return {boolean}              - true if item is operator, else false.
     */
    function isOperator(item) {
        const operators = operationsArr.map(obj => obj.operator);
        return operators.includes(item);
    }

    /**
     * Create one number by joining the last two numbers entered together
     * for the current calculation.
     * @param {number} num1 - The first number entered.
     * @param {number} num2 - The second number entered.
     */
    function concatenateNumbers(num1, num2) {
        const joinedNumber = parseInt(num1.toString() + num2.toString());
        calculationArr.pop();
        calculationArr.push(joinedNumber);
    }

    /**
     * Add the number entered into the current calculation being processed.
     * @param {number} number - A number entered from the calculator.
     */
    function handleNumberClick(number) {
        if (!calculationArr.length) {
            calculationArr.push(number);
        } else {
            const lastItemEntered = calculationArr[calculationArr.length - 1];
            if (isOperator(lastItemEntered)) {
                calculationArr.push(number);
            } else if (typeof lastItemEntered === 'number') {
                concatenateNumbers(lastItemEntered, number);
            }
        }
    }

    /**
     * Add the operator entered into the current calculation being processed.
     * @param {string} newOperator - Operator symbol entered ('*', '/', etc.).
     */
    function handleOperatorClick(newOperator) {
        const lastItemEntered = calculationArr[calculationArr.length - 1];

        if (typeof lastItemEntered === 'number') {
            calculationArr.push(newOperator);
        } else if (isOperator(lastItemEntered)) {
            // Replace previous operator with new operator.
            calculationArr.pop();
            calculationArr.push(newOperator);
        }
    }

    /**
     * Return a string representation of the current calculation with spaces
     * before and after operators and proper formatting.
     * @return {string} - Calculation represented as a string.
     */
    function getFormattedCalculation() {
        return calculationArr.reduce((calculationStr, arrItem, currIndex) => {
            if (isOperator(arrItem)) {
                if (arrItem === '*') {
                    calculationStr += ' &#215; ';
                } else if (arrItem === '/') {
                    calculationStr += ' &#247; ';
                } else if (arrItem === '**') {
                    calculationStr += '<sup>';
                } else {
                    calculationStr += ` ${arrItem} `;
                }
            } else {
                const isNumber = typeof arrItem === 'number';
                if (calculationArr[currIndex - 1] === '**' && isNumber) {
                    calculationStr += `${arrItem}</sup> `;
                } else {
                    calculationStr += `${arrItem}`;
                }
            }
            return calculationStr;
        });
    }

    /**
     * Remove all children from a provided node element in the DOM.
     * @param {Object} node - Node element in the HTML document's tree.
     */
    function removeAllNodeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    /**
     * Set the calculator's display to the provided string.
     * @param {string} displayStr - Calculation entry or '&nbsp;'.
     */
    function updateDisplay(displayStr) {
        const displayElement = document.getElementById('calculation__display');
        // Remove previous text node children and insert new string.
        removeAllNodeChildren(displayElement);
        displayElement.insertAdjacentHTML('afterbegin', displayStr);
    }

    /**
     * Evaluate a single operation in the current calculation being processed.
     * @param {string} operator - A mathematical operator ('+', '/', etc).
     */
    function evaluateOperation(operator) {
        let operatorIndex;
        let itemsToRemove;
        let operandOne;
        let operandTwo;
        let answer;

        while (calculationArr.includes(operator)) {
            operatorIndex = calculationArr.findIndex(item => item === operator);
            operandOne = calculationArr[operatorIndex - 1];
            // Check if second operand exists, else operand 1 equals operand 2.
            if (operatorIndex === calculationArr.length - 1) {
                operandTwo = operandOne;
                itemsToRemove = 2;
            } else {
                operandTwo = calculationArr[operatorIndex + 1];
                itemsToRemove = 3;
            }
            answer = operate(operator, operandOne, operandTwo);
            // Check if operation returned an invalid number.
            if (!Number.isFinite(answer)) return 'Zero Division';
            calculationArr.splice(operatorIndex - 1, itemsToRemove, answer);
        }
    }

    /**
     * Return the result of the calculation entered, or an error string for
     * invalid calculations (i.e division by 0).
     * @return {(number|string)} - Calculation's numerical result or 'ERROR'.
     */
    function evaluateCalculation() {
        // Array only contains a number.
        if (calculationArr.length === 1) return calculationArr[0];
        // Evaluate each operation in order of BEDMAS.
        const orderOfOperations = ['**', '/', '*', '+', '-'];
        orderOfOperations.forEach(operator => {
            if (evaluateOperation(operator) === 'Zero Division') {
                return 'ERROR';
            }
        });
        return calculationArr[0];
    }

    /**
     * Set the calculator's result box to the provided string.
     * @param {string} newResult - Result of a calculation or '&nbsp;'.
     */
    function updateResult(newResult) {
        const resultElement = document.getElementById('calculation__result');
        removeAllNodeChildren(resultElement);
        resultElement.insertAdjacentHTML('afterbegin', newResult);
    }

    /**
     * Event handler for `click` events within buttons in the calculator.
     * @param {Object} event - The MouseEvent triggering this function.
     */
    function handleClickEvent(event) {
        if (!event.target.closest('button')) return;
        const button = event.target.closest('button');

        if (button.classList.contains('number-button')) {
            handleNumberClick(parseInt(event.target.innerText));
            // Insert string version of calculation array.
            updateDisplay(getFormattedCalculation());
        } else if (button.classList.contains('reset-button')) {
            calculationArr = [];
            updateDisplay('&nbsp;');
            updateResult('&nbsp;');
        }

        if (!calculationArr.length) return;

        if (button.classList.contains('operator-button')) {
            handleOperatorClick(button.getAttribute('value'));
            updateDisplay(getFormattedCalculation());
        } else if (button.classList.contains('equal-button')) {
            updateResult(evaluateCalculation() + '');
            calculationArr = [];
        }
    }

    // Add 'click' event listener to whole calculator (event delegation).
    buttonsContainer.addEventListener('click', handleClickEvent);


})(); /* Invoke function to avoid globally-scoped functions, variables. */
