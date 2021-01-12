import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  host = 'http://localhost:8080';

  constructor(private http: HttpClient) { }


  public getCities() {
    return this.http.get(this.host + '/cities');
  }

  getCinemas(city: any) {
    return this.http.get(city._links.cinemas.href);
  }

  getSalles(cinema: any) {
    return this.http.get(cinema._links.salles.href);
  }

  getProjections(salle: any) {
    const url = salle._links.projections.href.replace('{?projection}', '');
    return this.http.get(url + '?projection=p1');
  }

  getTicketPlaces(proj: any) {
    const url = proj._links.tickets.href.replace('{?projection}', '');
    return this.http.get(url + '?projection=ticketsProj');
  }

  puyTickets(dataForm) {
    return this.http.post(this.host + '/puyTickets', dataForm);
  }
  findFilmById(id) {
    return this.http.get(this.host + `/findFilmById/${id}`);
  }
}
