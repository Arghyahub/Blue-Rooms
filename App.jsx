import {BrowserRouter, Routes, Route} from "react-router-dom"

import Auth from './components/auth/Auth'
import HomeMid from './components/home/HomeMid'
import Landing from "./components/landing/Landing"

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" Component={Landing} />
      <Route path="/auth" Component={Auth} />
      <Route path="/home" Component={HomeMid} />
    </Routes>
    </BrowserRouter>
  )
}

export default App