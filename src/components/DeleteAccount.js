import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { auth } from "@/lib/firebase"
import { DialogClose } from "@radix-ui/react-dialog"
import { deleteUser } from "firebase/auth"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const DeleteAccount = () => {
    
    const router = useRouter()

    // delete user function
    const handleDeleteUser = () => {
        deleteUser(auth.currentUser).then((res) => {
            toast.success('Account Deleted');
            router.push('/')
        }).catch((err) => {
            toast.error("Something went wrong...");
            console.log(err.message);
        })
    }

    return (
        <>
            <div className="h-auto w-full flex justify-end">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete your account. All the data will be lost and cannot be restored
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-3">
                            <Button variant="destructive" onClick={handleDeleteUser}>Yes</Button>
                            <DialogClose asChild>
                                <Button variant="outline">No</Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default DeleteAccount