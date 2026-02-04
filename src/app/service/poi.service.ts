import { Injectable } from '@angular/core';

export interface Poi {
  id: string;
  latPoi: number;
  lonPoi: number;
}

@Injectable({
  providedIn: 'root',
})
export class PoiService {
  private pois: Poi[] = [];
  private counter = 0;

  addPoi(latPoi: number, lonPoi: number): Poi {
    const newPoi: Poi = {
      id: `poi-${this.counter++}`,
      latPoi,
      lonPoi,
    };
    this.pois.push(newPoi);
    return newPoi;
  }
  getPois(): Poi[] {
    return this.pois;
  }
}
