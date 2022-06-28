using System;
using FAQServer;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Backend
{
    public class FAQManager
    {

        List<Question> questions;

        public FAQManager(int branch) 
        {
            questions = GetQuestion(branch);
        }

        public List<Question> ReturnQuestions()
        {
            return questions;
        }

        // Gets the first branch of questions and sends them to the client
        public string SendQuestions()
        {
            FAQManager sqlManager = new FAQManager(-1);
            var questionList = sqlManager.ReturnQuestions();
            Data data = new Data(questionList);
            var json = JsonConvert.SerializeObject(data);

            return json;
        }


        public string RetreiveQuestions(dynamic data)
        {
            string message = data.message;
            var obj = data;

            List<Question> questionList = new List<Question>();
            string answerText = null;
            object jsonObj = null;

            if (obj.refresh == true)
            {
                questionList = GetQuestion(-1);
                jsonObj = new Data(questionList);
            }
            else
            {
                int branch = obj.option;
                int id = obj.id;
                questionList = GetQuestion(branch);
                answerText = GetAnswer(id);
                createUser(obj);


                AnswerResponse answer = new AnswerResponse(answerText); // Puts the answers in an object
                jsonObj = new JSONResponse(answer, questionList); // Puts the questions and answers in another object


            }

            string jsonString = JsonConvert.SerializeObject(jsonObj); // Serialises the objects

            return jsonString;

        }


        // Uses the question id to find the answer in the database
        public static string GetAnswer(int id)
        {
            var answer = SQLFAQDataAccess.GetAnswer(id);
            //String[] answer = new string[] {"Functional testing is a type of software testing that validates the software system against the functional requirements.", "Non-functional testing checks the performance, reliabiliy, scaleablity and other non-functional aspects of the software system", "Unit testing is a type of software testing where individual units or componenets of a software are tested. Used to validate that each code performs as expected", "Integration testing is defined as a type of testing where software modules are integrated logically and tested as a group.", "Performance testing is a software testing process used for testing the speed, responce time and resource usage of a software application under particular workload", "Load testing is about creating production simulations withing an application or system that is as near as possible to being finished product ready to deplot and subject to the masses.", "Unit testing help fix bugs early in development cycle and helps developers to make changes quickly", "Developers write a section of code to test a specific function in software appication. This can be isolated and tested rigorously", "After each software module is unit tested, defects still exist such as a module made by one programmer may differ from other programmers, therefore integration testing becomes necessary to verify the software modules work in unity", "Big bang approach and incremental approach which includes top down approach, bottom up approach and sandwich approach.", "Performance testing is done to provide the stakeholders with information about their application regarding speed, stability, and scaleability.", "Load testing, stress testing, edurance testing, spike testing, volume testing and scalability testing.", "Load testing, stress testing, edurance testing, spike testing, volume testing and scalability testing.", "Load testing helps identify bottlenecks in the system under heavy user stress scenarios before they happen in a production environment.", "Manual load testing, in house developed load testing tools, open source load testing tools and enterprise-class load testing tools." };
            return answer[0].Text;

        }

        // Pulls the questions from the database and stores them in a list
        public static List<Question> GetQuestion(int branch)
        {

            List<Question> question = new List<Question>(SQLFAQDataAccess.LoadQuestions(branch));
            return question;

        }


        public int searchUserID(int ID)
        {

            List<Customer> userIDList = SQLFAQDataAccess.SearchUserID(ID);
            int userID = userIDList[0].ID;

            if (userID != -1)
            {
                return userID;
            }

            return -1;
        }


        public static void createUser(dynamic obj)
        {
            bool duplciate = true;
            int userID = 0;
            Random randomNumber = new Random();

            //creates unique ID for the user 
            while (duplciate)
            {
                duplciate = false;
                List<Customer> allIDList = SQLFAQDataAccess.GetAllUsersID();
                userID = randomNumber.Next(0, allIDList.Count + 1);

                // checks to see if the id is already been used
                if (allIDList.Any(e => (e.ID == userID)))
                {
                    duplciate = true;
                }

            }
            Console.WriteLine(obj.firstName);
            Customer c = new Customer
            {
                ID = userID,
                Level = 0,
                firstName = obj.firstName,
                lastName = obj.lastName,
                email = obj.email

            };

            SQLFAQDataAccess.SavePerson(c);

        }

        class Data
        {
            public Data(List<Question> questionList)
            {
                data = questionList;
            }

            public List<Question> data { get; }
        }

        class AnswerResponse
        {
            public AnswerResponse(string answerText)
            {
                Text = answerText;
            }

            public string Text { get; }
        }

        class JSONResponse
        {
            public JSONResponse(AnswerResponse Answer, object Data)
            {
                answer = Answer.Text;
                data = Data;
            }

            public string answer { get; }
            public object data { get; }
        }


    }
}
