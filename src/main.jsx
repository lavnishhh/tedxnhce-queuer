import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import AddScreen from './add_screen.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ViewScreen from './view_screen.jsx'
import { QueueProvider } from './services/firebase.jsx'
import { ModalProvider } from './services/modal.jsx'

const router = createBrowserRouter([
  {path: '/', element: <AddScreen></AddScreen>},
  {path: '/admin', element: <ViewScreen></ViewScreen>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ModalProvider>
      <QueueProvider>
        <RouterProvider router={router}/>
      </QueueProvider>
    </ModalProvider>
  </StrictMode>,
)


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAq5jNwwzisB3BNjwUrZmi5rUNEObAmUXw",
//   authDomain: "tedxnhce-queuer.firebaseapp.com",
//   projectId: "tedxnhce-queuer",
//   storageBucket: "tedxnhce-queuer.firebasestorage.app",
//   messagingSenderId: "977802517337",
//   appId: "1:977802517337:web:db2b785d4c037b66260a48"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);