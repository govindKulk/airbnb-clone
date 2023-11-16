import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb'

interface IParams {
    reservationId?: string
}

export async function DELETE (request: Request, {params}: {params: IParams}) {

    try{
        const currentUser = await getCurrentUser();
        if(!currentUser){
            return NextResponse.error()
        }

        const {reservationId} = params;

        if(!reservationId || typeof reservationId !== 'string'){
            return NextResponse.error();
        }

        
        const deletedReservation = await prisma.reservation.deleteMany({
            where: {
                id: reservationId, // selects the reservation using id
                OR: [ //following two users can delete the selected reservation
                    { userId: currentUser.id }, //customer who createed reservation for the listing
                    { listing: { userId: currentUser.id } }// host who created the listing itself
                ]
            }
            
        })

    

        return NextResponse.json(deletedReservation)

    }catch(error){
        console.log(error)
        return NextResponse.error();
    }
}