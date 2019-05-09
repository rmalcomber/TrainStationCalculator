import { Component, OnInit } from '@angular/core';
import { JsonDataProviderService } from './providers/data-provider.service';
import { DefaultMenuSelection } from './consts';
import { Destination } from './providers/dtos/destination.dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public startingStations: string[] = [];
  public endStations: string[] = [];
  public duration: number;
  public selectedStartStation = DefaultMenuSelection;
  public selectedEndStation = DefaultMenuSelection;
  public selectedIntermediateStation = '';

  constructor(private dataProvider: JsonDataProviderService) { }

  ngOnInit(): void {
    this.Reset();
  }

  public startDestinationChanged(newValue: string): void {

    if (this.ShouldReset(newValue)) {
      this.Reset();
      return;
    }

    this.selectedStartStation = newValue;
    this.UpdateEndList(newValue);
  }

  public finalDestinationChanged(newValue: string): void {
    this.selectedEndStation = newValue;
    this.UpdateDuration();
  }

  private UpdateEndList(station: string): void {

    this.CheckAndResetEndList();

    this.UpdateDuration();
  }

  private CheckAndResetEndList(): void {
    if (this.selectedStartStation === this.selectedEndStation) {
      this.selectedEndStation = DefaultMenuSelection;
      this.ResetItermediateStation();
    }
  }

  private ShouldReset(value: string): boolean {
    return value === DefaultMenuSelection;
  }

  private UpdateDuration(): void {
    let duration = 0;
    if (this.selectedStartStation !== DefaultMenuSelection && this.selectedEndStation !== DefaultMenuSelection) {
      duration = this.GetDuration(this.selectedStartStation, this.selectedEndStation);
    }

    this.duration = duration;
  }

  private GetDuration(startStation: string, endStation: string): number {
    const selectedDataObject = this.GetDestinationObject(startStation, endStation);

    if (!selectedDataObject) {
      return this.GetDurationWithIntemediateStation(startStation, endStation);
    } else {
      this.ResetItermediateStation();
      return (selectedDataObject ? selectedDataObject.Time : null);
    }

  }

  private GetDurationWithIntemediateStation(startStation: string, endStation: string) {
    const interMediateStations = this.GetIntermediateStations(startStation, endStation);
    if (!interMediateStations) { return null; }

    const intermediateStation = interMediateStations[0];
    const finalDestinationStation = this.GetDestinationObject(intermediateStation.ArriveAt, endStation);


    this.selectedIntermediateStation = intermediateStation.ArriveAt;
    return (interMediateStations[0].Time + finalDestinationStation.Time);
  }

  private ResetItermediateStation(): void {
    this.selectedIntermediateStation = '';
  }

  private GetDestinationObject(startStation: string, endStation: string): Destination {
    return this.dataProvider.GetData().find((station) => {
      return station.DepartFrom === startStation && station.ArriveAt === endStation;
    });
  }

  private GetIntermediateStations(startStation: string, endStation: string): Destination[] {
    const selectedDataObject = this.dataProvider.GetData();

    const allEndStation = selectedDataObject.filter((station) => station.ArriveAt === endStation);

    let interMediateStations: Destination[] = [];

    allEndStation.forEach((station) => {
      const possibleStations = selectedDataObject.filter((posStation) => {
        return posStation.ArriveAt === station.DepartFrom && posStation.DepartFrom === startStation;
      });
      interMediateStations = interMediateStations.concat(possibleStations);
    });

    return interMediateStations;

  }

  private Reset(): void {
    this.duration = 0;
    this.ResetStationLists();
  }

  private ResetStationLists(): void {
    const stations = this.dataProvider.GetTrainStations();
    this.selectedStartStation = DefaultMenuSelection;
    this.selectedEndStation = DefaultMenuSelection;
    this.startingStations = stations;
    this.endStations = stations;
  }

}
