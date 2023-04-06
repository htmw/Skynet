import datetime
import time

from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
# from rest_framework.permissions import IsAuthenticated
from django.http import *
import requests
import json
from datetime import datetime

from .models import *
from .serializer import *


# Create your views here.

class ItemView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self, request: Request):
        items = Item.objects.all()
        serialized_item = ItemSerializer(items, many=True)
        return Response(serialized_item.data)


class FindItemView(APIView):

    def get(self, request: Request, pk):
        items = Item.objects.get(pk=pk)
        serialized_item = ItemSerializer(items, many=False)
        return Response(serialized_item.data)


class AddItemView(APIView):

    def post(self, request: Request):
        item = ItemSerializer(data=request.data)
        if item.is_valid():
            item.save()
            return Response(item.data)
        else:
            return Response(item.errors)


class UpdateItemView(APIView):

    def put(self, request: Request, pk):
        item = Item.objects.get(pk=pk)
        item_serializer = ItemSerializer(item, data=request.data)
        if item_serializer.is_valid():
            item_serializer.save()
            return Response(item_serializer.data)
        else:
            return Response(item_serializer.errors)


class DeleteItemView(APIView):

    def delete(self, request: Request, pk):
        item = Item.objects.get(pk=pk)
        item.delete()
        return Response("Item deleted")


class SupplierView(APIView):

    def get(self, request: Request):
        suppliers = Supplier.objects.all()
        serialized_supplier = SupplierSerializer(suppliers, many=True)
        return Response(serialized_supplier.data)


class FindSupplierView(APIView):

    def get(self, request: Request, pk):
        suppliers = Supplier.objects.get(pk=pk)
        serialized_supplier = SupplierSerializer(suppliers, many=False)
        return Response(serialized_supplier.data)


class AddSupplierView(APIView):

    def post(self, request: Request):
        supplier = SupplierSerializer(data=request.data)
        if supplier.is_valid():
            supplier.save()
            return Response(supplier.data)
        else:
            return Response(supplier.errors)


class UpdateSupplierView(APIView):

    def put(self, request: Request, pk):
        supplier = Supplier.objects.get(pk=pk)
        supplier_serializer = SupplierSerializer(supplier, data=request.data)
        if supplier_serializer.is_valid():
            supplier_serializer.save()
            return Response(supplier_serializer.data)
        else:
            return Response(supplier_serializer.errors)


class DeleteSupplierView(APIView):

    def delete(self, request: Request, pk):
        supplier = Supplier.objects.get(pk=pk)
        supplier.delete()
        return Response("Supplier deleted")


class CustomerView(APIView):
    def get(self, request: Request):
        customers = Customer.objects.all()
        serialized_customer = CustomerSerializer(customers, many=True)
        return Response(serialized_customer.data)


class ShipmentView(APIView):
    def get(self, request: Request):
        shipments = Shipment.objects.all()
        serialized_shipment = ShipmentSerializer(shipments, many=True)
        return Response(serialized_shipment.data)


class InventoryView(APIView):
    def get(self, request: Request):
        inventory = Inventory.objects.all()
        serialized_inventory = InventorySerializer(inventory, many=True)
        return Response(serialized_inventory.data)


class GoodsReceiptView(APIView):
    def get(self, request: Request):
        goodsreceipt = GoodsReceipt.objects.all()
        serialized_goodsreceipt = GoodsReceiptSerializer(goodsreceipt, many=True)
        return Response(serialized_goodsreceipt.data)


class OrderView(APIView):
    def get(self, request: Request):
        orders = Order.objects.all()
        serialized_order = OrderSerializer(orders, many=True)
        return Response(serialized_order.data)


class FindOrderView(APIView):

    def get(self, request: Request, pk):
        orders = Order.objects.get(pk=pk)
        serialized_order = OrderSerializer(orders, many=False)
        return Response(serialized_order.data)


class AddOrderView(APIView):

    def post(self, request: Request):
        order = OrderSerializer(data=request.data)
        if order.is_valid():
            order.save()
            return Response(order.data)
        else:
            return Response(order.errors)


class UpdateOrderView(APIView):

    def put(self, request: Request, pk):
        order = Order.objects.get(pk=pk)
        order_serializer = OrderSerializer(order, data=request.data)
        if order_serializer.is_valid():
            order_serializer.save()
            return Response(order_serializer.data)
        else:
            return Response(order_serializer.errors)


class DeleteOrderView(APIView):

    def delete(self, request: Request, pk):
        order = Order.objects.get(pk=pk)
        order.delete()
        return Response("Order deleted")


