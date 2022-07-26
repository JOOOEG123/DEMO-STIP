import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private _alerts = new BehaviorSubject<string[]>([]);
  get alerts() {
    return this._alerts.asObservable();
  }

  constructor( ) {}


  emitAlert(alert: string) {
    const f = this._alerts.value;
    f.push(alert);
    this._alerts.next(f);
  }
  clearAlerts() {
    this._alerts.next([]);
  }
}
