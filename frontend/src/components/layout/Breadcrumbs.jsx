import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mt-1">
      <Link to="/" className="hover:text-gray-700">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <span key={name} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5" />
            {isLast ? (
              <span className="text-gray-900 font-medium">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-gray-700">
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
