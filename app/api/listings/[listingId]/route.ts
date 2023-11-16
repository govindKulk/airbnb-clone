import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server';


interface IParms {
    listingId?: string;
}
export async function DELETE(request: Request, { params }: { params: IParms }) {

    try {
    const currentUser = await getCurrentUser();
    if(!currentUser){
        return NextResponse.error();
    }
    
    const {listingId} = params;
    if(!listingId || typeof listingId !== "string"){
        return NextResponse.error();
    }

    const DeletedProperty = await prisma.listing.delete({
        where: {
            id: listingId
        }
    })

    return NextResponse.json(DeletedProperty)
}catch(error){
    console.log(error);
    return NextResponse.error();
    
}
}