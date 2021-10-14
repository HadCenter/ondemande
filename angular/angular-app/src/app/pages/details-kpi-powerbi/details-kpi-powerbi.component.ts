import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsKpiPowerbiService } from './details-kpi-powerbi.service';




export interface ConfigResponse {
  tokenId: string;
  accessToken: string;
  reportConfig: {
    reportId: string,
    reportName: string,
    embedUrl: string;
  };
}


@Component({
  selector: 'app-details-kpi-powerbi',
  templateUrl: './details-kpi-powerbi.component.html',
  styleUrls: ['./details-kpi-powerbi.component.css']
})
export class DetailsKpiPowerbiComponent implements OnInit {
  public embedConfig = {
    type: 'report',
    tokenType: "",
    accessToken: "",
    embedUrl: "",
    reportId: "",
    permissions: "",
    settings: {}
  };
  constructor(private route: ActivatedRoute, private detailkpi: DetailsKpiPowerbiService) { }

  ngOnInit(): void {
console.log("ON INIIIIIIIIIIIIIIIIIIIIIIIIIT");
    this.getDetailKpi(this.route.snapshot.params.id);

  }


  getDetailKpi(id: string) {
    this.detailkpi.getRapport(id).subscribe(config => {
      const model = window['powerbi-client'].models;
      this.embedConfig = {
        type: 'report',
        tokenType: model.TokenType.Embed,
        accessToken: config.accessToken,
        embedUrl: config.reportConfig[0].embedUrl,
        reportId: config.reportConfig[0].reportId,
        permissions: model.Permissions.All,
        settings: {
          filterPaneEnabled: true,
          navContentPaneEnabled: true
        }
      };
    });
    console.log(this.embedConfig);
  }
}
