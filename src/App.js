import React from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "assets/scss/style.scss";
import LandingPage from "pages/LandingPage";
// import Example from "pages/Example";
import DetailsPage from "pages/DetailsPage";
import Cbf from "pages/CbfPage";
import AdminPage from "pages/AdminPage";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import VacationPage from "pages/VacationPage";

const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});

function App() {
  return (
    <div className="App">
      <Router history={history} basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/browse-by" component={Cbf} />
          <Route exact path="/properties" component={VacationPage} />
          <Route exact path="/Wisata/:id" component={DetailsPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/admin" component={AdminPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/dashboard" component={LandingPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
