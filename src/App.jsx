import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import "./main.css";

function App() {
	const [searchText, setSearchText] = useState("");
	const [playerData, setPlayerData] = useState({});
	const [gameList, setGameList] = useState([]);
	const [masteryList, setMasteryList] = useState([]);
	
	const [liveGame, setLiveGame] = useState([]);

	const API_KEY = "RGAPI-a1586c0f-28d4-4fab-81c1-f4b733551e9f";

	function searchForPlayer(event) {
		// Set up correct api call
		let APICallString =
			"https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
			searchText +
			"?api_key=" +
			API_KEY;

		//handle api call
		axios
			.get(APICallString)
			.then(function(response) {
				setPlayerData(response.data);
			})
			.catch(function(error) {
				console.log(error);
				alert(error);
			});
	}

	function getPlayerGames(event) {
		//handle api call til proxy server
		axios
			.get("http://localhost:4000/past5games", {
				params: { username: searchText },
			})
			.then(function(response) {
				setGameList(response.data);
			})
			.catch(function(error) {
				console.log(error);
				alert("error");
			});
	}
	function getPlayerMastery(event) {
		//handle api call til proxy server
		axios
			.get("http://localhost:4000/playerInfo", {
				params: { username: searchText },
			})
			.then(function(response) {
				setMasteryList(response.data);
				
			})
			.catch(function(error) {
				console.log(error);
				alert("error");
			});
	}

	function getPlayerLiveGame(event) {
		//handle api call til proxy server
		
		axios
			.get("http://localhost:4000/liveGame", {
				params: { username: searchText },
			})
			.then(function(response) {
				setLiveGame(response.data);
				
			})
			.catch(function(error) {
				console.log(error);
				alert("error");
			});
	}

	// console.log(playerData)
	// console.log(gameList);
	// console.log( "livegame array: " + liveGame);
	console.log( "mastery array: ", masteryList);

	function epochToJsDate(rd) {
		// rd = revision date - epoch time
		// returns date obj

		return new Date(rd);
	}


	// Den her funktion var et forsøg på at oversætte champion id til chmpion name, virker i console men ikke i funktion
		var request = require('request');

var dDragonVersion = "12.6.1"

function getChampName(id) {
  request('http://ddragon.leagueoflegends.com/cdn/' + dDragonVersion + '/data/de_DE/champion.json', function (error, response, body) {

    let list = JSON.parse(body);
    let championList = list.data;

    for (var i in championList) {

      if (championList[i].key == id) {
		  console.log(championList[i].id)
		//   return championList[i].id;
		
      }

    //   console.log(championList[i].id + " | " + championList[i].key);
    }

  });
}
	

	return (
		<div className="App">
			<div>
				<h5>League Player Searcher</h5>

				<input
					type="text"
					onKeyPress={(event) => {
						if (event.key === "Enter") {
							setSearchText(event.target.value);
							searchForPlayer(event);
							getPlayerGames();
							getPlayerMastery();
							// test();
							
						} else {
							return;
						}
					}}
					onChange={(event) => setSearchText(event.target.value)}
				/>

				<button onClick={(event) => searchForPlayer(event)}>
					Search for Player
				</button>
				<br />
				<button onClick={(event) => getPlayerLiveGame(event)}>
					Search for Players Live game <br /> (Dont work if not ingame or weird characters in name) <br /> (Only works for lol games, needs error handling)
				</button>					
					<div>
					{liveGame.length !== 0 ? (
				<>
					<p>yes! data - gamelist</p>
					<div className="container">
						{liveGame.map((i ,index) => (
							<>
								<div>
									<h2> player {index +1} : {i} </h2>
									
								</div>
							</>
						))}
					</div>
				</>
			) : (
				<>
					<p>no! :C no gamelist data</p>
				</>
			)}
					</div>
				
			</div>

			{JSON.stringify(playerData) !== "{}" ? (
				<>
					<p> {playerData.name} </p>
					<img
						width="100"
						height="100"
						src={
							"http://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/" +
							playerData.profileIconId +
							".png"
						}
						alt="summoner "
					/>
					<p> Level : {playerData.summonerLevel}</p>
					<p>
						{" Sidste levelup : " +
							epochToJsDate(playerData.revisionDate)}{" "}
					</p>

				</>
			) : (
				<>
					<p>No Data :sadge: - please enter valid summonerName</p>
				</>

			)}

{masteryList.length !== 0 ? (
				<>
					<p>yes! - mastery data:</p>
					<div>
						{masteryList.map((data ,index) => (
							<>
							{/* konsollen skriver champion navne ud, indtil andet fix er fundet */}
							{getChampName(data.championId)} 
								<div>
									<h2> Champion {index +1}  </h2>
									<p> Mastery level: { data.championLevel } </p>
									<img
										width="100"
										height="100"
										src={
											'https://ddragon.leagueoflegends.com/cdn/12.4.1/img/champion/' + 'Aatrox' + '.png'
										}
										
										alt="Champion " 
									/>
									<p>
										{ data.chestGranted == true ? (
											<>
											You've already gotten the monthly chest from getting an S or S+ with this champion
											</>
										)
										:
										(
											<>
											Get an S or an S+ to earn a monthly chest with this champion
											</>
										)}
									</p>
									
								</div>
							</>
						))}
					</div>
				</>
			) : (
				<>
					<p>No Data on mastery </p>
				</>

			)}

			{gameList.length !== 0 ? (
				<>
					<p>yes! data - Match history</p>
					<div className="container">
						{gameList.map((gameData, index) => (
							<>
								<div>
									<h2>Game {index + 1} </h2>
									<div className="scoreboard">
										{gameData.info.participants.map(
											(data, participantIndex) => (
												<p>
													PLAYER{" "}
													{participantIndex + 1} :{" "}
													{data.summonerName}, KDA:{" "}
													{data.kills} / {data.deaths}{" "}
													/ {data.assists}{" "}
												</p>
											)
										)}
									</div>
								</div>
							</>
						))}
					</div>
				</>
			) : (
				<>
					<p>no! :C no Match History data</p>
				</>
			)}
		</div>
	);
}

export default App;
