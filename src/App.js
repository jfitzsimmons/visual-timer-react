/**testjpf
 *
 * main.8625bef6.js:2 FirebaseError: Firebase: Error (auth/invalid-api-key).
 * with serviceworker pwa
 *
 * python -m SimpleHTTPServer 8080
 */

import React, { useState, useEffect } from "react";
import { Weather } from "./components/weather/Weather";
import Timer from "./components/Timer";
import Coin from "./components/Coin";
import { fbDbRestApiconfig } from "./utils/helpers";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "./App.scss";

if (firebase.apps.length === 0) {
  firebase.initializeApp(fbDbRestApiconfig);
}

const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      return false;
    },
  },
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

export function SignInScreen() {
  return (
    <div className="fade_in2">
      <p>Please sign-in to access weather information:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export const signOut = () => {
  firebase
    .auth()
    .signOut()
    .catch(function (error) {
      console.log(error.message);
    });
};

function App() {
  const [lightMode, setLightMode] = useState(false);
  const [signedIn, setSignedIn] = useState(null);
  const [userToken, setUserToken] = useState(null);

  function handleIdToken() {
    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        setUserToken(idToken);
      })
      .catch(function (error) {
        console.warn(error.message);
      });
  }
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setSignedIn(!!user);
      });
    signedIn === true && handleIdToken();
    return () => unregisterAuthObserver();
  }, [signedIn]);

  return (
    <div className={`app ${lightMode === true ? "light" : "dark"}`}>
      <div className="mode">
        <span>Dark</span>
        <label className="switch">
          <input
            type="checkbox"
            className="mode__input"
            onClick={() =>
              lightMode === true ? setLightMode(false) : setLightMode(true)
            }
          />
          <span className="slider round"></span>
        </label>
        <span>Light</span>
      </div>
      <div className="widget_container">
        <Timer />
        <Coin />
      </div>
      {signedIn !== null &&
        (signedIn === false || !userToken ? (
          <SignInScreen />
        ) : (
          <>
            <button className="sign_out bold" onClick={() => signOut()}>
              log out
            </button>
            <Weather userToken={userToken} />
          </>
        ))}
    </div>
  );
}

export default App;
