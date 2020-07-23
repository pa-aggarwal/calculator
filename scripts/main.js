'use strict';

(function() {

    const calculatorElement = document.querySelector('.calculator');
    // Store numbers and operators inside calculation array.
    const calculationArr = [];
    const operations = [
        {
            operator: '+',
            operation: (num1, num2) => num1 + num2
        },
        {
            operator: '-',
            operation: (num1, num2) => num1 - num2
        },
        {
            operator: '*',
            operation: (num1, num2) => num1 * num2
        },
        {
            operator: '/',
            operation: (num1, num2) => num1 / num2
        }
    ];

    /**
     * Return the result of a mathematical operation.
     * @param  {String} operator - Operation to perform i.e '+', '/', etc.
     * @param  {Number} numX     - First operand in operation.
     * @param  {Number} numY     - Second operand in operation.
     * @return {Number}          - Result of math operation.
     */
    function getCalculationResult(operator, num1, num2) {
        // Assign appropriate object based on operator from array.
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
     * Event handler for `click` events within the calculator device.
     * @param {Object} event - The MouseEvent triggering this function.
     */
    function handleClickEvent(event) {
        const elementClasses = event.target.classList;

        if (elementClasses.contains('number-button')) {
            handleNumberClick(parseInt(event.target.innerText));
            // TODO: Update display.
        }
    }

    // Add 'click' event listener to whole calculator (event delegation).
    calculatorElement.addEventListener('click', handleClickEvent);


})(); /* Invoke function to avoid globally-scoped functions, variables. */
