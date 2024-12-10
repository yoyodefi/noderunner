import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ 
  className, 
  children, 
  ...props 
}: CardProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 border-b border-gray-100",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

Card.Content = function CardContent({ 
  className, 
  children, 
  ...props 
}: CardProps) {
  return (
    <div 
      className={cn("p-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
};