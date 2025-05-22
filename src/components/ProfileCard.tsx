
import UserAvatar from "./UserAvatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  name: string;
  imageSrc?: string;
  className?: string;
}

const ProfileCard = ({ name, imageSrc, className }: ProfileCardProps) => {
  return (
    <Card className={cn("token-card text-center", className)}>
      <CardHeader className="pt-6 pb-2">
        <UserAvatar name={name} imageSrc={imageSrc} size="lg" />
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-bold mt-2">{name}</h3>
        <div className="mt-4">
          <h4 className="text-md font-semibold">Profile</h4>
          <div className="w-full h-20 mt-2 rounded-lg bg-token-card-dark flex items-center justify-center">
            <div className="network-node"></div>
            <div className="network-node" style={{left: '60%', top: '30%'}}></div>
            <div className="network-node" style={{left: '30%', top: '70%'}}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
