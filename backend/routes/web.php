<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function () {
    $path = public_path('index.html');

    if (! file_exists($path)) {
        abort(404, 'SPA not built yet. Run build.sh to generate the frontend.');
    }

    return response(file_get_contents($path))
        ->header('Content-Type', 'text/html');
})->where('any', '^(?!api|sanctum).*$');
