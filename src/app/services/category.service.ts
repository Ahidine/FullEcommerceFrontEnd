import { Injectable } from '@angular/core';
import {CrudService} from './crud.service';
import {Category} from '../models/category.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  host = 'http://localhost:8080/';
categories: Category[] = [];
categorySubject = new Subject();
currentCat : Category;
currentCatSubj = new Subject();
  constructor(private crudService: CrudService) { }
  // emettre les données de cat
  emitCategories() {
    this.categorySubject.next(this.categories);
  }
  emitCurrentCat(){
    this.currentCatSubj.next(this.currentCat);
  }
  // get les categories from une promise
  GetCategories() {
this.crudService.getRessource( 'categories').then(
  (data) => {
    this.categories = data['_embedded'].categories;
    this.emitCategories();
  },
  (erreur) => {
    console.log('erreur de categories');
    console.log(erreur);
  }
);
  }
  setCurrentCat(c: Category) {
    this.currentCat=c;
    this.emitCurrentCat();
  }
}
