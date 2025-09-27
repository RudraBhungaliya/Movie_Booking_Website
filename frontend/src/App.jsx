import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";
import BookingPage from "./components/BookingPage";
import "./App.css";

export default function App() {
  const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
    errorElement: <div>Page Not Found!</div>,
  },
  {
      path: "/home",
      element: (
        <>
          <Navbar />
          <Home />
        </>
      ),
    },
  {
      path: "/movies",
      element: (
      <>
          <Navbar />
          <MovieList />
      </>
      ),
  },
  {
      path: "/booking",
      element: (
      <>
          <Navbar />
          <BookingPage />
      </>
      ),
  },
  {
    path: "*", 
    element: <div>404 - Page Not Found</div>,
  },
]);

  return (
    <>
    <RouterProvider router = {router}/>
    </>
  );
}


