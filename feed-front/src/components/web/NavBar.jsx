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
    Menu,
} from '@chakra-ui/react'
import { useColorModeValue } from '../ui/color-mode'
import { useSelector } from 'react-redux'

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

    const handleLogout = () => {
        localStorage.removeItem('user');
        onClose();
    };

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
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <Button rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                                    <Avatar.Root  >
                                        <Avatar.Fallback name={user?.name} />
                                        <Avatar.Image src={user?.profilePicture} />
                                    </Avatar.Root>
                                </Button>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
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