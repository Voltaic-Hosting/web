<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class BrandingController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Branding', [
            'branding' => config('voltaic.branding'),
        ]);
    }
}
