import {operate, isOperator, evaluateInnerCalc} from './calculate.js';

const buttonClick = function() {

    // Store numbers and operators inside calculation array.
    let calculationArr = [];
    let previousAnswer;

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
     * Change the sign of the previous entry if it was numeric or a float
     * stored as a string.
     */
    function handleSignClick() {
        const calcLength = calculationArr.length;
        const lastEntry = calculationArr[calcLength - 1];
        if (isOperator(lastEntry) || lastEntry === '(' || lastEntry === ')') {
            return;
        } else if (lastEntry === '.') {
            const secondLastEntry = calculationArr[calcLength - 2];
            if (typeof secondLastEntry === 'number' && secondLastEntry === 0) {
                calculationArr[calcLength - 2] = '-0';
            } else if (typeof secondLastEntry === 'number') {
                calculationArr[calcLength - 2] = -secondLastEntry;
            } else if (typeof secondLastEntry === 'string') {
                if (secondLastEntry.includes('-')) {
                    calculationArr[calcLength - 2] = secondLastEntry.slice(1);
                } else {
                    calculationArr[calcLength - 2] = '-' + secondLastEntry;
                }
            }
        } else if (typeof lastEntry === 'string') {
            if (lastEntry.startsWith('-')) {
                calculationArr[calcLength - 1] = lastEntry.slice(1);
            } else {
                calculationArr[calcLength - 1] = '-' + lastEntry;
            }
        } else if (typeof lastEntry === 'number') {
            calculationArr[calcLength - 1] = -lastEntry;
        }
    }

    /**
     * Remove the previous digit, decimal point, operator, or bracket entered
     * from the current calculation.
     */
    function handleUndoClick() {
        const lastEntry = calculationArr[calculationArr.length - 1];
        if (isOperator(lastEntry) || lastEntry === '(' || lastEntry === ')') {
            calculationArr.pop();
        } else if (lastEntry === '.') {
            const secondLastEntry = calculationArr[calculationArr.length - 2];
            if (secondLastEntry === '0') {
                calculationArr.splice(calculationArr.length - 2, 2);
            } else if (typeof secondLastEntry === 'number') {
                calculationArr.splice(calculationArr.length - 1, 1);
            }
        } else {
            const lastItem = calculationArr.pop() + '';
            const lastItemSubstr = lastItem.slice(0, lastItem.length - 1);
            // Only push back item if not empty string.
            if (lastItemSubstr) {
                calculationArr.push(lastItemSubstr);
            }
        }
    }

    /**
     * Append the answer from the last calculation into the current one,
     * with the exception that the last answer was 'ERROR' or is undefined.
     */
    function handleLastAnswerClick() {
        if (previousAnswer && previousAnswer !== 'ERROR') {
            calculationArr.push(previousAnswer);
        }
    }

    /**
     * Return the result of the current calculation by performing order of
     * operations (BEDMAS), or an error string indicating an invalid entry.
     * @return {(number|string)} - Calculation result or 'ERROR'.
     */
    function evaluateCalculation() {
        // Number of brackets in the calculation must be equal.
        if (getNumBrackets('(') !== getNumBrackets(')')) return 'ERROR';

        let leftIndex;
        let rightIndex;
        let nestedCalc;
        let nestedAnswer;
        let nestedCalcItems;

        // Perform all operations nested in brackets first.
        while (calculationArr.includes('(')) {
            leftIndex = calculationArr.indexOf('(');
            rightIndex = calculationArr.indexOf(')');
            nestedCalc = calculationArr.slice(leftIndex + 1, rightIndex);
            while (nestedCalc.includes('(')) {
                leftIndex = calculationArr.indexOf('(', leftIndex + 1);
                nestedCalc = calculationArr.slice(leftIndex + 1, rightIndex);
            }
            nestedAnswer = evaluateInnerCalc(nestedCalc);
            if (nestedAnswer === 'Zero Division') return 'ERROR';
            nestedCalcItems = rightIndex - leftIndex + 1;
            calculationArr.splice(leftIndex, nestedCalcItems, nestedAnswer);
        }

        // Evalute any operations left that aren't in brackets.
        const finalAnswer = evaluateInnerCalc(calculationArr);
        return (finalAnswer === 'Zero Division') ? 'ERROR' : finalAnswer;
    }

    /**
     * Evaluate and return the result of the current calculation after the
     * equal button is clicked.
     * @return {string} - Calculation result or 'ERROR'.
     */
    function handleEqualClick() {
        previousAnswer = evaluateCalculation() + '';
        return previousAnswer;
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
     * Return a boolean indicating if the current calculation has no entries.
     * @return {boolean} - true if calculation is empty, else false.
     */
    function isEmptyCalculation() {
        return calculationArr.length === 0;
    }

    /**
     * Empty the contents of the current calculation.
     */
    function emptyCalculation() {
        calculationArr = [];
    }

    return {
        handleNumberClick,
        handleOperatorClick,
        handleDecimalClick,
        handleBracketClick,
        handleSignClick,
        handleUndoClick,
        handleLastAnswerClick,
        handleEqualClick,
        getFormattedCalculation,
        isEmptyCalculation,
        emptyCalculation
    };

}();

export const {
    handleNumberClick,
    handleOperatorClick,
    handleDecimalClick,
    handleBracketClick,
    handleSignClick,
    handleUndoClick,
    handleLastAnswerClick,
    handleEqualClick,
    getFormattedCalculation,
    isEmptyCalculation,
    emptyCalculation
} = buttonClick;
