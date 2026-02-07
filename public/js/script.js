
const API_BASE_URL = 'http://127.0.0.1:8000/api';
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

async function loadCategories() {
    try {
        const response = await fetch(CATEGORIES_URL);
        if (!response.ok) throw new Error('Erro ao carregar categorias');
        
        categories = await response.json();
        updateCategoryFilters();
        updateCreatePostCategories();
    } catch (err) {
        console.error('Erro ao carregar categorias:', err);
    }
}

function updateCategoryFilters() {
    const filterCategory = document.getElementById('filter-category');
    if (!filterCategory) return;
    
    filterCategory.innerHTML = '<option value="">Todas as categorias</option>';
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
    
    postCategory.innerHTML = '<option value="" disabled selected>Selecione uma categoria</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        postCategory.appendChild(option);
    });
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const authLinks = document.getElementById('auth-links');
    const authName = document.getElementById('auth-name');
    const newPostBtn = document.getElementById('new-post-btn');
    
    if (token && authLinks && authName) {
        const name = localStorage.getItem('name');
        authName.textContent = `Olá, ${name}`;
        authLinks.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
        
        if (newPostBtn) {
            newPostBtn.style.display = 'block';
        }
    } else {
        if (authLinks) {
            authLinks.innerHTML = '<a href="/login">Login</a>';
        }
        if (authName) {
            authName.textContent = '';
        }
        if (newPostBtn) {
            newPostBtn.style.display = 'none';
        }
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
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }
    } catch (err) {
        console.error('Erro no logout:', err);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        window.location.reload();
    }
}

function setupEventListeners() {

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.onclick = () => loadPosts(1);
    }

    ['filter-category', 'filter-tag', 'filter-title'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loadPosts(1);
            });
        }
    });

    const newPostBtn = document.getElementById('new-post-btn');
    if (newPostBtn) {
        newPostBtn.onclick = showCreatePostModal;
    }

    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.onsubmit = handleCreatePost;
    }

    window.closeModal = closeModal;
    window.closeCreateModal = closeCreateModal;
}

