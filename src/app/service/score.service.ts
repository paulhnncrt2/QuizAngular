import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private apiUrl = 'http://localhost:3000/scores';

  constructor(private http: HttpClient) { }

  saveScore(scoreData: { name: string, score: number }): Observable<any> {
    console.log('Saving score:', scoreData);
    return this.http.post(this.apiUrl, scoreData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getScores(): Observable<any[]> {
    console.log('Fetching scores from:', this.apiUrl);
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(
      'Something bad happened; please try again later.');
  }
}
