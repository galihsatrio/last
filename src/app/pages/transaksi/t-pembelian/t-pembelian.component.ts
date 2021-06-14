import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from 'src/app/core/services/landa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-t-pembelian',
  templateUrl: './t-pembelian.component.html',
  styleUrls: ['./t-pembelian.component.scss'] 
})
export class TPembelianComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  model: any = { };
  modelParam: { invoice };
  listData: any;
  showForm: boolean;
  listPembelian: any = [];
  listBarang: any;

  myForm = new FormGroup({
    fileUpload: new FormControl("", [Validators.required]),
  });

  constructor(private LandaService: LandaService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pageTitle = "Transaksi Pembelian";
    this.breadCrumbItems = 
    [
      {
        label : 'Transaksi'
      },
      {
        label : 'Transaksi Pembelian',
        active : true
      }
    ];
    this.modelParam = {  
      invoice : ''
    }
    this.getData();
    this.empty();
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
      ajax: (dataTablesParameter: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameter.start,
          limit: dataTablesParameter.length
        };
        this.LandaService.DataGet('/t_pembelian/index', params).subscribe((res:any) => {
          this.listData = res.data.list;
          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        });
      }
    }
  }
  index() {
    this.showForm = !this.showForm;
    this.pageTitle = 'Data Transaksi Pembelian';
    this.getData();
  }
  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Transaksi Pembelian';
    this.isView = false;
    this.model.struk = this.LandaService.getImage("struk", "default.png");
    this.code();
    this.getBarang();
  }
  edit(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = val.nama;
    this.isView = false;
    this.isEdit = true;
    this.getData();
  }
  view(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.model.tanggal = this.toDate(val.tanggal);
    this.model.struk = this.LandaService.getImage("struk", val.struk);
    this.pageTitle = 'Data Pembelian' + val.invoice;
    this.isView = true;
    this.isEdit = false;
    this.getData();
    this.getBarang();
    this.getDetail(val.id);
  }
  save() {
    const final = {
      model : this.model,
      pembelian : this.listPembelian
    } ;
    this.LandaService.DataPost('/t_pembelian/save', final).subscribe((res:any) => {
      if(res.status_code === 200) {
        this.LandaService.alertSuccess('Berhasil', 'Data Berhasil Tersimpan');
        this.index();
      } else {
        this.LandaService.alertError('Mohon Maaf', res.errors);
      }
    });
  }
  delete (val) {
    const data = {
      id: val.id ? val.id : null,
      is_deleted : 1,
    };
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: 'Menghapus Data Transaksi Akan Berpengaruh Terhadap Data Lainya.',
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Ya, Hapus Data ini!',  
    }).then(result => {
      if(result.value) {
        this.LandaService.DataPost('/t_pembelian/hapus', data).subscribe((res:any) => {
          if(res.status_code === 200) {
            this.LandaService.alertSuccess('Berhasil', 'Data Transaksi Berhasil Terhapus');
            this.reloadDataTable();
          } else {
            this.LandaService.alertError('Mohon Maaf', res.errors);
          }
        });
      }
    });
  }
  reloadDataTable() {
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
        day: parseInt(day)
      };
      return obj;
    }
  }
  addRow(listPembelian) {
    const newRow = { 
      t_pembelian_id: 0,
      m_barang_id: 0,
      jumlah: 0,
      harga_beli:0
    };
    listPembelian.push(newRow);
  }
  removeRow(i) {
    this.listPembelian.splice(i);
  }
  harga(val, id) {
    this.LandaService.DataGet('/t_pembelian/barang_id', { id }).subscribe((res:any) => {
      val.harga_beli = res.data.harga_beli;
      val.jumlah = 1;
    });
  }
  subtotal(){
    let subtotal = 0;
    let total = 0;
    this.listPembelian.forEach((val) => {
      if(val.jumlah) {
        subtotal = val.jumlah * val.harga_beli;
        val.subtotal = subtotal;
        total += subtotal;
      }
    });
    this.model.total = total;
  }
  code() {
    let jumlah = this.listData.length + 1;
    let karakter = jumlah.toString().length;
    let zero = "0000";
    let huruf = "PMB";
    let potong;
    if(karakter == 1) {
      potong = zero.substring(0, zero.length -1);
    } else if ( karakter == 2) {
      potong = zero.substring(0, zero.length -2);
    } else if ( karakter == 3) {
      potong = zero.substring(0, zero.length -3);
    }
    let kode = huruf + potong + jumlah;
    this.model.invoice = kode;
  }
  getBarang(){
    this.LandaService.DataGet('/m_barang/index', {}).subscribe((res:any) => {
      this.listBarang = res.data.list;
    });
  }
  getDetail(id){
    console.log(id);
    this.LandaService.DataGet('/t_pembelian/detail', { id }).subscribe((res:any) => {
      this.listPembelian = res.data;
    });
  }
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.model.struk = {
          base64: reader.result as string,
        };
        this.myForm.patchValue({
          fileUpload: reader.result,
        });
      }
    }
  }
  viewStruk(modal, val) {
    this.modalService.open(modal, { size: "lg", backdrop: "static"});
    this.model.struk = this.LandaService.getImage("struk", val.struk);
  }
  
  

}
