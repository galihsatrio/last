import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from 'src/app/core/services/landa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-m-konsumen',
  templateUrl: './m-konsumen.component.html',
  styleUrls: ['./m-konsumen.component.scss']
})
export class MKonsumenComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  model: any = { };
  modelParam: { nama };
  listData: any;
  showForm: boolean;
  
  constructor(private LandaService: LandaService, private router: Router) { }

  ngOnInit(): void {
    this.pageTitle = "Master Konsumen";
    this.breadCrumbItems = 
    [
      {
        label : 'Master'
      },
      {
        label : 'Master Konsumen',
        active : true
      }
    ];
    this.modelParam = { 
      nama : ''
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
        this.LandaService.DataGet('/m_konsumen/index', params).subscribe((res:any) => {
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
    this.pageTitle = 'Data Master Konsumen';
    this.getData();
  }
  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Konsumen';
    this.isView = false;
    this.code();
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
    this.pageTitle = 'Edit ' + val.nama;
    this.isView = true;
    this.isEdit = false;
    this.getData();
  }
  save() {
    const final = Object.assign(this.model);
    this.LandaService.DataPost('/m_konsumen/save', final).subscribe((res:any) => {
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
      text: 'Menghapus Data Master Akan Berpengaruh Terhadap Data Lainya.',
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Ya, Hapus Data ini!',  
    }).then(result => {
      if(result.value) {
        this.LandaService.DataPost('/m_konsumen/hapus', data).subscribe((res:any) => {
          if(res.status_code === 200) {
            this.LandaService.alertSuccess('Berhasil', 'Data Master Berhasil Terhapus');
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
  code(){
    let jumlah = this.listData.length + 1;
    let karakter = jumlah.toString().length;
    let zero = "000";
    let huruf = "CUS";
    let potong;
    if(karakter == 1) {
      potong = zero.substring(0, zero.length -1);
    } else if(karakter == 2) {
      potong = zero.substring(0, zero.length -2);
    } else if ( karakter == 3) {
      potong = zero.substring(0, zero.length -3);
    }
    let kode = huruf + potong + jumlah;
    this.model.kode = kode;
  }

}
