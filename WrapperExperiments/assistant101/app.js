import * as dotenv from 'dotenv';
import {OpenAI} from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// // creating an assistant
// const assistant = await openai.beta.assistants.create({
//     name: "Travel Guide",
//     instructions: "You are a travel guide",
//     tools: [
//         {
//         type: "code_interpreter",
//         },
//     ],
//     model: "gpt-3.5-turbo",
// });


// retrieving an assistant
const assistant = await openai.beta.assistants.retrieve(
    "asst_id"
);
console.log(assistant)


// // threads
// const thread = await openai.beta.threads.create();
// console.log(thread);


// // create message
// const message = await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: "what is 12 * 12?",
// });


// // run assistant
// const run = await openai.beta.threads.runs.create(thread.id,{
//     assistant_id: assistant.id,
//     instructions: "address the user as Master",
// });


// retrieve thread and run ids
// const run = await openai.beta.threads.runs.retrieve(
//     "thread_id",
//     "run_id"
// );
//
// console.log(run);


// // show messages' content
// const messages = await openai.beta.threads.messages.list(
//     "thread_id"
// );
//
// messages.body.data.forEach(message => {
//     console.log(message.content);
// });


// // logs
// const logs = await openai.beta.threads.runs.steps.list(
//     "thread_id",
//     "run_id",
// );
//
// logs.body.data.forEach(log=>{
//     console.log(log.step_details);
// });

