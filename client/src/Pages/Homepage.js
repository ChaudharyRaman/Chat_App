import { Box, Container, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'

export default function Homepage() {

    const navigate = useNavigate();
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if(user){
            navigate('/chats')
        }
    },[navigate])

    return (
        <Container maxW='xl' centerContent >
            <Box
                display='flex'
                justifyContent="center"
                p={3}
                bg={'white'}
                w='100%'
                m="40px 0 15px 0"
                borderRadius={"lg"}
                borderWidth={'1px'}
            >
                <Text fontSize={'4xl'} fontFamily={"Work sans"} color={'black'}>TALKIE</Text>
            </Box>
            <Box bg={"white"} w="100%" p={4} borderRadius={"lg"} borderWidth="1px" >
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList mb={'1em'}>    
                        <Tab w={'50%'}>Login</Tab>
                        <Tab w={'50%'}>Sign up</Tab>
                    </TabList>
                    <TabPanels> 
                        <TabPanel>
                            {/* Login Component */}
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            {/* Signup COmponent */}
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}
