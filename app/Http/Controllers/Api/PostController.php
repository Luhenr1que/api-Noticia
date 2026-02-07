<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['category', 'user']);

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('tag') && $request->tag) {
            $query->where('tag', 'like', "%{$request->tag}%");
        }
        
        if ($request->has('title') && $request->title) {
            $query->where('title', 'like', "%{$request->title}%");
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate(9);
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Post::class);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'tag' => 'required|string|max:255',
            'summary' => 'required|string',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $post = Post::create([
            'title' => $data['title'],
            'tag' => $data['tag'],
            'summary' => $data['summary'],
            'content' => $data['content'],
            'category_id' => $data['category_id'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json($post, 201);
    }

    public function show($id)
    {
        $post = Post::with(['category', 'user'])->findOrFail($id);
        
        $this->authorize('view', $post);

        return response()->json($post);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'tag' => 'required|string|max:255',
            'summary' => 'required|string',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ]);

        $post->update($data);

        return response()->json($post, 200);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();
        
        return response()->json([
            'message' => 'Post deletado com sucesso'
        ]);
    }
}