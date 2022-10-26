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
  public user: any;
  constructor(private authService: AuthService,
  ) {
    super()
  }

  public ngOnInit() {
    this.authService.userData.subscribe(
      user => this.user = user);
    this.updateMenu();
  }
  public updateMenu() {
    if (this.user.role === 'SuperAdmin') {
      this.menu = [
        { name: "Accueil", link: '/home', icon: 'list' },
        { name: 'Clients', link: '/list-client', icon: 'list' },
        {
          name: 'Intégration', children: [
            { name: 'Transport', link: '/list-file-edi' },
            { name: 'Logistique', link: '/logistique' },
          ],
          icon: 'list',
        },
        {
          name: "Facturation", children: [
            { name: 'Facturation transport', link: '/list-transaction' },
            { name: 'Facturation préparation', link: '/facturation-preparation' },
            { name: 'Facturation logistique', link: '/facturation-logistique' },
          ]
          , icon: 'list'
        },
        { name: "Frais Variables", link: '/frais', icon: 'list' },
        { name: "Rapports", link: '/rapports', icon: 'list' },
        { name: "Utilisateurs", link: '/users', icon: 'list' },
        {
          name: 'Fichiers archivés', children: [
            { name: 'Transport archivés', link: '/list-file-edi-archives' },
            { name: 'Logistique archivés', link: '/logistique-archives' },
          ],
          icon: 'list',
        },
      ];
    } else {
      this.menu = [
        { name: "Accueil", link: '/home', icon: 'list' },
//        { name: 'Clients', link: '/list-client', icon: 'list' },
//         {
//           name: 'Intégration', children: [
//             { name: 'Transport archivés', link: '/list-file-edi-archives' },
//             { name: 'Logistique archivés', link: '/logistique-archives' },
//           ],
//           icon: 'list',
//         },
//         {
//           name: "Facturation", children: [
//             { name: 'Facturation transport', link: '/list-transaction' },
//             { name: 'Facturation logistique', link: '/facturation-logistique' },
//           ]
//           , icon: 'list'
//         },
        { name: "Rapports", link: '/rapports', icon: 'list' },
        // {
        //   name: 'Fichiers archivés', children: [
        //     { name: 'Transport archivés', link: '/list-file-edi-archives' },
        //     { name: 'Logistique archivés', link: '/logistique-archives' },
        //   ],
        //   icon: 'list',
        // },
      ];
    }
  }
}
