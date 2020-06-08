const expect = require("chai").expect;
const { execSync } = require("child_process");
const Robot = require("../src/robot");

// test service runs
describe("Run command line without crashing", () => {
	it("should run", () => {
		execSync(`npm start`, (error, stdout, stderr) => {
			let response;

			if (error) {
				response = false;
			} else if (stderr) {
				response = false;
			} else {
				response = true;
			}

			expect(response).to.equal(true);
		});
	});
});

const reportResponse = (x, y, facing) => {
	return `The Robot is currently placed at coordinates ${x}x, ${y}y and is facing ${facing}`;
};

// test robot
describe("Robot moves correctly and within bounds", () => {
	const bot = new Robot();
	bot.clear();

	// report on empty
	it("Report before placement", () => {
		expect(bot.report()).to.equal("");
	});

	// place
	// report returns correct location
	it("Sets place", () => {
		expect(bot.place("2,2,East")).to.equal(reportResponse(2, 2, "East"));
	});

	// move
	// report returns correct location
	it("Moves", () => {
		expect(bot.move()).to.equal(reportResponse(3, 2, "East"));
	});

	// left
	// report returns correct location
	it("Move Left", () => {
		expect(bot.turn("left")).to.equal(reportResponse(3, 2, "North"));
	});

	// right
	// report returns correct location
	it("Move Right", () => {
		expect(bot.turn("right")).to.equal(reportResponse(3, 2, "East"));
	});

	// place near edge of board
	// try to move off board
	// report returns original location
	it("Doesn't fall off board", () => {
		bot.place("4,4,North");
		expect(bot.move()).to.equal(reportResponse(4, 4, "North"));
	});

	function errorHandler() {
		// return emoty string to test againt
		return "";
	}

	// Place outside bounds
	// report returns correct location
	it("Rejects out of bounds place", () => {
		bot.clear();
		expect(bot.place("6,3,East", errorHandler)).to.equal("");
	});

	// Place outside bounds
	// report returns correct location
	it("Rejects out of bounds place", () => {
		bot.clear();
		expect(bot.place("0,-1,East", errorHandler)).to.equal("");
	});
});

// Match the tests provided in the challenge doc
describe("Robot passes sample checks", () => {
	const bot = new Robot();

	it("Passes test A", () => {
		bot.clear();
		bot.place("0,0,North");
		bot.move();
		expect(bot.report()).to.equal(reportResponse(0, 1, "North"));
	});

	it("Passes test B", () => {
		bot.clear();
		bot.place("0,0,North");
		bot.turn("left");
		expect(bot.report()).to.equal(reportResponse(0, 0, "West"));
	});

	it("Passes test C", () => {
		bot.clear();
		bot.place("1,2,East");
		bot.move();
		bot.move();
		bot.turn("left");
		bot.move();
		expect(bot.report()).to.equal(reportResponse(3, 3, "North"));
	});
});
