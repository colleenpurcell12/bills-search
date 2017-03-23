import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import Bills from './components/Bills';
import Legislators from './components/Legislators';
import oneLegislator from './components/oneLegislator';

import Votes from './components/Votes';
import oneBill from './components/oneBill';

// import Followers from './components/Followers'; // <Route path="followers/:usernameOne/:usernameTwo" component={Followers}/>

//            <Route path="user/:zipcode" component={User}/>
//	            <Route path="user" component={User}/>

const routes = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Bills}/>
            <Route path="/Legislators" component={Legislators}/>
            <Route path="/oneLegislator/:legislatorLastName/:chamber" component={oneLegislator}/>
            <Route path="/Votes" component={Votes}/>
            <Route path="/oneBill/:bill_id" component={oneBill}/>
        </Route>
    </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
