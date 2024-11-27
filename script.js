const apiKey = '496A6LEDENMNB6ED'; // ThingSpeak API Key
const channelNumber = 2703166;

// Fetch user data and populate sections
async function fetchData() {
    const url = `https://api.thingspeak.com/channels/${channelNumber}/feeds.json?api_key=${apiKey}&results=100`;
    const response = await fetch(url);
    const data = await response.json();
    const feeds = data.feeds;

    // Parse data for leaderboard and user information
    const userPoints = {};
    const totalRecycling = { metal: 0, plastic: 0, paper: 0 };

    feeds.forEach(feed => {
        if (feed.field1) {
            const user = JSON.parse(feed.field1);
            const uid = user.uid;
            const points = user.awardPoints;
            userPoints[uid] = points;

            // Accumulate totals
            totalRecycling.metal += user.metal || 0;
            totalRecycling.plastic += user.plastic || 0;
            totalRecycling.paper += user.paper || 0;
        }
    });

    // Populate leaderboard
    const sortedUsers = Object.entries(userPoints)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const medals = ["🥇", "🥈", "🥉"]; // Gold, Silver, Bronze medals
    document.getElementById('top-users').innerHTML = sortedUsers
        .map(([uid, points], index) => `
            <p class="leaderboard-item">${medals[index]} ${uid}: ${points} Points</p>
        `)
        //.map(([uid, points]) => `<p>${uid}: ${points} Points</p>`)
        .join('');

    // Populate total recycling
    document.getElementById('total-recycling').innerHTML = `
        <p>Metal: ${totalRecycling.metal}</p>
        <p>Plastic: ${totalRecycling.plastic}</p>
        <p>Paper: ${totalRecycling.paper}</p>
    `;

    // Display user data (example placeholder, adapt as needed)
    document.getElementById('user-stats').innerHTML = feeds
        .filter(feed => feed.field1)
        .map(feed => {
            const user = JSON.parse(feed.field1);
            return `<p>${user.uid}: ${user.awardPoints} Points</p>`;
        })
        .join('');
}

// Fetch data on load
//fetchData();


//animation
// Animate the leaderboard items
function animateLeaderboard() {
    const leaderboardItems = document.querySelectorAll("#top-users p");

    leaderboardItems.forEach((item, index) => {
        item.animate(
            [
                { opacity: 0, transform: "translateY(20px)" }, // Start state
                { opacity: 1, transform: "translateY(0)" }    // End state
            ],
            {
                duration: 500,
                delay: index * 200,
                easing: "ease-out",
                fill: "forwards"
            }
        );
    });
}

// Animate the recycling stats
function animateStats() {
    const stats = document.querySelectorAll("#total-recycling p");

    stats.forEach((stat, index) => {
        stat.animate(
            [
                { transform: "translateX(-50px)", opacity: 0 }, // Start state
                { transform: "translateX(0)", opacity: 1 }     // End state
            ],
            {
                duration: 600,
                delay: index * 200,
                easing: "ease-out",
                fill: "forwards"
            }
        );
    });
}

// Rotate the recycling icon once on page load
function rotateIconOnce() {
    const icon = document.querySelector("#recycling-icon");

    icon.animate(
        [
            { transform: "rotate(0deg)" },   // Start state
            { transform: "rotate(360deg)" } // End state
        ],
        {
            duration: 1000, // 1 second for full rotation
            easing: "ease-out",
            fill: "forwards"
        }
    );
}

// Fetch data and trigger animations
fetchData().then(() => {
    animateLeaderboard();
    animateStats();
});
rotateIconOnce();