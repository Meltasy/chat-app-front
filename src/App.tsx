import { Outlet } from 'react-router-dom'
import Navbar from './components/navbar.tsx'
import Footer from './components/footer.tsx'

function App() {

  return (
    <div className='wrapperApp'>
      <Navbar />
      <main className='mainApp'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
