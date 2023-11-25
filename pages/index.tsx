import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Container,
  useDisclosure,
} from '@chakra-ui/react'
import { trpc } from '@/utils/trpc'
import { useCallback, useState } from 'react'

const Home: NextPage = () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentTodo, setCurrentTodo] = useState(null);

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure()

  const { data: todos, refetch, isFetched } = trpc.todo.getAll.useQuery();
  const { mutateAsync: createMutateAsync } = trpc.todo.create.useMutation();
  const { mutateAsync: updateMutateAsync } = trpc.todo.update.useMutation();
  const { mutateAsync: deleteMutateAsync } = trpc.todo.delete.useMutation();

  const onCreate = useCallback(
    async () => {
      try {
        const payload = {
          title: title,
          description: description,
        }
        const result = await createMutateAsync(payload);
        onCreateClose()
        if (result.status === 201) {
          refetch()
        }
      } catch (error) {
        console.log(error)
      }
    },
    [createMutateAsync, title, description])

  const onUpdate = useCallback(
    async (id: number) => {
      try {
        const payload = {
          id: id,
          title: title,
          description: description,
        }
        const result = await updateMutateAsync(payload);
        onCreateClose()

        if (result.status === 201) {
          refetch()
        }
      } catch (error) {
        console.log(error)
      }
    },
    [updateMutateAsync, title, description])
  const handleUpdate = (todo: any) => {
    setCurrentTodo(todo)
    onUpdateOpen()
  }
  const onDelete = useCallback(
    async (id: number) => {
      try {
        const payload = {
          id: id,
        }
        const result = await deleteMutateAsync(payload);
        if (result.status === 201) {
          refetch()
        }
      } catch (error) {
        console.log(error)
      }
    },
    [deleteMutateAsync])

  return (
    <div className={styles.container}>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Generated by Todo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Container maxW='5xl' >
          <VStack w="full">
            <Heading mb={5}>TODO List</Heading>
            <Flex justifyContent={'end'} w={'full'}>
              <Button onClick={onCreateOpen}>+ Add</Button>
            </Flex>
            <TableContainer w="full">
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Description</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isFetched && todos?.length === 0 && (
                    <Tr>
                      <Td colSpan={3} textAlign={'center'}>No Todo</Td>
                    </Tr>
                  )}
                  {isFetched && todos?.length !== 0 && todos?.map((todo: any) => (
                    <Tr key={todo.id} >
                      <Td>{todo.title}</Td>
                      <Td> {todo.description}</Td>
                      <Td >
                        <Flex gap={2} justifyContent={'end'}>
                          {/* <Button colorScheme='blue' onClick={() => handleUpdate(todo)}>Edit</Button> */}
                          <Button colorScheme='red' onClick={() => onDelete(todo.id)}>Remove</Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        </Container>
      </main>

      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} gap={5}>

              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input onChange={(e) => setTitle(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea onChange={(e) => setDescription(e.target.value)} />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onCreateClose}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={onCreate}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <Modal isOpen={isUpdateOpen} onClose={onUpdateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={"column"} gap={5}>

              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input onChange={(e) => setTitle(e.target.value)} value={currentTodo?.title}/>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea onChange={(e) => setDescription(e.target.value)} />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onUpdateClose}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={() => onUpdate(currentTodo?.id)}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </div>
  )
}

export default Home