import React, { useEffect, useRef, useState } from "react";
import { BarChart, Bar, LineChart, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  export default function Itemchart() {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      return JSON.parse(tokenString);

    }
    let formDatas = {
      itemID: "",
      description: "",
      cost: "",
      sellingPrice: "",
      note: "",
      supplierID: "",
      Classification: "",
    };
     {
        React.useEffect(() => {
            fetch("http://localhost:8000/item", {
              headers: new Headers({
                'Authorization': 'Bearer ' + getToken()
              })
            })
              .then((res) => res.json())
              .then((data) => {
                setItems(data);
                items.map((item) => { });
                setLoading(false);
              }).catch((error) => {
                console.log('error: ' + error);
                // this.setState({ requestFailed: true });
              });
          }, []);
          const inputChanged = (event) => {
            formDatas[event.target.name] = event.target.value;
          };

    return (
    <div>
      <div>
        <h1 className="title is-1">Item Visualization</h1>
        {/* button that redirects to the Item page */}
      <a href="/item">
        <button className="button is-primary" >Back</button>
      </a>
        <h3 className="title is-1">Bar Chart</h3>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
        width={500}
        height={300}
          data={items}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="description">
            <Label value="Items" offset={-1} position="insideBottom" />
          </XAxis>
          <YAxis type="number" domain={[0, 1500]} label={{ value: 'USD', angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />
          <Tooltip />
          <Legend />
          <Bar name='Selling Price' dataKey="sellingPrice" fill="#6157a5" />
          <Bar name='Cost' dataKey="cost" fill="#3d6e6a" />
        </BarChart>
      </ResponsiveContainer>
      <h3 className="title is-1">Line Chart</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={items}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="description">
            <Label value="Items" offset={-1} position="insideBottom" />
          </XAxis>
          <YAxis type="number" domain={[0, 1500]} label={{ value: 'USD', angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />
          <Tooltip />
          <Legend />
          <Line name='Selling Price' type="monotone" dataKey="sellingPrice" stroke="#6157a5" activeDot={{ r: 8 }} />
          <Line name='Cost' type="monotone" dataKey="cost" stroke="#3d6e6a" />
        </LineChart>
      </ResponsiveContainer>
      </div>
      </div>
    );
    }
  }
