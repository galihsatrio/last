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

$app->get('/m_konsumen/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('*')
        ->from('m_konsumen')
        ->where('is_deleted', '=', 0);

    if(isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach($filter as $key => $value) {
            if($key == 'nama') {
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
    
    $models = $db->findAll();
    $totalItems = $data->count();

    return successResponse($response, [
        'list' => $models,
        'totalItems' => $totalItems
    ]);

});

$app->post('/m_konsumen/save', function($request, $response) {
    $data = $request->getParams();
    $db = Db::db();
    $landa = new Landa();
    
    $validasi = Validasi($data);

    if($validasi === true) {
        try {
            if (isset($data['id'])) {
                $model = $db->update('m_konsumen', $data, ['id' => $data['id']]);
            } else {
                // $kode = $db->select('*')->from('m_konsumen')->count();
                // $a = $kode + 1;
                // $urutan = strval($a);
                // $zero = "000";
                // $huruf = "CUS";
                // $karakter = strlen($urutan);
                // $potong;
                // if($karakter === 1) {
                //     $potong = substr($zero, 0, -1);
                // } else if ($karakter === 2) {
                //     $potong = substr($zero, 0, -2);
                // } else if( $karakter === 3) {
                //     $potong = substr($zero, 0, -3);
                // }
                // $result = $huruf . $potong . $urutan;
                $model = $db->insert('m_konsumen', ['nama' => $data['nama'], 'kode' => $data['kode']]);
            }
            return successResponse($response, $data);
        } catch (Exception $e) {
            return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
        }
    }
    return unprocessResponse($response, $validasi);

});

$app->post('/m_konsumen/hapus', function($request, $response){
    $data = $request->getParams();
    $db = DB::db();
    $model = $db->update('m_konsumen', ['is_deleted' => 1], ['id' => $data['id']]);

    if(isset($model)) {
        return successResponse($response, [$model]);
    }
    return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
});