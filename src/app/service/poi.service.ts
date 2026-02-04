import { Injectable } from '@angular/core';

export interface Poi {
  id: string;
  latPoi: number;
  lonPoi: number;
  name?: string;
  color?: string;
  radius?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PoiService {
  private pois: Poi[] = [];
  private counter = 0;

  addPoi(latPoi: number, lonPoi: number, name?: string, color?: string, radius?: number): Poi {
    const newPoi: Poi = {
      id: `poi-${this.counter++}`,
      latPoi,
      lonPoi,
      name: name || `POI ${this.counter}`,
      color,
      radius,
    };
    this.pois.push(newPoi);
    return newPoi;
  }
  getPois(): Poi[] {
    return this.pois;
  }
}
