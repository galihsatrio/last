<?php
use Service\Landa;
use Service\Db;

function toList($data) {
    $db = Db::db();
    $tanggalInduk = '';
    $totalInduk = 0;

    // Mencari induk tanggal
    if(count($data) > 1) {
        for($i = 0; $i < count($data); $i++) {
            if(($i + 1) < count($data)) {
                if($data[$i]->tanggal == $data[$i + 1]->tanggal) {
                    $tanggalInduk = $data[$i]->tanggal;
                }
            }
        }
    } else {
        $tanggalInduk = $data[0]->tanggal;
    }

    $details = $db->select('t_pembelian_det.*, t_pembelian.tanggal as tanggal, t_pembelian.total as total, t_pembelian.invoice as invoice, m_supplier.kode as kode_supplier, m_barang.kode as kode_barang, m_barang.nama as barang, m_barang.harga_jual as harga_jual, m_tipe_barang.nama as tipe_barang, m_satuan.nama as satuan')
        ->from('t_pembelian_det')
        ->leftJoin('t_pembelian', 't_pembelian.id = t_pembelian_det.t_pembelian_id')
        ->leftJoin('m_barang', 'm_barang.id = t_pembelian_det.m_barang_id')
        ->leftJoin('m_supplier', 'm_supplier.id = m_barang.m_supplier_id')
        ->leftJoin('m_tipe_barang', 'm_tipe_barang.id = m_barang.m_tipe_barang_id')
        ->leftJoin('m_satuan', 'm_satuan.id = m_barang.m_satuan_id')
        ->where('t_pembelian.tanggal', '=', $tanggalInduk)
        ->findAll();
        
    foreach($details as $d) {
        $total = $totalInduk + $d->total;
    }
    
    return [
        'tanggal' => date('Y-m-d', $tanggalInduk),
        'total' => $total,
        'rows' => count($details),
        'detail' => $details 
    ];
}


$app->get('/l_pembelian/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('t_pembelian_det.*, t_pembelian.tanggal as tanggal, t_pembelian.total as total, t_pembelian.invoice as invoice, m_supplier.kode as kode_supplier, m_barang.kode as kode_barang, m_barang.nama as barang, m_barang.harga_jual as harga_jual, m_tipe_barang.nama as tipe_barang, m_satuan.nama as satuan')
    ->from('t_pembelian_det')
    ->leftJoin('t_pembelian', 't_pembelian.id = t_pembelian_det.t_pembelian_id')
    ->leftJoin('m_barang', 'm_barang.id = t_pembelian_det.m_barang_id')
    ->leftJoin('m_supplier', 'm_supplier.id = m_barang.m_supplier_id')
    ->leftJoin('m_tipe_barang', 'm_tipe_barang.id = m_barang.m_tipe_barang_id')
    ->leftJoin('m_satuan', 'm_satuan.id = m_barang.m_satuan_id')
    ->where('t_pembelian.tanggal', '>', strtotime(date('Y-m-d', strtotime($params['periode_mulai']))))
    ->andWhere('t_pembelian.tanggal', '<', strtotime(date('Y-m-d', strtotime($params['periode_selesai']))))
    ->findAll();
    
    $arr = [
        'list' => [toList($data)],
        'data_atas' => [
            'periode_awal' => $params['periode_mulai'],
            'periode_akhir' =>  $params['periode_selesai'],
            'total_bawah' => toList($data)['total'],
            'rows' => toList($data)['rows']
        ]
    ];

    if (isset($params['is_export']) && 1 == $params['is_export']) {
        $view = twigView();
        $content = $view->fetch('laporan/transaksi_pembelian.html', [
          'list' => $arr,
        ]);
        echo $content;
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;Filename="List Pembelian.xls"');
      } elseif (isset($params['is_print']) && 1 == $params['is_print']) {
        $view = twigView();
        $content = $view->fetch('laporan/transaksi_pembelian.html', [
          'list' => $arr,
        ]);
        echo $content;
        echo '<script type="text/javascript">window.print();setTimeout(function () { window.close(); }, 500);</script>';
      } else {
        return successResponse($response, [
          'list' => $arr,
        ]);
      }


});
