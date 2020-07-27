import {operate, isOperator, evaluateInnerCalc} from './calculate.js';

(function() {

    const buttonsContainer = document.querySelector('.container');
    // Store numbers and operators inside calculation array.
    let calculationArr = [];

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
        if (typeof num1 === 'string' && num2 === 0) {
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
     * Add '(' to the current calculation based on the last entry's value.
     * @param  {(number|string)} lastEntry - Previous item entered.
     */
    function isLeftBracket(lastEntry) {
        if (lastEntry === '.') {
            const lastNumToInt = parseInt(removeLastNumAndDecimal());
            calculationArr.push(lastNumToInt, '*', '(');
        } else if (isOperator(lastEntry) || (lastEntry === '(')) {
            calculationArr.push('(');
        } else {
            calculationArr.push('*', '(');
        }
    }

    /**
     * Add ')' to the current calculation based on the last entry's value.
     * @param  {(number|string)} lastEntry - Previous item entered.
     */
    function isRightBracket(lastEntry) {
        if (lastEntry === '.') {
            const lastNumToInt = parseInt(removeLastNumAndDecimal());
            calculationArr.push(lastNumToInt, ')');
        } else {
            if (isOperator(lastEntry) || (lastEntry === '(')) {
                calculationArr.pop();
            }
            if (lastEntry !== '(') calculationArr.push(')');
        }
    }

    /**
     * Add a bracket entered into the current calculation.
     * @param {string} bracketType - An open/closed bracket i.e '(' or ')'.
     */
    function handleBracketClick(bracketType) {
        if (!calculationArr.length && bracketType === '(') {
            calculationArr.push(bracketType);
        } else if (calculationArr.length) {
            const lastEntry = calculationArr[calculationArr.length - 1];
            if (bracketType === '(') {
                isLeftBracket(lastEntry);
            } else if (getNumBrackets('(') <= getNumBrackets(')')) {
                return;
            } else {
                isRightBracket(lastEntry);
            }
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
     * Evaluate operations inside each nested pair of brackets for the current
     * calculation to follow order of operations.
     */
    function evaluateBrackets() {
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
                const calcAnswer = evaluateInnerCalc(innerMostArr);
                if (calcAnswer === 'Zero Division') {
                    return 'ERROR';
                } else {
                    const itemsInCalc = rightIndex - leftIndex + 1;
                    calculationArr.splice(leftIndex, itemsInCalc, calcAnswer);
                }
            }
        }
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
        const numLeftBrackets = getNumBrackets('(');
        const numRightBrackets = getNumBrackets(')');
        // Number of opening and closing brackets not equal.
        if (numLeftBrackets !== numRightBrackets) return 'ERROR';
        // Number of brackets are equal and greater than zero.
        if (numLeftBrackets) evaluateBrackets();
        // Evaluate rest of calculation not in brackets.
        let finalAnswer = evaluateInnerCalc(calculationArr);
        return (finalAnswer === 'Zero Division') ? 'ERROR' : finalAnswer;
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
     * Update an element's HTML code with the provided string.
     * @param {Object} element  - Element in the document to modify.
     * @param {string} htmlText - HTML code to place inside element.
     */
    function updateElementHTML(element, htmlText) {
        removeAllNodeChildren(element);
        element.insertAdjacentHTML('afterbegin', htmlText);
    }

    /**
     * Event handler for `click` events within buttons in the calculator.
     * @param {Object} event - The MouseEvent triggering this function.
     */
    function handleClickEvent(event) {
        if (!event.target.closest('button')) return;

        const button = event.target.closest('button');
        const displayElement = document.getElementById('calculation__display');
        const resultElement = document.getElementById('calculation__result');

        if (button.classList.contains('reset-button')) {
            calculationArr = [];
            updateElementHTML(resultElement, '&nbsp;');
            updateElementHTML(displayElement, '&nbsp;');
            return;
        } else if (button.classList.contains('number-button')) {
            handleNumberClick(parseInt(button.getAttribute('value')));
        } else if (button.classList.contains('decimal-button')) {
            handleDecimalClick();
        } else if (button.classList.contains('bracket-button')) {
            handleBracketClick(button.getAttribute('value'));
        }
        updateElementHTML(displayElement, getFormattedCalculation());

        if (!calculationArr.length) return;
        if (button.classList.contains('operator-button')) {
            handleOperatorClick(button.getAttribute('value'));
            updateElementHTML(displayElement, getFormattedCalculation());
        } else if (button.classList.contains('equal-button')) {
            updateElementHTML(resultElement, evaluateCalculation() + '');
            calculationArr = [];
        }
    }

    // Add 'click' event listener to whole calculator (event delegation).
    buttonsContainer.addEventListener('click', handleClickEvent);

})(); /* Invoke function to avoid globally-scoped functions, variables. */
