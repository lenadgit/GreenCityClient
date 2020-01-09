import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {habitFactRandomLink} from '../../links';
import {HabitFactDto} from '../../model/habit-fact/HabitFactDto';
import {Language} from '../../i18n/Language';

@Injectable({
  providedIn: 'root'
})
export class HabitFactService {

  constructor(private http: HttpClient) {
  }

  getHabitFact(id: number, language: Language): Observable<HabitFactDto> {
    return this.http.get<HabitFactDto>(`${habitFactRandomLink + id}?language=` + language);
  }
}
