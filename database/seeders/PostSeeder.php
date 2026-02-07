<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $categories = Category::all();
        
        if ($users->isEmpty() || $categories->isEmpty()) {
            $this->command->error('❌ Users or categories not found. Run their seeders first.');
            return;
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
                'title' => 'Novo Filme Bate Recorde de Bilheteria',
                'tag' => 'cinema, entretenimento, recorde',
                'summary' => 'Produção nacional atinge marca histórica no primeiro fim de semana.',
                'content' => 'O filme "A Jornada" superou todas as expectativas e se tornou a maior estreia do cinema nacional. Com críticas positivas e público cativado pela história, a produção já garantiu sequência. O diretor agradeceu ao público pelo apoio.',
                'category_id' => $categories->where('name', 'Entretenimento')->first()->id,
                'user_id' => $users->where('email', 'carlos@test.com')->first()->id,
            ],
            [
                'title' => 'Avances na Pesquisa sobre Câncer',
                'tag' => 'saúde, medicina, pesquisa',
                'summary' => 'Nova descoberta pode revolucionar tratamento de tipo específico de câncer.',
                'content' => 'Pesquisadores anunciaram uma descoberta significativa no tratamento de um tipo agressivo de câncer. O novo método utiliza imunoterapia combinada com técnicas genéticas e já apresentou resultados promissores em testes clínicos iniciais.',
                'category_id' => $categories->where('name', 'Saúde')->first()->id,
                'user_id' => $users->where('email', 'admin@test.com')->first()->id,
            ],
            [
                'title' => 'Plataforma de E-learning Gratuita',
                'tag' => 'educação, tecnologia, cursos',
                'summary' => 'Governo lança plataforma com cursos gratuitos de programação.',
                'content' => 'Foi lançada hoje uma plataforma nacional de educação com foco em habilidades digitais. A iniciativa oferece cursos gratuitos em áreas como programação, análise de dados e design. Mais de 50 mil vagas estão disponíveis na primeira fase.',
                'category_id' => $categories->where('name', 'Educação')->first()->id,
                'user_id' => $users->where('email', 'joao@test.com')->first()->id,
            ],
            [
                'title' => 'Mercado de Criptomoedas em Alta',
                'tag' => 'economia, criptomoedas, investimentos',
                'summary' => 'Bitcoin atinge maior valor dos últimos 2 anos.',
                'content' => 'O mercado de criptomoedas apresenta recuperação significativa, com o Bitcoin atingindo patamares não vistos desde 2022. Analistas atribuem o movimento à adoção institucional e regulamentações mais claras em diversos países.',
                'category_id' => $categories->where('name', 'Economia')->first()->id,
                'user_id' => $users->where('email', 'maria@test.com')->first()->id,
            ],
            [
                'title' => 'Descoberta de Novo Planeta Habitável',
                'tag' => 'ciência, espaço, astronomia',
                'summary' => 'Telescópio espacial identifica planeta com condições similares à Terra.',
                'content' => 'Astrônomos anunciaram a descoberta de um exoplaneta que pode ter condições para abrigar vida. Localizado na zona habitável de sua estrela, o planeta tem tamanho similar à Terra e atmosfera rica em oxigênio. Mais estudos serão realizados.',
                'category_id' => $categories->where('name', 'Ciência')->first()->id,
                'user_id' => $users->where('email', 'carlos@test.com')->first()->id,
            ],
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }
    }
}