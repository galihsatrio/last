<?php
use Service\Landa;
use Service\Db;

function Validasi($data, $custom = array()) {
    $validasi = array(
        'nama' => 'required'
    );
    $cek = validate($data, $validasi, $custom);
    return $cek;
}

$app->get('/m_tipe_barang/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('*')
        ->from('m_tipe_barang')
        ->where('is_deleted', '=', 0)
        ->orderBy('id DESC');

    if(isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach($filter as $key => $value) {
            if($key == 'nama') {
                $data->where('m_tipe_barang.nama', 'LIKE', $value);
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

    return successResponse($response, [
        'list' => $models,
        'totalItems' => $totalItems
    ]);

});

$app->post('/m_tipe_barang/save', function($request, $response) {
    $data = $request->getParams();
    $db = Db::db();
    $landa = new Landa();
    
    $validasi = Validasi($data);

    if($validasi === true) {
        try {
            if (isset($data['id'])) {
                $model = $db->update('m_tipe_barang', $data, ['id' => $data['id']]);
            } else {
                $model = $db->insert('m_tipe_barang', $data);
            }
            return successResponse($response, $data);
        } catch (Exception $e) {
            return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
        }
    }
    return unprocessResponse($response, $validasi);

});

$app->post('/m_tipe_barang/hapus', function($request, $response){
    $data = $request->getParams();
    $db = DB::db();
    $model = $db->update('m_tipe_barang', ['is_deleted' => 1], ['id' => $data['id']]);

    if(isset($model)) {
        return successResponse($response, [$model]);
    }
    return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
});