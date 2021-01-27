import { Component, HostBinding ,AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListOrderService } from '../list-orders/list-orders.service';
import { UpgradableComponent } from '../../../theme/components/upgradable';

declare const google: any;  

@Component({
  selector: 'app-details-order',
  templateUrl: './details-order.component.html',
  styleUrls: ['./details-order.component.scss']
})
export class DetailsOrderComponent extends UpgradableComponent implements AfterViewInit {

  public order: any;
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;

  public constructor(private route: ActivatedRoute, private tablesService: ListOrderService) {
    super();
    let arrayOrder = this.tablesService.getOrderById(this.route.snapshot.paramMap.get('id'));
    this.order = arrayOrder[0];
 
  }
  

  public ngAfterViewInit() {
    const mapOptions = {
      center: {  lat: parseFloat(this.order.address.latitude) , lng: parseFloat(this.order.address.longitude)},
      zoomControl: true,
      zoom: 11,
      maxZoom: 20,
      minZoom: 5,
      scrollwheel: false,
      mapMaker: true,
    };
    const map = new google.maps.Map(document.querySelector('.map__window'), mapOptions);
    const activeMarkerImage = 'assets/images/active_marker.png';
    const markers = {
      client_place: {
        marker: new google.maps.Marker({
          map,
          position: { lat: parseFloat(this.order.address.latitude) , lng: parseFloat(this.order.address.longitude)},
          animation: google.maps.Animation.DROP,
          icon: activeMarkerImage,
        }),
      },
    };
  }

}
