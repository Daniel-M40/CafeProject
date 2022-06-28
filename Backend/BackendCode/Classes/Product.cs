using System;
using System.Collections.Generic;
using System.Text;

namespace Backend
{
    class Product
    {
        public int productID { get; set; }
        public string productDescription { get; set; }
        public int productCost { get; set; }
        public int productQty { get; set; }
        public string productType { get; set; }
        public List<dynamic> products { get; set; }
    }
}
