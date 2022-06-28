using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Backend
{
    class Interface
    {
        PersonManager pManager;
        Basket basket;
        ItemList itemList;
        OrderManager order;
        SalesManager sales;
        FileManager fManager;
        FAQManager faqManager;

        public Interface()
        {
            fManager = new FileManager();
            pManager = new PersonManager();
            basket = new Basket();
            itemList = new ItemList();
            order = new OrderManager();
            sales = new SalesManager();
            faqManager = new FAQManager(-1);
        }

        enum Operation
        {
            createUser = 0,
            deleteUser = 1,
            modifyUser = 2,
            searchUser = 3,
            selectItem = 4,
            printAllItems = 5,
            printSubItems = 6,
            calculateTotal = 7,
            checkForMealDeal = 8,
            createOrder = 9,
            calcualteSales = 10,
            sendEmail = 11,
            saveFile = 12,
            getDirectory = 13,
            openFolder = 14,
            changeDirectory = 15,
            getFile = 16,
            sendFirstBranch = 17,
            faqQuestions = 18


        }

        public string selectOptions(dynamic data)
        {
            string result = "Operation Complete";

            try
            {

                int subOperation = data.subOperation;

                if (subOperation == (int)Operation.createUser)
                {
                    string output = pManager.createUser(data);
                    JsonMessage obj = new JsonMessage(output);
                    result = createJSONMessage(obj);
                }

                else if (subOperation == (int)Operation.deleteUser)
                {
                    pManager.deleteUser(data);
                }

                else if (subOperation == (int)Operation.modifyUser)
                {
                    acknowledgeOperation();
                    pManager.modifyUser(data);
                }

                else if (subOperation == (int)Operation.searchUser)
                {
                    acknowledgeOperation();
                    List<Person> user = pManager.searchUser(data);
                    return printUsers(user);
                }

                else if (subOperation == (int)Operation.selectItem)
                {
                    int id = data.ID;
                    basket.AddItem(itemList.GetItem(id), data);
                    return printBasket(basket.returnBasket());
                }

                else if (subOperation == (int)Operation.printAllItems)
                {
                    acknowledgeOperation();
                    List<Product> products = products = SQLDataAccess.LoadAllProducts();
                    return printProducts(products);
                }

                else if (subOperation == (int)Operation.printSubItems)
                {
                    acknowledgeOperation();
                    string subProducts = data.subProducts;

                    List<Product> products = SQLDataAccess.GetSubProducts(subProducts);
                    return printProducts(products);
                }

                else if (subOperation == (int)Operation.calculateTotal)
                {
                    acknowledgeOperation();
                    int total = basket.CalculatePrice(data);
                    TotalCost obj = new TotalCost(total);
                    return JsonConvert.SerializeObject(obj);


                }

                else if (subOperation == (int)Operation.checkForMealDeal)
                {
                    acknowledgeOperation();
                    var mealDeal = basket.CheckMealDeal(data);
                    return JsonConvert.SerializeObject(mealDeal);

                }

                else if (subOperation == (int)Operation.createOrder)
                {
                    acknowledgeOperation();
                    var orderResult = order.createOrder(data);
                    return JsonConvert.SerializeObject(orderResult);
                }

                else if (subOperation == (int)Operation.calcualteSales)
                {
                    acknowledgeOperation();
                    var monthlySales = sales.CalculateSales(data);
                    return monthlySales;
                }

                else if (subOperation == (int)Operation.sendEmail)
                {
                    acknowledgeOperation();
                    pManager.SendEmail(data);
                }
                else if (subOperation == (int)Operation.saveFile)
                {
                    acknowledgeOperation();
                    result = fManager.SaveFile(data);
                }
                else if (subOperation == (int)Operation.getDirectory)
                {
                    acknowledgeOperation();
                    List<FilePath> output = fManager.GetCurrentDirectory();
                    return JsonConvert.SerializeObject(output);

                }
                else if (subOperation == (int)Operation.openFolder)
                {
                    acknowledgeOperation();
                    List<FilePath> output = fManager.OpenFolder(data);
                    return JsonConvert.SerializeObject(output);

                }
                else if (subOperation == (int)Operation.changeDirectory)
                {
                    acknowledgeOperation();
                    List<FilePath> output = fManager.ChangeDirectory(data);
                    return JsonConvert.SerializeObject(output);

                }
                else if (subOperation == (int)Operation.getFile)
                {
                    acknowledgeOperation();
                    var output = fManager.GetFile(data);
                    return JsonConvert.SerializeObject(output);

                }
                else if (subOperation == (int)Operation.sendFirstBranch)
                {
                    acknowledgeOperation();
                    var output = faqManager.SendQuestions();
                    return output;

                }
                else if (subOperation == (int)Operation.faqQuestions)
                {
                    acknowledgeOperation();
                    var output = faqManager.RetreiveQuestions(data);
                    return output;

                }

                else
                {
                    return ("Operation " + subOperation + " not found");

                }

                return result;
            }

            catch (Exception e)
            {
                result = errorMessageOutput(e);
            }
            return result;

        }


        public string createJSONMessage(object text)
        {
            string output = JsonConvert.SerializeObject(text);
            return output;
        }


        public string printProducts(List<Product> products)
        {
            string output = JsonConvert.SerializeObject(products);
            return output;
        }

        public string printUsers(List<Person> users)
        {
            string output = JsonConvert.SerializeObject(users);
            return output;
        }

        public string printBasket(List<List<Product>> basket)
        {
            string output = JsonConvert.SerializeObject(basket);
            return output;
        }

        public string acknowledgeOperation()
        {
            string outputJSON = "{\"Message\":\"Operation acknowledged\"}";
            return outputJSON;

        }

        public string errorMessageOutput(Exception errorMessage)
        {
            string outputJSON = "{\"errorMessage\":";
            outputJSON += JsonConvert.SerializeObject(errorMessage);
            outputJSON += "}";

            return outputJSON;
        }
    }



    public class MonthlySales
    {
        public MonthlySales(List<int> data, List<string> date)
        {
            Data = data;
            Date = date;
        }

        public List<int> Data { get; set; }
        public List<string> Date { get; set; }
    }

    public class FolderStructure
    {
        public FolderStructure(List<FilePath> files)
        {
            Files = files;
        }

        public List<FilePath> Files { get; set; }
    }


    public class JsonMessage
    {
        public JsonMessage(string text)
        {
            this.Text = text;
        }

        public string Text { get; set; }
    }


    public class TotalCost
    {
        public TotalCost(int total)
        {
            this.totalCost = total;
        }

        public int totalCost { get; set; }
    }
}