async function loadPosts(page = 1) {
    currentPage = page;

    const category = document.getElementById('filter-category')?.value || '';
    const tag = document.getElementById('filter-tag')?.value.trim() || '';
    const title = document.getElementById('filter-title')?.value.trim() || '';

    const params = new URLSearchParams();
    if (category) params.append('category_id', category);
    if (tag) params.append('tag', tag);
    if (title) params.append('title', title);
    params.append('page', page);

    try {
        const response = await fetch(`${POSTS_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('Erro ao buscar posts');

        const data = await response.json();
        renderPosts(data.data);
        renderPagination(data);
    } catch (err) {
        console.error(err);
        const postsList = document.getElementById('posts-list');
        if (postsList) {
            postsList.innerHTML = '<div class="error">Erro ao carregar posts.</div>';
        }
    }
}

function renderPosts(posts) {
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;
    
    postsList.innerHTML = '';

    if (posts.length === 0) {
        postsList.innerHTML = '<div class="no-posts">Nenhum post encontrado.</div>';
        return;
    }

    posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.onclick = () => showPostDetail(post);
        
        div.innerHTML = `
            <div class="post-header">
                <h3>${post.title}</h3>
                ${isCurrentUserPost(post) ? `
                    <div class="post-actions">
                        <button class="btn-edit" onclick="editPost(${post.id}, event)">Editar</button>
                        <button class="btn-delete" onclick="deletePost(${post.id}, event)">Excluir</button>
                    </div>
                ` : ''}
            </div>
            <p class="post-summary">${post.summary}</p>
            <div class="post-meta">
                <span class="category">${post.category?.name || '—'}</span>
                <span class="author">${post.user?.name || '—'}</span>
                <span class="tag">${post.tag || '—'}</span>
                <span class="date">${formatDate(post.created_at)}</span>
            </div>
        `;
        
        postsList.appendChild(div);
    });
}

function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';

    if (data.last_page <= 1) return;

    if (data.current_page > 1) {
        const prevBtn = createPaginationButton('Anterior', () => loadPosts(data.current_page - 1));
        prevBtn.className = 'pagination-btn prev';
        pagination.appendChild(prevBtn);
    }

    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Página ${data.current_page} de ${data.last_page}`;
    pagination.appendChild(pageInfo);

    if (data.current_page < data.last_page) {
        const nextBtn = createPaginationButton('Próxima', () => loadPosts(data.current_page + 1));
        nextBtn.className = 'pagination-btn next';
        pagination.appendChild(nextBtn);
    }
}

function createPaginationButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    return button;
}

function isCurrentUserPost(post) {
    const currentUserId = localStorage.getItem('user_id');
    return currentUserId && post.user_id == currentUserId;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showPostDetail(post) {
    const modal = document.getElementById('noticiaModal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    if (modal && modalTitle && modalContent) {
        modalTitle.textContent = post.title;
        modalContent.innerHTML = `
            <div class="post-detail">
                <div class="post-meta">
                    <span><strong>Categoria:</strong> ${post.category?.name || '—'}</span>
                    <span><strong>Autor:</strong> ${post.user?.name || '—'}</span>
                    <span><strong>Tag:</strong> ${post.tag || '—'}</span>
                    <span><strong>Data:</strong> ${formatDate(post.created_at)}</span>
                </div>
                <div class="post-summary">
                    <h4>Resumo:</h4>
                    <p>${post.summary}</p>
                </div>
                <div class="post-content">
                    <h4>Conteúdo:</h4>
                    <p>${post.content}</p>
                </div>
                ${isCurrentUserPost(post) ? `
                    <div class="post-actions-detail">
                        <button class="btn-edit" onclick="editPost(${post.id})">Editar</button>
                        <button class="btn-delete" onclick="deletePost(${post.id})">Excluir</button>
                    </div>
                ` : ''}
            </div>
        `;
        modal.style.display = 'block';
    }
}

function showCreatePostModal() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para criar uma notícia.');
        window.location.href = '/login';
        return;
    }
    
    const modal = document.getElementById('createPostModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('noticiaModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeCreateModal() {
    const modal = document.getElementById('createPostModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('create-post-form');
        if (form) form.reset();
        const msg = document.getElementById('create-post-msg');
        if (msg) msg.textContent = '';
    }
}

async function handleCreatePost(e) {
    e.preventDefault();
    
    const msgElement = document.getElementById('create-post-msg');
    if (!msgElement) return;
    
    msgElement.textContent = 'Enviando...';
    msgElement.className = 'message loading';

    const formData = {
        title: document.getElementById('post-title')?.value.trim() || '',
        summary: document.getElementById('post-summary')?.value.trim() || '',
        content: document.getElementById('post-content')?.value.trim() || '',
        category_id: document.getElementById('post-category')?.value || '',
        tag: document.getElementById('post-tag')?.value.trim() || '',
    };

    if (!formData.title || !formData.summary || !formData.content || !formData.category_id) {
        msgElement.textContent = 'Preencha todos os campos obrigatórios.';
        msgElement.className = 'message error';
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        msgElement.textContent = 'Sessão expirada. Faça login novamente.';
        msgElement.className = 'message error';
        return;
    }

    try {
        const response = await fetch(POSTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || Object.values(data.errors || {}).flat().join(', '));
        }

        msgElement.textContent = 'Notícia criada com sucesso!';
        msgElement.className = 'message success';
        
        setTimeout(() => {
            closeCreateModal();
            loadPosts();
        }, 1500);
    } catch (err) {
        console.error('Erro ao criar post:', err);
        msgElement.textContent = err.message || 'Erro ao criar notícia. Tente novamente.';
        msgElement.className = 'message error';
    }
}

async function editPost(postId, event = null) {
    if (event) event.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        return;
    }
    try {
        const response = await fetch(`${POSTS_URL}/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do post');
        }
        const post = await response.json();
        showCreatePostModal();
        const modalTitle = document.getElementById('post-title');
        if (modalTitle) {
            modalTitle.value = post.title;
        }
        const postSummary = document.getElementById('post-summary');
        if (postSummary) {
            postSummary.value = post.summary;
        }
        const postContent = document.getElementById('post-content');
        if (postContent) {
            postContent.value = post.content;
        }
        const postCategory = document.getElementById('post-category');
        if (postCategory) {
            postCategory.value = post.category_id;
        }
        const postTag = document.getElementById('post-tag');
        if (postTag) {
            postTag.value = post.tag;
        }
        const createForm = document.getElementById('create-post-form');
        if (createForm) {
            createForm.onsubmit = async (e) => {
                e.preventDefault();
                const msgElement = document.getElementById('create-post-msg');
                if (!msgElement) return;
                const formData = {
                    title: document.getElementById('post-title')?.value.trim() || '',
                    summary: document.getElementById('post-summary')?.value.trim() || '',
                    content: document.getElementById('post-content')?.value.trim() || '',
                    category_id: document.getElementById('post-category')?.value || '',
                    tag: document.getElementById('post-tag')?.value.trim() || '',
                };

                if (!formData.title || !formData.summary || !formData.content || !formData.category_id) {
                    msgElement.textContent = 'Preencha todos os campos obrigatórios.';
                    msgElement.className = 'message error';
                    return;
                }

                try {
                    const response = await fetch(`${POSTS_URL}/${postId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || Object.values(data.errors || {}).flat().join(', '));
                    }

                    msgElement.textContent = 'Notícia atualizada com sucesso!';
                    msgElement.className = 'message success';
                    
                    setTimeout(() => {
                        closeCreateModal();
                        loadPosts();
                    }, 1500);
                } catch (err) {
                    console.error('Erro ao atualizar post:', err);
                    msgElement.textContent = err.message || 'Erro ao atualizar notícia. Tente novamente.';
                    msgElement.className = 'message error';
                }
            };
        }
    } catch (err) {
        console.error('Erro ao buscar dados do post:', err);
        alert('Erro ao buscar dados do post. Tente novamente.');
    }
}

