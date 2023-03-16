import React, { useEffect, useRef, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  export default function Orderchart() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const COLORS = ['#edc951 ', '#eb6841 ', '#cc2a36 ', '#4f372d ', '#00a0b0'];
    const data = [];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    // filter the data to show only data between 2022/02/01 and 2022/02/30
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
    };

    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      return JSON.parse(tokenString);

    }
    let formDatas = {
        orderID: "",
        itemID: "",
        quantity: "",
        orderDate: "",
        orderPrice: "",
        customerID: "",
        shipID: "",
      };
     {
        React.useEffect(() => {
            fetch("http://localhost:8000/order",{
              headers: new Headers({
                'Authorization': 'Bearer '+ getToken()
            })
            })
              .then((res) => res.json())
              .then((data) => {
                setOrders(data);
                orders.map((order) => {});
                setLoading(false);
              }).catch((error) => {
                console.log('error: ' + error);
                // this.setState({ requestFailed: true });
              });
          }, []);
          const inputChanged = (event) => {
            formDatas[event.target.name] = event.target.value;
          };
          const filteredData = orders.filter((entry) => {
            const date = new Date(entry.orderDate);
            return date >= new Date("2022-03-01") && date <= new Date("2022-03-28");
        });
    return (
    <div>
        <h1 className="title is-1">Order Visualization</h1>
        {/* button that redirects to the order page */}
      <a href="/order">
        <button className="button is-primary" >Back</button>
      </a>
      <ResponsiveContainer width="100%" height={1000}>
      <PieChart width={1000} height={1000}>
          <Pie
            data={orders}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={500}
            fill="#8884d8"
            dataKey="quantity"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ width: '100%', height: 500 }}>
      <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="quantity" data={orders} fill="#8884d8" label />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ResponsiveContainer width="100%" height={700}>
      <PieChart width={200} height={200}>
      <Pie
        data={filteredData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={300}
        fill="#8884d8"
        dataKey="quantity"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
    </ResponsiveContainer>
    <ResponsiveContainer width="100%" height={1000}>
    <BarChart
          width={500}
          height={300}
          data={filteredData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="orderDate">
            <Label value="Order Date" offset={-1} position="insideBottom" />
          </XAxis>
          <YAxis type="number" domain={[0, 'datamax']} label={{ value: 'Amount', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}/>
          <Tooltip />
          <Legend />
          <Bar name='Quantity of Order' dataKey="quantity" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
      </div>
    );
    }
  }