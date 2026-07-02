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

    return {

        gamesOwned: games.length,

        totalPlaytime: getTotalPlaytime(games),

        topGame: getTopGame(games),

        recentGame: recentGames.length > 0 ? recentGames[0] : null,

        accountCreated: player.timecreated,

        steamLevel,

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
