export type Sponsor = {
name: string;
short?: string;
description: string;
location?: string;
website?: string;
logo: string; // Path to the logo image in public/sponsors
};


export const SPONSORS: Sponsor[] = [
{
name: "100 Thieves",
short: "100T",
description:
"100 Thieves is a premium lifestyle brand and eSports gaming company. 100 Thieves' eSports teams have competed and won championships in some of the top games worldwide, including League of Legends, Call of Duty, and VALORANT and have collaborated with leading companies such as Rockstar, Lexus, JBL, the NBA2K franchise.",
location: "Los Angeles, CA",
website: "https://100thieves.com",
logo: "/sponsors/100thieves.png",
},
{
name: "Team Liquid",
description:
"Team Liquid is one of the biggest esports brands in the world. More than just a successful competitive gaming team, we are a broad based enterprise with businesses in online properties, video production, and influencer and campaign management. We have multiple championships across a dozen games, the highest earning team in the world, and the longest brand partnership in esports with Alienware.",
location: "Santa Monica, CA",
website: "https://www.teamliquid.com",
logo: "/sponsors/teamliquid.png",
},
{
name: "Dignitas",
description:
"Dignitas is an international esports organization and one of the most iconic and recognizable brands in the professional gaming industry, fielding teams in the world's largest and most popular games.",
location: "Newark, New Jersey",
website: "https://dignitas.gg/",
logo: "/sponsors/dignitas.png",
},
{
name: "Cloud9",
description:
"Cloud9 is a premier North American esports organization known for its championship-winning teams and strong presence across games like League of Legends, VALORANT, and Counter-Strike. It's recognized for its commitment to excellence and player development.",
location: "Los Angeles, California",
website: "https://www.cloud9.gg/",
logo: "/sponsors/cloud9.png",
},
{
name: "FaZe Clan",
description:
"FaZe Clan is one of the most prominent lifestyle and esports organizations in the world, known for its dominance in competitive gaming and massive influence in pop culture, entertainment, and apparel.",
location: "Los Angeles, California",
website: "https://fazeclan.com/",
logo: "/sponsors/faze-clan.png",
},
{
name: "NRG Esports",
description:
"NRG Esports is a leading North American organization competing in top titles like Rocket League, VALORANT, and Apex Legends. Known for its creative branding and community engagement, NRG blends competitive success with entertainment flair.",
location: "Los Angeles, California",
website: "https://www.nrg.gg/",
logo: "/sponsors/nrg-esports.png",
},
{
name: "Sentinels",
description:
"Sentinels is an American esports organization known for its success in VALORANT and Halo. It's recognized for its strong fan base, elite rosters, and engaging content creation.",
location: "Los Angeles, California",
website: "https://www.sentinels.gg/",
logo: "/sponsors/sentinels.png",
},
{
name: "G2 Esports",
description:
"G2 Esports is a leading European esports organization known for its dominance in games like League of Legends, VALORANT, and Counter-Strike. Founded by former pro player Carlos 'Ocelote' Rodríguez, G2 is recognized for its elite rosters and strong entertainment brand.",
location: "Berlin, Germany",
website: "https://g2esports.com/",
logo: "/sponsors/g2-esports.png",
},
{
name: "OpTic Gaming",
description:
"OpTic Gaming is an iconic North American esports organization with roots in competitive Call of Duty. Known as 'The Green Wall,' OpTic has expanded into games like Halo, VALORANT, and Rocket League.",
location: "Frisco, Texas",
website: "https://opticgaming.com/",
logo: "/sponsors/optic-gaming.png",
},
{
name: "Complexity Gaming",
description:
"Complexity Gaming is one of the longest-running North American esports organizations, competing in games such as Counter-Strike, Rocket League, and Madden. The organization is known for its professionalism and partnership with the Dallas Cowboys.",
location: "Frisco, Texas",
website: "https://complexity.gg/",
logo: "/sponsors/complexity-gaming.png",
},
{
name: "Team Vitality",
description:
"Team Vitality is a top-tier European esports organization competing in games like League of Legends, Counter-Strike, and Rocket League. Known for its bold branding and high-level competition, Vitality has become a cornerstone of the EU esports scene.",
location: "Paris, France",
website: "https://vitality.gg/",
logo: "/sponsors/team-vitality.png",
},
];