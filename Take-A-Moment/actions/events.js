"use server"

import {auth} from "@clerk/nextjs/server";
import {eventSchema} from "@/app/lib/validators";
import {db} from "@/lib/prisma";
import {addDays, addMinutes, format, isBefore, parseISO, startOfDay} from "date-fns";

export async function createEvent(data){
    const {userId} = auth();
    if (!userId){
        throw new Error("Unauthorized");
    }

    const validatedData = eventSchema.parse(data);

    const user = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if (!user) {
        throw new Error("user not found !");
    }

    const event = await db.event.create({
        data: {
            ...validatedData,
            userId: user.id,
        },
    });
    return event;
}

export async  function getUserEvents() {

    const {userId} = auth();
    if (!userId){
        throw new Error("Unauthorized");
    }


    const user = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if (!user) {
        throw new Error("user not found !");
    }

    const events = await db.event.findMany({
        where:{userId:user.id},
        orderBy:{createdAt:"desc"},
        include:{
            _count:{
                select:{bookings:true},
            },
        },
    });

    return {events,username:user.username}

}



export async  function deleteEvent(eventId) {
    const {userId} = auth();
    if (!userId){
        throw new Error("Unauthorized");
    }


    const user = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if (!user) {
        throw new Error("user not found !");
    }

    const event = await db.event.findUnique({
        where: {id:eventId},
    });

    if (!event || event.userId !== user.id){
        throw new Error("event not found!");
    }

    await db.event.delete ({
        where: {id:eventId},
    });

    return {success:true};

}

export async function getEventDetails (username, eventId){
    const event = await db.event.findFirst({
        where: {
            id: eventId,
            user: {
                username: username,
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    username: true,
                    imageUrl: true,
                },
            },
        },
    });
    return event;
}


    export async function getEventAvailability(eventId){
        const event = await db.event.findUnique({
            where: {
                id: eventId,
            },
            include: {
                user: {
                    include: {
                        availability: {
                            select: {
                                days: true,
                                timeGap: true,
                            },
                        },
                        bookings: {
                            select: {
                                startTime: true,
                                endTime: true,
                            },
                        },
                    },
                },
            },
        });

        if (!event || !event.user.availability){
            return [];
        }

        const {availability, bookings} = event.user;

        const startDate = startOfDay(new Date());
        const endDate = addDays(startDate, 30);

        const availableDates = [];

        for (let date = startDate; date<=endDate; addDays(startDate, 1)){
            const dayOfWeek = format(date, "EEEE").toUpperCase()
            const dayAvailability = availability.days.find((d)=>d.day === dayOfWeek);

            if (dayAvailability){
                const dateStr = format(date, "yyyy-MM-dd");

                const slots = generateAvailableTimeSlots(
                    dayAvailability.startTime,
                    dayAvailability.endTime,
                    event.duration,
                    bookings,
                    dateStr,
                    availability.timeGap,
                );

                availableDates.push({
                    date:dateStr,
                    slots,
                });
            }
        }
        return availableDates;
    }

    function generateAvailableTimeSlots(
        startTime,
        endTime,
        duration,
        bookings,
        dateStr,
        timeGap=0,
    ) {
    const slots = []
    let currentTime = parseISO(`${dateStr}T${startTime.toISOString().slice(11,16)}`);
    const slotEndTime = parseISO(`${dateStr}T${endTime.toISOString().slice(11,16)}`);

    const now = new Date();
    if (format(now, "yyyy-MM-dd") === dateStr){
        currentTime = isBefore(currentTime, now)
            ?addMinutes(now, timeGap)
            :currentTime;
    }
}
