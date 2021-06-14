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

$app->get('/m_supplier/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('*')
        ->from('m_supplier')
        ->where('is_deleted', '=', 0);

    if(isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach($filter as $key => $value) {
            if($key == 'nama') {
                $data->where('m_supplier.nama', 'LIKE', $value);
            }
            if($key == 'kode') {
                $data->where('m_supplier.kode', 'LIKE', $value);
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

$app->post('/m_supplier/save', function($request, $response) {
    $data = $request->getParams();
    $db = Db::db();
    $landa = new Landa();
    
    $validasi = Validasi($data);

    if($validasi === true) {
        try {
            if (isset($data['id'])) {
                $model = $db->update('m_supplier', $data, ['id' => $data['id']]);
            } else {
                $model = $db->insert('m_supplier', $data);
            }
            return successResponse($response, $data);
        } catch (Exception $e) {
            return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
        }
    }
    return unprocessResponse($response, $validasi);

});

$app->post('/m_supplier/hapus', function($request, $response){
    $data = $request->getParams();
    $db = DB::db();
    $model = $db->update('m_supplier', ['is_deleted' => 1], ['id' => $data['id']]);

    if(isset($model)) {
        return successResponse($response, [$model]);
    }
    return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
});