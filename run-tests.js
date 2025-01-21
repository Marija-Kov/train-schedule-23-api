const fs = require("fs/promises");
const path = require("path");
const { exec } = require("child_process");

const TESTS_PATH = path.join(__dirname, "tests");
const TEST_EXTENSION = ".test.js";

(async () => {
   try {
     const files = await fs.readdir(TESTS_PATH, { recursive: true });
     const testFiles = files.filter(file => file.endsWith(TEST_EXTENSION));
     testFiles.forEach(test => {
        const testPath = path.join(TESTS_PATH, test);
        exec(`node ${testPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running test ${test}:`, error);
                return;
            }
            console.log(`🧪 Results for ${test}: \n\n${stdout}`);
            if (stderr) {
                console.log(`Error running ${test}: \n\n${stderr}`);
            }
        })
    })
   } catch (error) {
     console.log(error);
   }
})();

