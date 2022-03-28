import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import VerificationPage from "./pages/VerificationPage/VerificationPage";
import { UserDetailsProvider } from "./context/UserContext";
import LogoutPage from "./pages/LogoutPage/LogoutPage";

function App() {
  return (
    <Router>
      <UserDetailsProvider>
        <Header />
        <main>
          <Container>
            <Route path="/" component={HomePage} exact />
            <Route path="/login" component={LoginPage} exact />
            <Route path="/register" component={RegistrationPage} exact />
            <Route
              path="/verifyEmail/:verifySecret"
              component={VerificationPage}
            />
            <Route path="/logout" component={LogoutPage} />
          </Container>
        </main>
        <Footer />
      </UserDetailsProvider>
    </Router>
  );
}

export default App;
