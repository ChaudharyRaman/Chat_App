import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

export default function ProfileModal({ user, children }) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? <span onClick={onOpen}>{children}</span> : (
                    <IconButton
                        display={{ base: 'flex' }}
                        icon={<ViewIcon />}
                        onClick={onOpen}
                    />
                )
            }

            <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h={'410px'}>
                    <ModalHeader
                        fontSize={'40px'}
                        fontFamily="Work sans"
                        display={'flex'}
                        justifyContent='center'
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDirection='column'
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Image
                            borderRadius={'full'}
                            boxSize='150px'
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            fontFamily={'Work sans'}
                            fontSize={{ base: '28px', md: '30px' }}
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}
