<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class SeederController extends Controller
{
    /**
     * Seed users
     */
    public function seedUsers()
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
        ]);

        $users = [
            [
                'name' => 'João Silva',
                'email' => 'joao@test.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria@test.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Carlos Oliveira',
                'email' => 'carlos@test.com',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        return response()->json([
            'success' => true,
            'message' => '✅ ' . User::count() . ' usuários criados com sucesso',
            'count' => User::count()
        ], 201);
    }

    /**
     * Seed categories
     */
    public function seedCategories()
    {
        $categories = [
            ['name' => 'Tecnologia'],
            ['name' => 'Esportes'],
            ['name' => 'Política'],
            ['name' => 'Entretenimento'],
            ['name' => 'Saúde'],
            ['name' => 'Educação'],
            ['name' => 'Economia'],
            ['name' => 'Ciência'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        return response()->json([
            'success' => true,
            'message' => '✅ ' . Category::count() . ' categorias criadas com sucesso',
            'count' => Category::count()
        ], 201);
    }

    /**
     * Seed posts
     */
    public function seedPosts()
    {
        $users = User::all();
        $categories = Category::all();
        
        if ($users->isEmpty() || $categories->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => '❌ Usuários ou categorias não encontrados. Execute os seeders de usuários e categorias primeiro.',
            ], 400);
        }

        $posts = [
            [
                'title' => 'Novo Framework PHP Lançado',
                'tag' => 'php, framework, programação',
                'summary' => 'A comunidade PHP acaba de ganhar um novo framework promissor.',
                'content' => 'O novo framework, chamado "NovaPHP", promete revolucionar o desenvolvimento web com PHP. Com foco em performance e developer experience, ele traz recursos inovadores que simplificam o desenvolvimento de APIs e aplicações web modernas. A adoção tem crescido rapidamente entre startups.',
                'category_id' => $categories->where('name', 'Tecnologia')->first()->id,
                'user_id' => $users->where('email', 'admin@test.com')->first()->id,
            ],
            [
                'title' => 'Time Local Conquista Campeonato',
                'tag' => 'futebol, esportes, vitória',
                'summary' => 'O time da cidade vence o campeonato estadual após 10 anos.',
                'content' => 'Em uma partida emocionante decidida nos pênaltis, o time local conquistou o título do campeonato estadual. A torcida invadiu o campo para comemorar com os jogadores. O técnico destacou a importância do trabalho em equipe e da persistência ao longo da temporada.',
                'category_id' => $categories->where('name', 'Esportes')->first()->id,
                'user_id' => $users->where('email', 'joao@test.com')->first()->id,
            ],
            [
                'title' => 'Reforma Tributária em Discussão',
                'tag' => 'política, economia, impostos',
                'summary' => 'Congresso debate nova proposta de reforma tributária.',
                'content' => 'A Câmara dos Deputados iniciou a discussão da nova proposta de reforma tributária. Especialistas acreditam que a mudança pode simplificar o sistema atual e reduzir a carga tributária para pequenas empresas. A votação está prevista para o próximo mês.',
                'category_id' => $categories->where('name', 'Política')->first()->id,
                'user_id' => $users->where('email', 'maria@test.com')->first()->id,
            ],
            [
                'title' => 'Avanço Científico em Tratamento de Doenças',
                'tag' => 'ciência, saúde, pesquisa',
                'summary' => 'Cientistas descobrem novo tratamento promissor para doenças crônicas.',
                'content' => 'Pesquisadores de uma universidade renomada anunciaram a descoberta de um novo tratamento que se mostrou eficaz em testes preliminares. O método inovador utiliza terapia genética e pode revolucionar o tratamento de várias doenças até então incuráveis. Os resultados serão publicados em revistas científicas internacionais.',
                'category_id' => $categories->where('name', 'Ciência')->first()->id,
                'user_id' => $users->where('email', 'carlos@test.com')->first()->id,
            ],
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }

        return response()->json([
            'success' => true,
            'message' => '✅ ' . Post::count() . ' posts criados com sucesso',
            'count' => Post::count()
        ], 201);
    }

    /**
     * Seed all data at once
     */
    public function seedAll()
    {
        try {
            // Seed users
            User::create([
                'name' => 'Administrador',
                'email' => 'admin@test.com',
                'password' => Hash::make('password'),
            ]);

            User::create([
                'name' => 'João Silva',
                'email' => 'joao@test.com',
                'password' => Hash::make('password'),
            ]);

            User::create([
                'name' => 'Maria Santos',
                'email' => 'maria@test.com',
                'password' => Hash::make('password'),
            ]);

            User::create([
                'name' => 'Carlos Oliveira',
                'email' => 'carlos@test.com',
                'password' => Hash::make('password'),
            ]);

            // Seed categories
            $categories = [
                ['name' => 'Tecnologia'],
                ['name' => 'Esportes'],
                ['name' => 'Política'],
                ['name' => 'Entretenimento'],
                ['name' => 'Saúde'],
                ['name' => 'Educação'],
                ['name' => 'Economia'],
                ['name' => 'Ciência'],
            ];

            foreach ($categories as $category) {
                Category::create($category);
            }

            // Seed posts
            $users = User::all();
            $allCategories = Category::all();

            $posts = [
                [
                    'title' => 'Novo Framework PHP Lançado',
                    'tag' => 'php, framework, programação',
                    'summary' => 'A comunidade PHP acaba de ganhar um novo framework promissor.',
                    'content' => 'O novo framework, chamado "NovaPHP", promete revolucionar o desenvolvimento web com PHP. Com foco em performance e developer experience, ele traz recursos inovadores que simplificam o desenvolvimento de APIs e aplicações web modernas. A adoção tem crescido rapidamente entre startups.',
                    'category_id' => $allCategories->where('name', 'Tecnologia')->first()->id,
                    'user_id' => $users->where('email', 'admin@test.com')->first()->id,
                ],
                [
                    'title' => 'Time Local Conquista Campeonato',
                    'tag' => 'futebol, esportes, vitória',
                    'summary' => 'O time da cidade vence o campeonato estadual após 10 anos.',
                    'content' => 'Em uma partida emocionante decidida nos pênaltis, o time local conquistou o título do campeonato estadual. A torcida invadiu o campo para comemorar com os jogadores. O técnico destacou a importância do trabalho em equipe e da persistência ao longo da temporada.',
                    'category_id' => $allCategories->where('name', 'Esportes')->first()->id,
                    'user_id' => $users->where('email', 'joao@test.com')->first()->id,
                ],
                [
                    'title' => 'Reforma Tributária em Discussão',
                    'tag' => 'política, economia, impostos',
                    'summary' => 'Congresso debate nova proposta de reforma tributária.',
                    'content' => 'A Câmara dos Deputados iniciou a discussão da nova proposta de reforma tributária. Especialistas acreditam que a mudança pode simplificar o sistema atual e reduzir a carga tributária para pequenas empresas. A votação está prevista para o próximo mês.',
                    'category_id' => $allCategories->where('name', 'Política')->first()->id,
                    'user_id' => $users->where('email', 'maria@test.com')->first()->id,
                ],
                [
                    'title' => 'Avanço Científico em Tratamento de Doenças',
                    'tag' => 'ciência, saúde, pesquisa',
                    'summary' => 'Cientistas descobrem novo tratamento promissor para doenças crônicas.',
                    'content' => 'Pesquisadores de uma universidade renomada anunciaram a descoberta de um novo tratamento que se mostrou eficaz em testes preliminares. O método inovador utiliza terapia genética e pode revolucionar o tratamento de várias doenças até então incuráveis. Os resultados serão publicados em revistas científicas internacionais.',
                    'category_id' => $allCategories->where('name', 'Ciência')->first()->id,
                    'user_id' => $users->where('email', 'carlos@test.com')->first()->id,
                ],
            ];

            foreach ($posts as $post) {
                Post::create($post);
            }

            return response()->json([
                'success' => true,
                'message' => '✅ Database seedada com sucesso!',
                'summary' => [
                    'users' => User::count() . ' usuários criados',
                    'categories' => Category::count() . ' categorias criadas',
                    'posts' => Post::count() . ' posts criados'
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao seedar: ' . $e->getMessage()
            ], 400);
        }
    }
}
