import { BlockParameter } from '@angular/compiler'; //why this import?? where did it originate
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, throwError } from 'rxjs';

export interface GeocodingResult {
  lat: number;
  lon: number;
  displayName: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private readonly API_URL = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  searchLocation(query: string): Observable<GeocodingResult> {
    //todo implemementatie
    const url = `${this.API_URL}?q=${query}&format=json&limit=1`;
    //search lines below to see how they work.
    return this.http.get<any[]>(url).pipe(
      map((Response) => {
        if (!Response || Response.length === 0) {
          throw new Error('Locatie niet gevonden');
        }
        //Nominatum to Geocodingresult
        const location = Response[0];
        const result = {
          lat: Number(location.lat),
          lon: Number(location.lon),
          displayName: location.display_name,
        };
        console.log(result.lat, result.lon); // 51.8296133 4.9738743

        return result;
      }),
      catchError((error) => {
        //errors afhandelen -> check how this should work.
        console.error('Geocoding API error:', error);
        return throwError(() => new Error('Kon locatie niet ophalen. Probeer opnieuw.'));
      }),
    );
  }
}