class CashtView(APIView):
    def post(self, request: Request):
        arr = request.data

        for e in arr:
            itemId = e['itemId']
            quantity = e['quantity']
            inventory = Inventory.objects.filter(itemID=itemId).first()
            inventory2 = InventorySerializer(inventory).data
            if inventory2 is None or inventory2['quantity'] < int(quantity):
                return Response({"code": 1, "msg": "Inventory not enough"})
        now = datetime.datetime.now()
        no = now.strftime("%Y%m%d%H%M%S%f")
        s = Shipment(trackingNo=no, shipDate=now, note="")
        # shipment = ShipmentSerializer(data=s)
        # if shipment.is_valid():
        #     shipment.save()
        s.save()
        cusId = 1
        customer = Customer.objects.filter(customerID=cusId).first()
        for e in arr:
            itemId = e['itemId']
            quantity = e['quantity']
            sellingPrice = e['sellingPrice']
            item = Item.objects.filter(itemID=itemId).first()
            inventory = Inventory.objects.filter(itemID=itemId).first()
            inventory2 = InventorySerializer(inventory).data
            o = Order(shipID=s, quantity=quantity, itemID=item, orderPrice=sellingPrice, orderDate=now, customerID=customer, customerID_id=cusId)
            # order = OrderSerializer(data=o)
            # if order.is_valid():
            #     order.save()
            o.save()
            count = inventory2['quantity'] - int(quantity)
            Inventory.objects.filter(stackID=inventory2['stackID']).update(quantity=count)
        return Response({"code": 0, "msg": "Cash success"})
    


#tracking functions

def get_ups_tracking_info(response, tracking_number):
    trans_id = '12345'
    transaction_src = 'Skynet Capstone'
    access_license_number = '0DD15E0D975760E1'

    url = f'https://wwwcie.ups.com/track/v1/details/{tracking_number}'
    headers = {
        'transID': trans_id,
        'transactionSrc': transaction_src,
        'AccessLicenseNumber': access_license_number
    }

    response = requests.get(url, headers=headers)
    json_response = json.loads(response.content)
    status_descriptions = []
    for activity in json_response['trackResponse']['shipment'][0]['package'][0]['activity']:
        status = activity['status']['description']
        date = datetime.strptime(activity['date'], '%Y%m%d').date()
        time = datetime.strptime(activity['time'], '%H%M%S').time()
        status_descriptions.append(f'Status: {status.rstrip()}: Date: {date} at {time}')

    pretty_response = json.dumps(status_descriptions, indent=4)
    print(HttpResponse(pretty_response, content_type="application/json"))

    return HttpResponse(pretty_response, content_type="application/json")


#test function to veiw the JSON response format
def test_ups_tracking_info(response):
    tracking_number = '1Z5338FF0107231059'
    trans_id = '12345'
    transaction_src = 'Skynet Capstone'
    access_license_number = '0DD15E0D975760E1'

    url = f'https://wwwcie.ups.com/track/v1/details/{tracking_number}'
    headers = {
        'transID': trans_id,
        'transactionSrc': transaction_src,
        'AccessLicenseNumber': access_license_number
    }

    response = requests.get(url, headers=headers)
    json_response = json.loads(response.content)
    status_descriptions = []
    for activity in json_response['trackResponse']['shipment'][0]['package'][0]['activity']:
        status = activity['status']['description']
        date = datetime.strptime(activity['date'], '%Y%m%d')
        time = datetime.strptime(activity['time'], '%H%M%S')
        status_descriptions.append(f'Status: {status.rstrip()}: Date: {date} at {time}')

    pretty_response = json.dumps(status_descriptions, indent=4)
    #pretty_response = json.dumps(json_response, indent=4)


    print(HttpResponse(pretty_response, content_type="application/json"))

    return HttpResponse(pretty_response, content_type="application/json")

def address_verify_UPS(request):
    trans_id = '12345'
    transaction_src = 'Skynet Capstone'
    access_license_number = '0DD15E0D975760E1'
    username = 'vBp1ER70HisKWtX5jr7GNyrdhhCrmrkNtQIRADaYAfAhwQhS'
    password = '7DnBBPbyGPdfWth8VZg8V5SRtMBD10LqfjnqCcPLSNWvvaSqSTGx5TSk8s3pf2iq'
        
    #pull data from React Request
    if request.method == 'POST':
        streetNumber = request.data.get('streetNumber')
        city = request.data.get('city')
        state = request.data.get('state')
        zip = request.data.get('zipCode')
    

        #send request to UPS API
        baseURL = 'https://wwwcie.ups.com/addressvalidation/v1/3'
        headers = {
            'AccessLicenseNumber' : access_license_number,
            'Username' :username,
            'Password' : password

        }
        data = {
            'address':{
                'AddressLine' : streetNumber,
                'City' : city,
                'State' : state,
                'Zip' : zip   

            }
        }

        response = requests.post(baseURL, json=data, headers=headers)

        #parse response
        if response.status_code == 200:
            verification_status = response.json().get('addressClassification', {}).get('description', '')
            return JsonResponse({'verification_status': verification_status})
        else:
            return JsonResponse({'error': 'Failed to verify address'})
    else:
        return JsonResponse({'error': 'Invalid request method'})





 
        


