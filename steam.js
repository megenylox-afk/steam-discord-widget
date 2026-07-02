const axios = require("axios");

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

async function getOwnedGames() {
    const url =
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${API_KEY}` +
        `&steamid=${STEAM_ID}` +
        `&include_appinfo=true` +
        `&include_played_free_games=true`;

    const response = await axios.get(url);

    return response.data.response.games;
}
async function getRecentGames() {

    const url =
        `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${API_KEY}&steamid=${STEAM_ID}`;

    const response = await axios.get(url);

    return response.data.response.games || [];

}
async function getPlayerSummary() {

    const url =
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${STEAM_ID}`;

    const response = await axios.get(url);

    return response.data.response.players[0];

}
async function getSteamLevel() {

    const url =
        `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${API_KEY}&steamid=${STEAM_ID}`;

    const response = await axios.get(url);

    return response.data.response.player_level;

}
function getTotalPlaytime(games) {

    let minutes = 0;

    for (const game of games) {
        minutes += game.playtime_forever;
    }

    return (minutes / 60).toFixed(1);

}
function minutesToHours(minutes) {

    return (minutes / 60).toFixed(1);

}
function getAccountAge(timestamp) {

    const created = new Date(timestamp * 1000);
    const now = new Date();

    let years = now.getFullYear() - created.getFullYear();
    let months = now.getMonth() - created.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    return `${years} years ${months} months`;

}
function getStatus(state) {

    const statuses = {
        0: "Offline",
        1: "Online",
        2: "Busy",
        3: "Away",
        4: "Snooze",
        5: "Looking to trade",
        6: "Looking to play"
    };

    return statuses[state] || "Unknown";

}
function getTopGame(games) {

    let topGame = games[0];

    for (const game of games) {

        if (game.playtime_forever > topGame.playtime_forever) {
            topGame = game;
        }

    }

    return topGame;

}
async function getStats() {

    const games = await getOwnedGames();
    const recentGames = await getRecentGames();
    const player = await getPlayerSummary();
    const steamLevel = await getSteamLevel();
    const topGame = getTopGame(games);

const recentGame = recentGames.length > 0 ? recentGames[0] : null;

    return {

        gamesOwned: games.length,

        totalPlaytime: getTotalPlaytime(games) + " h",

        topGame: topGame.name,

topGameHours: minutesToHours(topGame.playtime_forever) + " h",

recentGame: recentGame ? recentGame.name : "Нет",

lastTwoWeeks: recentGame
    ? minutesToHours(recentGame.playtime_2weeks) + " h"
    : "0 h",

        accountAge: getAccountAge(player.timecreated)

        steamLevel,

        avatar: player.avatarfull,

nickname: player.personaname,

profileUrl: player.profileurl,

    };

}

module.exports = {
    getOwnedGames,
    getRecentGames,
    getPlayerSummary,
    getSteamLevel,
    getTotalPlaytime,
    getTopGame,
    getStats
};
