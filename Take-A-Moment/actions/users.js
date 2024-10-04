"use server"
import {auth, clerkClient} from "@clerk/nextjs/server";
import {db} from "@/lib/prisma";

export async function updateUsername(username){
    const {userId} = auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const existingUsername = await db.user.findUnique({
        where: {username},
    })
    if (existingUsername && existingUsername.id !== userId){
        throw new Error("Username is taken!");
    }
    await db.user.update({
        where: {clerkUserId: userId},
        data: {username},
    });
    await clerkClient.users.updateUser(userId, {
        username,
    });
    return {success:true};
}

