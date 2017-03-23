import React from 'react';
import { browserHistory, Link } from 'react-router'; 
import googleKey from '../../GoogleAPIkey.json' 
import key from '../../ProPublicaAPIkey.json' 

class Legislators extends React.Component {
    constructor() {
        super();
        this.state = { zipcode: '', members: [], district: '',  chamber: "House",
            userResp: '', userSenator1: '', userSenator2: '', provideZipCodeQuery: false };
        this.switchChamber = this.switchChamber.bind(this);
        this.handleClickLegislator = this.handleClickLegislator.bind(this);
        this.handleClickYourLegislator = this.handleClickYourLegislator.bind(this);
        this.onChangeFindLegislatorsByZip = this.onChangeFindLegislatorsByZip.bind(this);

    }
    componentDidMount() {
        fetch(`https://api.propublica.org/congress/v1/115/${this.state.chamber}/members.json`,{method:'GET', headers: {'X-API-Key': key[0].secret} })
        .then(response => response.json())
        .then( info =>  { 
            this.setState({ members: info.results[0].members }); 
        });
        if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position) => {
                    let {latitude, longitude} = position.coords
                    // console.log("******* User lat lon captured") //is ",latitude,",",longitude)
                    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleKey[0].secret}`)
                    .then(response => response.json())
                    .then( info =>  { 
                        //console.log("** Google api res", info.results[0].formatted_address)
                        let zipcode = info.results[0].formatted_address.split(", ")[2].split(" ")[1]
                        // NESTED FETCH REQ
                        fetch(`http://whoismyrepresentative.com/getall_mems.php?zip=${zipcode}&output=json`)
                            .then(response => response.json())
                            .then( info =>  { let { results } = info;
                                this.setState({ 
                                    userResp: { name: results[0].name, 
                                        last_name: results[0].name.split(" ")[1],
                                        party: results[0].party[0], state: results[0].state,
                                        district: results[0].district
                                    },
                                    userSenator1: { name: results[1].name, 
                                        last_name: results[1].name.split(" ")[1],
                                        party: results[1].party[0], state: results[1].state
                                    },
                                    userSenator2: { name: results[2].name,
                                        last_name: results[2].name.split(" ")[1], 
                                        party: results[2].party[0], state: results[2].state
                                    } 
                                }); 
                        });
                    });
                }); 
            }
        // else{
            console.log("geolocation not available")
            this.setState({ provideZipCodeQuery: true })
        // }
        // how to tell if 
    }
    switchChamber(e){
        let chamber = e.target.id        
        this.setState({ chamber, members: [] });

        fetch(`https://api.propublica.org/congress/v1/115/${chamber.toLowerCase()}/members.json`, {method:'GET', headers: {'X-API-Key': key[0].secret} })
        .then(response => response.json())
        .then(info => { this.setState({ members: info.results[0].members });});
    } 
    handleClickLegislator(e){
        e.preventDefault();
        browserHistory.push(`/oneLegislator/${e.target.id}/${this.state.chamber}`)
    }
    handleClickYourLegislator(e){
        let chamber = "senate"
        const { userResp, userSenator1, userSenator2 } = this.state;
        const legArray = [userResp, userSenator1, userSenator2]
        const thisLeg = legArray[e.target.id]
        if(thisLeg.district){ chamber = "house" }
        e.preventDefault();
        browserHistory.push(`/oneLegislator/${thisLeg.last_name}/${chamber}`)
    }
    onChangeFindLegislatorsByZip(e){
        let zipcode = e.target.value
        if(zipcode.length<5){ 
            this.setState({ zipcode: zipcode });
        }
        else if(zipcode.length===5){
            console.log("about to fetch")
            fetch(`http://whoismyrepresentative.com/getall_mems.php?zip=${zipcode}&output=json`)
            .then(response => response.json())
            .then( info =>  { let { results } = info;
                this.setState({ 
                    userResp: { name: results[0].name, 
                        last_name: results[0].name.split(" ")[1],
                        party: results[0].party[0], state: results[0].state,
                        district: results[0].district
                    },
                    userSenator1: { name: results[1].name, 
                        last_name: results[1].name.split(" ")[1],
                        party: results[1].party[0], state: results[1].state
                    },
                    userSenator2: { name: results[2].name,
                        last_name: results[2].name.split(" ")[1], 
                        party: results[2].party[0], state: results[2].state
                    },  provideZipCodeQuery: false
                }); 
            });
        }
    }
    render() {
        let { zipcode, members, chamber, userResp, userSenator1, userSenator2, provideZipCodeQuery } = this.state; 
        if (!members) {
            return ( <div className="user-page">LOADING members...</div> );
        }
        return (
            <div className="search-page">
                
                <div className="tabs">
                    <Link  to="/" className="tab_item">Bills</Link>
                    <Link  to="/Legislators" className="tab_item selected">Legislators</Link>
                </div>

                <div className="search_container">
                    {(userResp && !provideZipCodeQuery)?
                            <div className="your_representatives search_description">
                                <div  className="your_representatives_title">
                                    Your representatives are
                                </div>
                                 <div>
                                    <span onClick={this.handleClickYourLegislator} 
                                        className="legislator_item"
                                        id="0">
                                        {userResp.name} ({userResp.state}-{userResp.district} {userResp.party}),
                                    </span>
                                    <span onClick={this.handleClickYourLegislator} 
                                        className="legislator_item"
                                        id="1">
                                        {userSenator1.name} ({userSenator1.state}-Sen. {userSenator1.party}),
                                    </span>
                                    <span onClick={this.handleClickYourLegislator} 
                                        className="legislator_item"
                                        id="2">
                                        {userSenator2.name} ({userSenator2.state}-Sen. {userSenator2.party})
                                    </span>
                                 </div>
                            </div>
                        : (provideZipCodeQuery)?
                            <div className="search_container">
                                <div className="search_description">Search for your legislators by zipcode</div>
                                    <img className="search_icon" src="https://cdn2.iconfinder.com/data/icons/picons-essentials/57/search-512.png" alt="search"/>
                                    <input className="search_bar" 
                                        ref="userInput"
                                        type='text'
                                        value={zipcode}
                                        placeholder=""
                                        onChange={this.onChangeFindLegislatorsByZip}
                                         />
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
                                <div className='items_name link' onClick={this.handleClickLegislator} 
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