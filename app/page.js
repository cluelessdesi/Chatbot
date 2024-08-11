'use client'

import Image from "next/image";
import { use, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I am TWN (talk whatever now), an AI powered chatbot, how can i help you?',
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
    setMessage('')
  };

  const useEnterKeyToSend = (event) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <a href="https://github.com/cluelessdesi/Customer-Support"> <Button variant="contained">Github code</Button> </a>
      <Button variant="text"></Button>
      <Stack direction="column" width="900px" height="700px" border="1px solid black" p={2} spacing={3}>
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
          {
            messages.map((t_message, index) => {
              return (
                <Box key={index} display="flex" justifyContent = {t_message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                  <Box bgcolor={t_message.role === 'assistant' ? 'green' : 'blue'} color="white" borderRadius={16} p={3}>
                    { t_message.content } 
                  </Box>
                </Box>
              )
            })
          }
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="send message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={useEnterKeyToSend}>
          </TextField>
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  )
}