import React, { SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <label htmlFor={htmlFor} className="label-text">
        {children}
    </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={`input-field ${className}`}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className = '', ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`input-field min-h-[100px] resize-y ${className}`}
                {...props}
            />
        );
    }
);
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
    ({ className = '', children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={`input-field appearance-none cursor-pointer ${className}`}
                {...props}
            >
                {children}
            </select>
        );
    }
);
Select.displayName = 'Select';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }>(
    ({ className = '', variant = 'primary', ...props }, ref) => {
        const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
        return (
            <button
                ref={ref}
                className={`${baseClass} ${className}`}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
