"use client";

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Link, Trash2} from "lucide-react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import {deleteEvent} from "@/actions/events";

const EventCard = ({event, username, isPublic=false}) => {

    const [isCopied, setIsCopied] = useState(false);
    const router = useRouter();
    const handleCopy = async ()=>{
      try {
          await navigator.clipboard.writeText(
              `${window.location.origin}/${username}/${event.id}`
          );
          setIsCopied(true);
          setTimeout(()=> setIsCopied(false), 2000);
      }  catch (error) {
          console.error("Failed to copy: ", err);
      }
    };

    const {loading, fn:fnDeleteEvent} = useFetch(deleteEvent);

    const handleDelete = async () => {
        if (window?.confirm("Are you sure you wanna delete?")){
            await fnDeleteEvent(event.id);
            router.refresh();
        }
    }

    return (
        <Card className="flex flex-col justify-between cursor-pointer">
            <CardHeader>
                <CardTitle className="text-2xl">
                    {event.title}
                </CardTitle>
                <CardDescription className="flex justify-between">
                    <span>
                        {event.duration} minutes | {event.isPrivate?"Private" : "Public"}
                    </span>

                    <span>
                        {event._count.bookings} Bookings
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    {event.description.indexOf(".") !== -1
                        ? event.description.substring(0, event.description.indexOf("."))
                        : event.description.substring(0, 140)}
                </p>
            </CardContent>
            {!isPublic && (
                <CardFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex items-center text-sm bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-yellow-200"
                        onClick={handleCopy}
                    >
                        <Link className="mr-2 h-4 w-4" />{" "}
                        {isCopied ? "Copied!" : "Copy Link"}
                    </Button>


                    <Button
                        variant="destructive"
                        className="flex items-center text-sm bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-red-800"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {loading ? "Deleting..." : "Delete"}
                    </Button>

                </CardFooter>
            )}
        </Card>
    );
};

export default EventCard;

