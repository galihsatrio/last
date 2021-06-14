import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from 'src/app/core/services/landa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-m-tipe-barang',
  templateUrl: './m-tipe-barang.component.html',
  styleUrls: ['./m-tipe-barang.component.scss']
})
export class MTipeBarangComponent implements OnInit {
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
    this.pageTitle = "Master Tipe Barang";
    this.breadCrumbItems = 
    [
      {
        label : 'Master'
      },
      {
        label : 'Master Tipe Barang',
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
        this.LandaService.DataGet('/m_tipe_barang/index', params).subscribe((res:any) => {
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
    this.pageTitle = 'Data Master Tipe Barang';
    this.getData();
  }
  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Tipe Barang';
    this.isView = false;
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
    this.LandaService.DataPost('/m_tipe_barang/save', final).subscribe((res:any) => {
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
        this.LandaService.DataPost('/m_tipe_barang/hapus', data).subscribe((res:any) => {
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

}
