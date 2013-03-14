var Skills = {};
Skills.skills = 
[
 {
	 skillId: "CHARGE",
	 name: "Charge Forward",
	 text1: 
		 "Run in a straight line for two steps and then jump into an enemy. \n"+
		"* Enemy evasion is reduced to a third \n"+
		"* Evasion breaking is double \n"+
		"* Damage is triplicated.",
	text2:
		"To perform a chance you need to engage into Brave tactics.\n"+
		"When charging you will see the 'Charge' indicator on the status line.\n"+
		"You can charge into any of the three positions ahead.",
	animation: 
		[
[
"#########",  
"#.......#",
"#.......#",
"#.@..m..#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#.......#",
"#..@.m..#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#...!...#",
"#...@m..#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#....!..#",
"#....@..#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#.....!.#",
"#....%@.#",
"#.......#",
"#########"
],
		]
 },
 {
	 skillId: "ASSAULT",
	 name: "Assault",
	 text1: 
		 "Jump into enemies while running.\n"+
		"* Ensure first attack while charging\n"+
		"* Increase charge damage",
	animation: 
		[
[
"#########",  
"#.......#",
"#.......#",
"#.@...m.#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#.......#",
"#..@..m.#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#...!...#",
"#...@.m.#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#....!..#",
"#....@*.#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#.......#",
"#....@%.#",
"#.......#",
"#########"
]]
		
 },
 {
	 skillId: "CORNER",
	 name: "Wall Pincer",
	 text1: 
		 "Attack an enemy with a solid object behind him\n"+
		 "* Enemy evasion is reduced to a half\n"+
		 "* Damage is doubled\n",
	animation: 
		[
[
"#########",  
"#.......#",
"#....S#.#",
"#.@.....#",
"#.......#",
"#########"
],
[
"#########",  
"#.......#",
"#....S#.#",
"#..@....#",
"#.......#",
"#########"
],
[
"#########",  
"#...!...#",
"#...@S#.#",
"#.......#",
"#.......#",
"#########"
],
[
"#########",  
"#...!...#",
"#...@%#.#",
"#.......#",
"#.......#",
"#########"
]
		]
 },
 {
	 skillId: "SPIN",
	 name: "Spin Slash",
	 text1: 
		 "When surrounded, attack enemies in opposite directions\n"+
		 "* Enemy evasion is reduced to a half\n"+
		 "* Damage is doubled\n",
	animation: 
		[
[
"#########",  
"#.......#",
"#...@S..#",
"#.S.....#",
"#.......#",
"#########",
"         "
],
[
"#########",  
"#.......#",
"#..S@*..#",
"#.......#",
"#.......#",
"#########",
"  LEFT   "
],
[
"#########",  
"#...!...#",
"#..*@S..#",
"#.......#",
"#.......#",
"#########",
"  RIGHT  "
],
[
"#########",  
"#...!...#",
"#..S@*..#",
"#.......#",
"#.......#",
"#########",
"  LEFT   "
],
[
"#########",  
"#...!...#",
"#..*@%..#",
"#.......#",
"#.......#",
"#########",
"   RIGHT "
],
[
"#########",  
"#...!...#",
"#..%@%..#",
"#.......#",
"#.......#",
"#########",
"         "
]
		]
 },
 {
	 skillId: "SLASH",
	 name: "Slash",
	 text1: 
		 "Pass by an enemy while attacking",
	animation: 
		[
[
"#########",  
"#.......#",
"#.......#",
"#..@..S.#",
"#.......#",
"#########",
],
[
"#########",  
"#.......#",
"#.......#",
"#...@S..#",
"#.......#",
"#########",
],
[
"#########",  
"#....!..#",
"#....@..#",
"#....*..#",
"#.......#",
"#########",
],
[
"#########",  
"#.......#",
"#.....!.#",
"#....*@.#",
"#.......#",
"#########",
],
[
"#########",  
"#.......#",
"#.......#",
"#....%@.#",
"#.......#",
"#########",
]
		]
 },
 
 {
	 skillId: "BACKSLASH",
	 requirements: ["SLASH"],
	 name: "Backslash",
	 text1: 
		 "Pass by two enemies while attacking",
	animation: 
		[
[
"#########",  
"#...S...#",
"#.......#",
"#..@..S.#",
"#.......#",
"#########",
],
[
"#########",  
"#.......#",
"#...S...#",
"#...@S..#",
"#.......#",
"#########",
],
[
"#########",  
"#....!..#",
"#...*@..#",
"#....*..#",
"#.......#",
"#########",
],
[
"#########",  
"#.......#",
"#...%.!.#",
"#....*@.#",
"#.......#",
"#########",
],
[
"#########",  
"#.......#",
"#...%...#",
"#....%@.#",
"#.......#",
"#########",
]
		]
 },
 
 {
	 skillId: "FINESSE",
	 name: "Finesse",
	 text1: 
		 "Prevent weapons from damaging on combat\n"+
		 "* Double lifetime for all weapons",
 },
 {
	 skillId: "COUNTER",
	 name: "Counterattack",
	 text1: 
		 "20% chance to gain a free attack after being hit",
 },
 {
	 skillId: "RAGE",
	 name: "Rage",
	 text1: 
		 "Increase damage for consecutive attacks",
 }
];