import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ImageSchema } from '../types/adminpage.types';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  
  constructor(private db: AngularFireDatabase) {}

  getAllImages(language: string) {
    return this.db.object(`persons/data/${language}/images`).valueChanges();
  }

  getAllImagesList(language: string) {
    return this.db.list(`persons/data/${language}/images`).valueChanges();
  }

  getImage(language: string, imageId: string) {
    return this.db.object(`persons/data/${language}/images/${imageId}`).valueChanges()
  }

  addOrUpdateImage(language: string, image: ImageSchema) {
    return this.db
      .object(`persons/data/${language}/images`)
      .update({ [image.imageId]: image });
  }

  // updateImage(image: ImageSchema) {
  //   return this.db
  //     .object(`persons/requestArchieve/images`)
  //     .update({ [image.imageId]: image });
  // }

  deleteImage(language: string, imageId: string) {
    return this.db.object(`persons/data/${language}/images/${imageId}`).remove();
  }

  // getImage(imageId:string) {
  //   return this.db.object(`persons/requestArchieve/images/${imageId}`).valueChanges()
  // }
}
