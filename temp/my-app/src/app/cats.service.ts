import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cat } from './models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatsService {

  constructor(private http: HttpClient) { }

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>("https://cat-fact.herokuapp.com/facts")
  }
}