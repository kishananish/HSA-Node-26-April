import AuthUser from "../LoginRegister/InvalidUser";
import { Suspense, lazy } from "react";
import { useAuth } from "../../AuthContext/Auth";

const Dashboard = lazy(() => import("../DashboardView/Dashboard"));

export default function PrivateRoute() {
  const userAuth = useAuth();

  return userAuth.user ? <Dashboard /> : <AuthUser />;
}
