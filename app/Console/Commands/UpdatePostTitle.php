<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;

class UpdatePostTitle extends Command
{
    /**
     * O nome e assinatura do comando.
     *
     * @var string
     */
    protected $signature = 'posts:update-title {new_title}';

    /**
     * A descrição do comando.
     *
     * @var string
     */
    protected $description = 'Altera o título de todas as postagens conforme especificado no teste';


    public function handle()
    {
        
        $newTitle = $this->argument('new_title');


        $updated = Post::query()->update(['title' => $newTitle]);
        
        $this->newLine();
        $this->info("✅ CONCLUÍDO!");
        $this->info("{$updated} postagens atualizadas com sucesso.");
        $this->line("Todos os títulos foram alterados para: '{$newTitle}'");
        
        return Command::SUCCESS;
    }
}