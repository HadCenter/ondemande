import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as pbi from 'powerbi-client';
import { Report, models, service, IEmbedConfiguration } from 'powerbi-client';

declare var powerbi: service.Service;


export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}


@Component({
  selector: 'app-powerbi-embedded',
  templateUrl: './powerbi-embedded.component.html',
  styleUrls: ['./powerbi-embedded.component.css']
})
export class PowerbiEmbeddedComponent implements OnInit {
  report: Report;

  @ViewChild('embeddedReport')
    embeddedReport: ElementRef;
    config: any;

    constructor(private httpClient: HttpClient) { }

   ngOnInit() {
        this.httpClient.get<any>(`https://aka.ms/CaptureViewsReportEmbedConfig`).subscribe(config => {
            this.config = config;
            const model = window['powerbi-client'].models;
            const embedConfig = {
                type: 'report',
                tokenType: model.TokenType.Embed,
                accessToken: config.EmbedToken.Token,
                embedUrl: config.EmbedUrl,
                permissions: model.Permissions.All,
                settings: {
                    filterPaneEnabled: true,
                    navContentPaneEnabled: true
                }
            };
           this.report = <Report>powerbi.embed(this.embeddedReport.nativeElement, embedConfig);

           this.report.on("loaded", () => {
            console.log("Report Loaded");
          });
          this.report.on("error", () => {
            console.log("Error");
          });
        
        });
    }
}
