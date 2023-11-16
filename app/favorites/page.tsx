// This will be a server side component since it will communicate with the db diretly through getLisingById func

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import FavoriteClient from "./FavoriteClient";
import getReservations from "@/app/actions/getReservations";
import getFavoriteListings from "../actions/getFavorites";

interface IParams {
    listingId?: string;
}
const FavoriteListings = async () => {


    const currentUser = await getCurrentUser();
    const favListings = await getFavoriteListings();



    
    
    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorised"
                    subtitle="Please Login First" />
            </ClientOnly>
        )
    }
    
    if (favListings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No favorites found"
                    subtitle="Looks like you have no favorite listings."
                />
            </ClientOnly>
        );
    }
    return (
        <ClientOnly>
            <FavoriteClient listings={favListings} currentUser={currentUser} />
        </ClientOnly>
    )
}

export default FavoriteListings
