/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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

/** Custom Services */
import { SystemService } from 'app/system/system.service';

/** Custom Components */
import { ReportParameterDialogComponent } from '../report-parameter-dialog/report-parameter-dialog.component';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Edit Report Component.
 */
@Component({
  selector: 'mifosx-edit-report',
  templateUrl: './edit-report.component.html',
  styleUrls: ['./edit-report.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatCheckbox,
    CdkTextareaAutosize,
    FaIconComponent,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator
  ]
})
export class EditReportComponent implements OnInit {
  /** Report Data. */
  reportData: any;
  /** Report Template Data. */
  reportTemplateData: any;
  /** Report Parameters Data. */
  reportParametersData: any[] = [];
  /** Data passed to dialog. */
  dataForDialog: { allowedParameters: any[]; parameterName: string; reportParameterName: string } = {
    allowedParameters: undefined,
    parameterName: undefined,
    reportParameterName: undefined
  };
  /** Report Form. */
  reportForm: UntypedFormGroup;
  /** Columns to be displayed in report parameters table. */
  displayedColumns: string[] = [
    'parameterName',
    'parameterNamePassed',
    'actions'
  ];
  /** Data source for report parameters table. */
  dataSource: MatTableDataSource<any>;
  /** Boolean to check if report parameters data is changed or not. */
  isReportParametersChanged: Boolean = false;

  reportCategoryTypeOptions: string[] = [
    'Client',
    'Loan',
    'Savings',
    'Fund',
    'Accounting'
  ];

  /** Paginator for report parameters table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for report parameters table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
   * Retrieves the report and report template data from `resolve`.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {SystemService} systemService System Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog Reference.
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService,
    private dialog: MatDialog
  ) {
    this.route.data.subscribe((data: { report: any; reportTemplate: any }) => {
      this.reportData = data.report;
      this.reportParametersData = data.report.reportParameters ? data.report.reportParameters : [];
      this.reportTemplateData = data.reportTemplate;
      this.dataForDialog.allowedParameters = this.reportData.allowedParameters;
    });
  }

  /**
   * Creates the report form.
   */
  ngOnInit() {
    this.createReportForm();
    this.setReportParameters();
    this.toggleVisibility();
  }

  /**
   * Initializes the data source, paginator and sorter for report parameters table.
   */
  setReportParameters() {
    this.dataSource = new MatTableDataSource(this.reportParametersData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Creates and sets the report form.
   */
  createReportForm() {
    this.reportForm = this.formBuilder.group({
      reportName: [
        { value: this.reportData.reportName, disabled: this.reportData.coreReport },
        Validators.required
      ],
      reportCategory: [
        {
          value: this.reportData.reportCategory ? this.reportData.reportCategory : '',
          disabled: this.reportData.coreReport
        }
      ],
      description: [
        {
          value: this.reportData.description ? this.reportData.description : '',
          disabled: this.reportData.coreReport
        }
      ],
      reportType: [
        { value: this.reportData.reportType, disabled: this.reportData.coreReport },
        Validators.required
      ],
      reportSubType: [
        {
          value: this.reportData.reportSubType ? this.reportData.reportSubType : '',
          disabled: this.reportData.reportType !== 'Chart' || this.reportData.coreReport
        }
      ],
      useReport: [this.reportData.useReport ? this.reportData.useReport : false],
      reportSql: [
        {
          value: this.reportData.reportSql,
          disabled: this.reportData.coreReport || this.reportData.reportType === 'Pentaho'
        },
        Validators.required

      ]
    });
  }

  /**
   * Adds a new report parameter.
   */
  addReportParameter() {
    this.dataForDialog.parameterName = undefined;
    this.dataForDialog.reportParameterName = undefined;
    const addReportParameterDialogRef = this.dialog.open(ReportParameterDialogComponent, {
      data: this.dataForDialog
    });
    addReportParameterDialogRef.afterClosed().subscribe((response: any) => {
      if (response !== '') {
        this.reportParametersData.push({
          id: '',
          parameterName: this.reportTemplateData.allowedParameters.find(
            (allowedParameter: any) => allowedParameter.id === response.parameterName
          ).parameterName,
          parameterId: response.parameterName,
          reportParameterName: response.reportParameterName ? response.reportParameterName : undefined
        });
        this.dataSource.connect().next(this.reportParametersData);
        this.isReportParametersChanged = true;
      }
    });
  }

  /**
   * Edits report parameter.
   * @param {any} reportParameter Report Parameter.
   */
  editReportParameter(reportParameter: any) {
    this.dataForDialog.parameterName = reportParameter.parameterId;
    this.dataForDialog.reportParameterName = reportParameter.reportParameterName;
    const editReportParameterDialogRef = this.dialog.open(ReportParameterDialogComponent, {
      data: this.dataForDialog
    });
    editReportParameterDialogRef.afterClosed().subscribe((response: any) => {
      if (response !== '') {
        this.reportParametersData[this.reportParametersData.indexOf(reportParameter)] = {
          id: reportParameter.id,
          parameterName: this.reportTemplateData.allowedParameters.find(
            (allowedParameter: any) => allowedParameter.id === response.parameterName
          ).parameterName,
          parameterId: response.parameterName,
          reportParameterName: response.reportParameterName
        };
        this.dataSource.connect().next(this.reportParametersData);
        this.isReportParametersChanged = true;
      }
    });
  }

  /**
   * Deletes the report parameter.
   * @param {any} reportParameter Report Parameter.
   */
  deleteReportParameter(reportParameter: any) {
    const deleteReportDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `report parameter ${reportParameter.parameterName}` }
    });
    deleteReportDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.reportParametersData.splice(this.reportParametersData.indexOf(reportParameter), 1);
        this.dataSource.connect().next(this.reportParametersData);
        this.isReportParametersChanged = true;
      }
    });
  }

  /**
   * Toggles the visibility status of Report Sub Type dropdown.
   */
  toggleVisibility() {
    this.reportForm.get('reportType').valueChanges.subscribe((type) => {
      switch (type) {
        case 'Chart':
          this.reportForm.get('reportSubType').enable();
          this.reportForm.get('reportSql').enable();
          break;
        case 'Pentaho':
          this.reportForm.get('reportSql').disable();
          this.reportForm.get('reportSubType').disable();
          break;
        default:
          this.reportForm.get('reportSql').enable();
          this.reportForm.get('reportSubType').disable();
      }
    });
  }

  /**
   * Submits the report form and updates report,
   * if successful redirects to view updated report.
   */
  submit() {
    if (this.reportData.coreReport) {
      this.reportForm.value.reportParameters = undefined;
    } else {
      this.reportForm.value.reportParameters = this.reportParametersData;
      this.reportForm.value.reportParameters.map(function (reportParameter: any) {
        reportParameter.parameterName = undefined;
        return reportParameter;
      });
    }
    this.systemService.updateReport(this.reportData.id, this.reportForm.value).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
