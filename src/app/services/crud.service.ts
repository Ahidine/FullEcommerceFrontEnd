import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
host = 'http://localhost:8080/';
  constructor(private httpClient: HttpClient , router: Router) { }

 public saveRessource(url: string, objet) {
    this.httpClient.post(this.host + url, objet).subscribe(
    (data) => {
        console.log('bien ajouter');
    },
    (error => {
      console.log('erreur :' + error);
    })
  );
  }
  public getRessource(url: string ) {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.host+url).subscribe(
        (data) => {
          resolve(data);
        },
        (error => {
          reject(error);
        })
      );
    });

  }
  public deleteRessource(url: string, objet) {
    this.httpClient.delete(this.host + url, objet).subscribe(
      (data) => {
        console.log('bien supprime');
      },
      (error => {
        console.log('erreur :' + error);
      })
    );
  }
}
