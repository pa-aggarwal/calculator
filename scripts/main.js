'use strict';

(function() {

    const calculatorElement = document.querySelector('.calculator');
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
     * Event handler for `click` events within the calculator device.
     * @param {Object} event - The MouseEvent triggering this function.
     */
    function handleClickEvent(event) {
    }

    // Add 'click' event listener to whole calculator (event delegation).
    calculatorElement.addEventListener('click', handleClickEvent);


})(); /* Invoke function to avoid globally-scoped functions, variables. */
