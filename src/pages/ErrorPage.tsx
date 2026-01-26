import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom'

const ErrorPage = () => {
  const error = useRouteError()
  console.error(error)

  let errorMessage: string

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = 'Unknown error'
  }

  return (
    <div className='wrapperApp'>
      <main className='mainApp'>
        <h1>Sorry, an unexpected error has occurred!</h1>
        <p><i>{errorMessage}</i></p>
        <Link to='/'>Take me to the home page.</Link>
      </main>
    </div>
  )
}

export default ErrorPage
