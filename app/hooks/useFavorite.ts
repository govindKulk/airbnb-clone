import { useCallback, useMemo } from "react";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IuseFavorite {
    listingId: string;
    currentUser?: SafeUser | null
}

const useFavorite = ({
    listingId,
    currentUser
}: IuseFavorite) => {

    const loginModal = useLoginModal();
    const router = useRouter();

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || [];
        return list.includes(listingId)
    }, [currentUser, listingId])

    const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {

        e.stopPropagation();
        if(!currentUser){
            return loginModal.onOpen()
        }

        try{

            let request;
            

            if(hasFavorited){
                request = () => axios.delete(`/api/favorite/${listingId}`)
            }
            else{
                request = () => axios.post(`/api/favorite/${listingId}`)
            }

            await request();
            router.refresh();
            toast.success("Success");

            

        }catch(error){
            toast.error("Something went wrong") 
        }

    }, [
        currentUser,
        listingId,
        router,
        hasFavorited,
        loginModal
    ])

    return {
        hasFavorited,
        toggleFavorite
    }

}

export default useFavorite