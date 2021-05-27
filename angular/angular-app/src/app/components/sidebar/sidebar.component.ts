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
    this.authService.userData.subscribe(
    user => this.user = user);
    this.updateMenu();
  }
  public updateMenu()
  {
    if (this.user.role === 'SuperAdmin')
    {
      this.menu = [
    { name : "Accueil" , link: '/home', icon: 'list' },
    { name: 'Clients', link: '/list-client', icon: 'list' },
    {
      name: 'Intégration', children: [
      { name: 'Transport', link: '/list-file-edi' },
      { name: 'Logistique', link: '/logistique' },
      ],
      icon: 'list',
    },
    { name : "Fichiers livraisons" , link: '/list-transaction', icon: 'list' },
    { name : "Utilisateurs" , link: '/users', icon: 'list' },
    ];
    }else{
      this.menu = [
    { name : "Accueil" , link: '/home', icon: 'list' },
    { name: 'Clients', link: '/list-client', icon: 'list' },
    {
      name: 'Intégration', children: [
      { name: 'Transport', link: '/list-file-edi' },
      { name: 'Logistique', link: '/logistique' },
      ],
      icon: 'list',
    },
    { name : "Fichiers livraisons" , link: '/list-transaction', icon: 'list' },
    ];
    }
  }
}
