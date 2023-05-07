import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

export default function Signup() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const [show, setShow] = useState(false);

    const history = useNavigate();

    const handleShow = () => {
        setShow(!show);
    }
    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dczilkqlt");
            fetch("https://api.cloudinary.com/v1_1/dczilkqlt/image/upload", {
                method: 'post',
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
        } else {
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

    }
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please Fill all the Fields',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'Password Do Not Match',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/user`,
                { name, email, password, pic },
                config
            );
            toast({
                title: 'Registeration Successful',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });

            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            history("/chats");

        } catch (error) {
            toast({
                title: `${error.message}`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }

    }

    return (
        <VStack spacing={'5px'} >

            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h='1.75rem' size={'sm'} onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h='1.75rem' size={'sm'} onClick={handleShow}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic' isRequired>
                <FormLabel>Upload Your Picture</FormLabel>
                <InputGroup>
                    <Input
                        type="file"
                        p={1.5}
                        accept="image/*"
                        onChange={(e) => postDetails(e.target.files[0])}
                    />

                </InputGroup>
            </FormControl>

            <Button
                colorScheme={"green"}
                width={'100%'}
                style={{ marginTop: '15px' }}
                onClick={submitHandler}
                isLoading={loading}
            >
                SignUp
            </Button>

        </VStack>
    )
}
