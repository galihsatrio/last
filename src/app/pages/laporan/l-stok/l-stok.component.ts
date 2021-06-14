import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from 'src/app/core/services/landa.service';

@Component({
  selector: 'app-l-stok',
  templateUrl: './l-stok.component.html',
  styleUrls: ['./l-stok.component.scss']
})
export class LStokComponent implements OnInit {
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
  modelParam: {
    nama,
  }
  listData: any;
  showForm: boolean;
  listBarang: any;

  constructor(private LandaService: LandaService) { }

  ngOnInit(): void {
    this.pageTitle = "Laporan Stok";
    this.breadCrumbItems = [
      {
        label: 'Laporan'
      },
      {
        label: "Laporan Stok",
        active: true
      }
    ];
    this.modelParam = {
      nama: ''
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
      ajax : (dataTablesParameters: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length
        };
        this.LandaService.DataGet('/l_stok/index', params).subscribe((res:any) => {
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
    this.pageTitle = 'Laporan Stok';
    this.getData();
  }

}
