import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

interface NavigationButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'left' | 'right' | 'back' | 'none';
  className?: string;
  disabled?: boolean;
}

const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({ 
    children, 
    onClick, 
    href, 
    variant = 'primary', 
    size = 'md', 
    icon = 'none',
    className,
    disabled = false,
    ...props 
  }, ref) => {
    const baseClasses = "transition-all duration-300 ease-in-out";
    const hoverClasses = "hover:shadow-lg";
    const activeClasses = "";
    
    const variantClasses = {
      primary: "bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-md hover:shadow-teal-200/50",
      secondary: "bg-white hover:bg-gray-50 text-teal-500 border-2 border-teal-500 hover:border-teal-600 shadow-md hover:shadow-teal-200/30",
      outline: "bg-transparent hover:bg-teal-50 text-teal-600 border-2 border-teal-200 hover:border-teal-400 shadow-sm hover:shadow-teal-100/40",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-0",
      link: "bg-transparent hover:bg-transparent text-teal-600 hover:text-teal-800 border-0 underline-offset-4 hover:underline"
    };
    
    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base"
    };
    
    const iconComponents = {
      left: <ArrowLeft className="h-4 w-4 mr-2" />,
      right: <ArrowRight className="h-4 w-4 ml-2" />,
      back: <ChevronLeft className="h-4 w-4 mr-2" />,
      none: null
    };

    const buttonClasses = cn(
      baseClasses,
      hoverClasses,
      activeClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (href) {
      return (
        <Button
          ref={ref}
          asChild
          className={buttonClasses}
          disabled={disabled}
          {...props}
        >
          <a href={href} className="flex items-center">
            {icon !== 'none' && iconComponents[icon]}
            {children}
          </a>
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        onClick={onClick}
        className={buttonClasses}
        disabled={disabled}
        {...props}
      >
        {icon !== 'none' && iconComponents[icon]}
        {children}
      </Button>
    );
  }
);

NavigationButton.displayName = 'NavigationButton';

export default NavigationButton;
