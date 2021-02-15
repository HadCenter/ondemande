import { Component, Input } from '@angular/core';

import { SidebarComponent as BaseSidebarComponent } from 'theme/components/sidebar';

@Component({
  selector: 'app-sidebar',
  styleUrls: ['../../../theme/components/sidebar/sidebar.component.scss', './sidebar.component.scss'],
  templateUrl: '../../../theme/components/sidebar/sidebar.component.html',
})
export class SidebarComponent extends BaseSidebarComponent {
  public title = 'onDemand';
  public menu = [

    { name: 'Clients', link: '/list-client', icon: 'list' },
    { name: 'Fichiers EDI', link: '/list-file-edi', icon: 'list' },
    { name : "Fichiers livraisons" , link: '/list-file-delivery', icon: 'list' },
    { name : "Utilisateurs" , link: '/users', icon: 'list' },
  ];
}
