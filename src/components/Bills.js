//BILLS

import React from 'react';
// import { Glyphicon } from 'react-bootstrap'; // Button, ButtonGroup, DropdownButton, MenuItem
import { browserHistory, Link } from 'react-router'; //import { browserHistory as history } from 'react-router';
import key from '../../ProPublicaAPIkey.json' 
// import icon from '../../public/icon.png' 

// console.log("key",key[0].secret)


class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  bills: [],  chamber:  "House", searchTerm:'',
            billTypeSelected:  "Updated", // introduced, updated, passed or major
            otherType1: 'Introduced', otherType2: 'Passed' };
        this.switchTypeOfBills  = this.switchTypeOfBills.bind(this);
        this.switchChamber      = this.switchChamber.bind(this);
        this.handleInputChange  = this.handleInputChange.bind(this);
        this.handleClickBill    = this.handleClickBill.bind(this);
    }
    componentDidMount() {
        // ProPublica        
        let { billTypeSelected, chamber } = this.state;
        billTypeSelected = billTypeSelected.toLowerCase();
        chamber = chamber.toLowerCase();
        fetch(`https://api.propublica.org/congress/v1/115/${chamber}/bills/${billTypeSelected}.json`,
           { method:'GET', headers: { 'X-API-Key': key[0].secret }})
        .then(response => response.json())
        .then(info =>  { 
            console.log("******* 1st Bill", info.results[0].bills[0])
            this.setState({ bills: info.results[0].bills }); 
        }); 
    }
    switchTypeOfBills(e){
        let newType = e.target.id.toLowerCase();
        this.setState({ billTypeSelected: newType, bills: [] }); 
        let Type1 = '';
        let Type2 = '';
        if(     newType==="Updated"){       Type1 = "Introduced";   Type2="Passed"; } 
        else if(newType==="Introduced"){    Type1 = "Updated";      Type2="Passed" }
        else{                               Type1 = "Introduced";   Type2="Updated"; }

        this.setState({ otherType1: Type1, otherType2: Type2, searchTerm:'' });
        let chamber = this.state.chamber.toLowerCase();
        fetch(`https://api.propublica.org/congress/v1/115/${chamber}/bills/${newType}.json`,
           { method:'GET', headers: { 'X-API-Key': key[0].secret }})
        .then(response => response.json())
        .then(info =>  { this.setState({ bills: info.results[0].bills }); }); 

    }
    switchChamber(e){
        let chamber = e.target.id
        this.setState({ chamber, bills: [], searchTerm:'' }); 
        let newType = this.state.billTypeSelected.toLowerCase()
        chamber = chamber.toLowerCase();
        fetch(`https://api.propublica.org/congress/v1/115/${chamber}/bills/${newType}.json`,
           { method:'GET', headers: { 'X-API-Key': key[0].secret } })
        .then(response => response.json())
        .then( info =>  { this.setState({ bills: info.results[0].bills }); });
    }
    
    handleInputChange (e) {
        const searchTerm = e.target.value.toLowerCase();
        this.setState({ searchTerm });
    }
    handleClickBill(e){
        const billNumber = (e.target.id).split(".").join('').toLowerCase();
        e.preventDefault();
        browserHistory.push(`/oneBill/${billNumber}`)
    }

    
    render() {
        const { bills, billTypeSelected, chamber, searchTerm, otherType1, otherType2 } = this.state;
        if (!bills) {
            return ( <div className="user-page">LOADING BILLS...</div> );
        }
        let billList =[]
        if(bills){
            billList= bills
            // the displayed repo list will only include the names that contain the filter string
            .filter (bill => bill.title.toLowerCase().includes(searchTerm))
        }
        
        return (
            <div className="search-page">

                <div className="tabs">
                    <Link  to="/" className="tab_item selected">Bills</Link>
                    <Link  to="/Legislators" className="tab_item">Legislators</Link>
                    <Link  to="/Votes" className="tab_item">Votes</Link>
                </div>

                <div className="search_container">
                    <div className="search_description">Search for bills by keyword</div>
                        <img className="search_icon" src="https://cdn2.iconfinder.com/data/icons/picons-essentials/57/search-512.png" alt="search"/>
                        <input className="search_bar" 
                            ref="userInput"
                            type='text'
                            value={searchTerm}
                            placeholder=""
                            onChange={this.handleInputChange}
                             />
                </div>

                <div className="main-content">
                    <div className="sidebar lower-content-area">
                        <div>Switch Bills' </div>
                        <div className="billTypesButton"> 
                            <div className="billCategory">type to </div>
                            <button className="button" id={otherType1} onClick={this.switchTypeOfBills}>
                                {otherType1} </button>
                            or <button className="button" id={otherType2} onClick={this.switchTypeOfBills}>
                                {otherType2} </button> 
                        </div> 
                        <div className="chamberButton">
                            <div className="billCategory">source to </div>
                            { (chamber==="House")? 
                                <div>  
                                    <button className="button" id="Senate" onClick={this.switchChamber}>
                                        Senate </button> </div>
                                : <div> 
                                    <button className="button" id="House" onClick={this.switchChamber}>
                                    House  </button> </div>
                            }
                        </div>
                    </div>
                    <div className="results lower-content-area">
                        <h2 className="search-form-title">{billTypeSelected} Bills from the {chamber}</h2>

                        <ul className="items_list">
                        {billList.map((bill, idx)=>
                            <li key={idx} className="items_item" >
                                <div className='items_name' onClick={this.handleClickBill} id={bill.number}>
                                    {bill.number}
                                </div>
                                <div className='oneBill_info '>

                                    {bill.title}
                                </div>
                                <div className="NEW">
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
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
};

export default Search;



