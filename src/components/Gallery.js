import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Ensure the path to your firebase configuration is correct
import { onAuthStateChanged } from "firebase/auth";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import NoImages from "./NoImages";
import Loader from "./Loader";
import { DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

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

    // Function to handle image download
    const handleDownload = (url, name) => {
        // Fetch the image as a blob and then download it
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                const blobUrl = URL.createObjectURL(blob);
                link.href = blobUrl;
                link.download = name; // Set the filename for the download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl); // Clean up the object URL after download
                toast.success('Donwloaded')
            })
            .catch(error => {
                console.error('Error downloading the image:', error);
                toast.error('Something went wrong...')
            });
    };

    if (loading) return <Loader />;

    return (
        <>
            {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-4 md:p-6">
                    {images.map((image, index) => (
                        <Dialog key={index}>
                            <DialogTrigger>
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="object-cover w-full rounded-lg overflow-hidden"
                                />
                            </DialogTrigger>
                            <DialogContent className="w-[400px] md:w-1/3 rounded-md">
                                <DialogTitle className='hidden' />
                                <img
                                    src={image.url}
                                    alt={image.name}
                                />
                                <DialogDescription>
                                    <button onClick={() => handleDownload(image.url, image.name)}>
                                        <DownloadIcon size={18} />
                                    </button>
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            ) : (
                <NoImages />
            )}
        </>
    );
};

export default Gallery;