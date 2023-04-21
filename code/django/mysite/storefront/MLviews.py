#global imports
from django.http import *
from .models import *
import json

import warnings
warnings.filterwarnings('ignore')
import pandas as pd

from django.db.models import Count

# query the order model for all 



#df = pd.DataFrame.from_records(order.objects.all().values('customerID', 'orderID'))


def order_number_by_customer(request):
    orderset = Order.objects.all()
    orders_per_customer = Order.objects.values('customerID').annotate(order_count=Count('orderID'))
    #orders_per_customer = df.groupby('customerID')['orderID'].count();

    #convert query response to DataFrame
    df = pd.DataFrame.from_records(orders_per_customer)

    #convert to list of dictionaries for safe JSON response
    Jresponse = df.to_dict(orient='records')
    return JsonResponse(Jresponse, safe = False)

def top_customers_by_orders(request):

    #pull in the data from Order table
    orderset = Order.objects.all()

    #create a dataFrame based on the returned values from Order
    df = pd.DataFrame.from_records(orderset.values())

    
    # 计算每个顾客的订单数量
    # Calculate the metrics of order by customer, aggregate sum, count, average and convert to the defined dataframe
    customer_order_summary = df.groupby('customerID_id').agg({'orderPrice': ['sum', 'count', 'mean']}) 
    customer_order_summary_df = pd.DataFrame(customer_order_summary).reset_index() #reset_index is needed to set the index back to the primary key or OrderTotal
    

 
    for index, row in customer_order_summary_df.iterrows():
        customerid = row['customerID_id'].iloc[0]
        totalOrders = row[('orderPrice', 'count')]
        totalSpent = row[('orderPrice', 'sum')]
        averageOrderPrice = row[('orderPrice', 'mean')]
        result_instance = Order_Top_Customer(customerID=customerid, totalOrders=totalOrders, totalSpent=totalSpent, averageOrderPrice=averageOrderPrice)

        result_instance, created = Order_Top_Customer.objects.update_or_create(
            customerID=customerid,
            defaults={
                'totalOrders': totalOrders,
                'totalSpent': totalSpent,
                'averageOrderPrice': averageOrderPrice
            }
        )
        if not created:
            result_instance.totalOrders = totalOrders
            result_instance.totalSpent = totalSpent
            result_instance.averageOrderPrice = averageOrderPrice
            result_instance.save()
    return JsonResponse("test", safe=False)




    
