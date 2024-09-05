import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Ensure the path to your firebase configuration is correct
import { onAuthStateChanged } from "firebase/auth";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import NoImages from "./NoImages";
import Loader from "./Loader";

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