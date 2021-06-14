<?php
use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array())
{
    $validasi = array(
        'nama' => 'required',
    );
    $cek = validate($data,$validasi,$custom);

    return $cek;
}

$app->get('/m_barang/index', function($request, $response){
    $params = $request->getParams();
    $db     = Db::db();

    $data = $db->select('m_barang.*, m_tipe_barang.nama as tipe_barang, m_satuan.nama as satuan, m_supplier.nama as supplier, m_supplier.kode as kode_supplier')
               ->from('m_barang')
               ->leftJoin('m_tipe_barang', 'm_tipe_barang.id = m_barang.m_tipe_barang_id')
               ->leftJoin('m_satuan', 'm_satuan.id = m_barang.m_satuan_id')
               ->leftJoin('m_supplier', 'm_supplier.id = m_barang.m_supplier_id')
               ->where('m_barang.is_deleted','=',0)
               ->orderBy('m_barang.id DESC');

        if (isset($params['filter'])) {
            $filter = (array) json_decode($params['filter']);
            foreach ($filter as $key => $value) {
                if ($key == 'nama') {
                    $data->where('m_barang.nama','LIKE',$value);
                }
                if ($key == 'kode') {
                    $data->where('m_barang.kode', 'LIKE', $value);
                }
                if($key == "supplier") {
                    $data->where('m_supplier.nama', 'LIKE', $value);
                }
            }
        }
        if (isset($params['limit']) && !empty($params['limit'])) {
            $data->limit($params['limit']);
        }
        if (isset($params['offset']) && !empty($params['offset'])) {
            $data->offset($params['offset']);
        }
    
        $models     = $data->findAll();
        $totalItems = $data->count(); 
        $totalSupplier = $db->select('*')->from('m_supplier')->where('is_deleted', '=', 0)->findAll(); 

        return successResponse($response, [
            'list'=> $models,
            'totalItems' => $totalItems,
            'supplier' => $totalSupplier
        ]);
});

$app->post('/m_barang/save',function ($request, $response){
    $data = $request->getParams();
    $db   = Db::db();
    $landa= new Landa();
    // ej($data);
    $validasi = Validasi($data);

    if ($validasi === true) {
        try {
            if (isset($data['id'])) {
                $model = $db->update('m_barang', $data,['id'=> $data['id']]);
            }else{
                $kodeSup = $db->select('*')
                    ->from('m_supplier')
                    ->where('id', '=', $data['m_supplier_id'])->find();
                $kodeSupplier = $kodeSup->kode;
                $kodeBarang = $db->select('*')->from('m_barang')->count();
                $urut = $kodeBarang + 1;
                $zero = "0000";
                $huruf = "BRG";
                $karakter = strlen($urut);
                $potong;
                if($karakter == 1) {
                    $potong = substr($zero, 0, -1);
                } elseif ($karakter == 2) {
                    $potong = substr($zero, 0, -2);
                } elseif( $karakter == 3) {
                    $potong = substr($zero, 0, -3);
                } elseif( $karakter == 4) {
                    $potong = substr($zero, 0, -4);
                }
                $result = $kodeSupplier . $huruf . $potong . $urut;
                $model = $db->insert('m_barang', [
                    'nama' => $data['nama'],
                    'm_supplier_id' => $data['m_supplier_id'],
                    'm_tipe_barang_id' => $data['m_tipe_barang_id'],
                    'm_satuan_id' => $data['m_satuan_id'],
                    'harga_jual' => $data['harga_jual'],
                    'harga_beli' => $data['harga_beli'],
                    'kode' => $result
                ]);
                if(isset($model->nama)) {
                    $db->insert('m_stok_barang', [
                        'm_barang_id' => $model->id,
                        'stok' => 0
                    ]);
                }
            }
            return successResponse($response, $model);
        } catch (Exception $e) {
            return unprocessResponse($response, ['Terjadi Masalah Pada Server']);
        }
    }
    return unprocessResponse($response, $validasi);
});

$app->post('/m_barang/hapus',function($request, $response){
    $data  = $request->getParams();
    $db    = Db::db();
    $model = $db->update('m_barang',['is_deleted' => 1],['id' => $data['id']]);

    if (isset($model)) {
        return successResponse($response, [$model]);
    }
    return unprocessResponse($response,['terjadi masalah pada server']);
});