document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const usernameInput = form.querySelector('input[name="username"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const errorElement = document.querySelector('.error-message') || createErrorElement(form);

    // Очищаем предыдущие ошибки
    errorElement.textContent = '';
    usernameInput.style.borderColor = '';
    passwordInput.style.borderColor = '';

    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json' // Явно указываем, что ожидаем JSON
            },
            body: new URLSearchParams({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });

        // Успешная аутентификация
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            window.location.href = 'http://localhost:8000/';
            return;
        }

        // Пытаемся прочитать ошибку как JSON
        let errorData = { detail: 'Неизвестная ошибка сервера' };
        try {
            errorData = await response.json();
        } catch (parseError) {
            console.error('Ошибка парсинга ответа:', parseError);
        }

        // Специальная обработка 401
        if (response.status === 401) {
            showError(errorElement, usernameInput, passwordInput,
                errorData.detail || 'Неверный логин или пароль');
            return;
        }

        // Остальные ошибки сервера
        showError(errorElement, usernameInput, passwordInput,
            `Ошибка сервера: ${errorData.detail || response.statusText}`);

    } catch (error) {
        console.error('Сетевая ошибка:', error);
        showError(errorElement, usernameInput, passwordInput,
            'Сервер недоступен. Проверьте подключение к интернету.');
    }
});

// Создаем элемент для ошибок если его нет
function createErrorElement(form) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    form.appendChild(errorElement);
    return errorElement;
}

// Универсальная функция показа ошибок
function showError(errorElement, usernameInput, passwordInput, message) {
    errorElement.textContent = message;
    usernameInput.style.borderColor = 'red';
    passwordInput.style.borderColor = 'red';
    passwordInput.value = ''; // Очищаем пароль при ошибке

    // Фокусируемся на поле с ошибкой
    if (message.includes('логин')) {
        usernameInput.focus();
    } else {
        passwordInput.focus();
    }
}