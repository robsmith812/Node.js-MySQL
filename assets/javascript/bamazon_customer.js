var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'bamazon_db'
});

function validateNumber(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return "Please enter a whole non-zero number."
    }
}

function promptUserPurchase() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the item you would like to buy?",
                name: "item",
                validate: validateNumber,
                filter: Number
            },
            {
                type: "input",
                message: "How many units would you like to buy?",
                name: "amount",
                validate: validateNumber,
                filter: Number
            }
        ])
        .then(function (response) {
            var item = response.item;
            var quantity = response.amount;

            var queryStr = 'SELECT * FROM products WHERE ?';

            connection.query(queryStr, { id: item }, function (err, data) {
                if (err) throw err;

                if (data.length === 0) {
                    console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                    displayInventory();
                } else {
                    var productData = data[0];

                    // console.log('productData = ' + JSON.stringify(productData));
				    // console.log('productData.stock_quantity = ' + productData.stock_quantity);

                    if (quantity <= productData.stock_quantity) {
                        console.log('Your product is in stock! Placing order.');

                        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + 'WHERE id = ' + item;
                        // console.log('updateQueryStr = ' + updateQueryStr);

                        connection.query(updateQueryStr, function (err, data) {
                            if (err) throw err;

                            console.log('Your order has been placed! Your total is $' + productData.price * quantity);
                            console.log('Thank you for shopping!');
                            console.log('\n----------------------------------------------\n');

                            connection.end();
                        })
                    } else {
                        console.log('Sorry we do not have enough product in stock, your order can not be placed.');
                        console.log('Please modify your order.');
                        console.log('\n----------------------------------------------\n');

                        displayInventory();
                    }
                }
            })
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

        promptUserPurchase();
    })
}

function runBamazon() {
    displayInventory();
}

runBamazon();