'use strict';

(function() {

    const calculatorElement = document.querySelector('.calculator');
    // Store numbers and operators inside calculation array.
    const calculationArr = [];
    const operations = [
        {
            operator: '+',
            operatorCode: 43,
            operation: (num1, num2) => num1 + num2
        },
        {
            operator: '-',
            operatorCode: 8722,
            operation: (num1, num2) => num1 - num2
        },
        {
            operator: '*',
            operatorCode: 215,
            operation: (num1, num2) => num1 * num2
        },
        {
            operator: '/',
            operatorCode: 247,
            operation: (num1, num2) => num1 / num2
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
     * Event handler for `click` events within the calculator device.
     * @param {Object} event - The MouseEvent triggering this function.
     */
    function handleClickEvent(event) {
        const elementClasses = event.target.classList;
        const length = calculationArr.length;

        if (elementClasses.contains('number-button')) {
            handleNumberClick(parseInt(event.target.innerText));
            // TODO: Update display.
        } else if (elementClasses.contains('operator-button') && length) {
            const newOperatorUnicode = event.target.innerHTML.codePointAt(0);
            handleOperatorClick(getOperator(newOperatorUnicode));
            // TODO: Update display.
        } else if (elementClasses.contains('equal-button')) {
            // TODO: Evaluate what's in the calculation array.
        } else if (elementClasses.contains('clear-button')) {
            // TODO: Clear the calculation array.
            // TODO: Clear display.
            // TODO: Clear calculation result.
        }
    }

    // Add 'click' event listener to whole calculator (event delegation).
    calculatorElement.addEventListener('click', handleClickEvent);


})(); /* Invoke function to avoid globally-scoped functions, variables. */
