import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import ChatBox from '../components/miscellaneous/ChatBox';
import MyChats from '../components/miscellaneous/MyChats';

export default function ChatPage() {

  const { user } = ChatState();
  // console.log(user);
  return (
    <div style={{ width: "100%" }}>

      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent="space-between"
        w={'100%'}
        h={'91.5h'}
        p={'10px'}
      >
        {user && <MyChats/>}
        {user && <ChatBox />}
      </Box>
    </div>
  )
}
