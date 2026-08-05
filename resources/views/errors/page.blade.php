@php
    $status = (int) $status;
    $error = config('voltaic.errors.'.$status, config('voltaic.errors.default'));
@endphp

@include('errors.layout', [
    'status' => $status,
    'title' => $error['title'],
    'description' => $error['description'],
    'siteName' => config('voltaic.name'),
    'privacyNote' => config('voltaic.privacy_note'),
])
