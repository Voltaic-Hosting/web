<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PanelController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Panel', [
            'panel' => config('voltaic.panel'),
        ]);
    }
}
