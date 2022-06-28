using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Backend
{
    class Basket
    {
        ItemList itemList = new ItemList();
        List<List<Product>> basketList;
        List<Product> Mains = new List<Product>();
        List<Product> Drinks = new List<Product>();
        List<Product> Snacks = new List<Product>();
        List<Product> MealDeals = new List<Product>();

        public Basket()
        {
            basketList = new List<List<Product>>();
            basketList.Add(Mains);
            basketList.Add(Drinks);
            basketList.Add(Snacks);
            basketList.Add(MealDeals);
        }


        public int CalculatePrice(dynamic data)
        {

            var basket = data.basket;
            int totalCost = 0;

            for (int index = 0; index < basket.Count; index++)
            {

                for (int count = 0; count < basket[index].Count; count++)
                {
                    JValue v1 = new JValue(basket[index][count].productCost * basket[index][count].productQty);
                    totalCost += (int)v1;

                }
            }

            return totalCost;
        }


        public void AddItem(Product item, dynamic data)
        {
            item.productQty = data.Quantity;


            if (item.productType == "Mains")
            {
                Mains.Add(item);
            }
            else if (item.productType == "Drinks")
            {
                Drinks.Add(item);
            }
            else if (item.productType == "Snack")
            {
                Snacks.Add(item);
            }

        }


        public List<List<Product>> CheckMealDeal(dynamic data)
        {
            var basket = OrderBasket(data);

            while (true)
            {

                if (basket[0].Count != 0 && basket[1].Count != 0 && basket[2].Count != 0)
                {
                    try
                    {
                        List<dynamic> temp = new List<dynamic>();



                        for (int index = 0; index < 3; index++)
                        {
                            if (basket[index][0].productQty > 1)
                            {
                                basket[index][0].productQty -= 1;
                                var item = basket[index][0];
                                temp.Add(item);
                            }
                            else
                            {
                                temp.Add(basket[index][0]);
                                basket[index].RemoveAt(0);
                            }

                        }

                        var result = SQLDataAccess.GetProductID("Combo Meal");
                        int id = result[0].productID;


                        Product md = new Product
                        {
                            productID = id,
                            productDescription = "Combo Meal",
                            productCost = 350,
                            productQty = 1,
                            productType = "Meal Deal",
                            products = temp

                        };

                        MealDeals.Add(md);
                    }

                    catch (Exception e)
                    {
                        Console.WriteLine("Meal Deal Error");
                        Console.WriteLine(e);
                    }
                }



                else if (basket[0].Count != 0 || basket[1].Count != 0 || basket[2].Count != 0 || basket[3].Count != 0)
                {
                    try
                    {


                        for (int index = 0; index < basket.Count; index++)
                        {
                            if (basket[index].Count != 0)
                            {
                                List<dynamic> temp = new List<dynamic>();

                                if (basket[index][0].products != null) 
                                {
                                    
                                    for (int count = 0; count < basket[index][0].products.Count; count++)
                                    {
                                        temp.Add(basket[index][0].products[count]);
                                    }
                                }


                                Product p = new Product
                                {
                                    productID = basket[index][0].productID,
                                    productDescription = basket[index][0].productDescription,
                                    productCost = basket[index][0].productCost,
                                    productQty = basket[index][0].productQty,
                                    productType = basket[index][0].productType,
                                    products = temp

                                };


                                basketList[index].Add(p);
                                basket[index].RemoveAt(0);
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine("Single Item Error");
                        Console.WriteLine(e);
                    }

                }
                else
                {
                    return basketList;
                }

            }
        }


        public dynamic OrderBasket(dynamic data)
        {
            var basket = data.basket;

            for (int index = 0; index < basket.Count; index++)
            {

                for (int sort = 0; sort < basket[index].Count - 1; sort++)
                {
                    if (basket[index][sort].productCost < basket[index][sort + 1].productCost)
                    {
                        var temp = basket[index][sort + 1];
                        basket[index][sort + 1] = basket[index][sort];
                        basket[index][sort] = temp;
                    }
                }
            }

            return basket;
        }


        public List<List<Product>> returnBasket()
        {
            return basketList;
        }

    }
}
