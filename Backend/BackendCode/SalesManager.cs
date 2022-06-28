using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Backend
{
    public class SalesManager
    {
        List<int> data;
        List<string> date;

        public SalesManager()
        {
            data = new List<int>();
            date = new List<string>();
        }


        public string CalculateSales(dynamic obj)
        {
            string pattern = "dd/MM/yyyy";
            string dateTime = obj.startDate;
            string subtractDate = obj.endDate;
            DateTime endDt = new DateTime();
            DateTime currentDt = DateTime.ParseExact(dateTime, pattern, null);

            if (subtractDate == "week")
            {
                endDt = currentDt.AddDays(-7);
            }
            else if (subtractDate == "month")
            {
                endDt = currentDt.AddMonths(-1);
            }
            else if (subtractDate == "year")
            {
                endDt = currentDt.AddDays(-365);
            }


            string currentDate = currentDt.ToString("yyyy/MM/dd");
            string endDate = endDt.ToString("yyyy/MM/dd");

            var orderIDList = SQLDataAccess.RetrieveOrderID(currentDate, endDate);

            for (int count = 0; count < orderIDList.Count; count++)
            {
                data.Add(RetrieveItems(orderIDList[count].OrdersID));
                date.Add(RetrieveDates(orderIDList[count].OrdersID));
            }

            MonthlySales sales = new MonthlySales(data, date);
            return JsonConvert.SerializeObject(sales);

        }

        public int RetrieveItems(int id)
        {
            var output = SQLDataAccess.RetrieveQuantity(id);
            int totalAmount = 0;

            for (int count = 0; count < output.Count; count++)
            {
                totalAmount += output[count].ProductQuantity;
            }

            return totalAmount;
        }

        public string RetrieveDates(int id)
        {
            var output = SQLDataAccess.RetrieveDate(id);
            return output[0].OrderDate;
        }

    }
}
