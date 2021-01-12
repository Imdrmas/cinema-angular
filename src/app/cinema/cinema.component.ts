import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CinemaService } from '../service/CinemaService';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public cities;
  public cinemas;
  public salles;
  public currentCity;
  public currentCinema;
  public currentProjection;
  public selectedTickets: any[] = [];
  public cityName;
  public showDetails = false;
  public film;

  constructor(public cinemaService: CinemaService) { }

  ngOnInit() {
    this.cinemaService.getCities()
      .subscribe(data => {
      this.cities = data;
      });
  }
  moreDetails(id) {
    this.cinemaService.findFilmById(id).subscribe(data => {
      this.film = data;
     this.showDetails = !this.showDetails;
    })
  }
  onGetCinema(city: any) {
    this.currentCity = city;
    this.salles = undefined;
    this.cityName = city.name;
    this.cinemaService.getCinemas(city)
       .subscribe(data => {
         this.cinemas = data;
       });
  }

  onGetSalle(c: any) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle => {
           this.cinemaService.getProjections(salle).subscribe(salles => {
             salle.projections = salles;
           });
        });
      });
  }

  onGetPlaces(p: any) {
    this.currentProjection = p;
    this.cinemaService.getTicketPlaces(p)
      .subscribe(data => {
      this.currentProjection.tickets = data;
      this.selectedTickets = [];
    });
  }

  onSelectTicket(t) {
     if (!t.selected) {
       t.selected = true;
       this.selectedTickets.push(t);
     } else {
       t.selected = false;
       this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
     }
  }

  getTicketClass(t: any) {
    let str = 'btn ';
    if (t.reserve === true) {
      str += 'btn-danger';
    } else if (t.selected) {
      str += 'btn-warning';
    } else {
      str += 'btn-success';
    }
    return str;
  }

  onPayTicket(dataForm) {
   const tickets = [];
   this.selectedTickets.forEach(t => {
     tickets.push(t.id);
   });
   dataForm.tickets = tickets;
   this.cinemaService.puyTickets(dataForm).subscribe(data => {
     dataForm = data;
     alert('Tickets Réservés avec success !');
     this.onGetPlaces(this.currentProjection);
   });
  }
}