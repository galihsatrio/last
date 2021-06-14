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
    $details = $db->select('t_penjualan_det.total as total_det, t_penjualan_det.jumlah as jumlah, t_penjualan.total as total_penj, t_penjualan.id as penjualan_id, t_penjualan.tanggal as tanggal, t_penjualan.invoice as invoice, m_konsumen.nama as konsumen, m_supplier.kode as kode_supplier, m_barang.kode as kode_barang, m_barang.nama as barang, m_tipe_barang.nama as tipe_barang, m_satuan.nama as satuan, m_barang.harga_jual as harga_jual')
        ->from('t_penjualan_det')
        ->leftJoin('t_penjualan', 't_penjualan.id = t_penjualan_det.t_penjualan_id')
        ->leftJoin('m_konsumen', 'm_konsumen.id = t_penjualan.m_konsumen_id')
        ->leftJoin('m_barang', 'm_barang.id = t_penjualan_det.m_barang_id')
        ->leftJoin('m_supplier', 'm_supplier.id = m_barang.m_supplier_id')
        ->leftJoin('m_tipe_barang', 'm_tipe_barang.id = m_barang.m_tipe_barang_id')
        ->leftJoin('m_satuan', 'm_satuan.id = m_barang.m_satuan_id')
        ->where('t_penjualan.tanggal', '=', $tanggalInduk)
        ->findAll();

    foreach($details as $d) {
        $totalInduk += $d->total_penj;
    }
    return [
        'tanggal' => date('Y-m-d', $tanggalInduk),
        'total' => $totalInduk,
        'rows' => count($details),
        'detail' => $details 
    ];
}

$app->get('/l_penjualan/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();
    $data = $db->select('t_penjualan_det.total as total_det, t_penjualan_det.jumlah as jumlah, t_penjualan.id as penjualan_id, t_penjualan.tanggal as tanggal, t_penjualan.invoice as invoice, m_konsumen.nama as konsumen, m_supplier.kode as kode_supplier, m_barang.kode as kode_barang, m_barang.nama as barang, m_tipe_barang.nama as tipe_barang, m_satuan.nama as satuan, m_barang.harga_jual as harga_jual')
        ->from('t_penjualan_det')
        ->leftJoin('t_penjualan', 't_penjualan.id = t_penjualan_det.t_penjualan_id')
        ->leftJoin('m_konsumen', 'm_konsumen.id = t_penjualan.m_konsumen_id')
        ->leftJoin('m_barang', 'm_barang.id = t_penjualan_det.m_barang_id')
        ->leftJoin('m_supplier', 'm_supplier.id = m_barang.m_supplier_id')
        ->leftJoin('m_tipe_barang', 'm_tipe_barang.id = m_barang.m_tipe_barang_id')
        ->leftJoin('m_satuan', 'm_satuan.id = m_barang.m_satuan_id')
        ->where('t_penjualan.tanggal', '>', strtotime(date('Y-m-d', strtotime($params['periode_mulai']))))
        ->andWhere('t_penjualan.tanggal', '<', strtotime(date('Y-m-d', strtotime($params['periode_selesai']))))
        ->findAll();

    $arr = [
        'list' => [toList($data)],
        'data_atas' => [
            'periode_awal' => $params['periode_mulai'],
            'periode_akhir' => $params['periode_selesai'],
            'total_bawah' => toList($data)['total']
        ]
    ];

    if (isset($params['is_export']) && 1 == $params['is_export']) {
        $view = twigView();
        $content = $view->fetch('laporan/transaksi_penjualan.html', [
          'list' => $arr,
        ]);
        echo $content;
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;Filename="List Penjualan.xls"');
      } elseif (isset($params['is_print']) && 1 == $params['is_print']) {
        $view = twigView();
        $content = $view->fetch('laporan/transaksi_penjualan.html', [
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