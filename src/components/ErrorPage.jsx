import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="h1 mb-4">404 - Page Not Found</h1>
          <p className="body-1 mb-8 text-n-2">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex justify-center">
            <Link
              to="/"
              className="button relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-1 px-7"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
