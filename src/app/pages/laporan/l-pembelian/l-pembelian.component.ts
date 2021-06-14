import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from 'src/app/core/services/landa.service';
import { environment } from 'src/environments/environment';
import * as moment from "moment";

@Component({
  selector: 'app-l-pembelian',
  templateUrl: './l-pembelian.component.html',
  styleUrls: ['./l-pembelian.component.scss']
})
export class LPembelianComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  is_tampilkan: boolean;
  model: any = { };
  listData: any;
  showForm: boolean;
  daterange: any = {};
  data: any;
  apiUrl = environment.apiURL;
  options:any ={
    locale : { format : "YYYY-MM-DD" },
    alwaysShowCalendars: false,
  }

  constructor(private LandaService: LandaService, private router: Router) { }

  ngOnInit(): void {
    this.pageTitle = "Laporan Pembelian";
    this.breadCrumbItems = 
    [
      {
        label : 'Laporan'
      },
      {
        label : 'Laporan Pembelian',
        active : true
      }
    ];
    this.empty();
    this.data = [];
  }
  empty() {
    this.model = {

    };
  }
  index() {
    this.showForm = !this.showForm;
    this.pageTitle = 'Data Laporan Pembelian';
  }
  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = 'Tambah Laporan Pembelian';
    this.isView = false;
  }
  view(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.model.tanggal = this.toDate(val.tanggal);
    this.pageTitle = 'Data Pembelian' + val.invoice;
    this.isView = true;
    this.isEdit = false; 
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
  
  print(id) {
    window.open(this.apiUrl + "/l_pembelian/print?id=" + id, "_blank");
  }
  selectedDate(value : any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }
  tampil(is_export, is_print) {
    const data = {
      periode_mulai: "null",
      periode_selesai: "null",
      sekarang: "null",
      is_export,
      is_print
    };
    if(this.daterange.start !== undefined && this.daterange.end !== undefined) {
      data.periode_mulai = moment(this.daterange.start).format("YYYY-MM-DD");
      data.periode_selesai = moment(this.daterange.end).format("YYYY-MM-DD");
    }
    if( is_export === 1 || is_print === 1) {
      window.open(this.apiUrl + "/l_pembelian/index?" + $.param(data), "_blank");
    } else {
      this.LandaService.DataGet('/l_pembelian/index', data).subscribe((res:any) => {
        if(res.status_code === 200) { 
          this.listData = res.data.list.list;
          this.is_tampilkan = true;
          this.model.total = this.listData[0].total;
        } else {
          this.is_tampilkan = false;
        }
      });
    }
    // this.LandaService.alertError("Mohon Maaf","Tanggal harus diisi!");
  }

}
