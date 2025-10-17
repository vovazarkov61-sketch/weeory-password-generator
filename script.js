// --- КОНСТАНТЫ СИМВОЛОВ И КЛЮЧИ ---
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const FAVORITE_KEY = "WEEORY_FAVORITE_PASS"; // Ключ для LocalStorage

// --- ФУНКЦИИ ГЕНЕРАЦИИ ПАРОЛЯ (Без изменений) ---

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


// --- НОВАЯ ЛОГИКА: РАСЧЕТ НАДЕЖНОСТИ (Strength Meter) ---

function calculateStrength(password, useLower, useUpper, useDigits, useSymbols) {
    const length = password.length;
    
    // 1. Определение размера алфавита (Entropy Pool Size)
    let poolSize = 0;
    if (useLower) poolSize += 26; // a-z
    if (useUpper) poolSize += 26; // A-Z
    if (useDigits) poolSize += 10; // 0-9
    if (useSymbols) poolSize += 32; // ~32 спецсимвола

    if (poolSize === 0 || length === 0) {
        return { score: 0, status: "Ошибка", crackTime: "Нет данных" };
    }
    
    // 2. Расчет энтропии (Entropy = log2(poolSize^length))
    const entropy = length * (Math.log(poolSize) / Math.log(2));

    // 3. Расчет времени взлома (Brute Force)
    // Допущение: 1 триллион (10^12) попыток в секунду для GPU-взлома
    const attemptsPerSecond = Math.pow(10, 12); 
    const totalPossibilities = Math.pow(poolSize, length);
    const secondsToCrack = totalPossibilities / attemptsPerSecond;

    // 4. Определение времени взлома в удобном формате
    let crackTime = "Мгновенно";
    if (secondsToCrack >= 60) {
        let minutes = secondsToCrack / 60;
        if (minutes >= 60) {
            let hours = minutes / 60;
            if (hours >= 24) {
                let days = hours / 24;
                if (days >= 365.25) {
                    let years = days / 365.25;
                    crackTime = years < 1000 ? `${years.toFixed(1)} лет` : "Более 1000 лет";
                } else {
                    crackTime = `${days.toFixed(1)} дней`;
                }
            } else {
                crackTime = `${hours.toFixed(1)} часов`;
            }
        } else {
            crackTime = `${minutes.toFixed(1)} минут`;
        }
    } else if (secondsToCrack > 0.1) {
        crackTime = `${secondsToCrack.toFixed(1)} секунд`;
    }

    // 5. Определение оценки (Score) и статуса
    let score = 0;
    let status = "Очень слабый";
    let statusColor = "#ff0000"; // Красный

    if (entropy >= 128) {
        score = 100;
        status = "Отличный";
        statusColor = "#00ff00"; // Зеленый
    } else if (entropy >= 90) {
        score = 75;
        status = "Сильный";
        statusColor = "#ffff00"; // Желтый
    } else if (entropy >= 60) {
        score = 50;
        status = "Средний";
        statusColor = "#ffaa00"; // Оранжевый
    } else if (entropy >= 30) {
        score = 25;
        status = "Слабый";
        statusColor = "#ff5500"; // Темно-оранжевый
    }
    
    return { score, status, crackTime, statusColor };
}

// --- ФУНКЦИИ LOCALSTORAGE (Без изменений) ---

function loadFavoritePassword(favoriteOutput) {
    const savedPass = localStorage.getItem(FAVORITE_KEY);
    if (savedPass) {
        favoriteOutput.textContent = savedPass;
        favoriteOutput.style.color = '#ffffff';
    } else {
        favoriteOutput.textContent = "Нет сохраненного пароля";
        favoriteOutput.style.color = '#666';
    }
}


// --- ГЛАВНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ ПАРОЛЯ И ИНДИКАТОРА ---

