import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../../UserAvatar/UserBadgeItem';
import UserListItem from '../../UserAvatar/UserListItem';

export default function GroupChatModal({ children }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/user?search=${search}`, config);

            setLoading(false)
            setSearchResult(data)

        } catch (error) {
            toast({
                title: `Error Occured- ${error.message} in GroupChatModal`,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
        }
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: `User Already Added`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: `Please Fill all the fields`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);

            setChats([data, ...chats])
            onClose();
            toast({
                title: `New GroupChat Created`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });

        } catch (error) {
            toast({
                title: `Failed to create the Chat!`,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
        }

    }
    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== userToDelete._id));
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'35px'}
                        fontFamily="Work sans"
                        display={'flex'}
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'} flexDir='column' alignItems={'center'}
                    >
                        <FormControl>
                            <Input placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users eg: John, Piyush, Jane'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {/* Searched Users */}
                        <Box
                            w={'100%'}
                            display={'flex'}
                            flexWrap='wrap'
                            justifyContent='left'
                        >
                            {selectedUsers.map(u => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>

                        {loading ? <div>Loading</div> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}
