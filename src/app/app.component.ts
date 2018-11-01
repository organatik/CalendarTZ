import { Component } from '@angular/core';
import { getYear, getMonth, startOfWeek, addDays, subMonths, addMonths, getDate, getISODay } from 'date-fns';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  year = getYear(new Date());
  month = getMonth(new Date());
  startDate;
  curDate;
  listOfDate;
  toDayDate;
  toDayIso;
  updateCalendar;
  selectedDay = null;
  dayIndex;
  event: { title: string; description: string; day: number };

  constructor(public dialog: MatDialog) {
    this.startDate = new Date(this.year, this.month);
    this.curDate = startOfWeek(this.startDate, { weekStartsOn: 1 });
    this.listOfDate = this.matrix();
    this.updateCalendar = new BehaviorSubject(this.matrix());
    this.toDayDate = getDate(new Date());
    this.toDayIso = getISODay(new Date());
    console.log(this.toDayIso);
  }

  selectDay(index, days, week) {
    this.selectedDay = days;
    console.log(days);
    console.log(week);
  }
  getToDayDate() {
    this.startDate = new Date(this.year, this.month);
    this.curDate = startOfWeek(this.startDate, { weekStartsOn: 1 });
    this.listOfDate = this.matrix();
    this.toDayDate = getDate(new Date());
    this.updateCalendar.next([...this.listOfDate]);
  }
  addInfo(selected, eventInfo) {
    selected[0] = eventInfo;
  }
  previousMonth() {
    this.startDate = subMonths(this.startDate, 1);
    this.curDate = startOfWeek(this.startDate, { weekStartsOn: 1 });
    // console.log(this.matrix());
    this.listOfDate = this.matrix();
    this.updateCalendar.next([...this.listOfDate]);
    this.toDayDate = 0;
  }
  nextMonth() {
    this.startDate = addMonths(this.startDate, 1);
    this.curDate = startOfWeek(this.startDate, { weekStartsOn: 1 });
    // console.log(this.matrix());
    this.listOfDate = this.matrix();
    this.updateCalendar.next([...this.listOfDate]);
    this.toDayDate = 0;
  }
  getIndex(week ,day) {
     this.dayIndex = indexOf(day)
  }

  openDialog( infoDays): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: { days: infoDays.day, curMonth: this.startDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.event = result;
        this.addInfo( this.selectedDay, {
          title: this.event.title,
          description: this.event.description,
          day: this.event.day
        });

      }
    });
  }

  matrix() {
    const startDate = this.curDate;
    const rows = 5;
    const cols = 7;
    const length = rows * cols;

    const dateArr = Array.from({ length })
      // create a list of dates
      .map((_, index) => {
        return [{ day: addDays(startDate, index).getDate() }];
      })
      // fold the array into a matrix
      .reduce(
        (matrix, current, index, days) =>
          !(index % cols !== 0) ? [...matrix, days.slice(index, index + cols)] : matrix,
        []
      );
    return dateArr;
  }
}
