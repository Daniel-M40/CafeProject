using Dapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SQLite;
using System.Linq;

namespace Backend
{
    class SQLDataAccess
    {

        public static List<Person> LoadUsers()
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Person>("select * from Customers", new DynamicParameters());
                return output.ToList();
            }
        }

        public static List<Product> LoadAllProducts()
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Product>("select * from Products", new DynamicParameters());
                return output.ToList();
            }
        }


        public static List<Product> GetSubProducts(string subOperation)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Product>("select * from Products where ProductType=\"" + subOperation + "\"", new DynamicParameters());
                return output.ToList();
            }
        }

        public static List<Product> GetProductID(string itemDescription)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Product>("select ProductID from Products where ProductDescription=\"" + itemDescription + "\"", new DynamicParameters());

                return output.ToList();
            }
        }


        public static void SavePerson(Person person)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                cnn.Execute("insert into Customers(customerID, studentID, firstName, lastName, password) values (@customerID, @studentID, @firstName, @lastName, @password)", person);
            }

        }

        public static void ModifyFirstName(int userID, string dataChange)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                cnn.Execute("update Customers set firstName = " + "'" + dataChange + "'" + "where CustomerID=" + userID);
            }
        }

        public static void ModifyLastName(int userID, string dataChange)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                cnn.Execute("update Customers set lastName = " + "'" + dataChange + "'" + "where CustomerID=" + userID);
            }
        }

        public static List<Person> SearchUser(int userID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Person>("select * from Customers where CustomerID=" + userID).ToList();
                return output;

            }
        }

        public static void DeletePerson(int userID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                cnn.Execute("delete from Customers where CustomerID=" + userID);
            }
        }

        public static List<Person> searchUser(int userID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Person>("select * from Customers where CustomerID=" + userID).ToList();
                return output;

            }
        }

        public static List<Order> searchOrder(int userID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Order>("select * from Orders where CustomerID=" + userID).ToList();
                return output;

            }
        }

        public static List<ProductQty> searchProductQtyOrder(int orderID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<ProductQty>("select * from ProductQuantity where OrderID=" + orderID).ToList();
                return output;

            }
        }

        public static void SaveOrder(Order order)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                cnn.Execute("insert into Orders(OrdersID, CustomerID, OrderDate) values (@OrdersID, @CustomerID, @OrderDate)", order);
            }

        }

        public static void SaveProductQuantityOrder(ProductQty pqty)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                cnn.Execute("insert into ProductQuantity(ProductOrderID, ProductID, OrderID, ProductQuantity) values (@productOrderID, @productID, @orderID, @productQuantity)", pqty);
            }

        }

        public static List<Order> LoadAllOrders()
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Order>("select * from Orders", new DynamicParameters());
                return output.ToList();
            }
        }

        public static List<ProductQty> LoadAllProductOrders()
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<ProductQty>("select * from ProductQuantity", new DynamicParameters());
                return output.ToList();
            }
        }

        public static List<OrderIDList> RetrieveOrderID(string startDate, string endDate)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<OrderIDList>("select OrdersID from Orders where OrderDate <= \"" + startDate + "\" and OrderDate >= \"" + endDate + "\"", new DynamicParameters());

                return output.ToList();

            }
        }



        public static List<Sales> RetrieveQuantity(int orderID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Sales>("SELECT ProductID, ProductQuantity from ProductQuantity where OrderID = " + orderID, new DynamicParameters());
                return output.ToList();
            }
        }

        public static List<Date> RetrieveDate(int orderID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Date>("SELECT OrderDate from Orders where OrdersID = " + orderID, new DynamicParameters());
                return output.ToList();
            }
        }


        private static string LoadConnectionString(string id = "Orders")
        {
            return ConfigurationManager.ConnectionStrings[id].ConnectionString;
        }
    }
}
