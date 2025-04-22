import { Avatar, Button, Card } from "@chakra-ui/react"

export const PostBox = ({author, content}) => {
  
  return (
    <Card.Root width="full">
      <Card.Body gap="2">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" />
        </Avatar.Root>
        <Card.Title mt="2">{author}</Card.Title>
        <Card.Description>
          {content}
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">Like</Button>
        <Button>Comment</Button>
      </Card.Footer>
    </Card.Root>
  )
}
