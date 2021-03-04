import { Component, OnInit,HostBinding, } from '@angular/core';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends UpgradableComponent implements  OnInit  {
  limit = 15;
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;
  users = [];
  public advancedHeaders = this.usersService.getAdvancedHeaders();
  constructor(private usersService: UsersService,
    private router: Router,) {
    super();
  }

  ngOnInit(): void {
    this.getUsers ();
    console.log(this.users);
  }

  public getUsers ()
  {
    this.usersService.getAllUsers()
      .subscribe(res => {this.users = res; console.log(this.users);
      },
          // error => this.error = "error.message");
          // for fake data
          error => console.log(error));
  }
  public getProfile(is_superadmin)
  {
    if (is_superadmin)
    {
      return "SuperAdmin";
    }
    else{
      return "Admin";
    }
  }
  public getStatus(is_active)
  {
    if (is_active)
    {
      return "Active";
    }else{
      return "InActive";
    }
  }

}
