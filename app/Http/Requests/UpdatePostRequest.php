<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'tag' => 'sometimes|required|string|max:255',
            'summary' => 'sometimes|required|string|min:10',
            'content' => 'sometimes|required|string|min:20',
            'category_id' => 'sometimes|required|exists:categories,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'O título é obrigatório',
            'title.max' => 'O título não pode ter mais de 255 caracteres',
            'tag.required' => 'A tag é obrigatória',
            'summary.required' => 'O resumo é obrigatório',
            'summary.min' => 'O resumo deve ter pelo menos 10 caracteres',
            'content.required' => 'O conteúdo é obrigatório',
            'content.min' => 'O conteúdo deve ter pelo menos 20 caracteres',
            'category_id.required' => 'A categoria é obrigatória',
            'category_id.exists' => 'A categoria selecionada não existe',
        ];
    }
}