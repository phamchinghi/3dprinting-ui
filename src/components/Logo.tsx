import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ size = 'md' }: LogoProps) => {
  const fontSize = size === 'lg' ? '1.75rem' : size === 'sm' ? '1.15rem' : '1.4rem';
  return (
    <Link to="/" className="brand-logo" style={{ fontSize }} aria-label="TiNi 3D Store">
      <span className="brand-logo-mark">Ti</span>
      <span>
        <span className="brand-logo-text">TiNi</span>
        <span className="accent"> 3D</span>
        <span className="brand-logo-text"> Store</span>
      </span>
    </Link>
  );
};
