/** Angular Imports */
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-collaterals',
  templateUrl: './collaterals.component.html',
  styleUrls: ['./collaterals.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    FaIconComponent,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator
  ]
})
export class CollateralsComponent implements OnInit {
  /** Collateral Data */
  collateralData: any;
  /** Columns to be displayed in the Collaterals Table */
  displayedColumns: string[] = [
    'name',
    'quality',
    'basePrice',
    'basePercentage',
    'unitType'
  ];
  /** DataSource for the Collateral Table */
  dataSource: MatTableDataSource<any>;

  /** Paginator for the Collateral Table */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for Collateral Table */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
   * Retrieves the Collaterals data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { collaterals: any }) => {
      this.collateralData = data.collaterals;
    });
  }

  /**
   * Filters data in collateral table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Sets the collateral table.
   */
  ngOnInit() {
    this.setCollaterals();
  }

  /**
   * Initializes the data source, paginator and sorter for collateral table.
   */
  setCollaterals() {
    this.dataSource = new MatTableDataSource(this.collateralData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
