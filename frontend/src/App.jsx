import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";
import BookingPage from "./components/BookingPage";
import MyBookingsPage from "./components/MyBookingsPage";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";

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
          <Footer />
        </>
      ),
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/book/:id",
      element: (
        <>
          <Navbar />
          <BookingPage />
          <Footer />
        </>
      ),
    },
    {
      path: "/movies",
      element: (
        <>
          <Navbar />
          <MovieList />
          <Footer />
        </>
      ),
    },
    {
      path: "/booking",
      element: (
        <>
          <Navbar />
          <BookingPage />
          <Footer />
        </>
      ),
    },
    {
      path: "/mybookings",
      element: (
        <>
          <Navbar />
          <MyBookingsPage />
          <Footer />
        </>
      ),
    },
    {
      path: "*",
      element: <div>404 - Page Not Found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
}
