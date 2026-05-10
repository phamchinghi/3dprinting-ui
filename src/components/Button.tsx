import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
  size?: 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', block, size = 'md', className = '', children, ...rest }: ButtonProps) => {
  const classes = ['btn', `btn-${variant}`, block && 'btn-block', size === 'lg' && 'btn-lg', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};
