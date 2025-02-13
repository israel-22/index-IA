import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class apiService {

  private apiUrl = 'https://us-central1-gothic-calling-450712-s0.cloudfunctions.net/function-1';

  constructor(private http: HttpClient) { }

  // Método para realizar una petición GET
  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Método para realizar una petición POST
  postData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
