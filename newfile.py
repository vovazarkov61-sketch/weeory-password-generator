import random
import string
import sys
import os

# Попытка импорта pyfiglet, необходимого для ASCII-арта
try:
    import pyfiglet
except ImportError:
    pyfiglet = None

# Ваше секретное слово
SECRET_WORD = "WEEORY"

# --- 1. ASCII-арт заголовок ---
def display_ascii_banner(text="JARKOVPASS", font="big", color="\033[95m", reset_color="\033[0m"):
    """
    Выводит заданный текст в виде ASCII-арта.
    Изменен шрифт на "big" для более жирного вида.
    """
    if pyfiglet:
        try:
            # Генерируем ASCII-арт
            ascii_art = pyfiglet.figlet_format(text, font=font)
            # Выводим с цветом, если поддерживается терминалом
            print(f"\n{color}{ascii_art}{reset_color}")
            print("=" * 50)
        except Exception:
            # Если шрифт не найден или другая ошибка pyfiglet
            print(f"\n[{text}] — ASCII-арт")
            print("=" * 50)
    else:
        # Если pyfiglet не установлен
        print("\n" + text.center(50, ' '))
        print("=" * 50)
        print("[ВНИМАНИЕ] Установите 'pyfiglet' через PIP для красивого заголовка!")
        print("=" * 50)


# --- 2. Логика генератора паролей ---
def generate_strong_password(length=12, use_lower=True, use_upper=True, use_digits=True, use_symbols=True):
    """
    Генерирует сильный пароль с заданными параметрами.
    """
    
    available_chars = ""
    custom_symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?" # Набор спецсимволов
    
    if use_lower:
        available_chars += string.ascii_lowercase
    if use_upper:
        available_chars += string.ascii_uppercase
    if use_digits:
        available_chars += string.digits
    if use_symbols:
        available_chars += custom_symbols
    
    # Проверка на пустой пул символов
    if not available_chars:
        return "Ошибка: Не выбран ни один тип символов."

    # Проверка длины
    if length < 4:
        length = 8
        print("\n[Внимание] Длина пароля установлена в 8 (минимум 4).")
    
    password = []
    
    # Гарантируем, что в пароле будет хотя бы один символ каждого выбранного типа
    if use_lower:
        password.append(random.choice(string.ascii_lowercase))
    if use_upper:
        password.append(random.choice(string.ascii_uppercase))
    if use_digits:
        password.append(random.choice(string.digits))
    if use_symbols:
        password.append(random.choice(custom_symbols))
        
    # Заполняем оставшуюся часть пароля
    remaining_length = length - len(password)
    
    if remaining_length > 0:
        password.extend(random.choices(available_chars, k=remaining_length))
        
    # Перемешиваем символы
    random.shuffle(password)
    
    return "".join(password)


# --- 3. Интерактивная часть ---

def get_yes_no_input(prompt, default='y'):
    """Обрабатывает ввод да/нет."""
    while True:
        response = input(f"{prompt} (y/n, по умолчанию {default}): ")
        if not response:
            response = default
        response = response.lower().strip()
        
        if response in ['y', 'yes']:
            return True
        elif response in ['n', 'no']:
            return False
        else:
            print("Пожалуйста, введите 'y' или 'n'.")

def run_interactive_generator():
    """Запускает генератор в интерактивном режиме."""
    print("\n--- Интерактивная настройка ---")
    
    # 1. Длина
    while True:
        try:
            user_input = input("Введите желаемую длину пароля (по умолчанию 12): ")
            length = int(user_input) if user_input else 12
            
            if length < 1:
                 print("Введите положительное число.")
                 continue
            break
        except ValueError:
            print("Неверный ввод. Пожалуйста, введите число.")
            
    # 2. Выбор символов 
    use_lower = get_yes_no_input("Включать маленькие буквы?")
    use_upper = get_yes_no_input("Включать заглавные буквы?")
    use_digits = get_yes_no_input("Включать цифры?")
    # Вставляем секретное слово
    use_symbols = get_yes_no_input(f"Включать спец. символы? (Секретное слово: {SECRET_WORD})")
    
    if not (use_lower or use_upper or use_digits or use_symbols):
        print("\n[Ошибка] Вы должны выбрать хотя бы один тип символов. Скрипт остановлен.")
        sys.exit()
    
    # 3. Генерируем
    password = generate_strong_password(
        length, 
        use_lower, 
        use_upper, 
        use_digits, 
        use_symbols
    )
    
    # 4. Выводим результат
    print("\n------------------------------")
    print(f"Сгенерированный пароль ({len(password)} символов):")
    print(f"** {password} **")
    print("------------------------------")

# --- Точка входа в скрипт ---
if __name__ == "__main__":
    # 1. Выводим ASCII-арт WEEORY
    # Изменен шрифт на "big"
    display_ascii_banner("JARKOVPASS", font="big") 
    
    # 2. Запускаем генератор паролей
    run_interactive_generator()
