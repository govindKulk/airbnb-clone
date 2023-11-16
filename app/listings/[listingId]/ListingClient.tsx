'use client'
import Container from '@/app/components/Container';
import {Range} from 'react-date-range'
import ListingHead from '@/app/components/listings/ListingHead';
import ListingInfo from '@/app/components/listings/ListingInfo';
import ListingReservation from '@/app/components/listings/ListingReservation';
import { categories } from '@/app/components/navbar/Categories';
import useLoginModal from '@/app/hooks/useLoginModal';
import { SafeListings, SafeReservations, SafeUser } from '@/app/types'
import { Reservation } from '@prisma/client';
import axios from 'axios';
import { differenceInCalendarDays, differenceInDays, eachDayOfInterval } from 'date-fns';
import { useRouter } from 'next/navigation';

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast';

interface ListingClientProps {
  listing: SafeListings & {
    user: SafeUser
  };
  reservations?: SafeReservations[];
  currentUser?: SafeUser | null
}

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
}


const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {

  const LoginModal = useLoginModal();
  const router = useRouter()

  
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    
    reservations.forEach((reservation) => {

      // eachDayOfInterval takes start and end date of an interval and returns array of dates in that interval
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      })
      dates = [...dates, ...range]
    })
    
    return dates
  }, [reservations])
  
  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category)
  }, [listing.category])

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price)
  const [dateRange, setDateRange] = useState<Range>(initialDateRange)

  const onCreateReservation = useCallback(() => {
    if(!currentUser){
      LoginModal.onOpen();
    }

    setIsLoading(true)

    axios.post('/api/reservations', {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id

    }).then(() => {
      toast.success("Listing Reserved");
      setDateRange(initialDateRange);
      router.push('/trips');
      
    }).catch((error) => {
      toast.error("Something Went Wrong");
    }).finally(() => {
      setIsLoading(false)
    })

  }, [
    totalPrice,
    listing?.id,
    dateRange,
    router,
    currentUser,
    LoginModal
  ])

  useEffect(() => {
    if(dateRange.startDate && dateRange.endDate){
      const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate)

      if(dayCount && listing.price){
        setTotalPrice(dayCount * listing.price)
      }else{
        setTotalPrice(listing.price)
      }
    }

  
  }, [dateRange, listing.price])




  return (
     <Container>
      <div 
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div 
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          >
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div 
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ListingClient
