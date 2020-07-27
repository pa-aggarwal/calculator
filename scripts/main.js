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
     * @param  {(number|string)} item - An operator or number.
     * @return {boolean}              - true if item is operator, else false.
     */
    function isOperator(item) {
        const operators = operationsArr.map(obj => obj.operator);
        return operators.includes(item);
    }

    /**
     * Remove the previous number and decimal point entered from the current
     * calculation, and return both joined as a string.
     * @return {string} - String matching the pattern \^[0-9]/.$\
     */
    function removeLastNumAndDecimal() {
        const secondLastItemPos = calculationArr.length - 2;
        const lastNumWithDecimal = calculationArr.splice(secondLastItemPos, 2);
        return lastNumWithDecimal.join('');
    }

    /**
     * Create one number by joining the last two numbers entered together
     * for the current calculation.
     * @param {(number|string)} num1 - The first number entered.
     * @param {number}          num2 - The second number entered.
     */
    function concatenateNumbers(num1, num2) {
        let joinedNum;
        if (num2 === 0) {
            joinedNum = num1 + num2;
        } else {
            const numStr = num1.toString() + num2.toString();
            joinedNum = parseFloat(numStr);
        }
        calculationArr.splice(calculationArr.length - 1, 1, joinedNum);
    }

    /**
     * Add a new float number to the calculation being processed.
     * @param {number} numAfterDecimal - number to place after decimal.
     */
    function appendFloatNumber(numAfterDecimal) {
        let finalNum = removeLastNumAndDecimal() + numAfterDecimal;
        // Use string if decimal point is 0 (else parseFloat converts to int)
        finalNum = (numAfterDecimal !== 0) ? parseFloat(finalNum) : finalNum;
        calculationArr.push(finalNum);
    }

    /**
     * Return the number of open/closed brackets in the current calculation.
     * @param  {string} bracketType - An open or closed bracket i.e '(' or ')'.
     * @return {number}             - Number count of open/closed brackets.
     */
    function getNumBrackets(bracketType) {
        return calculationArr.reduce((total, element) => {
            return (element === bracketType) ? total + 1 : total;
        }, 0);
    }

    /**
     * Add the number entered into the current calculation being processed.
     * @param {number} number - A number entered from the calculator.
     */
    function handleNumberClick(number) {
        if (!calculationArr.length) {
            calculationArr.push(number);
        } else {
            const lastEntry = calculationArr[calculationArr.length - 1];
            if (isOperator(lastEntry) || lastEntry === '(') {
                calculationArr.push(number);
            } else if (lastEntry === '.') {
                appendFloatNumber(number);
            } else if (lastEntry === ')') {
                calculationArr.push('*', number);
            } else {
                concatenateNumbers(lastEntry, number);
            }
        }
    }

    /**
     * Add the operator entered into the current calculation being processed.
     * @param {string} newOperator - Operator symbol entered ('*', '/', etc.).
     */
    function handleOperatorClick(newOperator) {
        const lastEntry = calculationArr[calculationArr.length - 1];
        const lastEntryType = typeof lastEntry;

        if (lastEntry === '(') {
            return;
        } else if (lastEntry === '.') {
            const lastNumAsInt = parseInt(removeLastNumAndDecimal());
            calculationArr.push(lastNumAsInt, newOperator);
        } else if (isOperator(lastEntry)) {
            // Replace previous operator with new operator.
            calculationArr.splice(calculationArr.length - 1, 1, newOperator);
        } else {
            calculationArr.push(newOperator);
        }
    }

    /**
     * Append a decimal point to the last number entered in the current
     * calculation, else place 0 in front of the decimal point.
     */
    function handleDecimalClick() {
        if (!calculationArr.length) {
            calculationArr.push('0', '.');
        } else {
            const lastEntry = calculationArr[calculationArr.length - 1];
            if (lastEntry === '.') {
                return;
            } else if (Number.isInteger(lastEntry)) {
                calculationArr.push('.');
            } else if (isOperator(lastEntry) || lastEntry === '(') {
                calculationArr.push('0', '.');
            } else if (lastEntry === ')') {
                calculationArr.push('*', '0', '.');
            }
        }
    }

    /**
     * Add a bracket entered into the current calculation.
     * @param {string} bracketType - An open/closed bracket i.e '(' or ')'.
     */
    function handleBracketClick(bracketType) {
        if (!calculationArr.length) {
            if (bracketType === '(') calculationArr.push(bracketType);
        } else {
            const lastEntry = calculationArr[calculationArr.length - 1];
            const addToCalculation = [];
            let isMoreLeftBrackets = getNumBrackets('(') > getNumBrackets(')');
            let lastNumToInt;

            if (bracketType === ')' && !isMoreLeftBrackets) return;

            if (lastEntry === '.') {
                lastNumToInt = parseInt(removeLastNumAndDecimal());
            }

            if (bracketType === '(' && lastEntry === '.') {
                addToCalculation.push(lastNumToInt, '*', bracketType);
            } else if (bracketType === '(') {
                if (isOperator(lastEntry) || (lastEntry === '(')) {
                    addToCalculation.push(bracketType);
                } else {
                    addToCalculation.push('*', bracketType);
                }
            } else if (bracketType === ')' && lastEntry === '.') {
                addToCalculation.push(lastNumToInt, bracketType);
            } else if (bracketType === ')') {
                if (isOperator(lastEntry) || (lastEntry === '(')) {
                    calculationArr.pop();
                    console.log(calculationArr);
                }
                if (lastEntry !== '(') addToCalculation.push(bracketType);
            }
            calculationArr.push(...addToCalculation);
        }
    }

    /**
     * Return a string representation of the current calculation with spaces
     * before and after operators and proper formatting.
     * @return {string} - Calculation represented as a string.
     */
    function getFormattedCalculation() {
        if (!calculationArr.length) return '&nbsp;';
        return calculationArr.reduce((calculationStr, currItem) => {
            if (isOperator(currItem)) {
                if (currItem === '*') {
                    calculationStr += ' &#215; ';
                } else if (currItem === '/') {
                    calculationStr += ' &#247; ';
                } else {
                    calculationStr += ` ${currItem} `;
                }
            } else {
                calculationStr += `${currItem}`;
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
     * Evaluate all operations in a calculation stored in a provided array.
     * @param {Object} innerArr - Array of numbers/operators.
     */
    function evaluateInnerCalc(innerArr) {
        let operatorIndex;
        let itemsToRemove;
        let operandOne;
        let operandTwo;
        let answer;

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

    /**
     * Return the result of the calculation entered, or an error string for
     * invalid calculations (i.e division by 0, unequal brackets).
     * @return {(number|string)} - Calculation's numerical result or 'ERROR'.
     */
    function evaluateCalculation() {
        if (calculationArr.length === 1 && !isNaN(calculationArr[0])) {
            return calculationArr[0];
        }

        if (getNumBrackets('(') !== getNumBrackets(')')) return 'ERROR';

        const leftBracketIndices = [];
        const rightBracketIndices = [];
        calculationArr.forEach((element, index) => {
            if (element === '(') leftBracketIndices.push(index);
            if (element === ')') rightBracketIndices.push(index);
        });

        let innerMostArr;
        for (let l = leftBracketIndices.length - 1, r = 0; l >= 0; l--, r++) {
            let leftIndex = leftBracketIndices[l];
            let rightIndex = rightBracketIndices[r];
            innerMostArr = calculationArr.slice(leftIndex + 1, rightIndex);
            if (innerMostArr.length === 1) {
                calculationArr.splice(leftIndex, 3, innerMostArr[0]);
            } else {
                let calcAnswer = evaluateInnerCalc(innerMostArr);
                if (calcAnswer === 'Zero Division') {
                    return 'ERROR';
                } else {
                    const itemsInCalc = rightIndex - leftIndex + 1;
                    calculationArr.splice(leftIndex, itemsInCalc, calcAnswer);
                }
            }
        }

        let finalAnswer = evaluateInnerCalc(calculationArr);
        return (finalAnswer === 'Zero Division') ? 'ERROR' : finalAnswer;
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
            handleNumberClick(parseInt(button.getAttribute('value')));
            // Insert string version of calculation array.
            updateDisplay(getFormattedCalculation());
        } else if (button.classList.contains('decimal-button')) {
            handleDecimalClick();
            updateDisplay(getFormattedCalculation());
        } else if (button.classList.contains('reset-button')) {
            calculationArr = [];
            updateDisplay('&nbsp;');
            updateResult('&nbsp;');
        } else if (button.classList.contains('bracket-button')) {
            handleBracketClick(button.getAttribute('value'));
            updateDisplay(getFormattedCalculation());
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
