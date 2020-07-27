const calculate = function() {

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
     * @param  {(number|string)} item - An operator or number.
     * @return {boolean}              - true if item is operator, else false.
     */
    function isOperator(item) {
        const operators = operationsArr.map(obj => obj.operator);
        return operators.includes(item);
    }

    /**
     * Mutate an array by evaluating the calculation stored with operators and
     * numbers, and returning the final result in the array.
     * @param  {Object}          innerArr - Array of numbers/operators.
     * @return {(number|string)}          - Calculation result/'Zero Divison'.
     */
    function evaluateInnerCalc(innerArr) {
        let operatorIndex;
        let itemsToRemove;
        let operandOne;
        let operandTwo;
        let answer;

        // Perform calculation using order of operations.
        const orderOfOperations = ['**', '/', '*', '+', '-'];
        for (let i = 0; i < orderOfOperations.length; i++) {
            const operator = orderOfOperations[i];
            while (innerArr.includes(operator)) {
                operatorIndex = innerArr.findIndex(item => item === operator);
                operandOne = innerArr[operatorIndex - 1];
                // Check if second operand exists, else operands are equal.
                if (operatorIndex === innerArr.length - 1) {
                    operandTwo = operandOne;
                    itemsToRemove = 2;
                } else {
                    operandTwo = innerArr[operatorIndex + 1];
                    itemsToRemove = 3;
                }
                // Convert operands to numbers in case they're strings.
                answer = operate(operator, +operandOne, +operandTwo);
                // Check if operation returned an invalid number.
                if (!Number.isFinite(answer)) return 'Zero Division';
                innerArr.splice(operatorIndex - 1, itemsToRemove, answer);
            }
        }

        return innerArr[0];
    }

    return {
        operate,
        isOperator,
        evaluateInnerCalc
    };

}();

export const {operate, isOperator, evaluateInnerCalc} = calculate;
