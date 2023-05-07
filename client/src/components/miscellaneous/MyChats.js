import { AddIcon } from '@chakra-ui/icons';
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getSender } from '../../config/ChatLogics';
import { ChatState } from '../../Context/ChatProvider';
import ChatLoading from '../ChatLoading';
import GroupChatModal from './GroupChatModal';

export default function MyChats({fetchAgain}) {

  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const toast = useToast();

  const fetchChats = async () => {
    setIsLoadingChat(true);
    const logdata = await JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(logdata)
    console.log(logdata);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/chat`, config);
      setChats(data);

    } catch (error) {
      toast({
        title: `Error Occured- ${error.message} in Mychats`,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
    setIsLoadingChat(false);
  }

  useEffect(() => {
    // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    console.log('HIIIIIIII');
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems={'center'}
      p='3'
      bg={'white'}
      w={{ base: '100%', md: '35%' }}
      h={'89vh'}
      borderRadius='lg'
      borderWidth={'1px'}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        display={'flex'}
        w='100%'
        // h='100%'
        justifyContent={'space-between'}
        alignItems='center'
      >
        My Chats
        <GroupChatModal>
          <Button
            display={'flex'}
            fontSize={{ base: "17px", md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={'flex'}
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w={'100%'}
        h='100%'
        borderRadius={'lg'}
        overflowY='hidden'
      >
        {isLoadingChat ? (
          <ChatLoading />
        ) : (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    getSender(loggedUser, chat.users)
                  ) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

    </Box>
  )
}
