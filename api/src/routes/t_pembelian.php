<?php
use Service\Landa;
use Service\Db;

function Validasi($data, $custom = array()) {
    $validasi = array(
        // 'tanggal' => 'required'
    );
    $cek = validate($data, $validasi, $custom);
    return $cek;
}

$app->get('/t_pembelian/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('*')
        ->from('t_pembelian')
        ->where('is_deleted', '=', 0)
        ->orderBy('id DESC');

    if(isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach($filter as $key => $value) {
            if($key == 'invoice') {
                $data->where('t_pembelian.invoice', 'LIKE', $value);
            }
        }
    }

    if(isset($params['limit']) && !empty($params['limit'])) {
        $data->limit($params['limit']);
    }
    if(isset($params['offset']) && !empty($params['offset'])) {
        $data->offset($params['offset']);
    }
    
    $models = $db->findAll();
    $totalItems = $data->count();

    foreach($models as $model) {
        $model->tanggal = date('Y-m-d', $model->tanggal);
    }

    return successResponse($response, [
        'list' => $models,
        'totalItems' => $totalItems
    ]);

});

$app->post('/t_pembelian/save', function($request, $response) {
    $data = $request->getParams();
    $db = Db::db();
    $landa = new Landa();
    $validasi = Validasi($data);
    // ej($data);

    if($validasi === true) {
        if(isset($data['model']['struk']['base64']) && !empty($data['model']['struk']['base64'])) {
            $path = 'assets/img/struk/';
            $uploadFile = $landa->base64ToImage($path, $data['model']['struk']['base64']);
            if($uploadFile) {
                $data['model']['struk'] = $uploadFile['data'];
            } else {
                return unprocessResponse($response, [$uploadFile['error']]);
            }
        }
        try {
            $data['model']['tanggal'] = $landa->arrayToDate($data['model']['tanggal']);
            $data['model']['tanggal'] = strtotime(date('Y-m-d', strtotime($data['model']['tanggal'])));
            $model = $db->insert('t_pembelian', $data['model']);

            foreach($data['pembelian'] as $beli) {
                $beli['t_pembelian_id'] = $model->id;
                $pembelian = $db->insert('t_pembelian_det', $beli);
                if(isset($beli['jumlah'])) {
                    $barang = $db->select('m_barang.*, m_stok_barang.*')
                        ->from('m_stok_barang')
                        ->where('m_barang_id', '=', $beli['m_barang_id'])
                        ->leftJoin('m_barang','m_barang.id = m_stok_barang.m_barang_id')
                        ->find();
                    $stok = $barang->stok + $beli['jumlah'];
                    $db->insert('l_kartu_stok', [
                        'tanggal' => $model->tanggal,
                        'm_barang_id' => $beli['m_barang_id'],
                        'masuk' => $beli['jumlah'],
                        'keluar' => 0,
                        'stok' => $stok
                    ]);
                    $db->insert('t_pembelian_history', [
                        't_pembelian_det_id' => $pembelian->id,
                        'jumlah_awal' => $barang->stok,
                        'jumlah_pembelian'=> $beli['jumlah'],
                    ]);
                    $db->update('m_stok_barang', ['stok' => $stok], ['m_barang_id' => $beli['m_barang_id']]);
                }
            }
            return successResponse($response, $pembelian);
        } catch (Exception $e) {
            return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
        }
    }
    return unprocessResponse($response, $validasi);
});

$app->post('/t_pembelian/hapus', function($request, $response){
    $data = $request->getParams();
    $db = DB::db();
    $model = $db->update('t_pembelian', ['is_deleted' => 1], ['id' => $data['id']]);

    if(isset($model)) {
        return successResponse($response, [$model]);
    }
    return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
});

$app->get('/t_pembelian/barang_id', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('*')
        ->from('m_barang')
        ->where('id', '=', $params['id'])
        ->find();
    return successResponse($response, $data);
});

$app->get('/t_pembelian/detail', function($request, $response) {
    $params = $request->getParams();
    $db = Db::db();
    $data = $db->select('t_pembelian_det.*, m_barang.nama as barang, m_barang.harga_beli as harga_beli')
        ->from('t_pembelian_det')
        ->leftJoin('m_barang', 'm_barang.id = t_pembelian_det.m_barang_id')
        ->where('t_pembelian_det.t_pembelian_id', '=', $params['id'])
        ->findAll();
    return successResponse($response, $data);
});