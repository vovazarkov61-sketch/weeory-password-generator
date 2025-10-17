// --- Логика Генератора Паролей на JavaScript ---

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generateStrongPassword(length, useLower, useUpper, useDigits, useSymbols) {
    let availableChars = "";
    let password = [];

    // 1. Собираем пул символов
    if (useLower) availableChars += LOWER;
    if (useUpper) availableChars += UPPER;
    if (useDigits) availableChars += DIGITS;
    if (useSymbols) availableChars += SYMBOLS;

    if (availableChars.length === 0) {
        return "Ошибка: Выберите хотя бы один тип символов!";
    }

    // 2. Гарантируем наличие хотя бы одного символа каждого выбранного типа
    if (useLower) password.push(LOWER[Math.floor(Math.random() * LOWER.length)]);
    if (useUpper) password.push(UPPER[Math.floor(Math.random() * UPPER.length)]);
    if (useDigits) password.push(DIGITS[Math.floor(Math.random() * DIGITS.length)]);
    if (useSymbols) password.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

    // 3. Заполняем оставшуюся часть пароля
    let remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
        password.push(availableChars[Math.floor(Math.random() * availableChars.length)]);
    }

    // 4. Перемешиваем массив (Shuffle)
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
}


// --- Обработка интерфейса (DOM) ---

document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById('password-output');
    const lengthInput = document.getElementById('length');
    const generateButton = document.getElementById('generate-button');
    const copyButton = document.getElementById('copy-button');
    
    // Элементы управления
    const lowerCheckbox = document.getElementById('lower');
    const upperCheckbox = document.getElementById('upper');
    const digitsCheckbox = document.getElementById('digits');
    const symbolsCheckbox = document.getElementById('symbols');

    function updatePassword() {
        const length = parseInt(lengthInput.value);
        
        // Минимальная длина
        if (length < 4) {
            outputElement.textContent = "Длина должна быть не менее 4 символов.";
            return;
        }

        const password = generateStrongPassword(
            length,
            lowerCheckbox.checked,
            upperCheckbox.checked,
            digitsCheckbox.checked,
            symbolsCheckbox.checked
        );
        
        outputElement.textContent = password;
    }

    function copyToClipboard() {
        // Копирование текста из элемента
        navigator.clipboard.writeText(outputElement.textContent)
            .then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Скопировано!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                alert('Ошибка копирования: ' + err);
            });
    }

    // Привязка событий
    generateButton.addEventListener('click', updatePassword);
    copyButton.addEventListener('click', copyToClipboard);

    // Первичная генерация при загрузке
    updatePassword(); 
});
