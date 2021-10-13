import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as pbi from 'powerbi-client';
import { Report, models, service, IEmbedConfiguration } from 'powerbi-client';
import { PowerbiEmbeddedService } from './powerbi-embedded.service';
declare var powerbi: service.Service;


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
  selector: 'app-powerbi-embedded',
  templateUrl: './powerbi-embedded.component.html',
  styleUrls: ['./powerbi-embedded.component.css']
})
export class PowerbiEmbeddedComponent implements OnInit {
  report: Report;
  public embedConfig= {
    type: 'report',
    tokenType: "",
    accessToken: "",
    embedUrl: "",
    reportId: "",
    permissions: "",
    settings: {}
  };

  reportConfig: pbi.IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: undefined,
  };

  @ViewChild('embeddedReport')
    embeddedReport: ElementRef;
    config: any;
    phasedEmbeddingFlag = false;

    // Pass the basic embed configurations to the wrapper to bootstrap the report on first load
    // Values for properties like embedUrl, accessToken and settings will be set on click of button
    
    isEmbedded = false;
    /**
     * Map of event handlers to be applied to the embedded report
     */
    // Update event handlers for the report by redefining the map using this.eventHandlersMap
    // Set event handler to null if event needs to be removed
    // More events can be provided from here
    // https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/handle-events#report-events
    eventHandlersMap = new Map<string, (event?: service.ICustomEvent<any>) => void>([
      ['loaded', () => console.log('Report has loaded')],
      [
        'rendered',
        () => {
          console.log('Report has rendered');
  
          // Set displayMessage to empty when rendered for the first time
          if (!this.isEmbedded) {
            console.log('Use the buttons above to interact with the report using Power BI Client APIs.');
          }
  
          // Update embed status
          this.isEmbedded = true;
        },
      ],
      [
        'error',
        (event?: service.ICustomEvent<any>) => {
          if (event) {
            console.error(event.detail);
          }
        },
      ],
      ['visualClicked', () => console.log('visual clicked')],
      ['pageChanged', (event) => console.log(event)],
    ]);
  
    constructor(
      private pbiService: PowerbiEmbeddedService) { }

   ngOnInit() {
        // this.httpClient.get<any>(`https://aka.ms/CaptureViewsReportEmbedConfig`).subscribe(config => {
        //     this.config = config;
        //     const model = window['powerbi-client'].models;
        //     const embedConfig = {
        //         type: 'report',
        //         tokenType: model.TokenType.Embed,
        //         accessToken: config.EmbedToken.Token,
        //         embedUrl: config.EmbedUrl,
        //         permissions: model.Permissions.All,
        //         settings: {
        //             filterPaneEnabled: true,
        //             navContentPaneEnabled: true
        //         }
        //     };
        //    this.report = <Report>powerbi.embed(this.embeddedReport.nativeElement, embedConfig);

        //    this.report.on("loaded", () => {
        //     console.log("Report Loaded");
        //   });
        //   this.report.on("error", () => {
        //     console.log("Error");
        //   });
        
        // });

        this.pbiService.getEmbedConfig("a2bf73b0-7d7a-4c67-a7f7-f064821b76b2").subscribe(config => {
          this.config = config;
          const model = window['powerbi-client'].models;
          this.embedConfig = {
              type: 'report',
              tokenType : model.TokenType.Embed,
              accessToken: config.accessToken,
              embedUrl: config.reportConfig[0].embedUrl,
              reportId: config.reportConfig[0].reportId,
              permissions: model.Permissions.All,
              settings: {
                  filterPaneEnabled: true,
                  navContentPaneEnabled: true
               }
          };
          console.log(this.embedConfig);
        //  this.report = <Report>powerbi.embed(this.embeddedReport.nativeElement, embedConfig);

        //  this.report.on("loaded", () => {
        //   console.log("Report Loaded");
        // });
        // this.report.on("error", () => {
        //   console.log("Error");
        // });
      
      });


    //this.embedReport();


    }



    // async embedReport(): Promise<void> {
    //   let reportConfigResponse: ConfigResponse;
  
    //   // Get the embed config from the service and set the reportConfigResponse
    //   try {
    //     reportConfigResponse = await this.httpService.getEmbedConfig(`http://localhost:8000/embededPowerBI/getEmbedParamsForSingleReport/`).toPromise();
    //   } catch (error) {
    //     // Prepare status message for Embed failure
    //     //await this.prepareDisplayMessageForEmbed(errorElement, errorClass);
    //     //this.displayMessage = `Failed to fetch config for report. Status: ${error.statusText} Status Code: ${error.status}`;
    //     console.error(error);
    //     return;
    //   }
  
    //   // Update the reportConfig to embed the PowerBI report
    //   this.reportConfig = {
    //     ...this.reportConfig,
    //     id: reportConfigResponse.tokenId,
    //     embedUrl: reportConfigResponse.reportConfig.embedUrl,
    //     accessToken: reportConfigResponse.accessToken,
    //   };
  
    //   // Get the reference of the report-container div
    // }
}
