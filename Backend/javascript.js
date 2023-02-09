const spawner = require('child_process').spawn;


//data to pass in
const data_passed_in = 'Hello World';
console.log['Data sent to Python: ', data_passed_in];

const python_process = spawner('python',['./jstopy.py', data_passed_in]);

python_process.stdout.on('data', (data) => {
    console.log('stdout:', data.toString());
});

//type "node javascript.js" in terminal to run this file
