import { Component, Input } from '@angular/core';
import { SidebarComponent as BaseSidebarComponent } from 'theme/components/sidebar';
import { AuthService } from '@services/*';
@Component({
  selector: 'app-sidebar',
  styleUrls: ['../../../theme/components/sidebar/sidebar.component.scss', './sidebar.component.scss'],
  templateUrl: '../../../theme/components/sidebar/sidebar.component.html',
})
export class SidebarComponent extends BaseSidebarComponent {
  public title = 'onDemand';
  public menu = [

  ];
  public user : any;
  constructor(private authService: AuthService,
    ) {
    super()
    }

  public ngOnInit() {
    this.authService.userData.subscribe(user => this.user = user);
    console.log("uuser",this.user.is_superadmin)
    this.updateMenu();
  }
  public updateMenu()
  {
    if (this.user.is_superadmin === true)
    {
      this.menu = [
    { name : "Accueil" , link: '/home', icon: 'list' },
    { name: 'Clients', link: '/list-client', icon: 'list' },
    { name: 'Fichiers EDI', link: '/list-file-edi', icon: 'list' },
    { name : "Fichiers livraisons" , link: '/list-transaction', icon: 'list' },
    { name : "Utilisateurs" , link: '/users', icon: 'list' },
    ];
    }else{
      this.menu = [
    { name : "Accueil" , link: '/home', icon: 'list' },
    { name: 'Clients', link: '/list-client', icon: 'list' },
    { name: 'Fichiers EDI', link: '/list-file-edi', icon: 'list' },
    { name : "Fichiers livraisons" , link: '/list-transaction', icon: 'list' },
    ];
    }
  }
}
