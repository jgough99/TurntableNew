const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
// response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

exports.addUserToFirestore= functions.auth.user().onCreate((user) => {
    return admin.firestore().collection("user").doc(user.uid).set({
        email:user.email,
        rock:-1,
        pop:-1,
        electro:-1,
        hipHop:-1,
        house:-1
    });
});

