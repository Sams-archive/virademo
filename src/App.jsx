
// import { Routes, Route, Navigate } from 'react-router-dom'

// import LandingPage from '../pages/LandingPage'
// import Demo        from '../pages/Demo'
// import Auth        from '../pages/Auth' // or Login.jsx / Signup.jsx

// export default function App() {
//   return (
//     <>
//       <div className="noise-overlay" />

//       <Routes>
//         {/* Public pages only */}
//         <p> H E L L O</p>
//         <Route path="/"     element={<LandingPage />} />
//         <Route path="/demo" element={<Demo />} />
//         <Route path="/auth" element={<Auth />} />

//         {/* Catch-all */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   )
// }

import { BrowserRouter } from 'react-router-dom'
import Demo from '../pages/Demo'

export default function App() {
  return (
    <BrowserRouter>
      <div className="noise-overlay" />
      <Demo />
    </BrowserRouter>
  )
}
