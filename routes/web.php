<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\BrandingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\PanelController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/about', AboutController::class)->name('about');
Route::get('/faq', FaqController::class)->name('faq');
Route::get('/contact', ContactController::class)->name('contact');
Route::get('/branding', BrandingController::class)->name('branding');
Route::get('/panel', PanelController::class)->name('panel');
Route::get('/privacy', [LegalController::class, 'privacy'])->name('privacy');
Route::get('/terms', [LegalController::class, 'terms'])->name('terms');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
