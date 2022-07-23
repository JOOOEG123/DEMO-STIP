"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.storage = exports.database = exports.fireStore = void 0;
const admin = require("firebase-admin");
exports.admin = admin;
// import * as functions from 'firebase-functions';
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://stip-demo-default-rtdb.firebaseio.com',
// });
admin.initializeApp();
const fireStore = admin.firestore();
exports.fireStore = fireStore;
const database = admin.database();
exports.database = database;
const storage = admin.storage();
exports.storage = storage;
//# sourceMappingURL=firebase.js.map