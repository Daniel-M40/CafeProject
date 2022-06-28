using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Backend
{
    class OrderManager
    {
        List<Product> menu;
        PersonManager manager;
        List<Order> orders;
        List<ProductQty> productOrders;
        List<dynamic> checkedItems;
        List<Product> products;

        public OrderManager() {
            manager = new PersonManager();
            orders = new List<Order>(SQLDataAccess.LoadAllOrders());
            productOrders = new List<ProductQty>(SQLDataAccess.LoadAllProductOrders());
            checkedItems = new List<dynamic>();
            products = new List<Product>(SQLDataAccess.LoadAllProducts());
        }


        public Order createOrder(dynamic data)
        {
            bool duplciate = true;
            int orderID = 0;
            Random randomNumber = new Random();
            string studentID = data.user[0].studentID;
            string dateTime = data.dateTime;
            dateTime = FormatDate(dateTime);



            int pos = manager.searchStudentID(studentID);
            int userID = manager.searchUserID(pos);

            // creates a new order id
            while (duplciate)
            {
                duplciate = false;

                orderID = randomNumber.Next(0, orders.Count + 1);

                if (orders.Any(e => (e.OrdersID == orderID)))
                {
                    duplciate = true;
                }

            }


            Order o = new Order
            {
                OrdersID = orderID,
                CustomerID = userID,
                OrderDate = dateTime

            };

            // Adds them to the database
            createProductQty(data, o.OrdersID);
            orders.Add(o);
            SQLDataAccess.SaveOrder(o);


            return o;
        }

        public string FormatDate(string dateTime) {

            string pattern = "dd/mm/yyyy";
            DateTime currentDt = DateTime.ParseExact(dateTime, pattern, null);


            return currentDt.ToString("yyyy/mm/dd");

        }



        public void createProductQty(dynamic data, int orderID)
        {
            var basket = data.basket;
            Random randomNumber = new Random();
            int productOrderID = 0;

            for (int basketIndex = 0; basketIndex < basket.Count; basketIndex++)
            {

                for (int count = 0; count < basket[basketIndex].Count; count++)
                {
                    bool duplciate = true;

                    //creates a new product order id
                    while (duplciate)
                    {
                        duplciate = false;

                        productOrderID = randomNumber.Next(0, productOrders.Count + 1);

                        if (productOrders.Any(e => (e.productOrderID == productOrderID)))
                        {
                            duplciate = true;
                        }

                    }

                    string productDescription = basket[basketIndex][count].productDescription;
                    Console.WriteLine(productDescription);
                    Console.WriteLine(productOrderID);

                    // checks to find if the item name is in the products table
                    if (products.Any(item => item.productDescription == productDescription))
                    {

                        int productQuantity = getProductQuantity(productDescription, basket, basketIndex); // gets the product quantity of the item
                        var output = SQLDataAccess.GetProductID(productDescription); // gets the id of the product
                        int productID = output[0].productID;



                        ProductQty pqty = new ProductQty
                        {
                            productOrderID = productOrderID,
                            productID = productID,
                            orderID = orderID,
                            productQuantity = productQuantity

                        };

                        productOrders.Add(pqty);
                        SQLDataAccess.SaveProductQuantityOrder(pqty);
                    }

                }
            }
        }

        public int getProductQuantity(string productDescription, dynamic basket, int basketIndex)
        {
            int productQuantity = 0;

            for (int counter = 0; counter < basket[basketIndex].Count; counter++)
            {
                if (basket[basketIndex][counter].productDescription.ToString() == productDescription)
                {
                    productQuantity++;
                }
            }
            checkedItems.Add(productDescription);
            return productQuantity;
        }


    }
}
