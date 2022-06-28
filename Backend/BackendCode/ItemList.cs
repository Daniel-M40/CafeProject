using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Backend
{
    class ItemList
    {
        List<Product> menu;


        public ItemList()
        {
            menu = new List<Product>(SQLDataAccess.LoadAllProducts());

            
        }


        public Product GetItem(int id)
        {
            
            return menu[SearchID(id)];
            
        }



        public int SearchID(int id)
        {
            foreach (var items in menu)
            {
                if (items.productID == id)
                {
                    return id;
                }
            }

            return -1;
        }


        public int getItemCount()
        {
            return menu.Count();
        }


    }
}
