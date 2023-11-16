import { Listing, Reservation, User } from "@prisma/client";


export type SafeReservations = Omit<Reservation, 'createdAt' | 'startDate' | 'endDate'> & {
    createdAt: string,
    startDate: string,
    endDate: string,
    listing: SafeListings
}

export type SafeListings = Omit<
    Listing,
    'createdAt'
> & {
    createdAt: string
}

export type SafeUser = Omit<
    User,
    'createdAt' | "updatedAt" | "emailVerified"
> & {
    createdAt: string,
    updatedAt: string,
    emailVerified: string | null
}