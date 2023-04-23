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

    # Create an empty DataFrame to store the results
    result_df = pd.DataFrame(columns=['CustomerID', 'TotalOrders', 'TotalAmountSpent', 'AverageOrderPrice'])
    
    orders_per_customer = df.groupby('customerID_id')['orderID'].count()
    sorted_orders = orders_per_customer.sort_values(ascending=False)
    top_customers = sorted_orders.iloc[:3].index.tolist()

    for customerID in top_customers:
        customer_orders = df.loc[df['customerID_id'] == customerID]
        total_orders = customer_orders.shape[0]
        total_spent = customer_orders['orderPrice'].sum()
        avg_spent = customer_orders['orderPrice'].mean()
        result_df = result_df.append({'CustomerID': customerID, 'TotalOrders': total_orders, 
                                  'TotalAmountSpent': total_spent, 'AverageOrderPrice': avg_spent}, 
                                 ignore_index=True)
    
    
    response_data = result_df.to_json(orient='records')
    response = json.loads(response_data)
    return JsonResponse(response, safe = False)


def popular_item_by_month(request):
    orderset = Order.objects.all()


    # Create a DataFrame based on the returned values from Order
    df = pd.DataFrame.from_records(orderset.values())

    # Extract month
    df['orderDate'] = pd.to_datetime(df['orderDate'])
    df['month'] = df['orderDate'].dt.month

    # Calculate the top items for each month
    popular_items = df.groupby(['month', 'itemID_id'])['quantity'].sum().reset_index()
    popular_items = popular_items.sort_values(['month', 'quantity'], ascending=[True, False])
    popular_items = popular_items.groupby('month').head(3)

    # Create an empty dictionary to store the results
    data = []
    for month, items in popular_items.groupby('month'):
        item_names = [str(i) for i in items['itemID_id'][:3]]
        data.append({"month": month, "item1": item_names[0], "item2": item_names[1], "item3": item_names[2]})
    return JsonResponse(data, safe=False)

    


    
