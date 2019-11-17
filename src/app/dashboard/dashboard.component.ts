import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {AuthServiceService} from '../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  authentifier : boolean ;
  authObservable : Subscription;


  constructor(private authService : AuthServiceService, private router : Router) { }

  ngOnInit() {
    // souscrire a la variable qui décrit le statut d'un utilisateur si connecté ou non
    this.authObservable = this.authService.authSubject.subscribe((statut : boolean) =>{
      this.authentifier= statut;
    });
    // charger les données à partir de local storage  (token)
    this.authService.loadUserFromLocalStorage();
    // initialiser la réception du statut
    this.authService.emitAuth();
  }
// getter de l'attribut authentifier
  auth() {
    return this.authentifier;
  }
// se déconnecté
  //changé le statut de l'utilisateur ( non auth)
  //supprimé token
  //se dériger vers la page de login
  onLogout() {
    this.authService.changeAuth(false);
    localStorage.removeItem('userToken');
    this.router.navigate(['login']);
  }
}
