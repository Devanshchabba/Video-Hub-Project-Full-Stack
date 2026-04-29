import React from 'react';
import { useRouteError } from 'react-router-dom';
import ErrorPage from './Error.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';

function RouteError() {
  const routeError = useRouteError();

  return (
    <ErrorPage
      statusCode={routeError?.status || 500}
      message="Something went wrong while loading this page."
      error={getErrorMessage(routeError)}
    />
  );
}

export default RouteError;
