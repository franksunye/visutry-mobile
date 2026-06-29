import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-ink hover:bg-brand-500 active:bg-brand-600 shadow-sm',
  secondary: 'bg-white text-ink-primary border border-ink-border hover:bg-gray-50',
  ghost: 'text-ink-secondary hover:text-ink hover:bg-black/5',
  outline: 'bg-transparent text-ink border-2 border-brand hover:bg-brand/10',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-12 px-6 text-base w-full',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none touch-manipulation select-none',
        variantClasses[variant],
        sizeClasses[size],
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
