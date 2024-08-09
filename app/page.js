'use client'

import Image from "next/image";
import { use, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I am cluelessdesi, an AI powered chatbot, how can i help you today',
    },
  ])

  const [message, setMessage] = useState('')


  // new helper function 

  const sendMessage = async () => {
    // if (input.trim() === '') return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    // setInput('');
    // setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let botMessage = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        botMessage.content += chunk;
        setMessages(prev => [...prev.slice(0, -1), { ...botMessage }]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      // setIsLoading(false);
    }
  };

  // helper function here
  // const sendMessage = async () => {
  //   setMessage(''); // Clear the input message
  //   setMessages((messages) => [
  //     ...messages,
  //     { role: "user", content: message },  // Add the user message to the list
  //     { role: "assistant", content: "" },  // Prepare an empty response for the assistant
  //   ]);
  
  //   try {
  //     const response = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify([...messages, { role: "user", content: message }]), // Send all messages including the new one
  //     });

  //     // new new stuff 

  //     if (response.ok) {
  //       const responseBody = await response.text();
  //       const responseJson = JSON.parse(responseBody);
  //       const responseMessage = responseJson.choices[0].message.content;

  //       setMessages((messages) => {
  //         let lastMessage = messages[messages.length - 1];
  //         let otherMessages = messages.slice(0, messages.length - 1); // Correct slicing syntax
    
  //         return [
  //           ...otherMessages,
  //           {
  //             ...lastMessage,
  //             content: lastMessage.content + responseMessage, // Append the response to the assistant's message
  //           },
  //         ];
  //       });

  //     } else {
  //       console.error(`Error: ${response.status} ${response.statusText}`);
  //     }

  //     // new new stuff end

  //     // ----- 
      
  //     // new stuff

  //     // const groqResponse = await response.json();
  //     // const responseMessage = groqResponse.choices[0].message.content;
  
  //     // setMessages((messages) => {
  //     //   let lastMessage = messages[messages.length - 1];
  //     //   let otherMessages = messages.slice(0, messages.length - 1); // Correct slicing syntax
  
  //     //   return [
  //     //     ...otherMessages,
  //     //     {
  //     //       ...lastMessage,
  //     //       content: lastMessage.content + responseMessage, // Append the response to the assistant's message
  //     //     },
  //     //   ];
  //     // });

  //     // new stuff end
      
  //     // old stuff
  //     // const reader = response.body.getReader();
  //     // const decoder = new TextDecoder();
  
  //     // let result = "";
  
  //     // reader.read().then(function processText({ done, value }) {
  //     //   if (done) {
  //     //     return result;  // Return the full result when done
  //     //   }
  
  //     //   const text = decoder.decode(value || new Int8Array(), { stream: true });
  //     //   setMessages((messages) => {
  //     //     let lastMessage = messages[messages.length - 1];
  //     //     let otherMessages = messages.slice(0, messages.length - 1); // Correct slicing syntax
  
  //     //     return [
  //     //       ...otherMessages,
  //     //       {
  //     //         ...lastMessage,
  //     //         content: lastMessage.content + text, // Append new text to the assistant's message
  //     //       },
  //     //     ];
  //     //   });
  
  //     //   return reader.read().then(processText);  // Continue reading the stream
  //     // });

  //   } catch (error) {
  //     console.error("Error during message processing:", error);
  //   }
  // };
  

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack direction="column" width="600px" height="700px" border="1px solid black" p={2} spacing={3}>
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
          {
            messages.map((t_message, index) => {
              return (
                <Box key={index} display="flex" justifyContent = {t_message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                  <Box bgcolor={t_message.role === 'assistant' ? 'red' : 'black'} color="white" borderRadius={16} p={3}>
                    { t_message.content } 
                  </Box>
                </Box>
              )
            })
          }
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="send message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)}>
          </TextField>
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  )
}