import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="mt-2 text-lg text-gray-700">Page not found</p>
      <Link
        to={process.env.NODE_ENV === 'production' ? '/calendario-istepo/' : '/'}
        className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
