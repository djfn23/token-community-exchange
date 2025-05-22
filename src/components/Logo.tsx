
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo = ({ className, size = 'md', withText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        className={cn(sizeClasses[size], "text-token")}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M85 30C85 23.925 80.075 19 74 19H55C48.925 19 44 23.925 44 30C44 36.075 48.925 41 55 41H65"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M30 44C30 50.075 34.925 55 41 55C47.075 55 52 50.075 52 44"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="30" cy="30" r="8" fill="currentColor" />
        <circle cx="74" cy="55" r="8" fill="currentColor" />
        <circle cx="41" cy="74" r="8" fill="currentColor" />
        <circle cx="19" cy="55" r="8" fill="currentColor" />
      </svg>
      
      {withText && (
        <div className="font-bold text-white tracking-tight">
          <div className={cn(
            size === 'sm' && "text-lg",
            size === 'md' && "text-xl",
            size === 'lg' && "text-2xl",
          )}>
            Token
          </div>
          <div className={cn(
            size === 'sm' && "text-lg -mt-1.5",
            size === 'md' && "text-xl -mt-2",
            size === 'lg' && "text-2xl -mt-2.5",
          )}>
            Trader
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
