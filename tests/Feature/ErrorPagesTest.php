<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ErrorPagesTest extends TestCase
{
    /**
     * @return array<string, array{0: int}>
     */
    public static function handledStatuses(): array
    {
        return [
            'unauthorized' => [401],
            'forbidden' => [403],
            'not found' => [404],
            'page expired' => [419],
            'too many requests' => [429],
            'server error' => [500],
            'service unavailable' => [503],
        ];
    }

    #[DataProvider('handledStatuses')]
    public function test_handled_statuses_render_inertia_error_page(int $status): void
    {
        config(['app.debug' => false]);

        Route::middleware('web')->get("/__test/error/{$status}", function () use ($status) {
            abort($status);
        });

        $error = config('voltaic.errors.'.$status);

        $this->get("/__test/error/{$status}")
            ->assertStatus($status)
            ->assertInertia(fn ($page) => $page
                ->component('Error')
                ->where('status', $status)
                ->where('title', $error['title'])
                ->where('description', $error['description'])
                ->where('site.name', config('voltaic.name')));
    }

    public function test_blade_error_fallbacks_render_without_vite(): void
    {
        foreach ([401, 403, 404, 419, 429, 500, 503] as $status) {
            $error = config('voltaic.errors.'.$status);

            $this->view("errors.{$status}", ['status' => $status])
                ->assertSee((string) $status, false)
                ->assertSee($error['title'], false)
                ->assertSee($error['description'], false)
                ->assertSee(config('voltaic.name'), false);
        }
    }

    public function test_debug_mode_keeps_default_server_error_response(): void
    {
        config(['app.debug' => true]);

        Route::middleware('web')->get('/__test/error/500-debug', function () {
            abort(500, 'forced failure');
        });

        $this->get('/__test/error/500-debug')
            ->assertStatus(500)
            ->assertDontSee('data-page', false);
    }
}
