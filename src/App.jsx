import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [searchText, setSearchText] = useState('');
  const [playerData, setPlayerData] = useState({});
  
  
  const API_KEY = 'RGAPI-0cc3efff-d0fa-4073-b474-5a59183fc8bf';

  function searchForPlayer(event) {

    // Set up correct api call 
    let APICallString = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + searchText + '?api_key=' + API_KEY;

    //handle api call
    axios.get(APICallString).then(function (response) {
    
      setPlayerData(response.data);

    }).catch(function (error) {
      console.log(error)
      alert('Summoner name not found')
    })

  }
console.log(playerData)

function epochToJsDate(rd){
  // rd = revision date - epoch time
  // returns date obj
  
  return new Date(rd*1000);
}

console.log(epochToJsDate(playerData.revisionDate))

  return (
    <div className="App">
     <div className='container'>

      <h5>League Player Searcher</h5>

      <input type="text" onChange={event => setSearchText(event.target.value)} />

      <button onClick={event => searchForPlayer(event)}>Search for Player</button>

     </div>

    { JSON.stringify(playerData) !== '{}' ? 
      <>
      <p> { playerData.name } </p>
      <img width='100' height='100' src={'http://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/' + playerData.profileIconId +'.png'} alt="summoner " />
      <p> Level : { playerData.summonerLevel }</p>
      <p>{ ' Sidste levelup : ' + epochToJsDate(playerData.revisionDate)}  </p>
      </>
      :
      <><p>No Data :sadge:</p></>
  }

    </div>
  );
}

export default App;
