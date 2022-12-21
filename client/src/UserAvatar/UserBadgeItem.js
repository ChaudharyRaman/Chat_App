import { Box, CloseButton } from '@chakra-ui/react'
import React from 'react'

export default function UserBadgeItem({ user, handleFunction }) {
    return (
        <Box
            display={'flex'}
            justifyContent='center'
            alignItems={'center'}
            px={1.5}
            py='1'
            borderRadius={'lg'}
            m={1}
            mb={2}
            varient="solid"
            fontSize={12}
            bg='purple'
            color={'white'}
            cursor={'pointer'}
            onClick={handleFunction}
        >
            <span>{user.name}</span>

            <CloseButton pl={1} />
        </Box>
    )
}
