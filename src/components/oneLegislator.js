import React from 'react';
import { Link } from 'react-router';
import key from '../../ProPublicaAPIkey.json' 

class oneLegislator extends React.Component {
    constructor() {
        super();
        this.state = { theMember: {}, votes: [], legislatorLastName: "Legislator" };
    }
    componentDidMount() {
    	let { legislatorLastName, chamber} = this.props.params
        this.setState({ legislatorLastName})
		fetch(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`,
            {method:'GET', headers: {'X-API-Key': key[0].secret} })
        .then(response => response.json())
        .then( info =>  { 
            let members = info.results[0].members
	        let theMember = members.filter( function(item){
	        	return item.last_name===legislatorLastName
	        } )
            this.setState({ theMember: theMember[0] }); 
	        fetch(`https://api.propublica.org/congress/v1/members/${theMember[0].id}/votes.json`, {method:'GET', headers: {'X-API-Key': key[0].secret} })
	        .then(response => response.json())
	        .then( info =>  {  this.setState({ votes: info.results[0].votes }); });
        });
    }
   
    render() {
        let {  theMember, votes, legislatorLastName } = this.state;  //searchTerm, 
        votes = votes.filter( vote => vote.bill.number)

        return (
            <div className="search-page">
                
                <div className="tabs">
                    <Link  to="/" className="tab_item">Bills</Link>
                    <Link  to="/Legislators" className="tab_item">Legislators</Link>
                </div>

                <div className="search_container">
                    <div className="search_description">
                    </div>     
                </div>
                {
                    (!theMember.first_name)?
                        <div className="main-content">
                            <div className="sidebar lower-content-area">
                                <div className="chamberButton">
                                    <div className="billCategory">
                                    </div>
                                </div>
                            </div>
                            <div className="results lower-content-area">
                                LOADING VOTES...
                            </div>
                        </div>
                    :
                
                <div className="main-content">
                    <div className="sidebar lower-content-area">
                        <div className="chamberButton">
                            <div className="billCategory">
                                <div> Next up for election </div>
                                <div> in {theMember.next_election} </div>
                                <div>
                                    <Link href={theMember.url} target="_blank" className="link">Website</Link>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="results lower-content-area">
                        <h1 className="search-form-title"> 
                            {theMember.first_name} {legislatorLastName} ({theMember.state}-
                                    {
                                        (theMember.district)? <span>{theMember.district}</span> 
                                        : <span>Sen. </span>
                                    }
                                    <span> </span>{theMember.party})
                        </h1>
                        
                        <h2 className="search-form-title"> Votes</h2>
                        <ol>
                        {votes.map((vote, idx)=>
                            <li key={idx} className="items_item" >
                                <div className='items_name' id={vote.bill.number}>
                                    <div className="bold">{vote.bill.number} {vote.question} 
                                    </div>
                                    <div>
                                        <span className="normal">{vote.bill.title}</span>
                                    </div>

                                    <div className="oneBill_info">
                                        <span className="bold">Voted:</span> 
                                        <span className="light">{vote.position}</span>
                                    </div>

                                </div>
                            </li>
                        )}
                        </ol>
                        
                    </div>
                        
                    </div>
                
                }
                </div>
        );
    }
};

export default oneLegislator;


// from {member[0].state} of the {  (member[0].party==='D')?" Democractic":" Republican"} Party