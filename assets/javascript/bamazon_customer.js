var inquirer = require("inquirer");

inquirer
    .prompt([
        {
            type: "input",
            message: "What is the ID of the item you would like to buy?",
            name: "item"
        },
        {
            type: "input",
            message: "How many units would you like to buy?",
            name: "amount"
        }
    ])
    .then()