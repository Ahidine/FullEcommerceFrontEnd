import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  auth: boolean;
  authSubject = new Subject();
  currentUser: UserModel;
  token;
  // tableau de test
  users: UserModel[] = [new UserModel("admin", "admin", ["ADMIN", "USER"]),
    new UserModel("user", "user", ["USER"])
  ];

  constructor() {
  }
// emettre le statut de l'auth
  emitAuth() {
    this.authSubject.next(this.auth);
  }
// chnager le statut
  changeAuth(statut: boolean) {
    this.auth = statut;
    this.emitAuth();
  }
// se connecter
  login(user: any) {
    // cherche le user parmi les users qui existe
    this.users.forEach((u) => {
      if (u.username == user.username && u.password == user.password) {
        // change le staut
        this.changeAuth(true);
        // mettre le currentUser
        this.currentUser = u;
        // stocker le token comme un objet
        this.token = {username: this.currentUser.username, roles: this.currentUser.role};
        // faire appel au methode qui va se charger de stockage de token au niveau de localstorage
        this.saveUserAuth();
      }
    })
  }
// verifier s'il est admin
  isAdmin() {
    if (this.auth) {
      // s'il trouve admin la valeur ca sera > -1 sinon si -1
      if (this.currentUser.role.indexOf('ADMIN') > -1) {
        return true;
      }
    }
    return false;
  }
// stockage de token au niveau de localstorage
  saveUserAuth() {
    if (this.auth) {
      localStorage.setItem('userToken', btoa(JSON.stringify(this.token)));
    }
  }
// charger les données from localstorage
  loadUserFromLocalStorage() {
    let token = localStorage.getItem('userToken');
    if (token)
        {    let user = JSON.parse(atob(token));
        // mettre les donnes de l utilisateur a partir de token dans currentUser
            this.currentUser = new UserModel(user.username, '', user.roles);
            // changer le statut de auth
            this.auth=true;
        }

  }
}
