import {
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
} from './button-click.js';

(function() {

    const buttonsContainer = document.querySelector('.container');

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
     * Update element(s) HTML code with the provided string.
     * @param {string} htmlText - HTML code to place inside element.
     * @param {Object} elements - Array of elements in the document to modify.
     */
    function updateElementHTML(htmlText, ...elements) {
        elements.forEach(element => {
            removeAllNodeChildren(element);
            element.insertAdjacentHTML('afterbegin', htmlText);
        });
    }

    /**
     * Perform a button's action based on the button pressed/clicked.
     * @param {Object} buttonSelected - Properties indicate button type chosen.
     */
    function executeButtonAction(buttonSelected) {
        const displayElement = document.querySelector('.display__input');
        const resultElement = document.querySelector('.display__result');

        if (buttonSelected.isReset) {
            emptyCalculation();
            updateElementHTML('&nbsp;', resultElement, displayElement);
            return;
        } else if (buttonSelected.isNumber) {
            handleNumberClick(parseInt(buttonSelected.value));
        } else if (buttonSelected.isDecimal) {
            handleDecimalClick();
        } else if (buttonSelected.isBracket) {
            handleBracketClick(buttonSelected.value);
        } else if (buttonSelected.isAnswer) {
            handleLastAnswerClick();
        }
        updateElementHTML(getFormattedCalculation(), displayElement);

        if (isEmptyCalculation()) return;
        if (buttonSelected.isEqual) {
            updateElementHTML(handleEqualClick(), resultElement);
            emptyCalculation();
            return;
        } else if (buttonSelected.isOperator) {
            if (buttonSelected.value === '^') {
                handleOperatorClick('**');
            } else {
                handleOperatorClick(buttonSelected.value);
            }
        } else if (buttonSelected.isSign) {
            handleSignClick();
        } else if (buttonSelected.isUndo) {
            handleUndoClick();
        }
        updateElementHTML(getFormattedCalculation(), displayElement);
    }

    /**
     * Event handler for `click` events within buttons in the calculator.
     * @param {Object} event - The MouseEvent triggering this function.
     */
    function handleClickEvent(event) {
        if (!event.target.closest('button')) return;
        const button = event.target.closest('button');
        const buttonClickedObj = {
            isReset: button.classList.contains('calc-button--reset'),
            isEqual: button.classList.contains('calc-button--equal'),
            isUndo: button.classList.contains('calc-button--undo'),
            isAnswer: button.classList.contains('calc-button--answer'),
            isDecimal: button.classList.contains('calc-button--decimal'),
            isSign: button.classList.contains('calc-button--sign'),
            isNumber: button.classList.contains('calc-button--number'),
            isBracket: button.classList.contains('calc-button--bracket'),
            isOperator: button.classList.contains('calc-button--operator'),
            value: button.getAttribute('value')
        };

        executeButtonAction(buttonClickedObj);
    }

    /**
     * Event handler for `keydown` events caused by keyboard presses.
     * @param {Object} event - The KeyboardEvent triggering this function.
     */
    function handleKeyEvent(event) {
        const keyPressed = event.key;
        const keyEnteredObj = {
            isReset: (keyPressed === 'C'),
            isEqual: (keyPressed === '=' || keyPressed === 'Enter'),
            isUndo: (keyPressed === 'Backspace'),
            isAnswer: (keyPressed === 'A'),
            isDecimal: (keyPressed === '.'),
            isSign: (keyPressed === 'S'),
            isNumber: !isNaN(keyPressed),
            isBracket: (keyPressed === '(' || keyPressed === ')'),
            isOperator: (['+', '-', '*', '/', '^'].includes(keyPressed)),
            value: keyPressed
        };

        executeButtonAction(keyEnteredObj);
    }

    // Add 'click' event listener to container only (event delegation).
    buttonsContainer.addEventListener('click', handleClickEvent);

    // Add 'keydown' event listener for buttons pressed on keyboard.
    document.addEventListener('keydown', handleKeyEvent);

})(); /* Invoke function to avoid globally-scoped functions, variables. */
