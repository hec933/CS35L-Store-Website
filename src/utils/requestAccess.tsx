//simple page to ask for help to register an account for admin
//and redirects users
function RequestAccess() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Access Required
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Only shop administrators can access this page. To request admin access:
            </p>
          </div>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500">
                  1. Contact your shop manager if you're a shop employee
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  2. For web admin access, please contact platform support
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  3. Include your registered email in any requests
                </p>
              </div>
              <div className="pt-4">
                <a
                  href="/"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export { RequestAccess };