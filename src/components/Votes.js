import React from 'react';
import { Link } from 'react-router'; //import key from '../../APIkey.json' 
import key from '../../ProPublicaAPIkey.json' 

class Votes extends React.Component {
    constructor() {
        super();
        this.state = {  voteObj: {}}; //, searchTerm:'' };
        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

        // https://api.propublica.org/congress/v1/{congress}/{chamber}/votes/{vote-type}.json
        fetch("https://api.propublica.org/congress/v1/115/senate/sessions/1/votes/17.json",
            {method:'GET', headers: {'X-API-Key': key[0].secret}
            })
        .then(response => response.json())
        .then( info =>  { 
            this.setState({ voteObj: info.results.votes.vote }); 
        });



        fetch("https://api.propublica.org/congress/v1/115/senate/sessions/1/votes/17.json",
            {method:'GET', headers: {'X-API-Key': key[0].secret}
            })
        .then(response => response.json())
        .then( info =>  { 
            // console.log("******* this is the propublica response", info.results.votes.vote)
            // console.log("******* this is the vote obj keys", Object.keys(info.results.votes.vote))


            // this.setState({ voteObj: info.results.votes.vote }); 
            
            // let { voteObj } = this.state;
            // console.log("***** voteObj",voteObj)
            // console.log("***** voteObj result",voteObj.result)
            // console.log("***** voteObj.description",voteObj.description)
            // console.log("***** voteObj.democratic",voteObj.democratic)
            // console.log("***** voteObj.republican",voteObj.republican)
            // console.log("***** voteObj.republican.majority_position",voteObj.republican.majority_position)
        });
    }

                    // <div>{voteObj.description}</div>
                    //<div>Democrats voted {voteObj.democratic.majority_position}</div>
                    //         <div>Democrats voted {voteObj["democratic"].majority_position}</div>
                    //         <div>Republicans voted {voteObj["republican"].majority_position}</div>
                    //         <div>{voteObj.result}</div>
    render() {
        let {  voteObj } = this.state; //searchTerm //bills, billTypeSelected, chamber,, otherType1, otherType2 
        // members = members.map((memb, ind)=> [{state: memb.state, first_name: memb.first_name, 
                                        //     last_name: memb.last_name, party: memb.party //, district: memb.district
                                        // }])
        // console.log(members[0])
        if (!voteObj) {
            return ( <div className="user-page">LOADING votes...</div> );
        }

        return (
            <div className="search-page">
                
                <div className="tabs">
                    <Link  to="/" className="tab_item">Bills</Link>
                    <Link  to="/Legislators" className="tab_item">Legislators</Link>
                    <Link  to="/Votes" className="tab_item selected">Votes</Link>
                </div>

                <div className="search_container">
                    <div className="search_description">Find voting records</div>
                         <img className="search_icon" src="https://cdn2.iconfinder.com/data/icons/picons-essentials/57/search-512.png" alt="search"/>
                         <input className="search_bar" 
                            ref="userInput"
                            type='text'
                            value={voteObj.results}
                            placeholder=""
                            onChange={this.handleInputChange}
                             />
                </div>

                <div className="main-content">
                    <div className="sidebar lower-content-area">
                        
                    </div>
                    <div className="results lower-content-area">
                        <h2 className="search-form-title">Votes</h2>

                            <div>{voteObj.description}</div>
                            <div>Result: {voteObj.result}</div> 
                        
                    </div>
                        
                    </div>
                </div>
        );
    }
};

export default Votes;

//                     <Link  to="/" className={"tab_item "+ (thisComp==="Bills" ? 'selected' : '')}>Bills</Link>



// from {member[0].state} of the {  (member[0].party==='D')?" Democractic":" Republican"} Party

// <ol>
// {members.map((member, idx)=>
// <li key={idx} className="items_item" >
//     <div className='items_name' onClick={this.handleClickBill} id={member[0].number}>
//         {member[0].first_name} {member[0].last_name} ({member[0].party}-{member[0].state})
//         </div>
// </li>
// )}
// </ol>