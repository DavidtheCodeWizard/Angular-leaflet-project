import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  imports: [FormsModule],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  searchQuery: string = '';

  private initMap(): void {
    this.map = L.map('map', {
      center: [51.8303, 4.9739],
      zoom: 14,
    });

    // Add OpenStreetMap tile layer
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap contributors',
    });

    tiles.addTo(this.map);
  }

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
    if (!this.searchQuery) {
      alert('Voer een locatie in!');
      return;
    }
    // Implement search functionality here
    const url = `https://nominatim.openstreetmap.org/search?q=${this.searchQuery}&format=json&limit=1`;
    console.log('API URL:', url);

    this.http.get(url).subscribe({
      next: (Response: any) => {
        console.log('API Response:', Response);
        const location = Response[0];
        const lat = location.lat;
        const lon = location.lon;
        console.log(lat, lon); // 51.8296133 4.9738743
        this.map.setView([lat, lon], 13);
      },
      error: (error) => {
        console.error('error', error);
      },
    });
  }
}
