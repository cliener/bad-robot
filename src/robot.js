const Conf = require("conf");
const config = new Conf();

module.exports = class Robot {
	// x axis corresponds to west/east
	// y axis corresponds to south/north

	// Min/Max dimensions could be set via a constructor
	minX = 0;
	maxX = 4;
	minY = 0;
	maxY = 4;
	facings = ["North", "South", "East", "West"];

	place(coordinates, errorHandler) {
		// if coordinates aren't provided, help and exit
		if (typeof coordinates === "undefined") {
			errorHandler();
		}

		// Break down directions
		const splitCoordinates = coordinates.split(",");

		// if the right numner of coordinates aren't provided, help and exit
		if (splitCoordinates.length !== 3) {
			errorHandler();
		}

		// check x and y are numbers
		const xCoordinate = parseInt(splitCoordinates[0]);
		const yCoordinate = parseInt(splitCoordinates[1]);
		const rawFacing = splitCoordinates[2];
		// Fix casing to upper case first letter and lower subsequent
		const facing = rawFacing.replace(
			/(.)(.*)/,
			(match, p1, p2) => p1.toUpperCase() + p2.toLowerCase()
		);

		// This is fairly crude if typical of command line applications
		// Anything wrong gets the whole help file
		// A better version would show exactly what was entered incorrectly
		if (
			// ensure x and y values are numbers
			isNaN(xCoordinate) ||
			isNaN(yCoordinate) ||
			// ensure x and y values are within max/min values
			xCoordinate > this.maxX ||
			xCoordinate < this.minX ||
			yCoordinate > this.maxY ||
			yCoordinate < this.minY ||
			// ensure facing is one of those available
			!this.facings.includes(facing)
		) {
			return errorHandler();
		}

		config.set("x", xCoordinate);
		config.set("y", yCoordinate);
		config.set("facing", facing);

		// Report result
		return this.report();
	}

	// clear stored config
	clear() {
		config.clear();
		return "Robot reset";
	}

	move() {
		// ignore command if the bot hasn't been placed
		if (typeof config.get("x") === "undefined") {
			return "";
		}

		// Increment/decrement x/y positions based on the current facing
		// Ensure movement doesn't exceed min/max for each axis
		switch (config.get("facing")) {
			case "North":
				config.set("y", Math.min(config.get("y") + 1, this.maxY));
				break;
			case "South":
				config.set("y", Math.max(config.get("y") - 1, this.minY));
				break;
			case "East":
				config.set("x", Math.min(config.get("x") + 1, this.maxX));
				break;
			case "West":
			default:
				// no other facings left
				config.set("x", Math.max(config.get("x") - 1, this.minX));
		}

		return this.report();
	}

	turn(direction) {
		// ignore command if the bot hasn't been placed
		if (typeof config.get("x") === "undefined") {
			return "";
		}

		// Validate direction
		// If this was written with TypeScript, this would be redundant
		if (direction !== "left" && direction !== "right") {
			console.error("Invalid direction received");
			return "";
		}

		let newFacing;

		switch (config.get("facing")) {
			case "North":
				// could use an inline if statement here but this is clearer
				if (direction === "left") {
					newFacing = "West";
				} else {
					// right
					newFacing = "East";
				}
				break;
			case "South":
				if (direction === "left") {
					newFacing = "East";
				} else {
					newFacing = "West";
				}
				break;
			case "East":
				if (direction === "left") {
					newFacing = "North";
				} else {
					newFacing = "South";
				}
				break;
			case "West":
			default:
				// no other facings left
				if (direction === "left") {
					newFacing = "South";
				} else {
					newFacing = "North";
				}
		}

		config.set("facing", newFacing);

		return this.report();
	}

	report() {
		// ignore command if the bot hasn't been placed
		if (typeof config.get("x") === "undefined") {
			return "";
		}

		return `The Robot is currently placed at coordinates ${config.get(
			"x"
		)}x, ${config.get("y")}y and is facing ${config.get("facing")}`;
	}
};
