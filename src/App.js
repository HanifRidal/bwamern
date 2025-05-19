import React from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "assets/scss/style.scss";
import LandingPage from "pages/LandingPage";
// import Example from "pages/Example";
import DetailsPage from "pages/DetailsPage";
import Cbf from "pages/CbfPage";

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
          <Route exact path="/properties/:id" component={DetailsPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
