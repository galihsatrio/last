<?php

use Service\Landa;
use Service\Db;

function Validasi($data, $custom = array()) {
    $validasi = array(
        'tanggal' => 'required',
        'm_konsumen_id' => 'required',
        'subtotal' => 'required',
        'total' => 'required'
    );
    $cek = validate($data, $validasi, $custom);
    return $cek;
}

$app->get('/t_penjualan/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('t_penjualan.*, m_konsumen.nama as konsumen')
        ->from('t_penjualan')
        ->leftJoin('m_konsumen', 'm_konsumen.id = t_penjualan.m_konsumen_id')
        ->where('t_penjualan.is_deleted', '=', 0)
        ->orderBy('t_penjualan.id DESC');
    
    if(isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach($filter as $key => $value) {
            if($key == 'invoice') {
                $data->where('t_penjualan.invoice', 'LIKE', $value);
            }
            if($key == 'konsumen') {
                $data->where('m_konsumen.nama', 'LIKE', $value);
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

    foreach($models as $model) {
        $model->tanggal = date('Y-m-d', $model->tanggal);
    }

    return successResponse($response, [
        'list' => $models,
        'totalItems' => $totalItems
    ]);

});

$app->post('/t_penjualan/save', function($request, $response) {
    $data = $request->getParams();
    $db = Db::db();
    $landa = new Landa();
    $validasi = Validasi($data['model']);

    if($validasi === true) {
        if(isset($data['model']['tanggal'])) {
            $data['model']['tanggal'] = $landa->arrayToDate($data['model']['tanggal']);
            $data['model']['tanggal'] = strtotime(date('Y-m-d', strtotime($data['model']['tanggal'])));
        }
        try {
            $model = $db->insert('t_penjualan', $data['model']);
            foreach($data['penjualan'] as $jual) {
                $jual['t_penjualan_id'] = $model->id;
                $jual['m_barang_id'] = $jual['m_barang_id']['id'];
                $penjualan = $db->insert('t_penjualan_det', $jual);
                if(isset($jual['jumlah'])) {
                    $barang = $db->select('m_stok_barang.*, m_barang.*')
                        ->from('m_stok_barang')
                        ->where('m_stok_barang.m_barang_id', '=', $jual['m_barang_id'])
                        ->leftJoin('m_barang', 'm_barang.id = m_stok_barang.m_barang_id')
                        ->find();
                    if($barang->stok !== 0) { 
                        if($barang->stok >= $jual['jumlah']) {
                            $stok = $barang->stok - $jual['jumlah'];
                            $db->update('m_stok_barang', ['stok' => $stok] , ['m_barang_id' => $jual['m_barang_id']]);
                            $db->insert('l_kartu_stok', [
                                'tanggal' => $model->tanggal,
                                'm_barang_id' => $jual['m_barang_id'],
                                'keluar' => $jual['jumlah'],
                                'masuk' => 0,
                                'stok' => $stok
                            ]);
                            $db->insert('t_penjualan_history', [
                                't_penjualan_det_id' => $penjualan->id,
                                'jumlah_awal' => $barang->stok,
                                'jumlah_penjualan'=> $jual['jumlah'],
                            ]);
                        } else {
                            return unprocessResponse($response, ['Maaf penjualan melebihi jumlah stok']);
                        }
                    } else if (empty($barang->stok)) {
                        $db->update('m_stok_barang', ['is_deleted' => 0] , ['m_barang_id' => $jual['m_barang_id']]);
                    }
                }
            }
            return successResponse($response, $penjualan);
        } catch(Exception $e) {
            return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
        }
    }
    return successResponse($response, $validasi);
});

$app->get('/t_penjualan/m_barang', function($request, $response){
    $params = $request->getParams();
    $db = DB::db();
    $data = $db->select('*')
        ->from('m_barang')
        ->where('is_deleted', '=', 0)
        ->findAll();

    successResponse($response, $data);
});

$app->get('/t_penjualan/barang_id', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('*')
        ->from('m_barang')
        ->where('m_barang.id', '=', $params['id'])
        ->find();

    return successResponse($response, $data);
});

$app->get('/t_penjualan/detail', function($request, $response) {
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('t_penjualan_det.*, m_barang.nama as m_barang_id, m_barang.harga_jual as harga_jual')
        ->from('t_penjualan_det')
        ->where('t_penjualan_det.t_penjualan_id', '=', $params['id'])
        ->leftJoin('m_barang', 'm_barang.id = t_penjualan_det.m_barang_id')
        ->findAll();

    return successResponse($response, $data);
});

$app->get('/t_penjualan/print', function($request, $response) {
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('t_penjualan.*, m_konsumen.nama as konsumen')
        ->from('t_penjualan')
        ->leftJoin('m_konsumen', 'm_konsumen.id = t_penjualan.m_konsumen_id')
        ->where('t_penjualan.id','=', $params['id'])
        ->find();

    $detail = $db->select('t_penjualan_det.*, m_barang.nama as barang, m_barang.harga_jual as harga')
        ->from('t_penjualan_det')
        ->leftJoin('m_barang', 'm_barang.id = t_penjualan_det.m_barang_id')
        ->where('t_penjualan_det.t_penjualan_id','=', $data->id)
        ->findAll();
    $view = twigView();
    $content = $view->fetch('laporan/struk.html', [
        'data' => $data,
        'detail' => $detail 
    ]);
    echo $content;
    echo 
    "<script type='text/javascript'>
        window.print();
        setTimeout( function() {
            window.close();
        }, 500);
    </script>";
});



