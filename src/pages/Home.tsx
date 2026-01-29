import SignUp from '../components/SignUp.tsx'
import LogIn from '../components/LogIn.tsx'


function Home() {
  return(
    <div>
      <header>
        <h1>Welcome to Chat App</h1>
      </header>
      <main>
        <SignUp />
        <LogIn />
      </main>
    </div>
  )
}

export default Home
