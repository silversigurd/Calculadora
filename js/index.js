function appendToDisplay(value) {
    const display = document.getElementById("display");
    
    // Si el último resultado fue un error, reiniciar la calculadora
    if (display.value === "Error") {
        // Si se presiona un número, reemplazar completamente el error
        if (!isNaN(parseInt(value)) || value === ',') {
            display.value = value === '0' ? '0' : value;
            return;
        }
        // Si se presiona un operador, comenzar con 0
        if (['+', '-', '*', '/'].includes(value)) {
            display.value = '0' + value;
            return;
        }
    }

    // Initial state handling
    if (display.value === "0") {
        if (value === '0') {
            return; // Prevenir múltiples ceros iniciales
        }
        
        // Si es un operador, añadir 0 primero
        if (['+', '-', '*', '/'].includes(value)) {
            display.value = '0' + value;
            return;
        }
        
        // Si es un número o coma, reemplazar el 0
        display.value = value === ',' ? '0,' : value;
        return;
    }

    // Validate input before adding
    if (!validateInput(display.value, value)) {
        return;
    }

    // Replace comma with proper decimal separator
    display.value += value;
}

// Función para manejar eventos de teclado
function handleKeyboardInput(event) {
    const display = document.getElementById("display");
    const key = event.key;

    // Prevenir comportamiento por defecto para ciertas teclas
    event.preventDefault();

    // Mapeo de teclas
    const keyMappings = {
        // Números
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', 
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        
        // Operadores
        '+': '+', '-': '-', '*': '*', '/': '/',
        
        // Decimal
        '.': ',', ',': ',',
        
        // Teclas especiales
        'Backspace': 'delete',
        'Delete': 'delete',
        'Enter': 'calculate',
        'Escape': 'clear'
    };

    // Numpad mappings
    const numpadMappings = {
        'Numpad0': '0', 'Numpad1': '1', 'Numpad2': '2', 'Numpad3': '3', 
        'Numpad4': '4', 'Numpad5': '5', 'Numpad6': '6', 'Numpad7': '7', 
        'Numpad8': '8', 'Numpad9': '9',
        'NumpadAdd': '+', 'NumpadSubtract': '-', 
        'NumpadMultiply': '*', 'NumpadDivide': '/',
        'NumpadDecimal': ',', 
        'NumpadEnter': 'calculate'
    };

    // Determinar qué tecla se presionó
    let mappedKey = keyMappings[key] || numpadMappings[key];

    // Manejar diferentes tipos de entrada
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
                // Para números, operadores y coma
                if (!isNaN(mappedKey) || 
                    ['+', '-', '*', '/', ','].includes(mappedKey)) {
                    appendToDisplay(mappedKey);
                }
        }
    }
}

// Función para borrar último carácter
function deleteLastCharacter() {
    const display = document.getElementById("display");
    
    // Si está en estado de error, reiniciar a "0"
    if (display.value === "Error") {
        display.value = "0";
        return;
    }
    
    display.value = display.value.length > 1 
        ? display.value.slice(0, -1) 
        : "0";
}

// Agregar event listener para eventos de teclado
document.addEventListener('keydown', handleKeyboardInput);

// Resto de las funciones anteriores (calculate, validateInput, etc.) permanecen igual
function validateInput(currentValue, newValue) {
    const operators = ['+', '-', '*', '/'];
    const lastChar = currentValue.slice(-1);

    // Prevent multiple consecutive operators
    if (operators.includes(newValue) && operators.includes(lastChar)) {
        return false;
    }

    // Prevent starting with an operator except minus for negative numbers
    if (currentValue === '' && operators.includes(newValue) && newValue !== '-') {
        return false;
    }

    // Prevent multiple decimal separators in one number
    if (newValue === ',' && currentValue.split(/[-+*/]/).pop().includes(',')) {
        return false;
    }

    return true;
}

function calculate() {
    const display = document.getElementById("display");
    
    try {
        // Si ya está en estado de error, no hacer nada
        if (display.value === "Error") {
            return;
        }
        
        // Replace comma with dot and remove leading zeros
        let expression = display.value.replace(/,/g, '.');
        
        // Manejar específicamente el caso de 0/0
        if (expression === '0/0') {
            display.value = "Error";
            return;
        }
        
        // Manejar el caso de 0/número
        if (expression.startsWith('0/')) {
            display.value = "0";
            return;
        }
        
        // Prevent eval security issues and handle edge cases
        const safeExpression = expression.replace(/[^-()\d/*+.]/g, '');
        
        // Prevent division by zero
        if (safeExpression.includes('/0') && !safeExpression.startsWith('0/')) {
            throw new Error('Division by zero');
        }

        // Use Function constructor for safer evaluation
        const result = new Function('return ' + safeExpression)();
        
        // Format result, limiting decimal places
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
// Inicializar display al cargar la página
window.onload = function() {
    const display = document.getElementById("display");
    display.value = "0";
    display.classList.add("blink");
    setTimeout(() => {
        display.classList.remove("blink");
    }, 200);
};