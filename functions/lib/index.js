"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const archiveController_1 = require("./archiveController");
const firebase_1 = require("./config/firebase");
// https://firebase.google.com/docs/database/extend-with-functions
const app = express();
app.use(cors({ origin: true }));
app.get('/', (req, res) => res.status(200).send('Hello World!'));
app.get('/allArchies', archiveController_1.allArchies);
exports.add = functions.https.onCall(async (data, context) => {
    // eslint-disable-next-line max-len
    const j = (await firebase_1.fireStore.collection(`publics`).get());
    try {
        return j.docs.map((item) => item.data());
    }
    catch (error) {
        return error;
    }
    // t.then((v) => {
    //   const o = v.val();
    //   return {
    //     message: 'Hello World!',
    //     status: 'success',
    //     data: o,
    //     h: v,
    //   };
    // }).catch((error) => {
    //   return {
    //     message: 'Hello World!',
    //     status: 'error',
    //     data: error,
    //   };
    // }
    // );
});
// api return an array of objects
// app.get('allArchies', (req, res) => {
//   const db = functions.database
//       .ref('/persons/requestArchieve/persons')
//       .onCreate((snapshot, context) => {
//         console.log(snapshot.val(), context);
//         return snapshot.val();
//       });
//   res.status(200).send(db);
// });
// post api from payload
// app.post('/api/archives', (req, res) => {
//   const archive = req.body;
//   res.status(200).send(archive);
// });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map