import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server";

import prisma from '@/app/libs/prismadb'
interface IParams {
    listingId?: string
}

export async function POST (request: Request, {params} : {params: IParams}) {

    const currentUser = await getCurrentUser();

    if(!currentUser){
        return NextResponse.error();
    }

    const {listingId} = params;
    if(!listingId || typeof listingId !== 'string' ){
        throw new Error("INVALID ID");
    }

    try{
        let favoriteIds = [...(currentUser.favoriteIds || [])];
        favoriteIds.push(listingId)
    
        const user = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                favoriteIds
            }
        })
    
        return NextResponse.json(user)

    }catch(error){
        return NextResponse.error()
    }

  
}
export async function DELETE (request: Request,{params} : {params: IParams}) {

    const currentUser = await getCurrentUser();

    if(!currentUser){
        return NextResponse.error();
    }

    const {listingId} = params;
    if(!listingId || typeof listingId !== 'string' ){
        throw new Error("INVALID ID");
    }

    try{
        let favoriteIds = [...(currentUser.favoriteIds || [])];
        
        favoriteIds = favoriteIds.filter((favoriteId) => favoriteId !== listingId )
    
        const user = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                favoriteIds
            }
        })
    
        return NextResponse.json(user)

    }catch(error){
        return NextResponse.error()
    }

  
}

