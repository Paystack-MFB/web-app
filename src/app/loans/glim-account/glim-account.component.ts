import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
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
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * GSIM Accounts Overview component.
 */
@Component({
  selector: 'mifosx-glim-account',
  templateUrl: './glim-account.component.html',
  styleUrls: ['./glim-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
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
  ]
})
export class GlimAccountComponent implements OnInit {
  /** Columns to be displayed in GLIM overview table. */
  displayedColumns: string[] = [
    'loanId',
    'clientId',
    'clientName',
    'loanAccountNumber',
    'clientPrincipalLoan',
    'groupPrincipalLoan'
  ];
  /** Data source for charge overview table. */
  dataSource: MatTableDataSource<any>;
  /** Charge Overview data */
  glimOverviewData: any;

  /** Paginator for charge overview table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /**
   * Retrieves the charge overview data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {MatDialog} dialog Dialog reference.
   */
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.route.data.subscribe((data: { glimData: any }) => {
      this.glimOverviewData = data.glimData;
    });
  }

  ngOnInit(): void {
    this.setLoanClientChargeOverview();
  }

  /**
   * Set GLIM Overview.
   */
  setLoanClientChargeOverview() {
    this.dataSource = new MatTableDataSource(this.glimOverviewData);
  }
}
