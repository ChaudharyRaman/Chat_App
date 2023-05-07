import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false);
    const [loading,setLoading] = useState(false);

    const handleShow = () => {
        setShow(!show);
    }
    const submitHandler = async() => {
        setLoading(true);
        if(!email || !password){
            toast({
                title: 'Please Select an Image',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
        try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };
            const {data} = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/user/login`,
                {email,password},
                config
            )
            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });

            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            navigate("/chats");

        }catch(error){
            toast({
                title: `${error.message}`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
    }

    return (
        <VStack spacing={'5px'} >

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h='1.75rem' size={'sm'} onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme={"green"}
                width={'100%'}
                style={{ marginTop: '15px' }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>

            <Button
                variant={'solid'}
                colorScheme={"red"}
                width={'100%'}
                style={{ marginTop: '15px' }}
                onClick={()=>{
                    setEmail("guest@example.com");
                    setPassword("123456")
                }}
            >
                Get Guest User Credentials
            </Button>

        </VStack>
    )
}
