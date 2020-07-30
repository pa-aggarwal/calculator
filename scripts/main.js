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
     * Event handler for `click` events within buttons in the calculator.
     * @param {Object} event - The MouseEvent triggering this function.
     */
    function handleClickEvent(event) {
        if (!event.target.closest('button')) return;

        const button = event.target.closest('button');
        const displayElement = document.querySelector('.display__input');
        const resultElement = document.querySelector('.display__result');

        if (button.classList.contains('button__reset')) {
            emptyCalculation();
            updateElementHTML('&nbsp;', resultElement, displayElement);
            return;
        } else if (button.classList.contains('button__number')) {
            handleNumberClick(parseInt(button.getAttribute('value')));
        } else if (button.classList.contains('button__decimal')) {
            handleDecimalClick();
        } else if (button.classList.contains('button__bracket')) {
            handleBracketClick(button.getAttribute('value'));
        } else if (button.classList.contains('button__answer')) {
            handleLastAnswerClick();
        }
        updateElementHTML(getFormattedCalculation(), displayElement);

        if (isEmptyCalculation()) return;
        if (button.classList.contains('button__equal')) {
            updateElementHTML(handleEqualClick(), resultElement);
            emptyCalculation();
            return;
        } else if (button.classList.contains('button__operator')) {
            handleOperatorClick(button.getAttribute('value'));
        } else if (button.classList.contains('button__sign')) {
            handleSignClick();
        } else if (button.classList.contains('button__undo')) {
            handleUndoClick();
        }
        updateElementHTML(getFormattedCalculation(), displayElement);
    }

    // Add 'click' event listener to whole calculator (event delegation).
    buttonsContainer.addEventListener('click', handleClickEvent);

})(); /* Invoke function to avoid globally-scoped functions, variables. */
