'use client'

import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeListings, SafeUser } from "../types"

interface FavoriteClientProps {
    listings?: SafeListings[];
    currentUser?: SafeUser | null;
}
const FavoriteClient:React.FC<FavoriteClientProps> = ({
    listings,
    currentUser
}) => {
  return (
    <Container>
    <Heading
      title="Your Favorites"
      subtitle="Liked Listings"
    />
    <div 
      className="
        mt-10
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
      "
    >
      {listings?.map((lisitng: any) => (
        <ListingCard
          key={lisitng.id}
          data={lisitng}
        //   reservation={reservation}
        //   actionId={reservation.id}
        //   onAction={onCancel}
        //   disabled={deletingId === reservation.id}
        //   actionLabel="Cancel guest reservation"
          currentUser={currentUser}
        />
      ))}
    </div>
  </Container>
  )
}

export default FavoriteClient


