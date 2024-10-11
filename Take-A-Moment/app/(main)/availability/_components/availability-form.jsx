"use client"

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {availabilitySchema} from "@/app/lib/validators";
import {Checkbox} from "@/components/ui/checkbox";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {timeSlots} from "@/app/(main)/availability/data";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";


const AvailabilityForm = ({initialData}) => {

    const {register, handleSubmit,control, setValue, watch, formState:{errors}} = useForm({
        resolver:zodResolver(availabilitySchema),
        defaultValues:{...initialData},
    });

    return <form>
        {[
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ].map((day)=>{
            const isAvailable = watch(`${day}.isAvailable`);
            return(
                <div key={day} className="flex items-center space-x-4 mb-4">
                    <Controller
                        name={`${day}.isAvailable`}
                        control={control}
                        render={({field})=>{
                            return (
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked)=>{
                                        setValue(`${day}.isAvailable`, checked);
                                        if (!checked) {
                                            setValue(`${day}.startTime`, "09:00");
                                            setValue(`${day}.endTime`, "17:00");
                                        }
                                    }}
                                />
                            );
                        }}
                    />



                    <span className="w-24">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>

                    {isAvailable && (
                        <>
                            <Controller
                                name={`${day}.startTime`}
                                control={control}
                                render={({field})=>{
                                    return (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Starting at: " />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map(time=>{
                                                    return <SelectItem key={time} value={time}>{time}</SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>

                                    );
                                }}
                            />
                            <span>to</span>
                            <Controller
                                name={`${day}.endTime`}
                                control={control}
                                render={({field})=>{
                                    return (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Ending at: " />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map(time=>{
                                                    return <SelectItem key={time} value={time}>{time}</SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>

                                    );
                                }}
                            />
                            {errors[day]?.endTime && (
                                <span className="text-red-500 text-sm ml-2">
                                    {errors[day].endTime.message}
                                </span>
                            )}
                        </>
                    )}
                </div>
            )
        })}

        <div className="flex items-center space-x-4">
            <span className="w-48">Minimum gap before booking (minutes):</span>
            <Input
                type="number"
                {...register("timeGap", {
                    valueAsNumber: true,
                })}
                className="w-32"
            />
            {errors?.timeGap && (
                <span className="text-red-500 text-sm ml-2">
                    {errors.timeGap.message}
                </span>
            )}
        </div>

        <Button type="submit" className="mt-5" >Update Availability</Button>

    </form>
};

export default AvailabilityForm;
