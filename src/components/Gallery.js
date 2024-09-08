import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase"; // Ensure the path to your firebase configuration is correct
import { onAuthStateChanged } from "firebase/auth";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import NoImages from "./NoImages";
import Loader from "./Loader";
import { BookmarkIcon, DownloadIcon, LinkIcon, ShareIcon } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { getDownloadURL, ref } from "firebase/storage";

const Gallery = ({ user }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const imagesCollection = collection(db, `${user.uid}`);

                // Set up real-time listener for image updates
                const unsubscribe = onSnapshot(imagesCollection, (snapshot) => {
                    const imageList = snapshot.docs.map(doc => doc.data());
                    setImages(imageList);
                }, (error) => {
                    console.error("Error fetching images from Firestore: ", error);
                });

                setLoading(false); // Set loading to false once listener is set up

                // Clean up the real-time listener on component unmount
                return () => unsubscribe();
            } else {
                setLoading(false); // Ensure loading is set to false if no user is present
            }
        })
    }, [user])

    // download button function
    const handleDownload = (path, name) => {
        if (!path) return;

        const imageRef = ref(storage, path);

        getDownloadURL(imageRef)
            .then((url) => {
                return fetch(url);
            })
            .then((response) => response.blob())
            .then((blob) => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', name);
                document.body.appendChild(link);
                link.click();

                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);
                toast.success('Downloaded')
            })
            .catch((error) => {
                console.error('Error downloading the image:', error);
                toast.error('Failed to download image.');
            });
    };

    // copy link button function 
    const handleCopy = (url) => {
        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success('Copied')
            })
            .catch((err) => {
                toast.error("Failed to copy. Try again")
            });
    };


    if (loading) return <Loader />;

    return (
        <>
            {images.length > 0 ? (
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-4 p-4 md:p-6">
                    {images.map((image, index) => (
                        <div key={index} className="break-inside-avoid mb-4">
                            <Dialog>
                                <DialogTrigger>
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="w-full rounded-lg overflow-hidden"
                                    />
                                </DialogTrigger>
                                <DialogContent className="w-[400px] md:w-[30%] rounded-md">
                                    <DialogTitle className="hidden" />
                                    <div className="flex justify-center items-center">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between">
                                            <div className="flex gap-3">
                                                <button onClick={() => handleDownload(image.url, image.name)}>
                                                    <DownloadIcon size={18} />
                                                </button>
                                                <button onClick={() => handleCopy(image.url)}>
                                                    <LinkIcon size={18} />
                                                </button>
                                                <button>
                                                    <ShareIcon size={18} />
                                                </button>
                                            </div>
                                            <div className="">
                                                <button>
                                                    <BookmarkIcon size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </div>
            ) : (
                <NoImages />
            )}
        </>
    );
};

export default Gallery;