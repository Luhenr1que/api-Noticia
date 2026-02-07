# Portal de Notícias - API Laravel

Projeto de um **Portal de Notícias** com backend em **Laravel** e frontend simples em **Blade + JavaScript**, desenvolvido como teste técnico para vaga de **Desenvolvedor Back-End + API**.

O projeto permite:
- Cadastro, login e logout de usuários (via Laravel Sanctum)
- Criação, edição e exclusão de postagens (somente pelo autor)
- Listagem de posts com filtros (categoria, tag, título) e paginação
- Front-end funcional para interação com a API
- Comando Artisan para alterar título de todas as postagens
- Seeders para popular usuários, categorias e posts

---

## Tecnologias Utilizadas

- PHP 8.x
- Laravel 10.x
- Laravel Sanctum (autenticação via token Bearer)
- MySQL
- Blade + Vanilla JavaScript
- HTML5 e CSS3

---

## Funcionalidades

### 1. Autenticação

- Registro de usuário: `POST /api/register`
- Login: `POST /api/login` → retorna token Bearer
- Logout: `POST /api/logout` → revoga token

### 2. Postagens

- **Criar post**: `POST /api/posts` → requer autenticação
- **Listar posts**: `GET /api/posts` → com filtros e paginação
- **Visualizar post**: `GET /api/posts/{id}`
- **Editar post**: `PUT /api/posts/{id}` → apenas autor
- **Deletar post**: `DELETE /api/posts/{id}` → apenas autor

### 3. Filtros e Paginação

- Filtrar por:
  - Categoria (`category_id`)
  - Tag (`tag`)
  - Título (`title`)
- Paginação automática: `?page=2`

### 4. Command Artisan

- Alterar título de todas as postagens:

```bash
php artisan posts:update-title "novo título"
```
##
# Instruções de execução

## 1. Intalação

- Clonar o repositório.
- Instalar dependências (composer install).

## 2. Configuração

- Copiar .env.example para .env.

- Configurar banco de dados, e-mail e outras variáveis no .env.

- Gerar a chave do Laravel (php artisan key:generate).

## 3. Banco de Dados

- Rodar migrations (php artisan migrate) para criar tabelas.

- Rodar seeders (php artisan db:seed) para popular dados iniciais.

## 4. Executar Projeto

- Iniciar o servidor (php artisan serve).

- Abrir no navegador (http://127.0.0.1:8000).




