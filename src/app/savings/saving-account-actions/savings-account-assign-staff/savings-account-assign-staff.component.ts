/** Angular Imports */
import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Dates } from 'app/core/utils/dates';

/** Custom Services */
import { SavingsService } from 'app/savings/savings.service';
import { SettingsService } from 'app/settings/settings.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Savings Account Assign Staff Component
 */
@Component({
  selector: 'mifosx-savings-account-assign-staff',
  templateUrl: './savings-account-assign-staff.component.html',
  styleUrls: ['./savings-account-assign-staff.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS
  ]
})
export class SavingsAccountAssignStaffComponent implements OnInit {
  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Savings Account Assign Staff form. */
  savingsAssignStaffForm: UntypedFormGroup;
  /** Savings Account Id */
  accountId: any;
  /** Field Officer Data */
  fieldOfficerData: any;
  /** Savings Account Data */
  savingsAccountData: any;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {SavingsService} savingsService Savings Service
   * @param {Dates} dateUtils Date Utils
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SettingsService} settingsService Setting service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private savingsService: SavingsService,
    private dateUtils: Dates,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.accountId = this.route.snapshot.params['savingAccountId'];
    this.route.data.subscribe((data: { savingsAccountActionData: any }) => {
      this.savingsAccountData = data.savingsAccountActionData;
    });
  }

  /**
   * Creates the savings account assign staff form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.fieldOfficerData = this.savingsAccountData.fieldOfficerOptions;
    this.createSavingsAssignStaffForm();
  }

  /**
   * Creates the savings account assign staff form.
   */
  createSavingsAssignStaffForm() {
    this.savingsAssignStaffForm = this.formBuilder.group({
      toSavingsOfficerId: [''],
      assignmentDate: [
        '',
        Validators.required
      ]
    });
  }

  /**
   * Submits the form and assigns staff the saving account,
   * if successful redirects to the saving account.
   */
  submit() {
    const savingsAssignStaffFormData = this.savingsAssignStaffForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevAssignmentDate: Date = this.savingsAssignStaffForm.value.assignmentDate;
    if (savingsAssignStaffFormData.assignmentDate instanceof Date) {
      savingsAssignStaffFormData.assignmentDate = this.dateUtils.formatDate(prevAssignmentDate, dateFormat);
    }
    const data = {
      ...savingsAssignStaffFormData,
      fromSavingsOfficerId: '',
      dateFormat,
      locale
    };
    this.savingsService.executeSavingsAccountCommand(this.accountId, 'assignSavingsOfficer', data).subscribe(() => {
      this.router.navigate(['../../transactions'], { relativeTo: this.route });
    });
  }
}
