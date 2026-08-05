<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('About', [
            'values' => config('voltaic.values'),
            'about' => config('voltaic.about'),
        ]);
    }
}
