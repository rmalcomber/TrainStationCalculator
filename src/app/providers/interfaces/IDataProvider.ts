import { Destination } from '../dtos/destination.dto';

export interface IDataProvider {
  GetData(): Destination[];
  GetTrainStations(): string[];
}
