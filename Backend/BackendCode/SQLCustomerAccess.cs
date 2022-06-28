using Dapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SQLite;
using System.Linq;

namespace Backend
{
    class SQLCustomerAccess
    {

        public static List<PersonTest> LoadUsers()
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<PersonTest>("select * from Customers", new DynamicParameters());
                return output.ToList();
            }
        }


        public static void SavePerson(PersonTest person)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                cnn.Execute("insert into Customers(customerID, username, password) values (@customerID, @username, @password)", person);
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

        public static List<PersonTest> SearchUser(int userID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<PersonTest>("select * from Customers where CustomerID=" + userID).ToList();
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

        public static List<PersonTest> searchUser(int userID)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<PersonTest>("select * from Customers where customerID=" + userID).ToList();
                return output;

            }
        }

        

        private static string LoadConnectionString(string id = "Customers")
        {
            return ConfigurationManager.ConnectionStrings[id].ConnectionString;
        }
    }
}
