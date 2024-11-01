function appendToDisplay(value) {
    const display = document.getElementById("display");
    
    if (display.value === "Error") {
        if (!isNaN(parseInt(value)) || value === ',') {
            display.value = value === '0' ? '0' : value;
            return;
        }
        if (['+', '-', '*', '/'].includes(value)) {
            display.value = '0' + value;
            return;
        }
    }

    if (display.value === "0") {
        if (value === '0') {
            return; 
        }
        
        if (['+', '-', '*', '/'].includes(value)) {
            display.value = '0' + value;
            return;
        }
        
        display.value = value === ',' ? '0,' : value;
        return;
    }

    if (!validateInput(display.value, value)) {
        return;
    }

    display.value += value;
}

function handleKeyboardInput(event) {
    const display = document.getElementById("display");
    const key = event.key;

    event.preventDefault();

    const keyMappings = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', 
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        
        '+': '+', '-': '-', '*': '*', '/': '/',
        
        '.': ',', ',': ',',
        
        'Backspace': 'delete',
        'Delete': 'delete',
        'Enter': 'calculate',
        'Escape': 'clear'
    };

    const numpadMappings = {
        'Numpad0': '0', 'Numpad1': '1', 'Numpad2': '2', 'Numpad3': '3', 
        'Numpad4': '4', 'Numpad5': '5', 'Numpad6': '6', 'Numpad7': '7', 
        'Numpad8': '8', 'Numpad9': '9',
        'NumpadAdd': '+', 'NumpadSubtract': '-', 
        'NumpadMultiply': '*', 'NumpadDivide': '/',
        'NumpadDecimal': ',', 
        'NumpadEnter': 'calculate'
    };

    let mappedKey = keyMappings[key] || numpadMappings[key];

    if (mappedKey) {
        switch (mappedKey) {
            case 'delete':
                deleteLastCharacter();
                break;
            case 'clear':
                clearDisplay();
                break;
            case 'calculate':
                calculate();
                break;
            default:
                if (!isNaN(mappedKey) || 
                    ['+', '-', '*', '/', ','].includes(mappedKey)) {
                    appendToDisplay(mappedKey);
                }
        }
    }
}

function deleteLastCharacter() {
    const display = document.getElementById("display");
    
    if (display.value === "Error") {
        display.value = "0";
        return;
    }
    
    display.value = display.value.length > 1 
        ? display.value.slice(0, -1) 
        : "0";
}

document.addEventListener('keydown', handleKeyboardInput);

function validateInput(currentValue, newValue) {
    const operators = ['+', '-', '*', '/'];
    const lastChar = currentValue.slice(-1);
    if (operators.includes(newValue) && operators.includes(lastChar)) {
        return false;
    }

    if (currentValue === '' && operators.includes(newValue) && newValue !== '-') {
        return false;
    }

    if (newValue === ',' && currentValue.split(/[-+*/]/).pop().includes(',')) {
        return false;
    }

    return true;
}

function calculate() {
    const display = document.getElementById("display");
    
    try {
        if (display.value === "Error") {
            return;
        }
        
        let expression = display.value.replace(/,/g, '.');
        
        if (expression === '0/0') {
            display.value = "Error";
            return;
        }
        
        if (expression.startsWith('0/')) {
            display.value = "0";
            return;
        }
        
        const safeExpression = expression.replace(/[^-()\d/*+.]/g, '');
        
        if (safeExpression.includes('/0') && !safeExpression.startsWith('0/')) {
            throw new Error('Division by zero');
        }

        const result = new Function('return ' + safeExpression)();
        
        const formattedResult = Number(result.toFixed(10)).toString().replace('.', ',');
        display.value = formattedResult;
    } catch (error) {
        display.value = "Error";
    }
}

function clearDisplay() {
    const display = document.getElementById("display");
    display.value = "0";
    display.classList.add("blink");
    setTimeout(() => {
        display.classList.remove("blink");
    }, 200);
}
window.onload = function() {
    const display = document.getElementById("display");
    display.value = "0";
    display.classList.add("blink");
    setTimeout(() => {
        display.classList.remove("blink");
    }, 200);
};