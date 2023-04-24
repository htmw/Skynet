#global imports
from django.http import *
from .models import *
import json
import io
import csv
import math
import warnings
warnings.filterwarnings('ignore')
import pandas as pd
from django.db.models import Count
# data preprocessing
import mlxtend.frequent_patterns
import mlxtend.preprocessing
from mlxtend.preprocessing import TransactionEncoder



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


def items_bought_together(request):


    orders_queryset = Order.objects.all()
    orders_dict = list(orders_queryset.values())
    df = pd.DataFrame.from_records(orders_dict)

    #filter desired columns
    new_df = df.loc[:, ['itemID_id', 'orderDate', 'customerID_id']]
    #print(new_df.head(20))
    
    # 为数据框新增一列名为uid的列，默认值为0
    new_df['uid'] = 0
    # 将orderDate转换为距离1999年9月30日的天数
    new_df['orderDate'] = pd.to_datetime(new_df['orderDate'])
    base_date = pd.Timestamp('1999-09-30')
    new_df['orderDate'] = (new_df['orderDate'] - base_date).dt.days
    # 计算每一列的uid，计算方法为 uid=orderDate * customerID * 圆周率
    new_df['uid'] = new_df['orderDate'] * new_df['customerID_id'] * math.pi
    # 显示新的数据集
    #print(new_df.head(20))

    # 删除orderDate 和 customerID 这两列
    new_df = new_df.drop(['orderDate', 'customerID_id'], axis=1)
    # 显示新的数据集
    # print(new_df.head(20))

    grouped_df = new_df.groupby('uid').agg(lambda x: list(x))
    grouped_df = grouped_df.reset_index(drop=True)
    #print(grouped_df.head())

    #new dataframe to run apriori on
    ml_df = pd.DataFrame(columns=[str(i) for i in range(9)])
   
    #将grouped_df中每一行的itemID中的若干值拆分成单独的值，并依次单独放入ml_df中
    for i, row in grouped_df.iterrows():
        itemIDs = row['itemID_id']
        for j in range(9):
            try:
                ml_df.loc[i, str(j)] = itemIDs[j]
            except IndexError:
                ml_df.loc[i, str(j)] = 0
    

    ml_df = ml_df.astype(int)
    csv_buffer = io.StringIO()
    ml_df.to_csv(csv_buffer, index=False)
    # 将CSV格式的字符串转换为列表
    csv_string = csv_buffer.getvalue()
    data = list(csv.reader(csv_string.split('\n')))

   # ml_df_dict = ml_df.to_dict(orient='list')
    for i in range(len(data)):
        data[i] = [value for value in data[i] if value != '0']


    encode_=mlxtend.preprocessing.TransactionEncoder()
    encode_arr=encode_.fit_transform(data)
    #print(encode_arr)
    
    encode_df=pd.DataFrame(encode_arr, columns=encode_.columns_)

    #apriori algorithm
    md=mlxtend.frequent_patterns.apriori(encode_df)
    md_minsup=mlxtend.frequent_patterns.apriori(encode_df, min_support=0.01, use_colnames=True)
    # md_minsup.head(20)

    #creating rules with confidence metric
    rules=mlxtend.frequent_patterns.association_rules(
    md_minsup, metric="confidence",min_threshold=0.06,support_only=False)

    #creating rules with lift metric
    rules2=mlxtend.frequent_patterns.association_rules(
    md_minsup, metric="lift",min_threshold=0.06,support_only=False)

    # 根据 lift 值进行排序
    rules2 = rules2.sort_values(by='lift', ascending=False)

    #rules2.head(20)
    #print(rules2)
    rules3 = rules2.copy()

    # 将 antecedents 和 consequents 合并为一个名为 combo 的新列
    rules3['combo'] = rules3.apply(lambda x: x['antecedents'].union(x['consequents']), axis=1)
    rules2['combo'] = rules3.apply(lambda x: x['antecedents'].union(x['consequents']), axis=1)
  
    # 去重复
    rules3 = rules3.drop_duplicates(subset='combo')
    rules2 = rules2.drop_duplicates(subset='combo')

    # 删除 combo 中包含大于 3 个对象的行
    rules3 = rules3[rules3['combo'].apply(lambda x: len(x) == 3)]
    rules2 = rules2[rules2['combo'].apply(lambda x: len(x) == 2)]
    
    # 去重复
    rules3['combo'] = rules3.apply(lambda x: x['antecedents'].union(x['consequents']), axis=1)

    result_3_df = pd.DataFrame(columns=['combo', 'support', 'confidence', 'lift'])
    result_2_df = pd.DataFrame(columns=['combo', 'support', 'confidence', 'lift'])
    


    
    for _, row in rules3.iterrows():
       combo = row['combo']
       support = row['support']
       confidence = row['confidence']
       lift = row['lift']
       result_3_df = result_3_df.append({'combo': combo, 'support': support, 'confidence': confidence, 'lift': lift}, ignore_index=True)
    result_3_df = result_3_df.drop_duplicates(subset='combo')

    result_3_df = result_3_df.sort_values(by='lift', ascending=False)
    result_3_top10 = result_3_df.head(10)

    for _, row in rules2.iterrows():
       combo = row['combo']
       support = row['support']
       confidence = row['confidence']
       lift = row['lift']
       result_2_df = result_2_df.append({'combo': combo, 'support': support, 'confidence': confidence, 'lift': lift}, ignore_index=True)
    result_2_df = result_2_df.drop_duplicates(subset='combo')

    result_2_df = result_2_df.sort_values(by='lift', ascending=False)
    result_2_top10 = result_2_df.head(10)

    
  
    
    # 删除 combo 中包含大于 2 个对象的行
    # 输出前 20 条关联规则
    #print('Combo of TWO items:')
    #print(rules2_new[['combo', 'support', 'confidence', 'lift']].head(20).to_string(index=False))
    
    result_3_top10['combo'] = result_3_df['combo'].apply(list)
    result_2_top10['combo'] = result_2_df['combo'].apply(list)

    def order_combo(combo_list):
        return sorted(combo_list)
    
    result_3_top10['combo'] = result_3_df['combo'].apply(lambda x: order_combo(x))
    result_2_top10['combo'] = result_2_df['combo'].apply(lambda x: order_combo(x))

    result_3_dict = result_3_top10.to_dict(orient='records')
    result_2_dict = result_2_top10.to_dict(orient='records')
   

    response_data = {
        'result_3': result_3_dict,
        'result_2': result_2_dict
    }
    
    response = json.dumps(response_data)
    return JsonResponse(response, safe=False, content_type='application/json' )

