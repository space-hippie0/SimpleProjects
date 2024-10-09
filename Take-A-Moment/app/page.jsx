import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link"
import {ArrowRight, Calendar, Clock, LinkIcon} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import TestimonialCarousel from "@/components/testimonials"
import Testimonials from "@/components/testimonials";
import Billboard from "@/components/billboard";


const features = [
    {
        icon: Calendar,
        title: "Create Events",
        description: "Easily set up and customize your event types",
    },
    {
        icon: Clock,
        title: "Manage Availability",
        description: "Define your availability to streamline scheduling",
    },
    {
        icon: LinkIcon,
        title: "Custom Links",
        description: "Share your personalized scheduling link",
    },
];

const howItWorks = [
    { step: "Sign Up", description: "Create your free TakeAMoment account" },
    {
        step: "Set Availability",
        description: "Define when you're available for meetings",
    },
    {
        step: "Share Your Link",
        description: "Send your scheduling link to clients or colleagues",
    },
    {
        step: "Get Booked",
        description: "Receive confirmations for new appointments automatically",
    },
];

export default function Home() {
    return (
        <main className="container mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
                <div className="lg:w-1/2">
                    <h1 className="gradient-title">
                        Manage Your Time
                    </h1>
                    <p className="text-x1 text-gray-400 mb-10">
                        The app that turns chaos into calendar magic!
                        Now you can actually pretend to have your life in order!
                        Enjoy at your own risk!
                    </p>
                    <Link href="/dashboard">
                        <Button
                            size="lg"
                            className="text-lg bg-gradient-to-r from-black to-gray-900 text-white hover:from-red-600 hover:to-red-800"
                        >
                            Get Started <ArrowRight className="ml-2 h-5 w-5"/>
                        </Button>
                    </Link>

                </div>
                <div className="lg:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-md aspect-square">
                        <Image
                            src="/poster.png"
                            alt="Sample image"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </div>
            </div>
            <div className="mb-24">
                <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 to-yellow-300 bg-clip-text text-transparent">
                    Key Features
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        return (
                            <Card key={index}>
                                <CardHeader>
                                    <feature.icon className="w-12 h-12 text-green-400 mb-4 mx-auto"/>
                                    <CardTitle className="text-center text-black">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-center text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}</div>
            </div>

            <div className="mb-24">
                <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 to-yellow-300 bg-clip-text text-transparent">
                    User Reviews
                </h2>
                <Testimonials/>
            </div>


            <div className="mb-24">
                <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                    Route to Success
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {howItWorks.map((step, index) => (
                        <div key={index} className="text-center">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                            <span className="text-black font-bold text-xl">{index + 1}</span>
                        </div>
                        <h3 className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent font-semibold text-lg mb-0">{step.step}</h3>
                        <p className="text-gray-400">{step.description}</p>

                    </div>
                ))}</div>
            </div>

            <div className="bg-gradient-to-r from-blue-300 to-gray-200 text-black rounded-lg p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to commit?</h2>
                <p className="text-gray-700 text-xl mb-6">Take-A-Moment to join hundreds of Homo-Sapiens and a couple dozens of Neanderthals in this journey.</p>
                <Link href="/dashboard">
                    <Button
                        size="lg"
                        className="text-lg bg-gradient-to-r from-black to-gray-900 text-white hover:from-red-600 hover:to-red-800"
                    >
                        Change Forever <ArrowRight className="ml-2 h-5 w-5"/>
                    </Button>
                </Link>

            </div>
            <Effectboard/>

        </main>
    );
}
