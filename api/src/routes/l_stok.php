<?php

use Service\Landa;
use Service\Db;

$app->get('/l_stok/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();
    $data = $db->select('m_stok_barang.*, m_barang.nama as barang, m_barang.kode as kode_barang')
        ->from('m_barang')
        ->leftJoin('m_stok_barang','m_barang.id = m_stok_barang.m_barang_id');

        if(isset($params['filter'])) {
            $filter = (array) json_decode($params['filter']);
            foreach($filter as $key => $value) {
                if($key == 'nama') {
                    $data->where('m_barang.nama', 'LIKE', $value);
                }
            }
        }
        if(isset($params['limit']) && !empty($params['limit'])) {
            $data->limit($params['limit']);
        }
        if(isset($params['offset']) && !empty($params['offset'])) {
            $data->offset($params['offset']);
        }
        $models = $data->findAll();
        $totalItems = $data->count();

        return successResponse($response, [
            'list' => $models,
            'totalItems' => $totalItems
        ]);
});