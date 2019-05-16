var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'bamazon_db'
});

function promptManagerAction() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Please select an option:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            filter: function (val) {
                if (val === 'View Products for Sale') {
                    return 'sale';
                } else if (val === 'View Low Inventory') {
                    return 'lowInventory';
                } else if (val === 'Add to Inventory') {
                    return 'addInventory';
                } else if (val === 'Add New Product') {
                    return 'newProduct'
                } else {
                    console.log('ERROR: Unsupported operation!');
                    exit(1);
                }
            }
        }
    ]).then(function (response) {
        if (response.option === 'sale') {
            displayInventory();
        } else if (response.option === 'lowInventory') {
            displayLowInventory();
        } else if (response.option === 'addInventory') {
            addInventory();
        } else if (response.option === 'newProduct') {
            createNewProduct();
        } else {
            console.log('ERROR: Unsupported operation!');
            exit(1);
        }
    })
}

function displayInventory() {
    queryStr = 'SELECT * FROM products';

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('Existing Inventory: ');
        console.log('..................\n');

        var strOut = '';
        for (var i = 0; i < data.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + data[i].id + ' // ';
            strOut += 'Product Name: ' + data[i].product_name + ' // ';
            strOut += 'Department: ' + data[i].department_name + ' // ';
            strOut += 'Price: $' + data[i].price + '\n';
            strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

            console.log(strOut);
        }

        console.log('------------------------------------------------\n');

        connection.end();
    })
}

function displayLowInventory() {
    queryStr = 'SELECT * FROM products WHERE stock_quantity < 10';

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('Low Inventory Items (below 10): ');
        console.log('..................\n');

        var strOut = '';
        for (var i = 0; i < data.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + data[i].id + ' // ';
            strOut += 'Product Name: ' + data[i].product_name + ' // ';
            strOut += 'Department: ' + data[i].department_name + ' // ';
            strOut += 'Price: $' + data[i].price + '\n';
            strOut += 'Quantity: ' + data[i].stock_quantity + '\n';

            console.log(strOut);
        }

        console.log('------------------------------------------------\n');

        connection.end();
    })
}

function validateNumber(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return "Please enter a whole non-zero number."
    }
}

function validateNumeric(value) {
    var number = (typeof parseFloat(value)) === 'number';
    var positive = parseFloat(value) > 0;

    if (number && positive) {
        return true;
    } else {
        return 'Please enter a positive number for unit price.'
    }
}

function addInventory() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Please enter the Item ID for stock update.',
            validate: validateNumber,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to add?',
            validate: validateNumber,
            filter: Number
        }
    ]).then(function (response) {
        var item = response.id;
        var addQuantity = response.quantity;

        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, { id: item }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                addInventory();
            } else {
                var productData = data[0];

                console.log('Updating Inventory...');

                var updateQueryStr = 'UPDATE products SET stock_quantity =' + (productData.stock_quantity + addQuantity) + 'WHERE id = ' + item;

                connection.query(updateQueryStr, function (err, data) {
                    if (err) throw err;

                    console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');
                    console.log('\n-----------------------------------------------------\n');

                    connection.end();
                })
            }
        })
    })
}

function createNewProduct() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'Please enter the new product name.',
        },
        {
            type: 'input',
            name: 'department_name',
            message: 'Which department does the new product belong to?',
        },
        {
            type: 'input',
            name: 'price',
            message: 'What is the price per unit?',
            validate: validateNumeric
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many items are in stock?',
            validate: validateNumber
        }
    ]).then(function (response) {
        console.log('Adding New Item: \n    Product Name = ' + response.product_name + '\n' +
            '    Department Name = ' + response.department_name + '\n' +
            '    Price = ' + response.price + '\n' +
            '    Stock Quantity = ' + response.stock_quantity);

        var queryStr = 'INSERT INTO products SET ?';

        connection.query(queryStr, input, function (error, results, fields) {
            if (error) throw error;

            console.log('New product has been added to the inventory under Item ID ' + results.insertID + '.');
            console.log('\n----------------------------------------------------------------\n');

            connection.end();
        });
    })
}

function runBamazon() {
    promptManagerAction();
}

runBamazon();