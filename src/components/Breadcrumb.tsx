import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  title: string;
  crumbs: Crumb[];
}

export const Breadcrumb = ({ title, crumbs }: BreadcrumbProps) => (
  <div className="breadcrumb">
    <div className="container">
      <h1>{title}</h1>
      <ul>
        {crumbs.map((c, idx) => (
          <li key={idx}>{c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}</li>
        ))}
      </ul>
    </div>
  </div>
);
