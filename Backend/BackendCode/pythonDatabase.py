import sqlite3
from datetime import date, timedelta
from random import randint


dates = []
con = sqlite3.connect('Orders.db')
cur = con.cursor()


def generateDate():
    start_date = date(2021, 12, 1) 
    end_date = date(2022, 2, 1)    # perhaps date.now()

    delta = end_date - start_date   # returns timedelta

    for i in range(delta.days + 1):
        day = start_date + timedelta(days=i)
        dates.append(day.strftime("%Y/%m/%d"))


def generateCustomers():
    data = []

    for counter in range (100):
        data.append(tuple((counter, "MOI1918247" + str(counter), "Daniel", "Moir", "password")))

    # Fill the table

    con.executemany("insert into Customers(customerID, studentID, firstName, lastName, password) values (?, ?, ?, ?, ?)", data)

    # Print the table contents
    for row in cur.execute('SELECT * FROM Customers'):
        print(row)

    con.commit()
    con.close()
    
def generateProductQuantity():
    generateDate()
    data = []
    id = 0
    
    
    for counter in range (200):
        ranNum = randint(1,10)
        for count in range (ranNum):
            productID = randint(0, 10)
            productQuantity = randint(0,10)
            data.append(tuple((id, productID, counter, productQuantity)))
            id += 1

    # Fill the table

    con.executemany("insert into ProductQuantity(ProductOrderID, ProductID, OrderID, ProductQuantity) values (?, ?, ?, ?)", data)


    con.commit()
    con.close()


def generateOrders():
    generateDate()
    data = []
    lengthOfDate = len(dates)
    customerID = 0
    orderID = 0

    for counter in range (lengthOfDate):
        ranNum = randint(1,3)
        for count in range(ranNum):
            data.append(tuple((orderID, customerID, dates[counter])))
            orderID += 1
            
        customerID += 1
            
    # Fill the table

    con.executemany("insert into Orders(OrdersID, CustomerID , OrderDate) values (?, ?, ?)", data)

    # Print the table contents
    for row in cur.execute('select ProductQuantity from ProductQuantity where OrderID = 2;'):
        print(row)
    con.commit()
    con.close()


    
generateProductQuantity()