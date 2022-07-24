/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import * as functions from 'firebase-functions';
import nodemailer = require('nodemailer');
import sdmail = require('@sendgrid/mail');
import {fireStore} from './config/firebase';
import {ALL_ADMIN_EMAIL} from './constants/adminEmails.contants';
import {ContactUs} from './types/contactus.types';
// eslint-disable-next-line camelcase
const sendGrid_api_key = functions.config().sendgrid.key;
sdmail.setApiKey(sendGrid_api_key);

export const contactUs = functions.https.onCall( async (data: any, context: any) => {
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' + 'while authenticated.');
  // }
  const {email: email = '', name: name = '', message: message = ''} = data;
  const msg = {
    to: ALL_ADMIN_EMAIL,
    from: 'joeladeniji123@gmail.com',
    subject: `${name || 'User'} Contact Us (${email || 'User'})`,
    text: message,
    // html: `<strong>${message}</strong>`,

  };
  try {
    await sdmail.send(msg);
    return {
      message: 'sendGridMail',
      status: 'success',
      data: 'Email sent successfully',
    };
  } catch (error) {
    return {
      message: 'sendGridMail',
      status: 'error',
      data: error,
    };
  }
}
);

const {useremail, refreshtoken, clientid, clientsecret, accesstoken} =
    functions.config().gmail;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: false,
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: useremail,
    clientId: clientid,
    clientSecret: clientsecret,
    refreshToken: refreshtoken,
    accessToken: accesstoken,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

export const sendMail = functions.https.onCall(async (_data: ContactUs, _context: any) => {
  try {
    const result = await transporter.sendMail({
      from: _data?.email,
      to: ALL_ADMIN_EMAIL,
      text: _data?.message,
      subject: `You have a notification from ${_data?.name} (${_data?.email})`,
      // html: '<!DOCTYPE html><html lang="en"><head><title>CSS Template</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>* { box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;}body { margin: 0; font-family: Arial, Helvetica, sans-serif;}/* Style the top navigation bar */.topnav { overflow: hidden; background-color: #333;}/* Style the topnav links */.topnav a { float: left; display: block; color: #f2f2f2; text-align: center; padding: 14px 16px; text-decoration: none;}/* Change color on hover */.topnav a:hover { background-color: #ddd; color: black;}/* Style the content */.content { background-color: #ddd; padding: 10px; height: 200px; /* Should be removed. Only for demonstration */}/* Style the footer */.footer { background-color: #f1f1f1; padding: 10px;}</style></head><body><div class="topnav"> <a href="#">Link</a> <a href="#">Link</a> <a href="#">Link</a></div><div class="content"> <h2>CSS Template</h2> <p>A topnav, content and a footer.</p></div><div class="footer"> <p>Footer</p></div></body></html>',
    });
    fireStore.collection('mail').add({
      to: 'joel@example.com',
      message: {
        subject: 'Hello from Firebase!',
        html: 'This is an <code>HTML</code> email body.',
      },
    });
    return {
      message: 'sendMail',
      status: 'success',
      data: result,
      result: _context,
    };
  } catch (error) {
    return {
      message: 'sendMail',
      status: 'error',
      data: error,
    };
  }
});

export const sendMailApprovedContribution = functions.database.ref(`/persons/requestArchieve/contributions/{user_id}/{contribution_id}`).onWrite(async (change, context: any) => {
  // context.params.user_id
  // context.params.contribution_id
  console.log(context.params.user_id);
  console.log(context.params.contribution_id);
  console.log('After: ', change.after.val());
  console.log('Before: ', change.before.val());
  console.log('a: ', change, 'content: ', context);
  if (change.after.val().publish === 'approved' && context.auth.token?.admin === true) {
    try {
      const result = await transporter.sendMail({
        from: 'joeladeniji123@gmail.com',
        to: 'joeladeniji123@gmail.com',
        text: 'testing contribution changes',
        subject: `You have a notification from ${context.params.user_id.name} (${context.params.user_id.email})`,
      });
      return {
        message: 'sendMail',
        status: 'success',
        data: result,
        // result: _context,
      };
    } catch (error) {
      console.log('Error (sendMailApprovedContribution):', error);
      return {
        message: 'sendMail',
        status: 'error',
        data: error,
      };
    }
  }
  return {
    message: 'sendMailApprovedContribution',
    status: 'Failed',
    data: 'no changes',
  };
});


