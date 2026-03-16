import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  size = 'md',
  href,
  external = false,
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) {
  const classes = `btn btn-${size} ${className}`

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return <Link href={href} className={classes}>{children}</Link>
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
