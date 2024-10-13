import {getUserByUsername} from "@/actions/users";
import {notFound} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import EventCard from "@/components/event-card";

const UserPage = async ({params}) => {
    console.log(params.username);

    const user = await getUserByUsername(params.username);
    if (!user){
        notFound();
    }
    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col items-center mb-8">
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={user.imageUrl} alt={user.name}/>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl text-gray-300 font-bold mb-2">{user.name}</h1>
                <p className="text-gray-500 text-center">
                    Welcome to my profile
                </p>
            </div>

            {user.events.length === 0?(
                <p className="text-center text-gray-400">No events available.</p>

            ):(
                <div>{user.events.map((event)=>{
                    return (
                        <EventCard
                        key={event.id}
                        event={event}
                        username={params.username}
                        isPublic
                    />
                    );
                })}
                </div>
            )}
        </div>
    );
};

export default UserPage;
