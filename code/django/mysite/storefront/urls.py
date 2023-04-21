from django.urls import path,include
from . import views
from . import upsViews
from . import MLviews

#store specific urls.py file

urlpatterns = [


     path('item/', views.ItemView.as_view(), name='storefront-item'),

     path('inventory/', views.InventoryView.as_view(), name='storefront-inventory'),

     path('customer/', views.CustomerView.as_view(), name='storefront-customer'),

     path('order/', views.OrderView.as_view(), name='storefront-order'),

     path('order/find/<int:pk>/', views.FindOrderView.as_view(), name='storefront-order'),

     path('order/add/', views.AddOrderView.as_view(), name='storefront-order'),

     path('order/update/<int:pk>/', views.UpdateOrderView.as_view(), name='storefront-order'),

     path('order/delete/<int:pk>/', views.DeleteOrderView.as_view(), name='storefront-order'),

     path('supplier/', views.SupplierView.as_view(), name='storefront-supplier'),

     path('supplier/find/<int:pk>/', views.FindSupplierView.as_view(), name='storefront-supplier'),

     # AddSupplierView, UpdateSupplierView, DeleteSupplierView

     path('supplier/add/', views.AddSupplierView.as_view(), name='storefront-supplier'),

     path('supplier/update/<int:pk>/', views.UpdateSupplierView.as_view(), name='storefront-supplier'),

     # path('supplier/delete/', views.DeleteSupplierView.as_view(), name='storefront-supplier'),
     # delete has id in request.data
     path('supplier/delete/<int:pk>/', views.DeleteSupplierView.as_view(), name='storefront-supplier'),

     # AddItemView, UpdateItemView, DeleteItemView

     path('item/find/<int:pk>/', views.FindItemView.as_view(), name='storefront-item'),

     path('item/add/', views.AddItemView.as_view(), name='storefront-item'),

     path('item/update/<int:pk>/', views.UpdateItemView.as_view(), name='storefront-item'),

     path('item/delete/<int:pk>/', views.DeleteItemView.as_view(), name='storefront-item'),

     # AddInventoryView, UpdateInventoryView, DeleteInventoryView

     # AddOrderView, UpdateOrderView, DeleteOrderView

     path('shipment/', views.ShipmentView.as_view(), name='storefront-shipment'),

     path('goodsReceipt/', views.GoodsReceiptView.as_view(), name='storefront-goodsReceipt'),


     path('cash/', views.CashtView.as_view(), name='storefront-goodsReceipt'),

     #tracking URLS

     path('tracking_UPS/<str:tracking_number>/', upsViews.get_ups_tracking_info, name= 'get_ups_tracking_info' ),
     #path('tracking_UPS/', views.get_ups_tracking_info, name= 'get_ups_tracking_info' ),
     path('test_ups_tracking_info/', upsViews.test_ups_tracking_info),

     #Address Verification URLS
     
     path('address_verify_UPS/', upsViews.address_verify_UPS),
     path('addressTest/', upsViews.addressTest),


     path('order_number_by_customer/', MLviews.order_number_by_customer),
     path('top_customers/', MLviews.top_customers_by_orders),

]