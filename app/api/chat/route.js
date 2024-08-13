import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const systemPrompt = "Please use these rules to provide replies to the incoming messages: 1) You are to mimic a person who is listening to an individual in distress. 2) Provide comforting & encouraging messages 3) if there are mentions of mental health issues, self harm or suicide, advise them to call helplines 4) provide messsage specific answers and not general answers 5) if the user message deviates from mental health related or emotion related or similar themed conversations, do not continue it, clarify that your purpose is to offer a place to vent or get things off the users chest"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, dangerouslyAllowBrowser: true});

export async function POST(req) {
  
    const { message } = await req.json();
    
    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama3-70b-8192",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null
    });
  
    const encoder = new TextEncoder();
  
    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(encoder.encode(content));
          }
          controller.close();
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );
}

// export async function POST() {
//   const chatCompletion = await getGroqChatCompletion();
//   // Print the completion returned by the LLM.
//   console.log(chatCompletion.choices[0]?.message?.content || "whyyyy");
//     //   return new NextResponse()
// }

// export async function getGroqChatCompletion() {
//     return groq.chat.completions.create({
//       messages: [
//         {
//           role: "user",
//           content: systemPrompt,
//         },
//       ],
//       model: "llama3-8b-8192",
//     }).then((response) => response.choices[0].message.content);
// }

// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const systemPrompt = "creating an ai powered chatbot for a headtstarter AI project"

// export async function POST(request) {
//     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
//     const data = await request.json()
    
//     const completion = await openai.chat.completions.create({
//         messages : [
//             {
//                 role : 'system',
//                 content : systemPrompt
//             },
//             ...data,
//         ], 
//         model : 'gpt-4o-mini',
//         stream : true,
//     })

    // const stream = new ReadableStream({
    //     async start (controller) {
    //         const encoder = new TextEncoder()
    //         try {
    //             for await (const chunk of completion) {
    //                 const content = chunk.choices[0]?.delta?.content
    //                 if (content) {
    //                     const text = encoder.encode(content)
    //                     controller.enqueue(text)
    //                 }
    //             }
    //         }
    //         catch (err) {
    //             controller.error(err)
    //         }
    //         finally {
    //             controller.close()
    //         }
    //     }
    // })

    // return new NextResponse(stream)

// }

