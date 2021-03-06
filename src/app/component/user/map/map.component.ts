import {Component, OnInit} from '@angular/core';
import {LatLngBounds} from '@agm/core';
import {Place} from '../../../model/place/place';
import {MapBounds} from '../../../model/map/map-bounds';
import {PlaceService} from '../../../service/place/place.service';
import {PlaceInfo} from '../../../model/place/place-info';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {UserService} from '../../../service/user/user.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {FavoritePlaceComponent} from '../favorite-place/favorite-place.component';
import {FavoritePlace} from '../../../model/favorite-place/favorite-place';
import {FilterPlaceService} from '../../../service/filtering/filter-place.service';
import {Location} from '../../../model/location.model';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  placeInfo: PlaceInfo;
  button = false;
  searchText;
  lat = 49.841795;
  lng = 24.031706;
  zoom = 13;
  userMarkerLocation: Location;
  map: any;
  isFilter = false;
  userRole: string;
  origin: any;
  destination: any;
  directionButton: boolean;
  navigationMode = false;
  navigationButton = 'Navigate to place';
  travelMode = 'WALKING';
  travelModeButton = 'DRIVING';
  distance;
  icon = 'assets/img/icon/blue-dot.png';
  color = 'star-yellow';
  markerYellow = 'assets/img/icon/favorite-place/Icon-43.png';
  querySubscription: Subscription;
  idFavoritePlace: number;
  favoritePlaces: FavoritePlace[];

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private uService: UserService,
              private route: ActivatedRoute,
              private placeService: PlaceService,
              private filterService: FilterPlaceService,
              private favoritePlaceService: FavoritePlaceService) {
    iconRegistry
      .addSvgIcon(
        'star-white'
        ,
        sanitizer
          .bypassSecurityTrustResourceUrl(
            'assets/img/icon/favorite-place/star-white.svg'
          ));
    iconRegistry
      .addSvgIcon(
        'star-yellow'
        ,
        sanitizer
          .bypassSecurityTrustResourceUrl(
            'assets/img/icon/favorite-place/star-yellow.svg'
          ));
    this.filterService.setCategoryName('Food');
    this.filterService.setSpecName('Own cup');
    this.querySubscription = route.queryParams.subscribe(
      (queryParam: any) => {
        this.idFavoritePlace = queryParam.fp_id;
      });
  }

  ngOnInit() {
    this.filterService.mapBounds = new MapBounds();
    this.userRole = this.uService.getUserRole();
    this.setCurrentLocation();
    this.userMarkerLocation = {lat: this.lat, lng: this.lng};
    this.filterService.setUserMarkerLocation(this.userMarkerLocation);
    if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
      this.getFavoritePlaces();
    }
  }

  getDirection(p: Place) {
    if (this.navigationMode === false) {
      this.navigationButton = 'Close navigation';
      this.navigationMode = true;
      this.destination = {lat: p.location.lat, lng: p.location.lng};
      this.origin = {lat: this.userMarkerLocation.lat, lng: this.userMarkerLocation.lng};
      this.filterService.setUserMarkerLocation(this.userMarkerLocation);
    } else {
      this.navigationMode = false;
      this.navigationButton = 'Navigate to place';
    }
  }

  setCurrentLocation(): Position {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 13;
        this.userMarkerLocation = {lat: this.lat, lng: this.lng};
        this.filterService.setUserMarkerLocation(this.userMarkerLocation);
        return position;
      });
    }
    return null;
  }

  boundsChange(latLngBounds: LatLngBounds) {
    this.filterService.setMapBounds(latLngBounds);
  }

  setMarker(place: any) {
    console.log('set marker');
    this.button = true;
    this.placeService.places = null;
    this.placeService.places = [place];
  }

  showAllPlaces() {
    this.origin = null;
    this.button = !this.button;
    this.placeService.getFilteredPlaces();
    console.log(this.placeService.places);
    this.searchText = null;
  }

  clearFilters() {
    this.filterService.clearFilter();
    this.placeService.getFilteredPlaces();
  }

  showDetail(pl: Place) {
    this.directionButton = true;
    this.placeService.getPlaceInfo(pl.id).subscribe((res) => {
        this.placeInfo = res;
        if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
          this.favoritePlaces.forEach(fp => {
            if (fp.placeId === this.placeInfo.id) {
              this.placeInfo.name = fp.name;
            }
          });

        }
      }
    );
    this.placeService.places = this.placeService.places.filter(r => {
      return r.id === pl.id;
    });
    if (this.placeService.places.length === 1 && this.button !== true) {
      this.button = !this.button;
    }
    pl.color = this.getIcon(pl.favorite);
  }

  saveOrDeletePlaceAsFavorite(place: Place) {
    console.log('savePlaceAsFavorite() method in map.component placeId=' + place.id);
    if (!place.favorite) {
      this.favoritePlaceService.saveFavoritePlace(new FavoritePlace(place.id, place.name)).subscribe(res => {
          this.getFavoritePlaces();
          this.changePlaceToFavoritePlace();
        }
      );
      place.favorite = true;
      place.color = this.getIcon(place.favorite);

    } else {
      this.favoritePlaceService.deleteFavoritePlace(place.id).subscribe(res => {
        this.getFavoritePlaces();
        this.changePlaceToFavoritePlace();
      })
      ;
      place.favorite = false;
      place.color = this.getIcon(place.favorite);
    }
  }

  getIcon(favorite: boolean) {
    return favorite ? 'star-yellow' : 'star-white';
  }

  getList() {
    if (this.idFavoritePlace) {
      console.log('in getList(), setFP');
      this.setFavoritePlaceOnMap();
    } else {
      console.log('in getList()');
      if (this.button !== true) {
        this.placeService.getFilteredPlaces();
        console.log(this.placeService.places);
        this.idFavoritePlace = null;
        this.searchText = null;
      }
    }
  }

  checkIfUserLoggedIn() {
    if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
      this.changePlaceToFavoritePlace();
    }
  }

  toggleFilter() {
    this.isFilter = !this.isFilter;
  }

  getMarkerIcon(favorite: boolean) {
    if (favorite) {
      return this.markerYellow;
    } else {
      return null;
    }
  }

  setFavoritePlaceOnMap() {
    if (this.idFavoritePlace) {
      this.favoritePlaceService.getFavoritePlaceWithLocation(this.idFavoritePlace).subscribe((res) => {
          res.favorite = true;
          this.placeService.places = [res];
          this.setMarker(this.placeService.places[0]);
        }
      );
      this.idFavoritePlace = null;

    }
  }

  getFavoritePlaces() {
    console.log('getFavoritePlaces');
    this.favoritePlaceService.findAllByUserEmail().subscribe((res) => {
        this.favoritePlaces = res;
        console.log(this.favoritePlaces);
      }
    );
  }

  changePlaceToFavoritePlace() {
    this.placeService.places.forEach((place) => {
      place.favorite = false;
      this.favoritePlaces.forEach((favoritePlace) => {
        if (place.id === favoritePlace.placeId) {
          place.name = favoritePlace.name;
          place.favorite = true;
        }
      });
    });
    this.placeService.places.sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
  }

  setLocationToOrigin(location) {
    this.userMarkerLocation.lat = location.coords.lat;
    this.userMarkerLocation.lng = location.coords.lng;
    if (this.placeService.places.length === 1) {
      this.destination = {lat: this.placeService.places[0].location.lat, lng: this.placeService.places[0].location.lng};
      this.origin = {lat: this.userMarkerLocation.lat, lng: this.userMarkerLocation.lng};
    }
    this.filterService.setUserMarkerLocation(this.userMarkerLocation);
    this.placeService.getFilteredPlaces();
  }

  changeTravelMode() {
    this.travelMode = (this.travelMode === 'WALKING') ? 'DRIVING' : 'WALKING';
    this.travelModeButton = (this.travelModeButton === 'DRIVING') ? 'WALKING' : 'DRIVING';
  }
}
