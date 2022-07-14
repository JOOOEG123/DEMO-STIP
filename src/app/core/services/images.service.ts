import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { UUID } from '../utils/uuid';

@Injectable({
  providedIn: 'root',
})

export class ImagesService {
    constructor(
        private db: AngularFireDatabase
    ) {}

    getAllImages() {
        return this.db
            .object(`persons/requestArchieve/images`)
            .valueChanges()
    }
}