<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function privacy(): Response
    {
        return Inertia::render('Privacy', [
            'legal' => config('voltaic.legal'),
            'content' => config('voltaic.legal.privacy'),
        ]);
    }

    public function terms(): Response
    {
        return Inertia::render('Terms', [
            'legal' => config('voltaic.legal'),
            'content' => config('voltaic.legal.terms'),
        ]);
    }
}
