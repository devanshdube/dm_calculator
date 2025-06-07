import { useEffect, useState } from "react";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";
const Login = lazy(() => import("./Screens/Login"));
// import AdminDashboard from "./Admin/AdminDashboard";
// import AdminDashboard2 from "./Admin/AdminDashboard2";
// import BusinessDeveloperDashboard from "./BusinessDeveloper/BusinessDeveloperDashboard";
const AdminDashboard = lazy(() => import("./Admin/AdminDashboard"));
const BusinessDeveloperDashboard = lazy(() =>
  import("./BusinessDeveloper/BusinessDeveloperDashboard")
);
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser?.role) {
      setUserRole(currentUser.role);

      // Redirect based on role if currently on login page
      if (location.pathname === "/") {
        if (currentUser.role === "Owner") {
          navigate("/admin/dashboard");
        } else if (currentUser.role === "BD") {
          navigate("/BD/dashboard");
        }
      }
    }
  }, [currentUser, location.pathname, navigate]);
  return (
    <>
      <Wrapper>
        <Suspense
          fallback={
            <div className="loading-container">
              {/* <div className="spinner"></div> */}
              <div className="spinner-wrapper">
                <div className="spinner-ring"></div>
                <div className="spinner-center">DM</div>
              </div>
            </div>
          }
        >
          {/* {currentUser &&
            location.pathname !== "/" &&
            location.pathname !== "/password-reset"} */}
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/BD/dashboard"
              element={
                currentUser?.role === "BD" ? (
                  <BusinessDeveloperDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                currentUser?.role === "Owner" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
          {/* {user === "Owner" && <AdminDashboard />}
          {user === "BD" && <BusinessDeveloperDashboard />} */}
        </Suspense>
      </Wrapper>
      {/* <Route path="/admin/2/dashboard" element={<AdminDashboard2 />} /> */}
    </>
  );
}

export default App;
const Wrapper = styled.div`
  .loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 9999;
  }

  /* .spinner {
    border: 6px solid #f3f3f3;
    border-top: 6px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  } */

  .spinner-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #e3f2fd, #fce4ec);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .spinner-ring {
    width: 150px;
    height: 150px;
    border: 8px solid transparent;
    border-top: 8px solid #dc620b;
    border-right: 8px solid #dc620b;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
    box-shadow: 0 0 8px rgba(238, 101, 3, 0.6);
    position: absolute;
  }

  .spinner-center {
    font-size: 20px;
    font-weight: bold;
    color: #dc620b;
    z-index: 1;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;
