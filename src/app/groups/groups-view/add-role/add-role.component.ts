/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/** Custom Services */
import { GroupsService } from '../../groups.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Groups Add Role Component
 */
@Component({
  selector: 'mifosx-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS
  ]
})
export class AddRoleComponent implements OnInit {
  /** Groups Add Role Form */
  groupsAddRoleForm: UntypedFormGroup;
  /** Client Member Data */
  clientMemberData: any;
  /** Role Data */
  roleData: any;
  /** Groups Account and Template Data */
  groupAndTemplateData: any;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {GroupsService} groupsService Groups Service
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private groupsService: GroupsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.data.subscribe((data: { groupAndTemplateData: any }) => {
      this.groupAndTemplateData = data.groupAndTemplateData;
    });
  }

  ngOnInit() {
    this.clientMemberData = this.groupAndTemplateData.activeClientMembers;
    this.roleData = this.groupAndTemplateData.availableRoles;
    this.createGroupsAddRoleForm();
  }

  /**
   * Creates the add group role form.
   */
  createGroupsAddRoleForm() {
    this.groupsAddRoleForm = this.formBuilder.group({
      clientId: [
        '',
        Validators.required
      ],
      role: [
        '',
        Validators.required
      ]
    });
  }

  /**
   * Submits the form and assigns the group role.
   */
  submit() {
    this.groupsService
      .executeGroupCommand(this.groupAndTemplateData.id, 'assignRole', this.groupsAddRoleForm.value)
      .subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
