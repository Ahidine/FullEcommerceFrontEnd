import {Product} from './product.model';

export class Category {
  public id: number;
  constructor(public nom: string , public description: string , public produits: Product[] ) {}

}
