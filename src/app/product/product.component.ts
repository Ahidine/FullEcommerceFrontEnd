import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpEventType, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ProductService} from '../services/product.service';
import {Product} from '../models/product.model';
import {Subscription} from 'rxjs';
import {CategoryService} from '../services/category.service';
import {AuthServiceService} from '../services/auth-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  // attribut pour stocker le fichier courant a uploader
  private currentFileUpload: any;
  // attribut pour stocker le pourcentage de l upload
  private pourcentage: number;
  // attribut time pour but de éviter le prb de cache on envoyant une réquet avec cet attribut afin de recuper les photos récentes
  private time ;
  constructor(private httpClient: HttpClient, private router: Router,
              private produitService: ProductService,
              private snap: ActivatedRoute,
              public  authService :AuthServiceService,
              private categoryService : CategoryService) {
    // souscrire au chaque changement de l'url de mm component
    this.router.events.subscribe((value => {
      if (value instanceof  NavigationEnd) {
        // chaque chargement on fait appel à une méthode qui va se charge de récupérer les données selon le genre du produit
        this.getUrl();
      }
    }));
  }

  produits: Product[];
  produitObservable: Subscription;
  currentProduct : Product;
  // état de changement est ce que on est dans un etat de changement ou non
  EditPhoto : boolean;
  // le fichier sélectionné
  SelectedFile : any;

  ngOnInit() {
// souscrire pour recevoir les données des produits
    this.produitObservable = this.produitService.produitSubject.subscribe(
      (data: Product[]) => {
        this.produits = data;
      }
    );

  }
// récuperer les bons produits
  getUrl() {
   // console.log('url avec id  : categories/'+this.snap.snapshot.params.id+'/produits')
    // récuperer les produits selectionné
    if (this.snap.snapshot.params.id == 'Selected')
    {
      // mettre la categorie courante undefined pour éviter le prb de selectionner de la cat au niveau de html
      this.categoryService.setCurrentCat(undefined);
      this.produitService.GetProducts('products/search/SelectedProducts');
    }
    // les produits en promo
    else if (this.snap.snapshot.params.id == 'Promotions'){
      this.categoryService.setCurrentCat(undefined);
      this.produitService.GetProducts('products/search/PromotionsProducts');
    }
    // les produits dispo
    else if (this.snap.snapshot.params.id == 'Disponibles'){
      this.categoryService.setCurrentCat(undefined);
      this.produitService.GetProducts('products/search/AvailablesProducts');
    }
    // sinon récuperer les produits d'un item parmi les item des cat
    else
      this.produitService.GetProducts('categories/'+this.snap.snapshot.params.id+'/produits');




  }
// lors de changement d'une photo d'un produit
  onEdit(p) {
    // on stocker le produit courant
    this.currentProduct=p;
    // on change le statut du changement
    this.EditPhoto = true ;

  }
// upload d'un fichier
  upload() {
    // on initialise le pourcentage à 0
    this.pourcentage = 0;
    // on charge le premier file et on le met dans le ficher courant
    this.currentFileUpload= this.SelectedFile.item(0);
    // on fait appel au produit service qui va se charger de communiquer avec le back end
    this.produitService.UploadPhoto(this.currentFileUpload,this.currentProduct.id).subscribe(
      event =>{
        // si l'event de type uploadProfress
      if (event.type==HttpEventType.UploadProgress){
        // on change le pourcentage
        this.pourcentage=Math.round(100*event.loaded/event.total);
        console.log(this.pourcentage);
      }
      // si l'event de type reponse
      else if (event instanceof HttpResponse){
        // on stocke la date actuelle afin de l'exploiter lors de chargement des images pour éviter le prb de cache
        this.time = Date.now();
        // on change le statut de changement de produit
        this.EditPhoto= false;

      }
    },
      error => {
      alert('problem de chargement  '+error);
      })

  }

  onChangeFile(event) {
    // si on change le fichier a uploader au moment de l upload on met le fichier dans l'attribut SelectedFile
    this.SelectedFile=event.target.files;

  }

  getTs() {
    return this.time;
  }

}
