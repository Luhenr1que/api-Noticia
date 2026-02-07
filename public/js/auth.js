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

toggleBtn.onclick = () => {
    isLogin = !isLogin;
    if (isLogin) {
        formTitle.innerText = 'Login';
        submitBtn.innerText = 'Entrar';
        toggleText.innerText = 'Não tem conta?';
        toggleBtn.innerText = 'Criar conta';
        nameInput.style.display = 'none';
        confirmInput.style.display = 'none';
    } else {
        formTitle.innerText = 'Registro';
        submitBtn.innerText = 'Registrar';
        toggleText.innerText = 'Já tem conta?';
        toggleBtn.innerText = 'Fazer login';
        nameInput.style.display = 'block';
        confirmInput.style.display = 'block';
    }
};

form.onsubmit = async (e) => {
    e.preventDefault();
    msg.innerText = 'Carregando...';

    const payload = {
        email: emailInput.value,
        password: passwordInput.value
    };

    let url = `${API_BASE}/login`;

    if (!isLogin) {
        payload.name = nameInput.value;
        payload.password_confirmation = confirmInput.value;
        url = `${API_BASE}/register`;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (err) {
            msg.innerText = 'Erro: resposta da API não é JSON.';
            console.error('Resposta da API:', responseText);
            return;
        }

        if (!response.ok) {
            msg.innerText = Object.values(data.errors || { erro: data.message }).join(', ');
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user.name);
        msg.innerText = isLogin ? 'Login realizado com sucesso!' : 'Registro realizado com sucesso!';
        window.location.href = '/';
    } catch (err) {
        msg.innerText = 'Erro ao logar/registrar. Tente novamente.';
        console.error(err);
    }
};
