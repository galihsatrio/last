<?php
use Service\Landa;
use Service\Db;

function to($hasil)
{
  $nilai = [
    'tanggal' => date('Y-m-d', $hasil[0]->tanggal),
    'rows' => count($hasil),
    'details' => $hasil,
  ];
  
  return $nilai;
}

function toList($data)
{
  $tanggal = [];
  $akhir = [];

  foreach ($data as $d) {
    array_push($tanggal, $d->tanggal);
  }

  foreach (array_unique($tanggal) as $t) {
    $hasil = [];
    foreach ($data as $d) {
      if ($d->tanggal == $t) {
        array_push($hasil, $d);
      }
    }
    array_push($akhir, to($hasil));
  }

  // $column = array_column($akhir, 'tanggal');
  // array_multisort($column, SORT_ASC, $akhir);

  return $akhir;
}

$app->get('/l_kartu_stok/index', function($request, $response){
    $params = $request->getParams();
    $db = Db::db();
    
    $data = $db->select('l_kartu_stok.*, m_barang.nama as barang, m_barang.kode as kode_barang')
    ->from('l_kartu_stok')
    ->leftJoin('m_barang', 'l_kartu_stok.m_barang_id = m_barang.id')
    ->where('l_kartu_stok.m_barang_id', '=', $params['m_barang_id'])
    ->andWhere('l_kartu_stok.tanggal', '>=', strtotime(date('Y-m-d', strtotime($params['periode_mulai']))))
    ->andWhere('l_kartu_stok.tanggal', '<=', strtotime(date('Y-m-d', strtotime($params['periode_selesai']))))
    ->orderBy('l_kartu_stok.tanggal ASC')
    ->findAll();    

    $mulai =  strtotime(date('Y-m-d', strtotime($params['periode_mulai'])));
    $masuk = $db->find("SELECT SUM(masuk) as jumlah from l_kartu_stok WHERE tanggal < {$mulai} and m_barang_id = {$params['m_barang_id']}");
    $keluar = $db->find("SELECT SUM(keluar) as jumlah from l_kartu_stok WHERE tanggal < {$mulai} and m_barang_id = {$params['m_barang_id']}");
    $stokAwal = $masuk->jumlah - $keluar->jumlah;
    $stok = $stokAwal;
    foreach($data as $d) {
      if($d->keluar ==  0) {
        $stok += $d->masuk;
        $d->stok = $stok;
      } else if ( $d->masuk == 0) {
        $stok -= $d->keluar;
        $d->stok = $stok;
      }
    }
    $array = [
        'list' => toList($data),
        'stokAwal' => $stokAwal,
        'data_atas' => [
          'periode_awal' => $params['periode_mulai'],
          'periode_akhir' =>  $params['periode_selesai'],
        ]
    ];

    if (isset($params['is_export']) && 1 == $params['is_export']) {
        $view = twigView();
        $content = $view->fetch('laporan/kartu_stok.html', [
          'list' => $array,
        ]);
        echo $content;
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;Filename="List Pembelian.xls"');
      } elseif (isset($params['is_print']) && 1 == $params['is_print']) {
        $view = twigView();
        $content = $view->fetch('laporan/kartu_stok.html', [
          'list' => $array,
        ]);
        echo $content;
        echo '<script type="text/javascript">window.print();setTimeout(function () { window.close(); }, 500);</script>';
      } else {
        return successResponse($response, [
          'list' => $array,
        ]);
      }


});

// function toList($data) {
//     $db = Db::db();
//     $tanggalInduk = '';

//     // Mencari induk tanggal
//     if(count($data) > 1) {
//       for($i = 0; $i < count($data); $i++) {
//         if(($i + 1) < count($data)) {
//             if($data[$i]->tanggal == $data[$i + 1]->tanggal) {
//                 $tanggalInduk = $data[$i]->tanggal;
//             }
//         }
//       }
//     } else {
//         $tanggalInduk = $data[0]->tanggal;
//     }
//     $details = $db->select('l_kartu_stok.*, m_barang.nama as barang, m_barang.kode as kode_barang')
//         ->from('l_kartu_stok')
//         ->leftJoin('m_barang', 'm_barang.id = l_kartu_stok.m_barang_id')
//         ->where('l_kartu_stok.tanggal', '=', $tanggalInduk)
//         ->findAll();

//     return [
//         'tanggal' => date('Y-m-d', $tanggalInduk),
//         'rows' => count($details),
//         'detail' => $details 
//     ];
// }

