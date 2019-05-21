var mysql = require("mysql");
var inquirer = require("inquirer");
var cliTable = require("cli-table");
var colors = require("colors");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazonDB"
});
    
    function displayProducts() {
  
      connection.query("SELECT * FROM products", function(err, res) {
          if (err) throw err;
  
        var table = new cliTable({
          head: ["Item Number".cyan, "Product Name".cyan, "Department".cyan, "Price".cyan, "Quantity".cyan],
          colWidths: [13, 20, 20, 13, 13],
          }); 
        
        for(var i = 0; i < res.length; i++) {
          table.push(
              [res[i].item_id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
          );
        };
        
        console.log(table.toString());	
        orderMenu();
      });
    };
   
    function orderMenu(){
  
      inquirer.prompt([
        {
          type: "input",
          message: "ID of the product you would like to buy?",
          name: "itemNum"
        },
        {
          type: "input",
          message: "How many would you like to buy?",
          name: "Qty"
        }
      ])
      .then(function (userOrder) {
  
        connection.query("SELECT * FROM products JOIN departments ON products.department_name = departments.department_name", 
          function(err, res) {
              if (err) throw err;
  
              var i = userOrder.itemNum - 1; 
  
              if(res[i].stock_quantity >= userOrder.Qty) {
  
                var updateQty = parseInt(res[i].stock_quantity) - parseInt(userOrder.Qty);
  
                var OrderTotal = parseFloat(res[i].price) * parseFloat(userOrder.Qty);
                  OrderTotal = OrderTotal.toFixed(2);
  
                connection.query("UPDATE products SET ? WHERE ?", 
                  [ {
                    stock_quantity: updateQty
                    }, 
                    {
                    item_id: userOrder.itemNum
                    }], 
                  function(error, results) {
                    
                    if(error) throw error;
  
                    orderMsg = "     Your order for " + userOrder.Qty + "  " +  res[i].product_name + " has been placed.  \n" +
                           "     Your total is $ " + OrderTotal + "  \n"; 
  
                    console.log(orderMsg);
                  }
                );
  
                var deptSales = parseFloat(res[i].total_sales) + parseFloat(OrderTotal);
                  deptSales = deptSales.toFixed(2);
  
                connection.query("UPDATE departments SET ? WHERE ?", [ 
                  {	total_sales: deptSales  }, 
                  {	department_name: res[userOrder.itemNum - 1].department_name }
                  ], 
                  function(error, results) {
                    
                    continueShopping();
                  }
                );
                
              }
  
              else {
                orderMsg = "     Insufficient quantity -- We only have " + res[i].stock_quantity + " "  +  res[i].product_name + " \n" +
                           "     We are sorry that we cannot fullfill your order request for  " + userOrder.Qty  + " " + res[i].product_name + " \n"; 
  
                console.log(orderMsg);
                continueShopping();
                 }	    
          });
        
      });	
    };
  
    function continueShopping(){
      inquirer.prompt([
        {
          type: "confirm",
          message: "Would you like to continue shopping? ",
          name: "cont"
        }
      ])
      .then(function (shopping) {
        if (shopping.cont) {
          displayProducts();
        }
        else {
          exitBamazon();
        }
      });
    };
  
    function exitBamazon(){
      connection.end();
      console.log("Goodbye, see you later!");
    };
  
    displayProducts();