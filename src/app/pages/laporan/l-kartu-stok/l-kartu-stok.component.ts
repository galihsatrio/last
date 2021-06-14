import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import * as moment from "moment";
import { LandaService } from 'src/app/core/services/landa.service';

@Component({
  selector: 'app-l-kartu-stok',
  templateUrl: './l-kartu-stok.component.html',
  styleUrls: ['./l-kartu-stok.component.scss']
})
export class LKartuStokComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance : Promise<DataTables.Api>;
  dtOptions: any;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  is_tampilkan: boolean;
  model: {
    m_barang_id
  };
  listData: any;
  showForm: boolean;
  daterange: any = {};
  data: any;
  apiUrl = environment.apiURL;
  options: any = {
    locale : { format : "YYY-MM-DD" },
    alwaysShowCalendars: false,
  }
  listBarang: any;
  stokAwal: any;


  constructor(private LandaService: LandaService) { }

  ngOnInit(): void {
    this.pageTitle = "Laporan Kartu Stok";
    this.breadCrumbItems = [
      {
        label : 'Laporan'
      },
      {
        label : 'Laporan Kartu Stok',
        active : true
      }
    ];
    this.model = {
      m_barang_id: ''
    }
    this.empty();
    this.data = [];
    this.getBarang();
  }
  empty() {

  }
  selectedDate(value: any, datepicker:any) {  
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
      m_barang_id: this.model.m_barang_id,
      is_export,
      is_print
    };
    data.periode_mulai = moment(this.daterange.start).format("YYYY-MM-DD");
    data.periode_selesai = moment(this.daterange.end).format("YYYY-MM-DD");
  
    if( is_export === 1 || is_print === 1) {
      window.open(this.apiUrl + "/l_kartu_stok/index?" + $.param(data), "_blank");
    } else {
      this.LandaService.DataGet('/l_kartu_stok/index', data).subscribe((res:any) => {
        if(res.status_code === 200) { 
          this.listData = res.data.list.list;
          this.stokAwal = res.data.list.stokAwal;
          this.is_tampilkan = true;
        } else {
          this.is_tampilkan = false;
        }
      });
    }
  }
  getBarang(){
    this.LandaService.DataGet('/m_barang/index', {}).subscribe((res:any) => {
      this.listBarang = res.data.list;
    });
  }
}
