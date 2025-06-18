
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    firebase.firestore().collection("clients").doc(user.uid).get().then(doc => {
      const data = doc.data();
      document.getElementById("account-balance").innerText = `$${data.balance}`;
      document.getElementById("returns").innerText = `$${data.returns}`;
    });
  }
});
