<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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

    }
}