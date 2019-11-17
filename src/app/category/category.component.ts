import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../services/category.service';
import {Category} from '../models/category.model';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
categories: Category[];
categorySubscrption: Subscription;
currentCat : Category;
currentCatSub : Subscription;
  constructor(private categoryService: CategoryService , private router: Router) { }

  ngOnInit() {
    // souscrire au Category Subject pour recevoir les données from database
    this.categorySubscrption = this.categoryService.categorySubject.subscribe(
      (data: Category[]) => {
        this.categories = data;

    },
      (error) => {
        console.log('erreur');
        console.log(error);
      }
    );
    // intialiser la réception
    this.categoryService.GetCategories();
    // souscrire à la variable current catégorie
    this.currentCatSub=this.categoryService.currentCatSubj.subscribe((data : Category) => {
      this.currentCat= data;
    });
    // initialisation de réception de current category
    this.categoryService.emitCurrentCat();
    // récupérer les produits sélectionnées au premier chargement
    this.router.navigate(['produits/Selected']);


  }
  // lors de chaque clique sur un item parmi les category on charge les produits qui concerne ce item
  onProduct(c: Category) {
    // on change la catégorie courante
    this.categoryService.setCurrentCat(c);
    // on navigue pour récupérer les produits de ce item
    this.router.navigate(['/produits/' + c.id]);
  }
}
