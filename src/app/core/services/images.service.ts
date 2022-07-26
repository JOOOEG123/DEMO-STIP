import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ImageSchema } from '../types/adminpage.types';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(private db: AngularFireDatabase) {}

  getAllImages() {
    return this.db.object(`persons/requestArchieve/images`).valueChanges();
  }

  addImage(language: string, image: ImageSchema) {
    return this.db
      .object(`persons/data/${language}/images`)
      .update({ [image.imageId]: image });
  }

  updateImage(language: string, image: ImageSchema) {
    return this.db
      .object(`persons/data/${language}/images`)
      .update({ [image.imageId]: image });
  }

  deleteImage(language: string, imageId: string) {
    return this.db.object(`persons/data/${language}/images/${imageId}`).remove();
  }

  getImage(language: string, imageId:string) {
    return this.db.object(`persons/data/${language}/images/${imageId}`).valueChanges()
  }
}
