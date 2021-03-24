export class Contact {

  idContact: number;
  codeClient: string;
  nomClient: string;
  email: string;
  archived: boolean;

constructor(idContact: number, codeClient: string, nomClient: string, email: string, archived: boolean) {
  this.idContact= idContact;
  this.codeClient= codeClient;
  this.nomClient= nomClient;
  this.email= email;
  this.archived= archived;
}
}