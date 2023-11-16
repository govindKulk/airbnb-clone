interface IParams {
    listingId?: string;
    authorId?: string;
    userId?: string;
}

import prisma from '@/app/libs/prismadb'

export default async function getReservations(params: IParams) {

    try {
        const { listingId, authorId, userId } = params;

        let query: any = {};
        if (listingId) {
            query.listingId = listingId;
        }

        if (authorId) {
            query.listing = { userId: authorId };
        }

        if (userId) {
            query.userId = userId;
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const safeReservations = reservations.map((reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing: {
                ...reservation.listing,
                createdAt: reservation.createdAt.toISOString()
            }

        }))

        return safeReservations;
    } catch (error: any) {
        throw new Error(error)
    }
}