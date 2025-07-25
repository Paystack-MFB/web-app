/** Angular Imports */
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Components */
import { SmsCampaignStepComponent } from '../sms-campaign-stepper/sms-campaign-step/sms-campaign-step.component';
import { CampaignMessageStepComponent } from '../sms-campaign-stepper/campaign-message-step/campaign-message-step.component';

/** Custom Services */
import { OrganizationService } from 'app/organization/organization.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import { MatStepper, MatStepperIcon, MatStep, MatStepLabel } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CampaignPreviewStepComponent } from '../sms-campaign-stepper/campaign-preview-step/campaign-preview-step.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Create SMS Campaign Component
 */
@Component({
  selector: 'mifosx-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatStepper,
    MatStepperIcon,
    FaIconComponent,
    MatStep,
    MatStepLabel,
    SmsCampaignStepComponent,
    CampaignMessageStepComponent,
    CampaignPreviewStepComponent
  ]
})
export class CreateCampaignComponent {
  /** SMS Campaign Template */
  smsCampaignTemplate: any;
  /** Run report headers */
  templateParameters: any;

  /** SMS Campaign Step */
  @ViewChild(SmsCampaignStepComponent, { static: true }) smsCampaignStep: SmsCampaignStepComponent;
  /** Campaign Message Step */
  @ViewChild(CampaignMessageStepComponent, { static: true }) campaignMessageStep: CampaignMessageStepComponent;

  /**
   * Fetches campaign template from `resolve`
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {OrganizationService} organizationService Organization Service
   * @param {SettingsService} settingsService Settings Service
   * @param {Dates} dateUtils Date Utils
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private settingsService: SettingsService,
    private dateUtils: Dates
  ) {
    this.route.data.subscribe((data: { smsCampaignTemplate: any }) => {
      this.smsCampaignTemplate = data.smsCampaignTemplate;
    });
  }

  /**
   * Retrieves SMS Campaign forms in a single form group to check validity.
   */
  get smsCampaignForm() {
    return this.smsCampaignStep.smsCampaignFormGroup;
  }

  /**
   * Retrieves SMS Campaign object after formatting form values.
   */
  get smsCampaign() {
    return {
      ...this.smsCampaignStep.smsCampaignFormGroupValue,
      ...this.campaignMessageStep.campaignMessage
    };
  }

  /**
   * Passes template parameters to campaign-message-step.
   * @param {any} $event Template parameters
   */
  setParameters($event: any) {
    this.templateParameters = $event;
  }

  /**
   * Creates SMS Campaign.
   */
  submit() {
    // TODO: Update once language and date settings are setup
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const dateTimeFormat = 'dd MMMM yyyy HH:mm:ss';
    const smsCampaign = {
      ...this.smsCampaign,
      campaignType: this.smsCampaign.isNotification ? 2 : 1,
      submittedOnDate: this.dateUtils.formatDate(new Date(), dateFormat),
      dateTimeFormat,
      dateFormat,
      locale
    };
    if (this.smsCampaign.triggerType === 2) {
      const prevRecurrenceDate: Date = smsCampaign.recurrenceStartDate;
      smsCampaign.recurrenceStartDate = this.dateUtils.formatDate(prevRecurrenceDate, dateTimeFormat);
    }
    this.organizationService.createSmsCampaign(smsCampaign).subscribe((response: any) => {
      this.router.navigate(
        [
          '../',
          response.resourceId
        ],
        { relativeTo: this.route }
      );
    });
  }
}
