import { Component, OnInit } from '@angular/core';
import { JsonDataProviderService } from './providers/data-provider.service';
import { DefaultMenuSelection } from './consts';

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

  public finalDestinationChanged(newValue: string) {
    this.selectedEndStation = newValue;
    this.UpdateDuration();
  }

  private UpdateEndList(station: string) {
    const filterDestinations = this.filterDestinations(station);
    this.endStations = filterDestinations;

    this.CheckAndResetEndList();

    this.UpdateDuration();
  }

  private CheckAndResetEndList(): void {
    if (this.endStations.indexOf(this.selectedEndStation) < 0) {
      this.selectedEndStation = DefaultMenuSelection;
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

  private GetDuration(startStation: string, EndStation: string): number {
    const selectedDataObject = this.dataProvider.GetData().find((station) => {
      return station.DepartFrom === startStation && station.ArriveAt === EndStation;
    });
    return (selectedDataObject ? selectedDataObject.Time : null);
  }

  private filterDestinations(startStation: string): string[] {

    const stations = this.dataProvider.GetData().filter(station => {
      return (station.DepartFrom === startStation);
    });
    return stations.map(station => station.ArriveAt);

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
