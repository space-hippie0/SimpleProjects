import {z} from "zod";

export const usernameSchema = z.object({
    username: z
        .string()
        .min(2)
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/,
            "Username should only contain letters, numbers, underscores"),
});

export const eventSchema = z.object({
    title: z
        .string()
        .min(1, "needs a name !")
        .max(100, "a little overkill? <100 !"),
    description: z
        .string()
        .min(1, "needs a description !")
        .max(500, "are you writing a novel? <500 !"),
    duration: z.number().int().positive("duration must not bend time !"),
    isPrivate: z.boolean(),

});
