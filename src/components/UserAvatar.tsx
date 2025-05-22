
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  imageSrc?: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar = ({ name, imageSrc, size = 'md' }: UserAvatarProps) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  }[size];
  
  return (
    <Avatar className={sizeClass}>
      {imageSrc && <AvatarImage src={imageSrc} alt={name} />}
      <AvatarFallback 
        className="bg-token-card-dark text-token border-2 border-token/30"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
