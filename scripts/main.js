'use strict';

(function() {

    const calculatorElement = document.querySelector('.calculator');
    // Store numbers and operators inside calculation array.
    let calculationArr = [];
    const operations = [
        {
            operator: '/',
            operatorCode: 247,
            operatorRegExp: /\//g,
            operation: (num1, num2) => num1 / num2
        },
        {
            operator: '*',
            operatorCode: 215,
            operatorRegExp: /\*/g,
            operation: (num1, num2) => num1 * num2
        },
        {
            operator: '+',
            operatorCode: 43,
            operatorRegExp: /\+/g,
            operation: (num1, num2) => num1 + num2
        },
        {
            operator: '-',
            operatorCode: 8722,
            operatorRegExp: /-/g,
            operation: (num1, num2) => num1 - num2
        }
    ];

    /**
     * Return the result of a mathematical operation.
     * @param  {string} operator - Operation to perform i.e '+', '/', etc.
     * @param  {number} numX     - First operand in operation.
     * @param  {number} numY     - Second operand in operation.
     * @return {number}          - Result of math operation.
     */
    function getCalculationResult(operator, num1, num2) {
        const opObj = operations.find(obj => (obj.operator === operator));
        return opObj.operation(num1, num2);
    }

    /**
     * Return a boolean indicating if the provided item is an operator.
     * @param  {(string|number)} item - An operator ('+', etc.) or number.
     * @return {boolean}              - true if item is operator, else false.
     */
    function isOperator(item) {
        const operatorSymbols = operations.map(obj => obj.operator);
        return operatorSymbols.includes(item);
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
     * Return the symbol equivalent of an operator's HTML entity code.
     * @param  {number} entityCode - Operator's HTML code i.e 43 (+).
     * @return {string}            - Operator as a symbol ('*', '/', etc.).
     */
    function getOperator(entityCode) {
        const opObj = operations.find(obj => (obj.operatorCode === entityCode));
        return opObj.operator;
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
            // Replace previous operator with newOperator.
            calculationArr.pop();
            calculationArr.push(newOperator);
        }
    }

    /**
     * Return an updated string with any operator symbols present converted
     * into their equivalent HTML code values.
     * @param  {string} string - May contain operators ('+', etc.) to change.
     * @return {string}        - Updated string with operators replaced.
     */
    function mapOperatorToUnicode(string) {
        if (string !== '') {
            operations.forEach(operation => {
                // Destructure so we don't have to access by dot notation.
                const {operator, operatorCode, operatorRegExp} = operation;
                let operatorUnicode = `&#${operatorCode};`;
                string = string.replace(operatorRegExp, operatorUnicode);
            });
        }
        return string;
    }

    /**
     * Set the calculator's display to numbers/operators as they're entered.
     */
    function updateDisplay() {
        const displayElement = document.getElementById('calculation__display');
        let calculationStr = mapOperatorToUnicode(calculationArr.join(' '));
        displayElement.innerHTML = calculationStr;
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
            // Check if operation returned a number.
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
        for (let i = 0; i < operations.length; i++) {
            const {operator} = operations[i];
            if (evaluateOperation(operator) === 'Zero Division') {
                return 'ERROR';
            }
        }
        // Array contains 1 number after performing all operations.
        return calculationArr[0];
    }

    /**
     * Set the calculator's result box to the answer for the entered calulation.
     * @param {(number|string)} calculationAnswer - Numerical result or 'ERROR'.
     */
    function updateResult(calculationAnswer) {
        const resultElement = document.getElementById('calculation__result');
        resultElement.innerText = calculationAnswer + '';
    }

    /**
     * Event handler for `click` events within the calculator device.
     * @param {Object} event - The MouseEvent triggering this function.
     */
    function handleClickEvent(event) {
        const elementClasses = event.target.classList;
        const length = calculationArr.length;

        if (elementClasses.contains('number-button')) {
            handleNumberClick(parseInt(event.target.innerText));
            updateDisplay();
        } else if (elementClasses.contains('operator-button') && length) {
            const newOperatorUnicode = event.target.innerHTML.codePointAt(0);
            handleOperatorClick(getOperator(newOperatorUnicode));
            updateDisplay();
        } else if (elementClasses.contains('equal-button') && length) {
            updateResult(evaluateCalculation());
            calculationArr = [];
        } else if (elementClasses.contains('clear-button')) {
            // TODO: Clear the calculation array.
            // TODO: Clear display.
            // TODO: Clear calculation result.
        }
    }

    // Add 'click' event listener to whole calculator (event delegation).
    calculatorElement.addEventListener('click', handleClickEvent);


})(); /* Invoke function to avoid globally-scoped functions, variables. */
