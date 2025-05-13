import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfileProps {
  user: {
    name: string
    email: string
    photoUrl: string
  }
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center space-x-4 mb-6 p-4 bg-muted rounded-lg">
      <Avatar>
        <AvatarImage src={user.photoUrl} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}
