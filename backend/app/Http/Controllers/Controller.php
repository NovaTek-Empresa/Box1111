<?php

namespace App\Http\Controllers;

use Illuminate\Pagination\AbstractPaginator;

abstract class Controller
{
    protected function paginatedResponse(AbstractPaginator $paginator)
    {
        return $this->jsonResponse([
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
        ]);
    }

    protected function jsonResponse($data, $status = 200, $headers = [], $options = 0)
    {
        $options |= JSON_PRESERVE_ZERO_FRACTION;

        return response()->json($data, $status, $headers, $options);
    }
}
