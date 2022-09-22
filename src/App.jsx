import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import "./main.css";

function App() {
	const [searchText, setSearchText] = useState("");
	const [playerData, setPlayerData] = useState({});
	const [gameList, setGameList] = useState([]);
	
	const [liveGame, setLiveGame] = useState([]);

	const API_KEY = "RGAPI-3b8dd079-1867-4f46-9c2e-bc83d25db672";

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
	console.log(liveGame);

	function epochToJsDate(rd) {
		// rd = revision date - epoch time
		// returns date obj

		return new Date(rd);
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
							
						} else {
							return;
						}
					}}
					onChange={(event) => setSearchText(event.target.value)}
				/>

				<button onClick={(event) => searchForPlayer(event)}>
					Search for Player
				</button>
				<button onClick={(event) => getPlayerLiveGame(event)}>
					Search for Players Live game
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

			

			{gameList.length !== 0 ? (
				<>
					<p>yes! data - gamelist</p>
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
					<p>no! :C no gamelist data</p>
				</>
			)}
		</div>
	);
}

export default App;
