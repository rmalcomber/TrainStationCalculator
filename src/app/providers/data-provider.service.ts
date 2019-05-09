import { Injectable } from '@angular/core';

import data from '../data/RailwayStations.json';
import { Destination } from './dtos/destination.dto.js';
import { IDataProvider } from './interfaces/IDataProvider.js';

@Injectable({
  providedIn: 'root'
})
export class JsonDataProviderService implements IDataProvider {

  constructor() { }

  GetData(): Destination[] {
    return data;
  }

  GetTrainStations(): string[] {
    const trainStations = this.GetData().map((a) => {
      return a.ArriveAt;
    });
    return trainStations.filter((v, i, a) => a.indexOf(v) === i);
  }

}
