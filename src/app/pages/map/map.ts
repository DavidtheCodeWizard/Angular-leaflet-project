import { AfterViewInit, Component, input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PoiService } from '../../service/poi.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core'; //new
import { NgTemplateOutlet } from '@angular/common'; //new

@Component({
  selector: 'app-map',
  standalone: true, //check if this is right?
  imports: [FormsModule, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './map.html',
  styleUrl: './map.scss',
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private poiLayer = L.layerGroup();
  poiForm!: FormGroup;
  @ViewChild('poiFormContainer', { read: ElementRef }) //check these 2 lines
  poiFormContainer!: ElementRef<HTMLElement>;
  searchQuery: string = '';
  isAddingPoi: boolean = false;
  currentLat!: number;
  currentLon!: number;
  private popup!: L.Popup; //popup property

  //map init
  private initMap(): void {
    this.map = L.map('map', {
      center: [51.8303, 4.9739],
      zoom: 14,
    });

    //OpenStreetMap tile layer
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap contributors',
    });

    tiles.addTo(this.map);
    this.poiLayer = L.layerGroup().addTo(this.map);

    //register click
    this.map.on('click', (e) => {
      if (this.isAddingPoi == true) {
        const latPoi = e.latlng.lat;
        const lonPoi = e.latlng.lng;
        this.showPoiPopup(latPoi, lonPoi);
      }
    });
  }

  constructor(
    private http: HttpClient,
    public poiService: PoiService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.poiForm = this.fb.group({
      name: [''],
      color: ['#ff0000'],
      radius: [10],
    });
  }
  ngAfterViewInit(): void {
    this.initMap();
  }

  //add POI mode
  toggleAddPoiMode(): void {
    this.isAddingPoi = !this.isAddingPoi;
    console.log('Add POI mode:', this.isAddingPoi);
  }

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
    if (!this.searchQuery) {
      alert('Voer een locatie in!');
      return;
    }
    //search API
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

  private renderAllPois(): void {
    this.poiLayer.clearLayers();

    const allPois = this.poiService.getPois();
    allPois.forEach((poi) => {
      const marker = L.circle([poi.latPoi, poi.lonPoi], {
        color: poi.color || '#ff0000',
        radius: poi.radius || 3,
      }).addTo(this.poiLayer);
      //click event
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        console.log('POI clicked:', poi);
        //open edit popup.
        this.showEditPoiPopup(poi);
      });
    });
  }
  //save POI from popup
  private savePoiFromPopup(
    latPoi: number,
    lonPoi: number,
    name: string,
    color?: string,
    radius?: number,
  ): void {
    const newPoi = this.poiService.addPoi(latPoi, lonPoi, name, color, radius);
    console.log('New POI added:', newPoi);
    this.renderAllPois();
  }

  //show POI popup -> refactor openNewPoiPopup
  private showPoiPopup(latPoi: number, lonPoi: number): void {
    this.currentLat = latPoi;
    this.currentLon = lonPoi;
    this.poiForm.reset({
      name: '',
      color: '#ff0000',
      radius: 10,
    });

    const popupContent = this.poiFormContainer.nativeElement; //new
    console.log(popupContent);
    if (popupContent.parentElement) {
      popupContent.parentElement.removeChild(popupContent);
    }
    this.popup = L.popup().setLatLng([latPoi, lonPoi]).setContent(popupContent).openOn(this.map);
    //const popup = L.popup().setLatLng([latPoi, lonPoi]).setContent(popupContent).openOn(this.map);
  }

  public savePoi(): void {
    if (this.poiForm.invalid) return;

    const { name, color, radius } = this.poiForm.value;
    console.log('saving POI:', name, color, radius);

    this.savePoiFromPopup(this.currentLat, this.currentLon, name, color, radius);
    if (this.popup) {
      this.map.closePopup(this.popup);
    } else {
      this.map.closePopup();
    }
    this.renderAllPois();
  }

  //edit POI popup
  private showEditPoiPopup(poi: any): void {
    //get html content and set values
    //show popup
    //timeout
    //save button with all fields
    //delete old record?
    //add new record? is update posible?
    //close popup
    //rendeAllPois
  }

  /*private getHTMLContent(poi: any) : string {
   //const template = document.getElementById('poi-form-template');
  // return = const popupcontent = template?.innerHTML || '';
  }  */
}
