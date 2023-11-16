import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from 'next/server'

import prisma from '@/app/libs/prismadb'
export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();

    const {
        title,
        description,
        imageSrc,
        category,
        guestCount,
        bathroomCount,
        roomCount,
        location,
        price
    } = body;


    Object.keys(body).forEach((key: any) => {
        if(!body[key]){
            NextResponse.error()
        }
    })

    const listing = await prisma.listing.create({
        data: {
            userId: currentUser.id,
            title,
            description,
            imageSrc,
            category,
            guestCount,
            bathroomCount,
            roomCount,
            locationValue: location.value,
            price: parseInt(price, 10)
        }
    })

    return NextResponse.json(listing)
}

