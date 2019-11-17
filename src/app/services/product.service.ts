import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {CrudService} from './crud.service';
import {Product} from '../models/product.model';
import {Observable, Subject} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  host = 'http://localhost:8080/';

  constructor(private router: Router , private  httpClient: HttpClient , private crudservice: CrudService  ) { }
  produits: Product[] = [];
  produitSubject = new Subject();
  form : FormData;
  emitProdcts() {
    this.produitSubject.next(this.produits);
  }
  SaveProduct(produit: Product) {
    this.crudservice.saveRessource('products', produit);

  }
  GetProducts(url) {
    this.crudservice.getRessource(url).then(
      (data) => {
       this.produits = data['_embedded'].products;
       this.emitProdcts();
      },
      (erreur) => {
        console.log(erreur);
      }
    );
   // console.log('data ' + data);
   // this.produits = data._embedded.produits;


  }
  DeleteProducts(produit: Product) {
    this.crudservice.deleteRessource('products', produit );

  }
// une methode de type Observable
  UploadPhoto(file: File, idProduct :number) : Observable<HttpEvent<{}>>{
    // une classe de formulaire dont on va mettre le fichier
    this.form= new FormData();
    this.form.append('file',file);
    console.log(this.form);
    // on ecrit une request avec un entete pour specifier le type de retour et le feedback de l upload parlons de progress
    const req = new HttpRequest('Post',this.host+'uploadPhoto/'+idProduct,this.form,{
      reportProgress : true,
      responseType : 'text' ,
    });
    // on retourn le request de type observable
    return this.httpClient.request(req);

  }

}
