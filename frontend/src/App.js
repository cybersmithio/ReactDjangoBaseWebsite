import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  return (
    <Router>
      <main>
        <Container>
          <Route path="/" component={HomePage} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
