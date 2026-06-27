<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <meta name="application-name" content="{{ config('app.name', 'TomSkyShop') }}" />
        <link rel="icon" type="image/webp" href="{{ Vite::asset('resources/assets/Tomskyshop_logo.webp') }}" />
        <link rel="apple-touch-icon" href="{{ Vite::asset('resources/assets/Tomskyshop_logo.webp') }}" />

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
