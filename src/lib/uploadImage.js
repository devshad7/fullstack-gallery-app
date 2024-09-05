import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImages = async (userId, files, onProgress) => {
    const uploadPromises = Array.from(files).map((file, index) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `${userId}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress(index, progress);
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(url);
                }
            );
        });
    });

    return Promise.all(uploadPromises);
};