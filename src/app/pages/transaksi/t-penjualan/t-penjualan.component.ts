import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from 'src/app/core/services/landa.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-t-penjualan',
  templateUrl: './t-penjualan.component.html',
  styleUrls: ['./t-penjualan.component.scss']
}) 
export class TPenjualanComponent implements OnInit {
  apiUrl = environment.apiURL;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  model: any = {
    
  };
  modelParam : {
    invoice,
    konsumen
  }
  listData: any;
  showForm: boolean;
  listKonsumen: any;
  listPenjualan: any = [];
  listBarang: any;

  constructor(private LandaService:LandaService, private router: Router) { }

  ngOnInit(): void {
    this.pageTitle = "Transaksi Penjualan";
    this.breadCrumbItems = 
    [
      {
        label: 'Master'
      }, 
      {
        label: 'Transaksi Penjualan',
        active: true
      }
    ];
    this.modelParam = {
      invoice : '',
      konsumen : '',
    }
    this.getData();
    this.empty();
    this.listPenjualan = [];
  }
  empty() {
    this.model = {

    };
    this.getData();
  }
  getData() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pagingType: 'full_numbers',
      ajax: (dataTablesParameters: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.LandaService.DataGet('/t_penjualan/index', params).subscribe((res: any) => {
          this.listData = res.data.list;
          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        });
      },
    };
  }

  index() {
    this.showForm = !this.showForm;
    this.pageTitle = 'Data Transaksi Penjualan';
    this.getData();
  }
  create() {
    this.empty();
    this.listPenjualan = [];
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Data Transaksi Penjualan';
    this.isView = false;
    this.getKonsumen();
    this.getBarang();
    this.code();

  }
  code(){
    let jumlah = this.listData.length + 1;
    let karakter = jumlah.toString().length;
    let zero = "0000";
    let huruf = "PNJ";
    let potong;
    if(karakter == 1) {
      potong = zero.substring(0, zero.length -1);
    } else if( karakter == 2) {
      potong = zero.substring(0, zero.length -2);
    } else if( karakter == 3) {
      potong = zero.substring(0, zero.length -3); 
    }
    let kode = huruf + potong + jumlah;
    this.model.invoice = kode;
  }
  edit(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = 'Transaksi Penjualan : ' + val.nama;
    this.isView = false;
    this.isEdit = true;
    this.model.tanggal = this.toDate(val.tanggal);
    this.getData();
    this.getKonsumen();
  }
  view(val) {
    this.showForm = !this.showForm;
    this.pageTitle = 'Detail ' + val.invoice;
    this.model = val;
    this.model.tanggal = this.toDate(val.tanggal);
    this.isView = true;
    this.isEdit = false;
    this.getData(); 
    this.getKonsumen();
    this.getBarang();
    this.getDetail(val.id);
  }
  save() {
    const final ={
      model : this.model,
      penjualan : this.listPenjualan
    };

    this.LandaService.DataPost('/t_penjualan/save', final).subscribe((res: any) => {
      if (res.status_code === 200) {
        this.LandaService.alertSuccess('Berhasil', 'Data Transaksi Penjualan Telah Tersimpan');
        this.index();
      } else {
        this.LandaService.alertError('Mohon Maaf', res.errors);
      }
    });
  }
  delete(val) {
    const data = {
      id: val.id ? val.id : null,
      is_deleted: 1,
    };
    Swal.fire({
      title: 'Apakah Anda Yakin ?',
      text: 'Menghapus Data Master Akan Berpengaruh Terhadap Data Lainnya',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Ya, Hapus Data Ini'
    }).then(result => {
      if(result.value) {
        this.LandaService.DataPost('/t_penjualan/hapus', data).subscribe((res: any) => {
          if (res.status_code === 200) {
            this.LandaService.alertSuccess('Berhasil', 'Data Master Berhasil Terhapus');
            this.reloadDataTable();
          } else {
            this.LandaService.alertError('Mohon Maaf', res.errors);
          }
        });
      }
    })
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  } 
  toDate(dob) {
    if(dob) {
      const [year, month, day] = dob.split("-");
      const obj = {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      }; 
      return obj;
    }
  }
  getKonsumen() {
    this.LandaService.DataGet('/m_konsumen/index', {}).subscribe((res:any) => {
      this.listKonsumen = res.data.list; 
    });
  }
  getBarang() {
    this.LandaService.DataGet('/m_barang/index', {}).subscribe((res:any) => {
      this.listBarang = res.data.list;
    }); 
  }
  // tambah baris
  addRow(listPenjualan) {
    const newRow = {
      // t_penjualan_id : 0,
      // m_barang_id : 0,
      // jumlah : 0,
      // harga_jual : 0,
      // total : 0
    };
    listPenjualan.push(newRow);
  } 
  // hapus baris
  removeRow(i) {
    this.listPenjualan.splice(i);
  }  
  barang(val, id) {
    let barang = id;
    this.LandaService.DataGet('/t_penjualan/barang_id', { id:barang['id'] }).subscribe((res:any) => {
      val.harga_jual = res.data.harga_jual;
      val.jumlah = 1;
      this.total();
      this.diskon();
    });
  }
  total(){
    let subtotal = 0;
    this.listPenjualan.forEach((val) => {
      if(val.jumlah) {
        val.total = 0;
        val.total = val.harga_jual * val.jumlah;
      }
      subtotal += val.total;
    });
    this.model.subtotal = subtotal;
    this.model.total = subtotal;
  }
  diskon() {
    let diskon = this.model.diskon;
    let subtotal = this.model.subtotal;
    let hitungDiskon;
    let total;
    if(diskon) {
      hitungDiskon = (diskon / 100) * subtotal;
      total = subtotal - hitungDiskon;
    }
    this.model.total = total;
  }
  getDetail(id) {
    this.LandaService.DataGet('/t_penjualan/detail', { id }).subscribe((res:any) => {
      this.listPenjualan = res.data;
    });
  }
  print(id) {
    window.open(this.apiUrl + "/t_penjualan/print?id=" + id, "_blank");
  } 
}
