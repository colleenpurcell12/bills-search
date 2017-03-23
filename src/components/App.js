import React from 'react';
import { Link } from 'react-router';
// import { Glyphicon } from 'react-bootstrap';

// former icon in tab: https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/VisualEditor_-_Icon_-_Open-book-3.svg/200px-VisualEditor_-_Icon_-_Open-book-3.svg.png

//other https://d30y9cdsu7xlg0.cloudfront.net/png/84860-200.png


// Congress http://findhoalaw.com/wp-content/icons/icon_pending-legislation.png

// voting  https://cdn0.iconfinder.com/data/icons/thin-voting-awards/24/thin-0665_vote_ticket_paper_voting-512.png
// https://cdn0.iconfinder.com/data/icons/thin-voting-awards/24/thin-0665_vote_ticket_paper_voting-512.png
class App extends React.Component {
    render() {
        return (

            <div className="main-app">
            	<div className="main-header">
                    <h1><img className="congressIcon" src="http://findhoalaw.com/wp-content/icons/icon_pending-legislation.png " alt="congress"/><Link to="/">Voter Capital</Link></h1>
                    <h3>Find your legislators, search for bills by interest and examine votes</h3>
                </div>
                <main>
                    {this.props.children}
                </main>
                
            </div>
        );
    }
};

export default App;


// <header className="main-header">
//     <h1><Link to="/"> Legislative Bills </Link></h1>
//     <h4>by Colleen Purcell</h4> 
// </header>