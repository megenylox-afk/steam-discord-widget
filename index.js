require("dotenv").config();

const steam = require("./steam");

async function main() {

    const stats = await steam.getStats();

    console.log("========== STEAM STATS ==========\n");

    console.log(`📚 Games owned: ${stats.gamesOwned}`);

    console.log(`🎮 Total playtime: ${stats.totalPlaytime} h`);

    console.log();

    console.log("🏆 Top Game");

    console.log(stats.topGame.name);

    console.log(`${(stats.topGame.playtime_forever / 60).toFixed(1)} h`);

    if (stats.recentGame) {

        console.log();

        console.log("🔥 Most Recent Game");

        console.log(stats.recentGame.name);

        console.log();

        console.log(`⏱ Played last two weeks: ${(stats.recentGame.playtime_2weeks / 60).toFixed(1)} h`);

    }
console.log();

const created = new Date(stats.accountCreated * 1000);
const now = new Date();

const years = now.getFullYear() - created.getFullYear();

console.log("📅 Account Age");
console.log(`${years} years`);
console.log();

console.log("⭐ Steam Level");

console.log(stats.steamLevel);
}
main();