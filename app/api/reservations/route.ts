import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser'

import {NextResponse} from 'next/server'

export async function POST(request: Request){
    const currentUser = await getCurrentUser();

    if(!currentUser){
        return NextResponse.error();
    }

    try{

        const body = await request.json();
        const {
            listingId,
            totalPrice,
            startDate,
            endDate
        } = body;
    
        if(!listingId || !totalPrice || !startDate || !endDate){
            return NextResponse.error();
        }
    
        const listingAndReservation = await prisma.listing.update({
            where: {
                id: listingId
            },
            data: {
                reservations: {
                    create:{
                        totalPrice,
                        startDate,
                        endDate,
                        userId: currentUser.id
                    }
                }
            }
        })
    
        return NextResponse.json(listingAndReservation)
    }
    catch(error){
        return NextResponse.error();
        console.log(error)
    }

}