"use client";

import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {Card, CardContent} from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

const testimonials = [
    {
        name: "Vlad Draculove",
        role: "Nocturnal Romance Director",
        content:
            "Thanks to TakeAMoment, my late-night rendezvous are as scheduled as my victims. Now if only it could help me remember where I buried my last date's heart!",
        image: "https://i.pravatar.cc/150?img=9",
    },
    {
        name: "Johnny Jiggles",
        role: "Freelance Sensation Coordinator",
        content:
            "With TakeAMoment, my 'clients' never miss an appointment. Now if only it could remind me where I left my pants after the last one...",
        image: "https://i.pravatar.cc/150?img=10",
    },
    {
        name: "Candy Cane",
        role: "Unicorn Whisperer by Day",
        content:
            "TakeAMoment ensures I can juggle all my *nighttime escapades* and *daytime distractions* without ever missing a beat. Or a spank.",
        image: "https://i.pravatar.cc/150?img=11",
    },
    {
        name: "Randy McSnuggles",
        role: "Certified Pillow Fluffer",
        content:
            "Since using TakeAMoment, I’ve mastered the art of 'getting busy'. My schedule’s full, my hands are full... let’s just say life is *very* satisfying now.",
        image: "https://i.pravatar.cc/150?img=12",
    },
];


const Testimonials = () => {
    return (
        <Carousel plugins={[
            Autoplay({
                delay: 2000,
            }),
        ]} className="w-full mx-auto">
            <CarouselContent>
                {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full">
                            <CardContent className="flex flex-col justify-between h-full p-6">
                                <p className="text-gray-600 mb-4">
                                    &quot;{testimonial.content}&quot;
                                </p>
                                <div className="flex items-center mt-4">
                                    <Avatar className="h-12 w-12 mr-4">
                                        <AvatarImage
                                            src={testimonial.image}
                                            alt={testimonial.name}/>
                                        <AvatarFallback>
                                            {testimonial.name
                                            .split(" ")
                                            .map((n)=>n[0])
                                            .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
};

export default Testimonials;
