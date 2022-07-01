import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import {allArchies} from './archiveController';
import {fireStore} from './config/firebase';


// https://firebase.google.com/docs/database/extend-with-functions

const app = express();
app.use(cors({origin: true}));

app.get('/', (req, res) => res.status(200).send('Hello World!'));
app.get('/allArchies', allArchies);
export const add = functions.https.onCall(async (data, context) => {
  // eslint-disable-next-line max-len
  const result = fireStore.collection('/publics').doc();
  return {
    message: 'Hello World!',
    status: 'success',
    data: result,
  };
}
);

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
