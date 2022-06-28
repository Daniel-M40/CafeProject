using Dapper;
using FAQServer;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SQLite;
using System.Linq;


namespace Backend
{
    public class SQLFAQDataAccess
    {
        // Gets the questions based on what branch it is on
        public static List<Question> LoadQuestions(int branch)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Question>("select * from Questions where Branch=" + branch, new DynamicParameters());
                return output.ToList();
            }
        }

        // Gets the answes based on the id
        public static List<Answer> GetAnswer(int id)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Answer>("select Text from Answers where ID=" + id, new DynamicParameters());
                return output.ToList();
            }
        }

        //Saves a person in the database
        public static void SavePerson(Customer customer)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                cnn.Execute("insert into Customer(ID, Level, firstName, lastName, email) values (@ID, @Level, @firstName, @lastName, @email)", customer);
            }

        }

        // Searches for a user ID and stores them in a list
        public static List<Customer> SearchUserID(int id)
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Customer>("select ID from Customer where ID=" + id, new DynamicParameters());
                return output.ToList(); ;
            }
        }

        // Gets all the userIDs and stores them in a list
        public static List<Customer> GetAllUsersID()
        {
            using (IDbConnection cnn = new SQLiteConnection(LoadConnectionString()))
            {
                var output = cnn.Query<Customer>("select ID from Customer", new DynamicParameters());
                return output.ToList(); 
            }
        }


        private static string LoadConnectionString(string id = "Database")
        {
            return ConfigurationManager.ConnectionStrings[id].ConnectionString;
        }
    }
}
