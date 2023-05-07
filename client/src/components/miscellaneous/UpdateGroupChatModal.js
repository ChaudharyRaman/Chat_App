import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Modal, ModalContent, ModalHeader, ModalFooter, ModalContentloseButton, ModalOverlay, useDisclosure, ModalBody, useToast, Box, FormControl, Input, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../../UserAvatar/UserBadgeItem';
import axios from 'axios'
import UserListItem from '../../UserAvatar/UserListItem';

export default function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState('');
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);


    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user._id !== user._id) {
            toast({
                title: `Only Admins can add someone`,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            )

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

        } catch (error) {
            toast({
                title: `Error Occured`,
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
        }

    }

    const handleAddUser = async (user1) => {
        console.log(selectedChat.users);
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: `User Already in group`,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: `Error Occured`,
                status: 'error',
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
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: `Only Admins can add someone`,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
            setLoading(false)
        }
    }
    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

        } catch (error) {
            toast({
                title: `Error Occured!`,
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            });
            setRenameLoading(false)
        }
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query);
        setSearchResult([]);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: `Error Occured!`,
                description: "Failed to Load the Search Results",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            });
            setLoading(false)
        }
    }

    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'35px'}
                        fontFamily='Work sans'
                        display={'flex'}
                        justifyContent='center'
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalBody>
                        <Box w={'100%'} display='flex' flexWrap={'wrap'} pb={3}>
                            {selectedChat.users.map(u => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display={'flex'}>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant={'solid'}
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl overflowY={'scroll'}>
                            <Input
                                placeholder='Enter User To Add'
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size={'lg'} />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={()=>{handleRemove(user)}} bgColor={'red'}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}
