import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const addUserToFirestore = (user) => {
    return addDoc(collection(db, "users"), user)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
      })
      .catch((e) => {
        console.error("Error adding document: ", e);
        throw e;
      });
  };