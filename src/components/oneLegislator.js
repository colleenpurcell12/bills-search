// https://api.propublica.org/congress/v1/members/{member-id}/votes.json

import React from 'react';
import { Link } from 'react-router'; // browserHistory,
import key from '../../ProPublicaAPIkey.json' 

class oneLegislator extends React.Component {
    constructor() {
        super();
        this.state = { theMember: {}, votes: [], legislatorLastName: "Legislator" }; //members: [], 
    }
    componentDidMount() {
    	let { legislatorLastName, chamber} = this.props.params
        this.setState({ legislatorLastName})
        // ProPublica
        console.log("this.props.params.legislatorlast:",legislatorLastName)
        console.log("chamber", chamber)
		
		fetch(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`,
            {method:'GET', headers: {'X-API-Key': key[0].secret} })
        .then(response => response.json())
        .then( info =>  { 
        	console.log(" received members like ", info.results[0].members[0])
        	//console.log(info.results[0].members)
            // this.setState({ members: info.results[0].members }); 

            let members = info.results[0].members
	        let theMember = members.filter( function(item){
	        	// console.log("item.last_name",item.last_name,"legislatorName",legislatorName)
	        	return item.last_name===legislatorLastName
	        } )
	        console.log("theMember",theMember[0])
            this.setState({ theMember: theMember[0] }); 
	        // console.log("theMember id",theMember[0].id)


	        fetch(`https://api.propublica.org/congress/v1/members/${theMember[0].id}/votes.json`,
	            {method:'GET', headers: {'X-API-Key': key[0].secret}
	            })
	        .then(response => response.json())
	        .then( info =>  { 
				console.log("theMember's votes",info)
	            this.setState({ votes: info.results[0].votes }); 
	        });
        });
        

 
        // sample congressman
        // fetch("https://api.propublica.org/congress/v1/members/A000055.json",

    }
   


    render() {
        // let {  searchTerm, members, chamber, userResp, userSenator1, userSenator2 } = this.state; //bills, billTypeSelected, chamber,, otherType1, otherType2 
        let {  theMember, votes, legislatorLastName } = this.state;  //searchTerm, 
        votes = votes.filter( vote => vote.bill.number)
         // members = members.map((memb, ind)=> [{state: memb.state, first_name: memb.first_name, 
         //                                    last_name: memb.last_name, party: memb.party //, district: memb.district
         //                                }])
        // console.log(members[0])
        // if (!members) {
        //     return ( <div className="user-page">LOADING members...</div> );
        // }

        return (
            <div className="search-page">
                
                <div className="tabs">
                    <Link  to="/" className="tab_item">Bills</Link>
                    <Link  to="/Legislators" className="tab_item">Legislators</Link>
                    <Link  to="/Votes" className="tab_item">Votes</Link>
                </div>

                <div className="search_container">
                    <div className="search_description">
                    </div>     
                </div>

                <div className="main-content">
                    <div className="sidebar lower-content-area">
                        <div className="chamberButton">
                            <div className="billCategory">
                                <div> Next up for election </div>
                                <div> in {theMember.next_election} </div>
                                <div>
                                    <a src={theMember.url} alt="website" className="link">Website</a>
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
                </div>
        );
    }
};

export default oneLegislator;


// from {member[0].state} of the {  (member[0].party==='D')?" Democractic":" Republican"} Party