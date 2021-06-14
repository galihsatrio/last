import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { LandaService } from 'src/app/core/services/landa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-m-role',
  templateUrl: './m-role.component.html',
  styleUrls: ['./m-role.component.scss']
})
export class MRoleComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  modelParam: {
    nama,

  }
  listData: any;
  listAkses: any;
  showForm: boolean;
  listStatus: any;

  modelCheck: {
    DataMaster,
    DataTransaksi,
    DataLaporan
  }

  model: {
    nama,
    akses: {
      pengguna,
      barang,
      supplier,
      satuan,
      tipe_barang,
      konsumen,
      role,
      penjualan,
      pembelian,
      l_penjualan,
      l_pembelian,
      stok,
      l_stok

    }
  };

  constructor(private LandaService: LandaService, private Router: Router) { }

  ngOnInit(): void {
    this.pageTitle = "Role";
    this.breadCrumbItems = [
      {
        label : 'Master'
      },
      {
        label : 'Role User',
        active : true
      }
    ];
    this.modelParam = {
      nama: '',
    }
    this.getData();
    this.empty();
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
          limit: dataTablesParameters.length
        };
        this.LandaService.DataGet('/m_role/index', params).subscribe((res: any) => {
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
  empty() {
    this.modelCheck = {
      DataMaster: false,
      DataTransaksi: false,
      DataLaporan: false,
    }

    this.model = {
      nama: '',
      akses: {
        barang: false,
        pengguna: false,
        supplier: false,
        satuan: false,
        tipe_barang: false,
        konsumen: false,
        role: false,
        penjualan: false,
        pembelian: false,
        l_penjualan: false,
        l_pembelian: false,
        stok: false,
        l_stok: false
      }
    }
    this.getData();
  }
  checkAllKolom(val, arr) {
    arr.forEach((value: any, key: any) => {
      Object.keys(value).forEach(key => {
        if(val) {
          this.model.akses[value] = true;
        } else {
          this.model.akses[value] = false;
        }
      });
    });
  }
  index(){
    this.showForm = !this.showForm;
    this.pageTitle = 'Data Role';
    this.getData();
  }
  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Role';
    this.isView = false;
  }
  edit(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = 'Role : ' + val.nama;
    this.getData();
    this.isView = false;
    this.isEdit = true;
  }
  view(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = 'Role : ' + val.nama;
    this.getData();
    this.isView = true;
  }
  save(){
    const final = Object.assign(this.model);
    this.LandaService.DataPost('/m_role/save', final).subscribe((res:any) => {
      if(res.status_code === 200) {
        this.LandaService.alertSuccess('Berhasil', 'Data Role telah disimpan!');
        this.index();
      } else {
        this.LandaService.alertSuccess('Mohon Maaf', res.errors);
      }
    });
  }
  delete(val) {
    const data = {
      id:val != null ? val.id : null,
      is_deleted: 1
    };
    Swal.fire({
      title: 'Apakah anda yakin ?',
      text: 'Menghapus data Pengguna akan berpengaruh terhadap data lainnya',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Ya, Hapus data ini !'
    }).then(result => {
      if (result.value) {
        this.LandaService.DataPost('/m_role/delete', data).subscribe((res: any) => {
          if (res.status_code === 200) {
            this.LandaService.alertSuccess('Berhasil', 'Data Pengguna telah dihapus !');
            this.reloadDataTable();
          } else {
            this.LandaService.alertError('Mohon Maaf', res.errors);
          }
        });
      }
    });
  }
  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  
}
