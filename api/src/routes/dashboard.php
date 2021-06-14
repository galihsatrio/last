<?php

use Service\Db;
use Service\Firebase;
use Service\Landa;

$app->get('/dashboard/getdata', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $barang = $db->select('*')
        ->from('m_barang')
        ->where('m_barang.is_deleted','=', 0 )
        ->findAll();
    $konsumen = $db->select('*')
        ->from('m_konsumen')
        ->where('m_konsumen.is_deleted', '=', 0)
        ->findAll();
    $supplier = $db->select('*')
        ->from('m_supplier')
        ->where('m_supplier.is_deleted', '=', 0)
        ->findAll();
    $penjualan = $db->select('*')
        ->from('t_penjualan')
        ->where('t_penjualan.is_deleted', '=', 0)
        ->findAll();
    $pembelian = $db->select('*')
        ->from('t_pembelian')
        ->where('t_pembelian.is_deleted', '=', 0)
        ->findAll();
    $data = [
        'barang' => count($barang),
        'konsumen' => count($konsumen),
        'supplier' => count($supplier),
        'penjualan' => count($penjualan),
        'pembelian' => count($pembelian),
    ];
    return successResponse($response, $data);
});
