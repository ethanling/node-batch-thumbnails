const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Global Variables
const imageDir = path.join(__dirname + "/test_images/");
const thumbnailDir = path.join(imageDir + "/thumbnails/");
const thumbnailSize = { height: 200, width: 200 };
let allFiles = {};

function resizeImage(inputFile, outputFile, height, width) {
	sharp(inputFile)
		.resize({ height: height, width: width })
		.toFile(outputFile)
		.then((newFileInfo) => {
			console.log("🎨 Success.");
		})
		.catch((error) => {
			console.log(error);
			console.log("🛑 An error occured.");
		})
		.then(() => {
			return outputFile;
		});
}

function createNewFile(parentDirectory, fileName, extension) {
	const newFilePath = path.join(
		thumbnailDir + fileName + "_thumbnail" + extension
	);

	fs.writeFileSync(newFilePath, "", (error) => {
		if (error) throw error;
	});
	console.log("✅" + newFilePath + " created succesfully.");
}

function getContentsOfDir(inputDir) {
	const contents = fs.readdirSync(inputDir);
	const _contents = contents.filter((item) => item != ".DS_Store");
	return _contents;
}

function createThumbDir() {
	const checkIfExists = getContentsOfDir(imageDir);
	if (checkIfExists.filter((str) => str === "thumbnails").length > 0) {
		console.log("Directory already exists");
	} else {
		fs.mkdirSync(thumbnailDir, (error) => {
			if (error) throw error;
			console.log("📂 Created thumbnail directory.");
		});
	}
}

function formatFileNames(array) {
	let allFileNames = {
		original: [],
		thumbnail: [],
	};

	array.forEach((file) => {
		// Only format files, not directories
		if (file.indexOf(".") > 0) {
			const fileArr = file.split(".");
			const name = fileArr[0];
			const ext = "." + fileArr[1];
			if (name && ext) {
				allFileNames.original.push({ name: file });
				allFileNames.thumbnail.push({ name: name, extension: ext });
			}
		}
	});

	return allFileNames;
}

function main() {
	// Create thumbnail directory
	createThumbDir();
	// Read contents of parent
	const data = getContentsOfDir(imageDir);
	const fileNames = formatFileNames(data);
	allFiles = fileNames;
	fileNames.thumbnail.forEach((file) => {
		const newFiles = createNewFile(imageDir, file.name, file.extension);
	});
	for (let i = 0; i < allFiles.original.length; i++) {
		const origPath = path.join(imageDir + allFiles.original[i].name);
		const thumbPath = path.join(thumbnailDir + allFiles.thumbnail[i].name + allFiles.thumbnail[i].extension);
		resizeImage(origPath, thumbPath, thumbnailSize.height, thumbnailSize.width);
	}
}

main();
