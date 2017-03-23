//BILLS

import React from 'react';
// import { Glyphicon } from 'react-bootstrap'; // Button, ButtonGroup, DropdownButton, MenuItem
import { Link } from 'react-router'; //import { browserHistory as history } from 'react-router';
import key from '../../ProPublicaAPIkey.json' 
// import icon from '../../public/icon.png' 

// console.log("key",key[0].secret)


class oneBill extends React.Component {
    constructor(props) {
        super(props);
        this.state = { bill:{} }; //searchTerm:'',
        // this.handleInputChange  = this.handleInputChange.bind(this);
    }
    componentDidMount() {
        console.log("**this.props.params.bill_id",this.props.params.bill_id)

        fetch(`https://api.propublica.org/congress/v1/115/bills/${this.props.params.bill_id}.json`, // hr1362.json`,// hr1362 hres212
           { method:'GET', headers: { 'X-API-Key': key[0].secret }})
        .then(response => response.json())
        .then( info =>  { 
             console.log("******* ONE Bill in oneBill comp", info.results[0])
            // console.log(`${billTypeSelected}Bills`)
             this.setState({ bill: info.results[0] }); 
        }); 

        
    } 
    render() {
        const { bill } = this.state;
        if (!bill) {
            return ( <div className="user-page">LOADING BILL...</div> );
        }
        return (
            <div className="search-page">
                <div className="tabs">
                    <Link  to="/" className="tab_item">Bills</Link>
                    <Link  to="/Legislators" className="tab_item">Legislators</Link>
                    <Link  to="/Votes" className="tab_item">Votes</Link>
                </div>

                <div className="search_container">
                    <div className="search_description"></div>
                </div>

                <div className="main-content">
                    <div className="sidebar lower-content-area">
                        <div>Sidebar </div>
                        
                    </div>
                    <div className="results lower-content-area">
                        <h2 className="search-form-title">Info about bill</h2>
                        <div className="oneBill_info">
                            <span className="bold">
                                {bill.bill}
                            </span>
                            <span className="light">
                                {bill.title}
                            </span>
                        </div> 
                        <div className="oneBill_info">
                            <span className="bold">Summary:
                            </span>
                            {bill.summary}
                        </div>
                        <div className="oneBill_info">
                            <span className="bold">Sponsor:</span> 
                            <span className="light">
                                {bill.sponsor} ({bill.sponsor_state}-{bill.sponsor_party})
                            </span>
                        </div>
                        <div className="oneBill_info">
                            <span className="bold">Committees:
                            </span>
                                {bill.committees}
                        </div>
                        <div className="oneBill_info">
                            <span className="bold">
                                Passed the House:
                            </span>
                            { (bill.house_passage==="")?
                                <span className="light">No</span>
                                :
                                <span className="light">Yes</span>
                            }
                            <span className="bold">
                                , the Senate: 
                            </span>
                            { (bill.senate_passage==="")?
                                <span className="light">No</span>
                                :
                                <span className="light">Yes</span>
                            }
                        </div> 
                        
                        <div className="oneBill_info">
                            <span className="bold">
                                Find out more about the bill and take action at:
                            </span>
                            <a src={bill.govtrack_url} alt="govtrack link" id="govtrack_link">govtrack.com</a>
                            
                        </div>                   
                    </div>
                </div>
            </div>
        );
    }
};

export default oneBill;