using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Backend
{
    class PersonManagerTest
    {
        List<Person> users;
        List<PersonTest> usersList;
        List<Product> products;
        List<dynamic> checkedItems;


        public PersonManagerTest()
        {
            users = new List<Person>(SQLDataAccess.LoadUsers());
            usersList = new List<PersonTest>(SQLCustomerAccess.LoadUsers());

        }


        public int searchUserID(int userID)
        {

            if (users.Any(e => (e.customerID == userID)))
            {
                return userID;
            }

            return -1;
        }


        public int searchStudentID(string username)
        {
            if (usersList.Any(e => (e.username == username)))
            {
                int index = usersList.FindIndex(a => a.username == username);
                return index;
            }

            return -1;
        }

        
        public string createUser(dynamic data)
        {
            bool duplciate = true;
            int userID = 0;
            Random randomNumber = new Random();
            string studentID = data.studentID;

            //creates unique ID for the user 
            while (duplciate)
            {
                duplciate = false;

                userID = randomNumber.Next(0, users.Count + 1);

                // checks to see if the id is already been used
                if (users.Any(e => (e.customerID == userID)))
                {
                    duplciate = true;
                }

                // checks to see if the student id is already been used
                if (users.Any(e => e.studentID == studentID))
                {

                    duplciate = true;
                    if (checkPassword(studentID, data))
                    {
                        return "Logged In";
                    }
                    else 
                    {
                        return "Incorrect password";
                    }
                }


            }

            Console.WriteLine(data.password);
            string password = hashPassword(data);


            Person p = new Person
            {
                customerID = userID,
                studentID = data.studentID,
                firstName = data.firstName,
                lastName = data.lastName,
                password = password


            };

            users.Add(p);
            SQLDataAccess.SavePerson(p);
            return "User Created";
        }
        
        /*
        public string createUser(dynamic data)
        {
            bool duplciate = true;
            int userID = 0;
            string page = data.page;
            Random randomNumber = new Random();
            string username = data.username;

            //creates unique ID for the user 
            while (duplciate)
            {
                duplciate = false;

                userID = randomNumber.Next(0, usersList.Count + 1);

                // checks to see if the id is already been used
                if (usersList.Any(e => (e.customerID == userID)))
                {
                    duplciate = true;
                }

                // checks to see if the student id is already been used
                if (usersList.Any(e => e.username == username))
                {

                    duplciate = true;
                    if (checkPassword(username, data))
                    {
                        return "Logged In";
                    }
                    else
                    {
                        return "Incorrect password";
                    }
                }
                else 
                {
                    // If the user is on the login page and the username is incorrect return error message
                    if (page == "login")
                    {
                        return "Username incorrect";
                    }
                    else if (page == "register")
                    {
                        return "Username already taken";
                    }

                }


            }

            Console.WriteLine(data.password);
            string password = hashPassword(data);


            PersonTest p = new PersonTest
            {
                customerID = userID,
                username = username,
                password = password


            };

            usersList.Add(p);
            SQLCustomerAccess.SavePerson(p);
            return "User Created";
        }
        */


        public string hashPassword(dynamic data)
        {
            string password = data.password;
            byte[] salt = ReadFromFile();

            Console.WriteLine($"Salt: {Convert.ToBase64String(salt)}");

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8));

            Console.WriteLine($"Hashed: {hashed}");

            return hashed;
        }


        public byte[] ReadFromFile()
        {
            byte[] salt = new byte[128 / 8];
            string path = @"..\Backend\saltFile";

            if (!File.Exists(path))
            {

                // Create a file to write to.
                using (StreamWriter sw = File.CreateText(path))
                {
                    salt = createSalt();
                    sw.WriteLine(Convert.ToBase64String(salt));
                    sw.Close();
                    return salt;
                };
            }
            else
            {
                // Open the file to read from.
                using (StreamReader sr = File.OpenText(path))
                {
                    string text = System.IO.File.ReadAllText(path);
                    sr.Close();
                    return Encoding.ASCII.GetBytes(text);
                }
            }
        }


        public byte[] createSalt()
        {
            byte[] salt = new byte[128 / 8];
            using (var rngCsp = new RNGCryptoServiceProvider())
            {
                // Fills an array of bytes with a crytpography strong sequence of random non zero value
                rngCsp.GetNonZeroBytes(salt);
            }

            return salt;


        }


        public bool checkPassword(string studentID, dynamic data) 
        {
            int pos = searchStudentID(studentID);
            int userID = searchUserID(pos);

            var user = SQLCustomerAccess.searchUser(userID);

            string password = hashPassword(data);

            if (password == user[0].password)
            {
                return true;
            }
            else
            {
                return false;
            }

        }


        public void deleteUser(dynamic data)
        {
            string studentID = data.studentID;

            int pos = searchStudentID(studentID); //find the customer based on the student id
            int userID = searchUserID(pos); // finds their unique id
            users.RemoveAt(userID); // removes them using the unique id
            SQLDataAccess.DeletePerson(userID);
        }


        public int modifyUser(dynamic data)
        {

            string studentID = data.studentID;
            string firstName = data.firstName;
            string lastName = data.lastName;

            int pos = searchStudentID(studentID);
            int userID = searchUserID(pos);



            if (userID == -1)
            {
                return -1;
            }


            if (firstName != "")
            {
                SQLDataAccess.ModifyFirstName(userID, firstName);
            }

            if (lastName != "")
            {
                SQLDataAccess.ModifyLastName(userID, lastName);
            }

            return -1;
        }


        public List<Person> searchUser(dynamic data)
        {
            List<Person> singleUser = new List<Person>();
            string studentID = data.studentID;

            int pos = searchStudentID(studentID);
            int userID = searchUserID(pos);

            if (pos != -1)
            {
                singleUser = SQLDataAccess.searchUser(userID);
                return singleUser;
            }

            return singleUser;
        }

        public void SendEmail(dynamic data) {

            string receiverEmail = data.receiverEmail;
            string subject = data.subject;
            string bodyText = data.bodyText;
            string senderName = data.username;
            string emailAddress = data.emailAddress;
            string password = data.password;

            // create a new mime message object to fill message data
            MimeMessage message = new MimeMessage();

            // add sender info that will appear in email message
            message.From.Add(new MailboxAddress(senderName, emailAddress));

            // add the receiver email address
            message.To.Add(MailboxAddress.Parse(receiverEmail));

            // add the message subject
            message.Subject = subject;

            //add the mesage body as plain text
            // also use HTML
            message.Body = new TextPart("plain")
            {
                Text = bodyText
            };

            SmtpClient client = new SmtpClient();

            try
            {
                client.Connect("smtp.gmail.com", 465, true);
                client.Authenticate(emailAddress, password);
                client.Send(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }
        }


    }


}

