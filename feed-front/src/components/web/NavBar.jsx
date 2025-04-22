'use client'

import {
    Box,
    Flex,
    Avatar,
    HStack,
    Text,
    // IconButton,
    Button,
    Portal,
    // Menu,
    // MenuButton,
    // MenuList,
    // MenuItem,
    // MenuDivider,
    useDisclosure,
    Stack,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Links = ['Dashboard', 'Projects', 'Team']

const NavLink = (props) => {
    const { children } = props

    return (
        <Box
            as="a"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
            }}
            href={'#'}>
            {children}
        </Box>
    )
}

export default function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const user = useSelector((state) => state.user.user);
    const setUser = useSelector((state) => state.user.setUser);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        setShowDropdown(false);
        setUser(null);
        navigate('/login');
    };
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    
    console.log(user)
    return (
        <>
            <Box px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    {/* <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    /> */}
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>Logo</Box>
                        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Box position="relative">
                            <Button 
                                rounded={'full'} 
                                variant={'link'} 
                                cursor={'pointer'} 
                                minW={0}
                                onClick={toggleDropdown}
                            >
                                <Avatar.Root>
                                    <Avatar.Fallback name={user?.user?.name} />
                                    <Avatar.Image src={user?.user?.profilePicture} />
                                </Avatar.Root>
                            </Button>
                            
                            {showDropdown && (
                                <Box
                                    position="absolute"
                                    right={0}
                                    mt={2}
                                    bg="white"
                                    borderWidth="1px"
                                    borderRadius="md"
                                    boxShadow="md"
                                    p={2}
                                    zIndex={1000}
                                    minWidth="100px"
                                >
                                    <Button
                                        variant="ghost"
                                        w="100%"
                                        justifyContent="flex-start"
                                        onClick={handleLogout}
                                        _hover={{ bg: 'gray.100' }}
                                    >
                                        Logout
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    )
}