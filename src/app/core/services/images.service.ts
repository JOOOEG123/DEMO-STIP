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

  addImage(image: ImageSchema) {
    return this.db
      .object(`persons/requestArchieve/images`)
      .update({ [image.imageId]: image });
  }

  updateImage(image: ImageSchema) {
    return this.db
      .object(`persons/requestArchieve/images`)
      .update({ [image.imageId]: image });
  }

  deleteImage(imageId: string) {
    return this.db.object(`persons/requestArchieve/images/${imageId}`).remove();
  }

  getImage(imageId:string) {
    return this.db.object(`persons/requestArchieve/images/${imageId}`).valueChanges()
  }
}
