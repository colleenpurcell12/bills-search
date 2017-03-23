import React from 'react';
import { browserHistory, Link } from 'react-router'; 
import googleKey from '../../GoogleAPIkey.json' 
import key from '../../ProPublicaAPIkey.json' 

class Legislators extends React.Component {
    constructor() {
        super();
        this.state = {  
            members: [], district: '',  chamber: "House", // searchTerm:'',zipcode: '',
            userResp: '', userSenator1: '', userSenator2: ''  };
        this.switchChamber = this.switchChamber.bind(this);
        this.handleClickLegislator = this.handleClickLegislator.bind(this);
        // this.clickRep = this.clickRep.bind(this);
        // this.clickSenator = this.clickSenator.bind(this);
    }
    componentDidMount() {
        fetch(`https://api.propublica.org/congress/v1/115/${this.state.chamber}/members.json`,
            {method:'GET', headers: {'X-API-Key': key[0].secret}
            })
        .then(response => response.json())
        .then( info =>  { 
            console.log("******* A member rep", info.results[0].members[0])
            this.setState({ members: info.results[0].members }); 
        });

        navigator.geolocation.getCurrentPosition((position) => {
            let {latitude, longitude} = position.coords
             console.log("******* User lat lon captured") //is ",latitude,",",longitude)
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleKey[0].secret}`)
            .then(response => response.json())
            .then( info =>  { 
                //console.log("******* this is the google api response", info.results[0].formatted_address)
                let zipcode = info.results[0].formatted_address.split(", ")[2].split(" ")[1]
                //console.log("******* user zipcode", zipcode)
                // this.setState({ zipcode }); 

                //NEXT FETCH REQUEST
                fetch(`http://whoismyrepresentative.com/getall_mems.php?zip=${zipcode}&output=json`)//${this.state.searchTerm}
                    .then(response => response.json())
                    .then( info =>  { 
                        //console.log("******* User representatives", info)
                        //console.log("******* district from whoismyrepresentative", info.results[0].district)
                        this.setState({ userResp: { 
                                            name: info.results[0].name, 
                                            party: info.results[0].party[0], 
                                            state: info.results[0].state,
                                            district: info.results[0].district
                                        },
                                        userSenator1: { 
                                            name: info.results[1].name, 
                                            party: info.results[1].party[0], 
                                            state: info.results[1].state
                                        },
                                        userSenator2: { 
                                            name: info.results[2].name, 
                                            party: info.results[2].party[0], 
                                            state: info.results[2].state
                                        } 
                                    }); 
                });
            });
        }); 
        
        
        // sample congressman
        // fetch("https://api.propublica.org/congress/v1/members/A000055.json",

    }
    switchChamber(e){
        let chamber = e.target.id        
        this.setState({ chamber, members: [] });  //, searchTerm:''
        chamber = chamber.toLowerCase();
        fetch(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`,
            {method:'GET', headers: {'X-API-Key': key[0].secret} })
        .then(response => response.json())
        .then( info =>  { 
            this.setState({ members: info.results[0].members }); 
        });
    }
    handleClickLegislator(e){
        let {  chamber } = this.state; 
        // console.log("e.target.id",e.target.id)
        //const firstName = e.target.id
        const lastName = e.target.id
        //const LegislatorLastName = (e.target.id).split(" ")[1]
        console.log("lastName e.target.id",e.target.id)
        // console.log("LegislatorLastName e.target.ref",e.target.ref)
        e.preventDefault();
        // browserHistory.push(`/oneLegislator/${firstName}/${lastName}/${chamber}`)
        browserHistory.push(`/oneLegislator/${lastName}/${chamber}`)
    }
    // clickRep(e){
    //     // /oneLegislator/:legislatorName
    //     const LegislatorLastName = (e.target.id).split(" ")[1] //.join('').toLowerCase();
    //     e.preventDefault();
    //     browserHistory.push(`/oneLegislator/${LegislatorLastName}/house`)
    // }
    // clickSenator(e){
    //     // /oneLegislator/:legislatorName
    //     const LegislatorLastName = (e.target.id).split(" ")[1] //.join('').toLowerCase();
    //     e.preventDefault();
    //     browserHistory.push(`/oneLegislator/${LegislatorLastName}/senate`)
    // }

    // from district {members[0].district} 

    handleInputChange(e){
        // this.setState({  searchTerm: e.target.value })
        //if(this.state.searchTerm.length===5){
        fetch(`http://whoismyrepresentative.com/getall_mems.php?zip=94010&output=json`)//${this.state.searchTerm}
        .then(response => response.json())
        .then( info =>  { 
            console.log("******* this is the RESULTS from whoismyrepresentative", info)
            // this.setState({ members: info }); 
        });
        //}
    }
    render() {
        let {   members, chamber, userResp, userSenator1, userSenator2 } = this.state; 
         // members = members.map((memb, ind)=> [{state: memb.state, first_name: memb.first_name, 
                                        //     last_name: memb.last_name, party: memb.party 
                                        // }])
        if (!members) {
            return ( <div className="user-page">LOADING members...</div> );
        }

        return (
            <div className="search-page">
                
                <div className="tabs">
                    <Link  to="/" className="tab_item">Bills</Link>
                    <Link  to="/Legislators" className="tab_item selected">Legislators</Link>
                    <Link  to="/Votes" className="tab_item">Votes</Link>
                </div>

                <div className="search_container">
                    {(userResp)?
                            <div className="your_representatives search_description">
                                <div  className="your_representatives_title">
                                    Your representatives are
                                </div>
                                 <div>
                                    <span id={userResp.name} onClick={this.clickRep} className="legislator_item">
                                        {userResp.name} ({userResp.state}-{userResp.district} {userResp.party}),
                                    </span>
                                    <span id={userSenator1.name} onClick={this.clickSenator} className="legislator_item">
                                        {userSenator1.name} ({userSenator1.state}-Sen. {userSenator1.party}),
                                    </span>
                                    <span id={userSenator2.name} onClick={this.clickSenator}>
                                        {userSenator2.name} ({userSenator2.state}-Sen. {userSenator2.party})
                                    </span>
                                 </div>
                            </div>
                        :
                        <div className="your_representatives your_representatives_title search_description">
                            Loading your legislators...
                        </div>
                    }
                </div>

                <div className="main-content">
                    <div className="sidebar lower-content-area">
                        <div className="chamberButton">
                            <div className="billCategory">Members of the </div>
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
                        <h2 className="search-form-title">{chamber} Legislators</h2>
                        
                        <ol>
                        {members.map((member, idx)=>
                            <li key={idx} className="items_item" >
                                <div className='items_name' onClick={this.handleClickLegislator} 
                                    id={member.last_name} >
                                    {member.first_name} {member.last_name} ({member.state}-
                                    {
                                        (member.district)? <span>{member.district}</span> 
                                        : <span>Sen. </span>
                                    }
                                    <span> </span>{member.party})
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

export default Legislators;


// from {member[0].state} of the {  (member[0].party==='D')?" Democractic":" Republican"} Party