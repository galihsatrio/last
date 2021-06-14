import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-m-barang',
  templateUrl: './m-barang.component.html',
  styleUrls: ['./m-barang.component.scss']
})
export class MBarangComponent implements OnInit {
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
  supplier: any = {
    
  };
  tipe: any = {

  }
  satuan: any = {

  };
  modelParam: {
    nama,
    kode,
    supplier
  }
  listData: any;
  showForm: boolean;
  listSupplier: any;
  listTipe: any;
  listSatuan: any;
  

  constructor(private LandaService: LandaService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.pageTitle = "Master Barang";
    this.breadCrumbItems = 
    [
      {
        label: 'Master'
      }, 
      {
        label: 'Master Barang',
        active: true
      }
    ];
    this.modelParam = {
      nama: '',
      kode: '',
      supplier: ''
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
      ajax: (dataTablesParameters: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.LandaService.DataGet('/m_barang/index', params).subscribe((res: any) => {
          this.listData = res.data.list;
          this.listSupplier = res.data.supplier;
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
    this.pageTitle = 'Data Master Barang';
    this.getData();
    console.log(this.listData.harga_jual);

  }
  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Data Barang';
    this.isView = false;
    this.getSupplier();
    this.getTipe();
    this.getSatuan();
  }
  edit(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = 'Master Barang : ' + val.nama;
    this.isView = false;
    this.isEdit = true;
    this.getData();
    this.getTipe();
    this.getSupplier();
    this.getSatuan();
  }
  view(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = 'Master Barang : ' + val.nama;
    this.isView = true;
    this.isEdit = false;
    this.getData();
    this.getTipe();
    this.getSupplier();
    this.getSatuan();
  }
  save() {
    const final = Object.assign(this.model);
    this.LandaService.DataPost('/m_barang/save', final).subscribe((res: any) => {
      if (res.status_code === 200) {
        this.LandaService.alertSuccess('Berhasil', 'Data Barang Telah Tersimpan');
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
        this.LandaService.DataPost('/m_barang/hapus', data).subscribe((res: any) => {
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
  getSupplier() {
    this.LandaService.DataGet('/m_supplier/index', {}).subscribe((res:any) => {
      this.listSupplier = res.data.list;
    });
  }
  getTipe() {
    this.LandaService.DataGet('/m_tipe_barang/index', {}).subscribe((res:any) => {
      this.listTipe = res.data.list;
    });
  }
  getSatuan() {
    this.LandaService.DataGet('/m_satuan/index', {}).subscribe((res:any) => {
      this.listSatuan = res.data.list;
    });
  }
  // modal Supplier
  addSupplier(modal){
    this.modalService.open(modal, { size: "lg", backdrop: "static"});
    this.codeSupplier();
  }
  codeSupplier(){
    let jumlah = this.listSupplier.length + 1;
    let karakter = jumlah.toString().length;
    let huruf = "SP";
    let kode = huruf + jumlah;
    this.supplier.kode = kode;
  }
  saveSupplier() {
    const final = Object.assign(this.supplier);
    this.LandaService.DataPost('/m_supplier/save', final).subscribe((res:any) => {
      if(res.status_code === 200) {
        this.LandaService.alertSuccess('Berhasil', 'Data Supplier Telah Tersimpan');
        this.modalService.dismissAll();
      } else {
        this.LandaService.alertError("Mohon Maaf", res.errors);
      }
    });
  }
  //modal tipe barang
  addTipe(modal) {
    this.modalService.open(modal, { size: "lg", backdrop: "static" });
  }
  saveTipe() {
    const final = Object.assign(this.tipe);
    this.LandaService.DataPost('/m_tipe_barang/save', final).subscribe((res:any) => {
      if(res.status_code === 200) {
        this.LandaService.alertSuccess('Berhasil', 'Data Tipe Barang Berhasil Disimpan');
        this.modalService.dismissAll();
      } else {
        this.LandaService.alertError('Mohon Maaf', res.errors);
      }
    });
  }

  // modal satuan
  addSatuan(modal){
    this.modalService.open(modal, { size: "lg", backdrop: "static"});
  }
  saveSatuan() {
    const final = Object.assign(this.satuan);
    this.LandaService.DataPost('/m_satuan/save', final).subscribe((res:any) => {
      if(res.status_code === 200) {
        this.LandaService.alertSuccess('Berhasil', 'Data Satuan Berhasil Disimpan');
        this.modalService.dismissAll();
      } else {
        this.LandaService.alertError("Mohon Maaf", res.errors);
      }
    });
  }
}
