const API_URL = 'http://127.0.0.1:8000/api/posts';

let currentPage = 1;

async function carregarPosts(page = 1) {
    currentPage = page;

    const category = document.getElementById('filter-category').value;
    const tag = document.getElementById('filter-tag').value.trim();
    const title = document.getElementById('filter-title').value.trim();

    const params = new URLSearchParams();
    if (category) params.append('category_id', category);
    if (tag) params.append('tag', tag);
    if (title) params.append('title', title);
    params.append('page', page);

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('Erro ao buscar posts');

        const data = await response.json();

        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '';

        data.data.forEach(post => {
            const div = document.createElement('div');
            div.classList.add('post');
                        div.onclick = async () => {
                try {
                    document.getElementById('modal-title').innerText = post.title;
                    document.getElementById('modal-content').innerText = post.content;

                    document.getElementById('noticiaModal').style.display = 'block';
                } catch (error) {
                    console.error('Erro ao carregar notícia:', error);
                    alert('Erro ao carregar a notícia.');
                }
            }
            div.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.summary}</p>
                <small>
                  Categoria: ${post.category?.name || '—'} | 
                  Autor: ${post.user?.name || '—'} | 
                  Tag: ${post.tag || '—'}
                </small>
            `;
            postsList.appendChild(div);
        });

        renderPagination(data);

    } catch (err) {
        console.error(err);
        document.getElementById('posts-list').innerText = 'Erro ao carregar posts.';
    }
}

function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (data.prev_page_url) {
        const btnPrev = document.createElement('button');
        btnPrev.innerText = 'Anterior';
        btnPrev.onclick = () => carregarPosts(currentPage - 1);
        pagination.appendChild(btnPrev);
    }

    pagination.append(` Página ${data.current_page} de ${data.last_page} `);

    if (data.next_page_url) {
        const btnNext = document.createElement('button');
        btnNext.innerText = 'Próxima';
        btnNext.onclick = () => carregarPosts(currentPage + 1);
        pagination.appendChild(btnNext);
    }
}

document.getElementById('filter-btn').onclick = () => carregarPosts(1);

carregarPosts();

function closeModal() {
    document.getElementById('noticiaModal').style.display = 'none';
}


const authLinks = document.getElementById('auth-links');
const authName = document.getElementById('auth-name');
const token = localStorage.getItem('token');

if (token) {
    const name = localStorage.getItem('name');
    authName.innerText = `Olá, ${name}`;
    authLinks.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
} else {
    authLinks.innerHTML = '<a href="/login">Login</a>';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.reload();
}

const newPostBtn = document.getElementById('new-post-btn');
const createPostModal = document.getElementById('createPostModal');
const createPostForm = document.getElementById('create-post-form');
const createPostMsg = document.getElementById('create-post-msg');

newPostBtn.onclick = () => {
    if (!token) {
        alert('Você precisa estar logado para criar uma notícia.');
        return;
    }
    createPostModal.style.display = 'block';
}

function closeCreateModal() {
    createPostModal.style.display = 'none';
    createPostForm.reset();
    createPostMsg.innerText = '';
}

createPostForm.onsubmit = async (e) => {
    e.preventDefault();
    createPostMsg.innerText = 'Enviando...';

    const payload = {
        title: document.getElementById('post-title').value.trim(),
        summary: document.getElementById('post-summary').value.trim(),
        content: document.getElementById('post-content').value.trim(),
        category_id: parseInt(document.getElementById('post-category').value),
        tag: document.getElementById('post-tag')?.value.trim() || '',
    };

    if (!payload.title || !payload.summary || !payload.content) {
        createPostMsg.innerText = 'Preencha todos os campos obrigatórios.';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload) 
        });

        const data = await response.json();

        if (!response.ok) {
            const errors = data.errors || { erro: data.message || 'Erro desconhecido' };
            createPostMsg.innerText = Object.values(errors).flat().join(', ');
            return;
        }

        createPostMsg.innerText = 'Notícia criada com sucesso!';
        closeCreateModal();
        carregarPosts();
    } catch (err) {
        console.error('Erro ao criar post:', err);
        createPostMsg.innerText = 'Erro ao criar notícia. Verifique o token ou conexão.';
    }
};

carregarPosts();