function updatePassword(
    outputElement, lengthInput, lowerCheckbox, upperCheckbox, digitsCheckbox, symbolsCheckbox,
    strengthStatusElement, strengthBarElement, crackTimeElement
) {
    const length = parseInt(lengthInput.value);
    
    // Получаем текущие настройки для генерации и расчета
    const useLower = lowerCheckbox.checked;
    const useUpper = upperCheckbox.checked;
    const useDigits = digitsCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;

    if (length < 4) {
        outputElement.textContent = "Длина должна быть не менее 4 символов.";
        strengthStatusElement.textContent = "Слишком короткий";
        strengthStatusElement.style.color = "#ff0000";
        strengthBarElement.style.width = '0%';
        crackTimeElement.textContent = "Мгновенно";
        return;
    }

    if (!(useLower || useUpper || useDigits || useSymbols)) {
         outputElement.textContent = "Выберите хотя бы один тип символов!";
         strengthStatusElement.textContent = "Нет символов";
         strengthStatusElement.style.color = "#ff0000";
         strengthBarElement.style.width = '0%';
         crackTimeElement.textContent = "Мгновенно";
         return;
    }


    const password = generateStrongPassword(
        length,
        useLower,
        useUpper,
        useDigits,
        useSymbols
    );
    
    outputElement.textContent = password;
    
    // !!! РАСЧЕТ И ОБНОВЛЕНИЕ ИНДИКАТОРА !!!
    const strength = calculateStrength(password, useLower, useUpper, useDigits, useSymbols);
    
    strengthStatusElement.textContent = strength.status;
    strengthStatusElement.style.color = strength.statusColor;
    strengthBarElement.style.width = `${strength.score}%`;
    strengthBarElement.style.backgroundColor = strength.statusColor;
    crackTimeElement.textContent = strength.crackTime;

}

// --- ИНИЦИАЛИЗАЦИЯ (EventListener) ---

document.addEventListener('DOMContentLoaded', () => {
    // Элементы для генерации
    const outputElement = document.getElementById('password-output');
    const lengthInput = document.getElementById('length');
    const generateButton = document.getElementById('generate-button');
    const copyButton = document.getElementById('copy-button');
    const saveButton = document.getElementById('save-button'); 

    // Элементы для Избранного
    const favoriteOutput = document.getElementById('favorite-output'); 
    const copyFavoriteButton = document.getElementById('copy-favorite-button');
    const clearFavoriteButton = document.getElementById('clear-favorite-button');

    // Элементы для Индикатора Надежности
    const strengthStatusElement = document.getElementById('strength-status');
    const strengthBarElement = document.getElementById('strength-bar');
    const crackTimeElement = document.getElementById('crack-time');
    
    // Элементы управления
    const lowerCheckbox = document.getElementById('lower');
    const upperCheckbox = document.getElementById('upper');
    const digitsCheckbox = document.getElementById('digits');
    const symbolsCheckbox = document.getElementById('symbols');
    
    // --- ФУНКЦИИ ИНТЕРФЕЙСА (Без изменений) ---

    function saveCurrentPassword() {
        const currentPass = outputElement.textContent;
        if (currentPass && currentPass !== "Нажмите 'Сгенерировать'" && currentPass.length > 3) {
            localStorage.setItem(FAVORITE_KEY, currentPass);
            loadFavoritePassword(favoriteOutput); 
            alert('Пароль успешно сохранен в Избранное!');
        } else {
            alert('Сначала сгенерируйте пароль!');
        }
    }

    function clearFavoritePassword() {
        if (confirm('Вы уверены, что хотите удалить сохраненный пароль?')) {
            localStorage.removeItem(FAVORITE_KEY);
            loadFavoritePassword(favoriteOutput); 
        }
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
    
    // Привязываем функцию updatePassword ко всем изменениям!
    const elementsToWatch = [
        generateButton, lengthInput, 
        lowerCheckbox, upperCheckbox, digitsCheckbox, symbolsCheckbox
    ];
    
    elementsToWatch.forEach(element => {
        // Привязываем updatePassword к клику на кнопку, изменению длины и чекбоксам
        element.addEventListener('click', () => updatePassword(
             outputElement, lengthInput, lowerCheckbox, upperCheckbox, digitsCheckbox, symbolsCheckbox,
             strengthStatusElement, strengthBarElement, crackTimeElement
        ));
        element.addEventListener('input', () => updatePassword(
             outputElement, lengthInput, lowerCheckbox, upperCheckbox, digitsCheckbox, symbolsCheckbox,
             strengthStatusElement, strengthBarElement, crackTimeElement
        ));
    });

    copyButton.addEventListener('click', () => copyToClipboard(outputElement));
    saveButton.addEventListener('click', saveCurrentPassword); 
    clearFavoriteButton.addEventListener('click', clearFavoritePassword); 
    copyFavoriteButton.addEventListener('click', () => {
        if (favoriteOutput.textContent !== "Нет сохраненного пароля") {
            copyToClipboard(favoriteOutput);
        } else {
            alert('Сначала сохраните пароль!');
        }
    });

    // Первичная загрузка и генерация
    loadFavoritePassword(favoriteOutput); 
    
    // Первичный запуск, чтобы не было 'Ожидание...'
    updatePassword(
         outputElement, lengthInput, lowerCheckbox, upperCheckbox, digitsCheckbox, symbolsCheckbox,
         strengthStatusElement, strengthBarElement, crackTimeElement
    );
});
