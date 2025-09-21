import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-6597146310-3402d",
  "appId": "1:159639894417:web:19eefb74aa8e4b0a96c230",
  "apiKey": "AIzaSyAWJ_WY1qGpazhx6TOG3nYr2C0ldNY2cN0",
  "authDomain": "studio-6597146310-3402d.firebaseapp.com",
  "messagingSenderId": "159639894417"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
