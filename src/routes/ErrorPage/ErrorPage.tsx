import { useRouteError } from 'react-router-dom';

import Navigation from '../navigation/navigation.component';
import PageContent from '../../components/PageContent/PageContent';

function ErrorPage() {
  const error: any = useRouteError();

  let title = 'An error occurred!';
  let message = 'Something went wrong!';

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = 'Not found!';
    message = 'Could not find resource or page.';
  }

  return (
    <>
      <Navigation />
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </>
  );
}

export default ErrorPage;