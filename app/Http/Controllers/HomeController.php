<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'hero_lede' => config('voltaic.home_hero_lede'),
            'services' => config('voltaic.services'),
            'values' => config('voltaic.values'),
            'panel' => config('voltaic.panel'),
        ]);
    }
}
