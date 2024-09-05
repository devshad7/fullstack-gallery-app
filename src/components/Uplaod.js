'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getAuth } from "firebase/auth";
import { UploadIcon } from 'lucide-react'
import { useState } from "react";
import { uploadImages } from "@/lib/uploadImage";
import toast from "react-hot-toast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { db } from "@/lib/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";

const Uplaod = () => {

    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    // const [uploadedUrls, setUploadedUrls] = useState([]);

    const auth = getAuth();
    const user = auth.currentUser;

    const handleFilesChange = (e) => {
        setFiles(e.target.files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpload = async () => {
        if (user && files.length > 0) {
            const onProgress = (index, progress) => {
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [index]: progress,
                }));
            };
            uploadImages(user.uid, files, onProgress)
                .then((urls) => {
                    const batch = writeBatch(db);  // Updated for modular SDK
                    urls.forEach((url, index) => {
                        const file = files[index];
                        const fileRef = doc(collection(db, `${user.uid}`)); // Create doc with unique ID
                        batch.set(fileRef, {
                            name: file.name,
                            url: url,
                            createdAt: new Date(),
                            size: file.size,
                        });
                    });

                    return batch.commit(); // Commit the batch operation to Firestore
                })
                .then(() => {
                    toast.success("Uploaded");

                    // Clear files and progress after upload
                    setFiles([]);  // Clear files
                    setUploadProgress({});  // Clear upload progress
                })
                .catch((error) => {
                    console.error("Error uploading files or saving to Firestore: ", error);
                    toast.error("Something went wrong...");
                });

        } else {
            toast.error('Please select file to upload')
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <UploadIcon className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[400px] rounded-md md:w-1/3">
                    <DialogTitle />
                    <h2 className="text-2xl font-semibold mb-4">Upload</h2>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-gray-400 p-4 rounded-lg mb-4 flex flex-col items-center justify-center"
                    >
                        <p>Drag and drop or <span className="underline cursor-pointer text-blue-500" onClick={() => document.getElementById('fileInput').click()}>browse</span></p>
                        <input
                            type="file"
                            multiple
                            onChange={handleFilesChange}
                            className="hidden"
                            id="fileInput"
                        />
                    </div>

                    {Array.from(files).map((file, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex justify-between items-center">
                                <span>{file.name.substring(0, 30)}...</span>
                                <span>{uploadProgress[index] ? `${Math.round(uploadProgress[index])}%` : ''}</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1 rounded">
                                <div
                                    className="bg-black h-1 rounded"
                                    style={{ width: `${uploadProgress[index] || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleUpload}
                        className="mt-4 bg-black text-white py-2 px-4 rounded-lg font-semibold"
                    >
                        Upload
                    </button>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Uplaod