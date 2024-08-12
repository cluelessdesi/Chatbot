'use client'

import Image from "next/image";
import { use, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I am TWN (talk whatever now), an AI powered chatbot designed to converse about issues that are bothering you, how might i help you today?',
    },
  ])

  const [message, setMessage] = useState('')

  let emotions = ["sadness", "sad", "grief", "sorrow", "despair", "melancholy", "disappointment", "heartache", "loneliness", "dejection", "misery", "despondency", "mourning", "regret", "frustration", "hopelessness", "loss", "emptiness", "gloom", "resentment", "bitterness", "isolation", "pain", "ache", "betrayal", "disillusionment", "upset", "helplessness", "failure", "unhappiness", "hurt", "dismay", "remorse", "trepidation", "dissatisfaction", "lamentation", "disheartenment", "suffering", "discontent", "confusion", "depression", "unease", "anxiety", "violated", "insecurity", "vexation", "estrangement", "brokenness", "shock", "weariness", "bereavement", "wistfulness", "distress", "agony", "detachment", "nostalgia", "rage", "turmoil", "discontentment", "apprehension", "discomfort", "trauma", "discouragement","heartbreak", "displeasure", "anguish", "dismal", "painfulness", "abandonment", "distressed", "bereaved", "shattered", "shame", "mournful", "regretful", "resentful", "overwhelmed", "disheartened", "depressed", "saddened", "discontented", "unfulfilled"]


  // new helper function 

  const sendMessage = async () => {
    // if (input.trim() === '') return;

    let counter = 0;
    for (let i = 0; i < emotions.length; ++i) {
      if (message.includes(emotions[i])) {
        counter += 1
      }
    }

    let temp_msg = "I'm sorry I can not respond to that prompt as I am designed to converse about issues that are bothering you";
    if (counter < 1) {
      alert(temp_msg)
      setMessage('')
      return null
    }

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
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center"
      sx={{backgroundImage: 'url(/sky.gif)', backgroundSize: 'cover', backgroundPosition: 'center',}}>
      <Typography variant='h7' color='#000' textAlign={'center'} fontWeight={'bold'}>
        This is an experimental chatbot with limited capabilities. The chatbot is not designed to prescribe medication
        for mental health issues or to mimic the role of a therapist, but simply, offer a conversational space to talk 
        about whats bothering you. If you face any issues with the chatbot, please <a href="mailto:sufiyanretreat@gmail.com">reach out</a>.
      </Typography>

      <Stack direction="column" width="800px" height="700px" p={2} spacing={3}>
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
          {
            messages.map((t_message, index) => {
              return (
                <Box key={index} display="flex" justifyContent = {t_message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                  <Box bgcolor={t_message.role === 'assistant' ? '#FFFAA0' : '#AEC6CF'} color="black" borderRadius={16} p={3}>
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