import Register from '../components/Register.tsx'
import LogIn from '../components/LogIn.tsx'


function Home() {
  return(
    <div>
      <header>
        <h1>Welcome to Chat App</h1>
      </header>
      <main>
        <LogIn />
        <Register />
      </main>
    </div>
  )
}

export default Home