async function deletePost(postId, event = null) {
    if (event) event.stopPropagation();
    
    if (!confirm('Tem certeza que deseja excluir este post?')) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        return;
    }

    try {
        const response = await fetch(`${POSTS_URL}/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir post');
        }

        alert('Post excluído com sucesso!');
        loadPosts();
        closeModal();
    } catch (err) {
        console.error('Erro ao excluir post:', err);
        alert('Erro ao excluir post. Tente novamente.');
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('noticiaModal');
    const createModal = document.getElementById('createPostModal');
    
    if (modal && event.target === modal) {
        closeModal();
    }
    if (createModal && event.target === createModal) {
        closeCreateModal();
    }
}

async function loadCategories() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/categories');
        if (!response.ok) throw new Error('Erro na API');
        
        const data = await response.json();
        
        let categoriesArray = [];
        if (Array.isArray(data)) {
            categoriesArray = data;
        } else if (typeof data === 'object') {

            categoriesArray = Object.entries(data).map(([id, name]) => ({
                id: Number(id),
                name: name
            }));
        }
        
        const filterSelect = document.getElementById('filter-category');
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">Todas</option>';
            categoriesArray.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                filterSelect.appendChild(option);
            });
        }
        
        const createSelect = document.getElementById('post-category');
        if (createSelect) {
            createSelect.innerHTML = '<option value="" disabled selected>Categoria</option>';
            categoriesArray.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                createSelect.appendChild(option);
            });
        }
        
    } catch (err) {
        console.error('Erro ao carregar categorias:', err);
    }
}


window.carregarPosts = loadPosts;
window.logout = logout;
window.editPost = editPost;
window.deletePost = deletePost;