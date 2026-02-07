<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        // Verificar autorização
        $this->authorize('create', Category::class);
        
        // Criar categoria
        $category = Category::create($request->validated());
        
        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Categoria criada com sucesso'
        ], 201);
    }

    public function show()
    {
        $categories = Category::pluck('name', 'id');
        return response()->json($categories);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {

        $this->authorize('update', $category);
        

        $category->update($request->validated());
        
        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Categoria atualizada com sucesso'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {

        $this->authorize('delete', $category);
        
        if ($category->posts()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Não é possível excluir uma categoria que possui posts. Exclua ou mova os posts primeiro.'
            ], 422);
        }
        
        // Excluir categoria
        $category->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Categoria excluída com sucesso'
        ]);
    }
    
}