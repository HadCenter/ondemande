import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImportFileEdiService } from './import-file-edi.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-import-file-edi',
  templateUrl: './import-file-edi.component.html',
  styleUrls: ['./import-file-edi.component.scss']
})
export class ImportFileEdiComponent implements OnInit {
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  constructor(private importFileService: ImportFileEdiService, private fb: FormBuilder, private router: Router)
  {
    this.dropdownRefresh();
  }
  public listObject : { id: string, nom_client: string }[] = [];
  public listItems : Array<string> = [];
  ngOnInit(): void {
    componentHandler.upgradeDom();
  }
  dropdownRefresh()
  {
    this.importFileService.getAllClients().subscribe(
      data => {
          data.forEach(element => {
              this.listItems.push(element["nom_client"]);
              var id = element['id']; var nomClient = element['nom_client'];
              var client = {
                  id : id,
                  nom_client : nomClient
              };
              this.listObject.push(client);
          });
          console.log(this.listItems);
          console.log(this.listObject);
      });
  }
  get f(){
    return this.myForm.controls;
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  submit()
  {
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);
    var nom = this.myForm.getRawValue().name;
    var client = this.listObject.find(element => element.nom_client === nom);
    formData.append('client', client.id);
    console.log(formData.get('file'));
    console.log(formData.get('client'));
    this.importFileService.upload(formData).subscribe(
      (res) => {
        console.log("success");
        this.router.navigate(['/list-file-edi']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  public onInputChange(event) {
    event.target.required = true;
  }


}
