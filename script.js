// --- Логика Генератора Паролей на JavaScript (БЕЗ ИЗМЕНЕНИЙ) ---

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const FAVORITE_KEY = "WEEORY_FAVORITE_PASS"; // Ключ для LocalStorage

function generateStrongPassword(length, useLower, useUpper, useDigits, useSymbols) {
    let availableChars = "";
    let password = [];

    if (useLower) availableChars += LOWER;
    if (useUpper) availableChars += UPPER;
    if (useDigits) availableChars += DIGITS;
    if (useSymbols) availableChars += SYMBOLS;

    if (availableChars.length === 0) {
        return "Ошибка: Выберите хотя бы один тип символов!";
    }

    if (useLower) password.push(LOWER[Math.floor(Math.random() * LOWER.length)]);
    if (useUpper) password.push(UPPER[Math.floor(Math.random() * UPPER.length)]);
    if (useDigits) password.push(DIGITS[Math.floor(Math.random() * DIGITS.length)]);
    if (useSymbols) password.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

    let remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
        password.push(availableChars[Math.floor(Math.random() * availableChars.length)]);
    }

    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
}


// --- НОВАЯ ЛОГИКА: LocalStorage и Интерфейс ---

document.addEventListener('DOMContentLoaded', () => {
    // Элементы для генерации
    const outputElement = document.getElementById('password-output');
    const lengthInput = document.getElementById('length');
    const generateButton = document.getElementById('generate-button');
    const copyButton = document.getElementById('copy-button');
    const saveButton = document.getElementById('save-button'); // НОВАЯ КНОПКА

    // Элементы для Избранного
    const favoriteOutput = document.getElementById('favorite-output'); // НОВЫЙ ВЫВОД
    const copyFavoriteButton = document.getElementById('copy-favorite-button');
    const clearFavoriteButton = document.getElementById('clear-favorite-button');

    // Элементы управления
    const lowerCheckbox = document.getElementById('lower');
    const upperCheckbox = document.getElementById('upper');
    const digitsCheckbox = document.getElementById('digits');
    const symbolsCheckbox = document.getElementById('symbols');

    
    // --- ФУНКЦИИ LOCALSTORAGE ---

    function loadFavoritePassword() {
        const savedPass = localStorage.getItem(FAVORITE_KEY);
        if (savedPass) {
            favoriteOutput.textContent = savedPass;
            favoriteOutput.style.color = '#ffffff'; // Делаем цвет белым, если пароль есть
        } else {
            favoriteOutput.textContent = "Нет сохраненного пароля";
            favoriteOutput.style.color = '#666';
        }
    }

    function saveCurrentPassword() {
        const currentPass = outputElement.textContent;
        if (currentPass && currentPass !== "Нажмите 'Сгенерировать'") {
            localStorage.setItem(FAVORITE_KEY, currentPass);
            loadFavoritePassword(); // Обновляем вывод избранного
            alert('Пароль успешно сохранен в Избранное!');
        } else {
            alert('Сначала сгенерируйте пароль!');
        }
    }

    function clearFavoritePassword() {
        if (confirm('Вы уверены, что хотите удалить сохраненный пароль?')) {
            localStorage.removeItem(FAVORITE_KEY);
            loadFavoritePassword(); // Обновляем вывод избранного
        }
    }

    // --- ФУНКЦИИ ИНТЕРФЕЙСА ---

    function updatePassword() {
        const length = parseInt(lengthInput.value);
        
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

    function copyToClipboard(element) {
        const textToCopy = element.textContent;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const button = (element === outputElement) ? copyButton : copyFavoriteButton;
                const originalText = button.textContent;
                button.textContent = 'Скопировано!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                alert('Ошибка копирования: проверьте настройки браузера.');
            });
    }

    // --- ПРИВЯЗКА СОБЫТИЙ ---
    
    // События для генерации
    generateButton.addEventListener('click', updatePassword);
    copyButton.addEventListener('click', () => copyToClipboard(outputElement));
    
    // События для Избранного
    saveButton.addEventListener('click', saveCurrentPassword); // Сохранить текущий
    clearFavoriteButton.addEventListener('click', clearFavoritePassword); // Удалить избранное
    copyFavoriteButton.addEventListener('click', () => {
        if (favoriteOutput.textContent !== "Нет сохраненного пароля") {
            copyToClipboard(favoriteOutput);
        } else {
            alert('Сначала сохраните пароль!');
        }
    });

    // Первичная загрузка и генерация
    loadFavoritePassword(); // Загрузить сохраненный пароль при запуске
    updatePassword(); 
});
