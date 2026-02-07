let isLogin = true;

const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleBtn = document.getElementById('toggle-btn');
const toggleText = document.getElementById('toggle-text');
const nameInput = document.getElementById('name');
const confirmInput = document.getElementById('password_confirmation');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const form = document.getElementById('auth-form');
const msg = document.getElementById('msg');

const API_BASE = 'http://127.0.0.1:8000/api';

function updateFormState() {
    if (isLogin) {
        formTitle.innerText = 'Bem-vindo de volta!';
        submitBtn.innerText = 'Entrar';
        toggleText.innerHTML = 'Não tem conta? <span id="toggle-btn" class="toggle-link">Crie uma agora</span>';
        nameInput.style.display = 'none';
        confirmInput.style.display = 'none';
        form.classList.remove('register-mode');
        form.classList.add('login-mode');
    } else {
        formTitle.innerText = 'Crie sua conta';
        submitBtn.innerText = 'Registrar';
        toggleText.innerHTML = 'Já tem conta? <span id="toggle-btn" class="toggle-link">Faça login</span>';
        nameInput.style.display = 'block';
        confirmInput.style.display = 'block';
        form.classList.remove('login-mode');
        form.classList.add('register-mode');
    }

    const newToggleBtn = document.getElementById('toggle-btn');
    if (newToggleBtn) {
        newToggleBtn.onclick = toggleAuthMode;
    }
}

function toggleAuthMode() {
    isLogin = !isLogin;
    updateFormState();
    clearErrors();
    msg.innerHTML = '';
}

function clearErrors() {
    const inputs = [nameInput, emailInput, passwordInput, confirmInput];
    inputs.forEach(input => {
        if (input) {
            input.classList.remove('error');
            const errorElement = input.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
    });
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#f44336';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '5px';
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

function validateForm(payload) {
    clearErrors();
    let isValid = true;

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        showFieldError(emailInput, 'Por favor, insira um email válido');
        isValid = false;
    }

    if (!payload.password || payload.password.length < 6) {
        showFieldError(passwordInput, 'A senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }

    if (!isLogin) {
        if (!payload.name || payload.name.trim().length < 2) {
            showFieldError(nameInput, 'O nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }

        if (!payload.password_confirmation || payload.password !== payload.password_confirmation) {
            showFieldError(confirmInput, 'As senhas não coincidem');
            isValid = false;
        }
    }

    return isValid;
}

function formatApiErrors(errors) {
    if (typeof errors === 'string') return errors;
    if (Array.isArray(errors)) return errors.join(', ');
    if (typeof errors === 'object') {
        return Object.values(errors).flat().join(', ');
    }
    return 'Ocorreu um erro desconhecido';
}

function showMessage(text, type = 'info') {
    msg.innerHTML = '';
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    msg.appendChild(messageDiv);

    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(-10px)';
    messageDiv.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
}

async function handleSubmit(e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Processando...';

    const payload = {
        email: emailInput.value.trim(),
        password: passwordInput.value
    };

    if (!isLogin) {
        payload.name = nameInput.value.trim();
        payload.password_confirmation = confirmInput.value;
    }

    if (!validateForm(payload)) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = isLogin ? 'Entrar' : 'Registrar';
        return;
    }

    const url = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`;

    try {

        showMessage('Processando sua solicitação...', 'loading');

        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {

            if (data.errors) {
                Object.keys(data.errors).forEach(key => {
                    let input;
                    switch(key) {
                        case 'name': input = nameInput; break;
                        case 'email': input = emailInput; break;
                        case 'password': input = passwordInput; break;
                        case 'password_confirmation': input = confirmInput; break;
                    }
                    if (input) {
                        showFieldError(input, data.errors[key][0]);
                    }
                });
                showMessage('Por favor, corrija os erros acima', 'error');
            } else {
                showMessage(data.message || 'Erro na autenticação', 'error');
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = isLogin ? 'Entrar' : 'Registrar';
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('name', data.user.name);

        showMessage(
            isLogin ? '🎉 Login realizado com sucesso!' : '🎉 Conta criada com sucesso!',
            'success'
        );

        setTimeout(() => {
            window.location.href = '/';
        }, 1500);

    } catch (err) {
        console.error('Erro na autenticação:', err);
        showMessage('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = isLogin ? 'Entrar' : 'Registrar';
    }
}

function checkExistingAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        
        window.location.href = '/';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    checkExistingAuth();

    toggleBtn.onclick = toggleAuthMode;

    form.onsubmit = handleSubmit;

    const inputs = [nameInput, emailInput, passwordInput, confirmInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorElement = this.nextElementSibling;
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.remove();
                }
            });
        }
    });

    document.querySelector('.auth-container').style.opacity = '0';
    document.querySelector('.auth-container').style.transform = 'translateY(20px)';
    document.querySelector('.auth-container').style.transition = 'all 0.5s ease';
    
    setTimeout(() => {
        document.querySelector('.auth-container').style.opacity = '1';
        document.querySelector('.auth-container').style.transform = 'translateY(0)';
    }, 100);

    if (isLogin) {
        emailInput.focus();
    } else {
        nameInput.focus();
    }
});

updateFormState();