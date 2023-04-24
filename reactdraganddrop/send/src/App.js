import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const SearchInput = lazy(() => import("../src/Component/Route/Private"));
const Registration = lazy(() =>
  import("../src/Component/LoginRegister/RegistrationForm")
);
const Login = lazy(() => import("../src/Component/LoginRegister/Login"));
const NotFound = lazy(() => import("../src/Component/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route>
          <Route path="/" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<SearchInput />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
