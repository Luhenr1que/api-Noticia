<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login / Registro</title>
    <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
</head>
<body>

    <div class="auth-container">
        <h2 id="form-title">Login</h2>

        <form id="auth-form">
            <input type="text" id="name" placeholder="Nome" style="display: none;">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Senha" required>
            <input type="password" id="password_confirmation" placeholder="Confirmar senha" style="display: none;">

            <button type="submit" id="submit-btn">Entrar</button>
        </form>

        <p id="toggle-text">
            Não tem conta?
            <span id="toggle-btn">Criar conta</span>
        </p>

        <p id="msg"></p>
    </div>

    <script src="{{ asset('js/auth.js') }}"></script>
</body>
</html>
