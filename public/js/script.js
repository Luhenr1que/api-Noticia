// 🔥 BASE DINÂMICA (FUNCIONA EM PRODUÇÃO E LOCAL)
const API_BASE_URL = window.location.origin + '/api';

const POSTS_URL = `${API_BASE_URL}/posts`;
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const AUTH_URL = `${API_BASE_URL}/auth`;

let currentPage = 1;
let categories = [];

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    await loadCategories();
    checkAuth();
    setupEventListeners();
    loadPosts();
}

// ================= CATEGORIAS =================
async function loadCategories() {
    try {
        const response = await fetch(CATEGORIES_URL);
        if (!response.ok) throw new Error('Erro ao carregar categorias');
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
            categories = data;
        } else if (typeof data === 'object') {
            categories = Object.entries(data).map(([id, name]) => ({
                id: Number(id),
                name: name
            }));
        }

        updateCategoryFilters();
        updateCreatePostCategories();
    } catch (err) {
        console.error('Erro ao carregar categorias:', err);
    }
}

function updateCategoryFilters() {
    const filterCategory = document.getElementById('filter-category');
    if (!filterCategory) return;
    
    filterCategory.innerHTML = '<option value="">Todas</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        filterCategory.appendChild(option);
    });
}

function updateCreatePostCategories() {
    const postCategory = document.getElementById('post-category');
    if (!postCategory) return;
    
    postCategory.innerHTML = '<option value="" disabled selected>Selecione</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        postCategory.appendChild(option);
    });
}

// ================= AUTH =================
function checkAuth() {
    const token = localStorage.getItem('token');
    const authLinks = document.getElementById('auth-links');
    const authName = document.getElementById('auth-name');
    const newPostBtn = document.getElementById('new-post-btn');
    
    if (token) {
        const name = localStorage.getItem('name');
        if (authName) authName.textContent = `Olá, ${name}`;
        if (authLinks) authLinks.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
        if (newPostBtn) newPostBtn.style.display = 'block';
    } else {
        if (authLinks) authLinks.innerHTML = '<a href="/login">Login</a>';
        if (authName) authName.textContent = '';
        if (newPostBtn) newPostBtn.style.display = 'none';
    }
}

async function logout() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await fetch(`${AUTH_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
        }
    } catch (err) {
        console.error(err);
    } finally {
        localStorage.clear();
        window.location.reload();
    }
}

// ================= EVENTOS =================
function setupEventListeners() {
    document.getElementById('filter-btn')?.addEventListener('click', () => loadPosts(1));

    ['filter-category', 'filter-tag', 'filter-title'].forEach(id => {
        document.getElementById(id)?.addEventListener('keypress', e => {
            if (e.key === 'Enter') loadPosts(1);
        });
    });

    document.getElementById('new-post-btn')?.addEventListener('click', showCreatePostModal);
    document.getElementById('create-post-form')?.addEventListener('submit', handleCreatePost);

    window.closeModal = closeModal;
    window.closeCreateModal = closeCreateModal;
}

// ================= POSTS =================
async function loadPosts(page = 1) {
    currentPage = page;

    const params = new URLSearchParams({
        category_id: document.getElementById('filter-category')?.value || '',
        tag: document.getElementById('filter-tag')?.value || '',
        title: document.getElementById('filter-title')?.value || '',
        page
    });

    try {
        const response = await fetch(`${POSTS_URL}?${params}`);
        if (!response.ok) throw new Error('Erro ao buscar posts');

        const data = await response.json();
        renderPosts(data.data);
        renderPagination(data);
    } catch (err) {
        console.error(err);
        document.getElementById('posts-list').innerHTML = 'Erro ao carregar posts';
    }
}

function renderPosts(posts) {
    const container = document.getElementById('posts-list');
    container.innerHTML = '';

    if (!posts.length) {
        container.innerHTML = 'Nenhum post encontrado';
        return;
    }

    posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.onclick = () => showPostDetail(post);

        div.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
            <small>${post.category?.name || ''} • ${post.user?.name || ''}</small>
        `;

        container.appendChild(div);
    });
}

// ================= PAGINAÇÃO =================
function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (data.current_page > 1) {
        pagination.appendChild(createBtn('Anterior', () => loadPosts(data.current_page - 1)));
    }

    const info = document.createElement('span');
    info.textContent = `Página ${data.current_page} de ${data.last_page}`;
    pagination.appendChild(info);

    if (data.current_page < data.last_page) {
        pagination.appendChild(createBtn('Próxima', () => loadPosts(data.current_page + 1)));
    }
}

function createBtn(text, fn) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.onclick = fn;
    return btn;
}

// ================= MODAL =================
function showPostDetail(post) {
    const modal = document.getElementById('noticiaModal');
    document.getElementById('modal-title').textContent = post.title;
    document.getElementById('modal-content').innerHTML = `
        <p>${post.content}</p>
    `;
    modal.style.display = 'block';
}

function showCreatePostModal() {
    if (!localStorage.getItem('token')) {
        alert('Faça login');
        return;
    }
    document.getElementById('createPostModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('noticiaModal').style.display = 'none';
}

function closeCreateModal() {
    document.getElementById('createPostModal').style.display = 'none';
}

// ================= CRIAR POST =================
async function handleCreatePost(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const data = {
        title: document.getElementById('post-title').value,
        summary: document.getElementById('post-summary').value,
        content: document.getElementById('post-content').value,
        category_id: document.getElementById('post-category').value,
        tag: document.getElementById('post-tag').value,
    };

    try {
        const res = await fetch(POSTS_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Erro');

        alert('Criado!');
        closeCreateModal();
        loadPosts();
    } catch (err) {
        alert('Erro ao criar');
    }
}

// ================= GLOBAL =================
window.logout = logout;
window.editPost = () => {};
window.deletePost = () => {};