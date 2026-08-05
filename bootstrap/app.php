<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Support\Voltaic;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if ($request->is('api/*')) {
                return $response;
            }

            $status = $response->getStatusCode();
            $handled = [401, 403, 404, 419, 429, 500, 503];

            if (! in_array($status, $handled, true)) {
                return $response;
            }

            if ($status === 500 && config('app.debug')) {
                return $response;
            }

            /** @var array{title: string, description: string} $error */
            $error = Voltaic::errorFor($status);

            try {
                return Inertia::render('Error', [
                    'status' => $status,
                    'title' => $error['title'],
                    'description' => $error['description'],
                    'site' => Voltaic::siteProps(),
                ])
                    ->toResponse($request)
                    ->setStatusCode($status);
            } catch (Throwable) {
                return response()->view('errors.'.$status, [
                    'status' => $status,
                ], $status);
            }
        });
    })->create();
