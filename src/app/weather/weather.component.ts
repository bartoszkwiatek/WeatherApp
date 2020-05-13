import { Component } from '@angular/core';
import { backgrounds } from './backgrounds';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent {
  location = '';
  backgroundURL = backgrounds;
  currentWeatherData = null;
  forecastWeatherData = null;
  chosenBackground = null;
  background = () => {
    this.chosenBackground = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.backgroundURL[this.currentWeatherData['weather'][0]['icon']]
    );
  };

  handleErrors = (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  };

  reset = () => {
    this.location = '';
    this.currentWeatherData = null;
    this.forecastWeatherData = null;
  };

  constructor(private sanitizer: DomSanitizer) {}

  handleSearch() {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.location}&units=metric&appid=7bd0dc94a3212db6f91d5eb723443c2f`
    )
      .then((response) => this.handleErrors(response))
      .then((response) => response.json())
      .then((data) => {
        this.currentWeatherData = data;
        this.background();
      })
      .then(() => {
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${this.location}&units=metric&appid=7bd0dc94a3212db6f91d5eb723443c2f`
        )
          .then((response) => response.json())
          .then((data) => {
            this.forecastWeatherData = data;
            console.log(data);
          })
          .catch((error) => {
            this.currentWeatherData = null;
            console.warn(error);
          });
      });
  }
}