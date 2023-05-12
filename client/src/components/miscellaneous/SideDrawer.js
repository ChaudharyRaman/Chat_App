import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';

import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';

export default function SideDrawer() {

    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();


    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { user, setSelectedChat, chats, setChats ,notification, setNotification } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    }

    const handleSearch = async () => {
        // setLoading(true);

        if (!search) {
            toast({
                title: `Please Enter something in search`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/user?search=${search}`, config);
            // console.log(data);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: `Error Occured- ${error.message}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            });
        }

    }

    const accessChat = async(userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
            }
            
            const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/chat`, { userId }, config);
            console.log(data);
            if(!chats.find((c)=>c._id === data._id)){
                setChats([data,...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: `Error Occured- ${error.message} in side Drawer`,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    }

    return (
        <>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems="center"
                bg={'white'}
                w='100%'
                p={'5px 10px 5px 10px'}
                borderWidth='5px'
            >
                <Tooltip label="Search Users to Chat"
                    hasArrow
                    placement={'bottom-end'}
                >
                    <Button variant={'ghost'} onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: 'none', md: 'flex' }} px={'4'} >
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={'3xl'} fontFamily={'Work sans'}>
                    TALKIE
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize={'2xl'} m={2} />
                        </MenuButton>
                        <MenuList pl={2} >
                            {!notification.length &&  "No new Messages"}
                            {
                                notification?.map((n) => (
                                    <MenuItem key={n._id} onClick={()=>{
                                        setSelectedChat(n.chat)
                                        setNotification(notification.filter((nf)=>nf !== n))
                                    }}>
                                        {n.chat.isGroupChat? `New Message in ${n.chat.chatName}` 
                                        // : `New Message from ${getSender(user,notification.chat.users)}
                                        : `New Message from ${getSender(user,n.chat.users)}
                                        `}
                                    </MenuItem>
                                ))
                            }
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />} >
                            <Avatar
                                size={'sm'}
                                cursor={'pointer'}
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler} >Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer
                placement='left'
                onClose={onClose}
                isOpen={isOpen}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomRadius={'1px'} >Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display={'flex'} p={'2'}>
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (

                            searchResult?.map(user => {
                                return (<UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />)
                            })
                        )}
                        {loadingChat && <Spinner ml={'auto'} display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
    )
}
