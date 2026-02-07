<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Início | Notícias</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>

<body>

    <header>
        <h1>Portal de Notícias</h1>
        <nav>
            <span id="auth-name"></span>
            <span id="auth-links"></span>
        </nav>
    </header>

    <main>
        <section id="posts">
            <h2>Últimas notícias</h2>

            <div id="posts-list">

            </div>
        </section>
    </main>

    <div id="noticiaModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 id="modal-title"></h2>
            <p id="modal-content"></p>
        </div>
    </div>

    <button id="new-post-btn" style="margin-bottom: 16px;">+</button>

    <div id="createPostModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeCreateModal()">&times;</span>
            <h2>Criar Nova Notícia</h2>
            <form id="create-post-form">
                <input type="text" id="post-title" placeholder="Título" required
                    style="width: 100%; margin-bottom: 10px; padding: 8px;">
                <textarea id="post-summary" placeholder="Resumo" required style="width: 100%; margin-bottom: 10px; padding: 8px;"></textarea>
                <textarea id="post-content" placeholder="Conteúdo completo" required
                    style="width: 100%; margin-bottom: 10px; padding: 8px;"></textarea>
                <select id="post-category" required style="width: 100%; margin-bottom: 10px; padding: 8px;">
                    <option value="" disabled selected>Carregando categorias...</option>
                </select>
                <textarea id="post-tag" placeholder="Tag" required style="width: 100%; margin-bottom: 10px; padding: 8px;"></textarea>
                <button type="submit">Criar</button>
                <p id="create-post-msg"></p>
            </form>
        </div>
    </div>
    <div id="filters" style="margin-bottom: 20px;">
        <select id="filter-category">
            <option value="">Todas as categorias</option>
        </select>

        <input type="text" id="filter-tag" placeholder="Tag" style="margin-left: 10px;">
        <input type="text" id="filter-title" placeholder="Título" style="margin-left: 10px;">
        <button id="filter-btn">Filtrar</button>
    </div>

    <div id="posts-list"></div>

    <div id="pagination" style="margin-top: 20px;"></div>


    <footer>
        <p>© 2026 - API Notícias</p>
    </footer>

    <script src="{{ asset('js/script.js') }}"></script>
</body>

</html>
