<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'upload' => 'required|image|mimes:jpeg,png,jpg,gif|max:1024',
        ]);

        $file = $request->file('upload');
        // $path = $file->store('uploads', 'public');
        $destinationPath = 'images/media/';
        $profileImage = date('YmdHis') . '-' . $file->getClientOriginalName();
        $file->move($destinationPath, $profileImage);

        return response()->json([
            // 'url' => Storage::url($path),
            // 'url' => env('APP_URL').'/'.$destinationPath.$profileImage,
            'url' => '../../'.$destinationPath.$profileImage,
            'uploaded' => 1,
            'fileName' => $file->getClientOriginalName(),
        ]);
    }
}
