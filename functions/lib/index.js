"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const archiveController_1 = require("./archiveController");
const testController_1 = require("./testController");
const emailController_1 = require("./emailController");
// https://firebase.google.com/docs/functions/typescript
// https://firebase.google.com/docs/database/extend-with-functions
const app = express();
app.use(cors({ origin: true }));
app.post('/', (_req, res) => res.status(200).send('Hello World!'));
app.post('/allArchies', archiveController_1.allArchies);
exports.modifyRightistRequest = emailController_1.modifyRightistRequest;
exports.sendMailApprovedRejectNotificationContribution = emailController_1.sendMailApprovedRejectNotificationContribution;
exports.contactUs = emailController_1.contactUs;
exports.testFetchDetails = functions.https.onCall(testController_1.testFetchDetails);
exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map