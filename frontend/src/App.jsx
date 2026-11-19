import { Navigate, Route, Routes } from "react-router-dom";
import Home_page from "./Components/Landing_page/Home_page";
import Register from "./Components/AuthUser/Register";
import Login from "./Components/AuthUser/Login";
import PatientDashboard from "./Components/Dashboards/PatientDashboard";
import DoctorDashboard from "./Components/Dashboards/DoctorDashboard";
import DoctorDirectory from "./Components/DoctorDirectory";
import DoctorDetails from "./Components/DoctorDetails";

function ProtectedRoute({ role, roles, children }) {
    const token = localStorage.getItem("Auth_token");
    const savedUser = localStorage.getItem("Auth_user");
    let user = null;

    try {
        user = savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
        console.error("Could not read the saved user.", error);
    }

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const allowedRoles = roles || [role];

    if (!allowedRoles.includes(user.role)) {
        const dashboardByRole = {
            doctor: "/doctorDashboard",
            patient: "/patientDashboard",
        };

        return <Navigate to={dashboardByRole[user.role] || "/"} replace />;
    }

    return children;
}

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home_page />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/find-doctor"
                    element={
                        <ProtectedRoute roles={["patient", "doctor"]}>
                            <DoctorDirectory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/doctors/:doctorId"
                    element={
                        <ProtectedRoute roles={["patient", "doctor"]}>
                            <DoctorDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patientDashboard"
                    element={
                        <ProtectedRoute role="patient">
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/doctorDashboard"
                    element={
                        <ProtectedRoute role="doctor">
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
