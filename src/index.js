#!/usr/bin/env node

const Robot = require("./robot");

// Process commands
// First two arguments aren't relevant to us here
// For more details of how node arguments work,
// see https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
const commands = process.argv.slice(2);

if (commands.length < 1) {
	// if no commands are provided, show help
	// Note: help will also exit the process
	showHelp();
}

const bot = new Robot();

console.clear();

// read command
switch (commands[0].toLowerCase()) {
	case "place":
		console.log(bot.place(commands[1], showHelp));
		break;
	case "move":
		console.log(bot.move());
		break;
	case "left":
		console.log(bot.turn("left"));
		break;
	case "right":
		console.log(bot.turn("right"));
		break;
	case "report":
		console.log(bot.report());
		break;
	case "clear":
		console.log(bot.clear());
		break;
	default:
		// if no commands are provided, show help
		// Note: help will also exit the process
		showHelp();
}

// Helper functions
// These should technically be separated out into another file but I'm being lazy

// Clean and parse place coordinates
function parseCoordinates(coordinates) {}

// Show help instructions and exit
function showHelp() {
	console.log(`🤖🤖🤖 Welcome to Bad Robot 🤖🤖🤖

Bad Robot simulates the movement of a toy robot on a 5 x 5 grid

Try the following commands:

PLACE X,Y,Facing
> Move the robot to a particular location and facing
> Facings can be North, South, East, or West
> The bot cannot be placed outside the grid
> For example: place 2,3,West

MOVE
> Move the robot one space forward

LEFT
> Turn the robot left

RIGHT
> Turn the robot right

REPORT
> Return the current location and facing

🤖🤖🤖 --- 🤖🤖🤖`);
	process.exit();
}
