<?php

return [
    'mercadopago' => [
        'access_token' => env('MERCADOPAGO_ACCESS_TOKEN'),
        'public_key' => env('MERCADOPAGO_PUBLIC_KEY'),
        'user_id' => env('MERCADOPAGO_USER_ID'),
        'pos_id' => env('MERCADOPAGO_POS_ID'),
        'store_id' => env('MERCADOPAGO_STORE_ID'),
        'environment' => env('MERCADOPAGO_ENVIRONMENT', 'production'),
    ],
];
