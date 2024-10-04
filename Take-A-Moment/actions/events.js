"use server"

import {auth} from "@clerk/nextjs/server";
import {eventSchema} from "@/app/lib/validators";
import {db} from "@/lib/prisma";

export async function createEvent(data){
    const {userId} = auth();
    if (!userId){
        throw new Error("Unauthorized");
    }

    const validatedData = eventSchema.parse(data);

    const existingUser = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if (!existingUser) {
        throw new Error("user not found !");
    }

    const event = await db.event.create({
        data: {
            ...validatedData,
            userId: existingUser.id,
        },
    });
    return event;
}

