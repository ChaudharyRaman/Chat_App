import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import './styles.css'

import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'

// const ENDPOINT = 'http://localhost:5000';
// const ENDPOINT = 'https://chat-app-backend-qmli.onrender.com';
var socket, selectedChatCompare;

export default function SingleChat({ fetchAgain, setFetchAgain }) {

    const toast = useToast();
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/message/${selectedChat._id}`, config);
            // console.log(data);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);

        } catch (error) {
            toast({
                title: `Error Occured`,
                description: 'Failed To Send Messages',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    }

    useEffect(() => {
        socket = io(`${process.env.REACT_APP_BASE_URL}`);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])


    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat

    }, [selectedChat]);


    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                // Give Notification
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived,...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    // console.log(notification);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                }
                setNewMessage("");
                // this is not affect as setNewMEssage is asyncronous  
                const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);

                // console.log(data);

                socket.emit('new message', data);
                setMessages([...messages, data]);

            } catch (error) {
                toast({
                    title: `Error Occured`,
                    description: 'Failed To Send Messages',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom-left'
                });
            }
        }
    }



    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // Typing handler logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            pb={3}
                            px={2}
                            w='100%'
                            fontFamily={'Work sans'}
                            display='flex'
                            justifyContent={{ base: 'space-between' }}
                            alignItems='center'
                        >
                            <IconButton
                                display={{ base: 'flex', md: 'none' }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )}
                        </Text>
                        <Box
                            display={'flex'}
                            flexDir="column"
                            justifyContent={'flex-end'}
                            p={3}
                            bg="#E8E8E8"
                            w='100%'
                            h='100%'
                            borderRadius={'lg'}
                            overflowY='hidden'
                        >
                            {/* Messages */}
                            {
                                loading ? (
                                    <Spinner
                                        size={'xl'}
                                        w='20'
                                        h={'20'}
                                        alignSelf='center'
                                        margin={'auto'}
                                    />) : (
                                    <div className='messages'>
                                        {/* Message here */}
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                            }
                            <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                                {isTyping ? <div style={{width:'3rem'}}>
                                    <Lottie
                                        width='7'
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                        options={defaultOptions}
                                    />
                                </div> : (
                                    <></>
                                )}
                                <Input
                                    variant={'filled'}
                                    bg='#E0E0E0'
                                    placeholder='Enter a message...'
                                    value={newMessage}
                                    onChange={typingHandler}
                                />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box
                        display={'flex'}
                        alignItems='center'
                        justifyContent={'center'}
                        h='100%'
                    >
                        <Text fontSize={'3xl'} pb='3' fontFamily={'Work sans'} >Click on User to Start Chating</Text>
                    </Box>
                )
            }
        </>
    )
}
