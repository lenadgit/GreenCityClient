import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HabitItem} from './HabitItem';

@Component({
  selector: 'app-habit-item',
  templateUrl: './habit-item.component.html',
  styleUrls: ['./habit-item.component.css']
})
export class HabitItemComponent implements OnInit {
  @Input()
  habitItem: HabitItem;
  @Output()
  activeChange = new EventEmitter<number>();
  @Output()
  nonActiveChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  setActive() {
    console.log(this.habitItem);
    this.activeChange.emit(this.habitItem.numb);
  }

  setNoneActive() {
    console.log(this.habitItem);
    this.nonActiveChange.emit();
  }
}