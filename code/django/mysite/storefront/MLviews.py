#global imports
from django.http import *
from .models import Order

import warnings
warnings.filterwarnings('ignore')
import pandas as pd

from django.db.models import Count

# query the order model for all 
orderset = Order.objects.all()


#df = pd.DataFrame.from_records(order.objects.all().values('customerID', 'orderID'))


def order_number_by_customer(request):
    orders_per_customer = Order.objects.values('customerID').annotate(order_count=Count('orderID'))
    #orders_per_customer = df.groupby('customerID')['orderID'].count();

    #convert query response to DataFrame
    df = pd.DataFrame.from_records(orders_per_customer)

    #convert to list of dictionaries for safe JSON response
    Jresponse = df.to_dict(orient='records')




    return JsonResponse(Jresponse, safe = False)