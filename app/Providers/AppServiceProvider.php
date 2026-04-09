<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <-- IMPORTANTE: Não esqueça essa linha!

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Força o esquema HTTPS se o ambiente for de produção (Render)
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}
