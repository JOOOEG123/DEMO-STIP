import * as functions from "firebase-functions";

import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";

const app = express();
app.use(cors({origin: "**"}));
app.use(bodyParser.json());


app.post("/", (req, res) => res.status(200).send("Hello World!"));


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.app = functions.https.onRequest(app);
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
