document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        username: document.querySelector('input[name="username"]').value,
        password: document.querySelector('input[name="password"]').value
    };

    try {
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

    } catch (error) {
        alert('Login failed');
    }
});