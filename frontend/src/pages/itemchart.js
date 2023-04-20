import React, { useEffect, useRef, useState, PureComponent } from "react";
import { BarChart, Bar, PieChart, Pie, Sector, LineChart, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function SellingPriceVsCostBarChart(items) {
  return (
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
        <YAxis
          type="number"
          domain={[0, 1500]}
          label={{
            value: 'USD',
            angle: -90,
            position: 'insideLeft',
            textAnchor: 'middle',
          }}
        />
        <Tooltip />
        <Legend />
        <Bar name="Selling Price" dataKey="sellingPrice" fill="#6157a5" />
        <Bar name="Cost" dataKey="cost" fill="#3d6e6a" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SellingPriceVsCostLineChart(items) {
  return (
    <ResponsiveContainer width="100%" height={500}>
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
        <YAxis
          type="number"
          domain={[0, 1500]}
          label={{
            value: 'USD',
            angle: -90,
            position: 'insideLeft',
            textAnchor: 'middle',
          }}
        />
        <Tooltip />
        <Legend />
        <Line
          name="Selling Price"
          type="monotone"
          dataKey="sellingPrice"
          stroke="#6157a5"
          activeDot={{ r: 8 }}
        />
        <Line name="Cost" type="monotone" dataKey="cost" stroke="#3d6e6a" />
      </LineChart>
    </ResponsiveContainer>
  );
}
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

class SillyPieChart extends PureComponent {
  constructor(props) {
    super(props);
    this.items = props.items;
    this.state = {
      activeIndex: 0,
    };
  }

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      <ResponsiveContainer width="100%" height={500}>
        <PieChart width={500} height={500}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.props.items}
            cx="50%"
            cy="50%"
            innerRadius={135}
            outerRadius={175}
            fill="#8884d8"
            dataKey="itemID"
            onMouseEnter={this.onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}


export default function Itemchart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/item', {
      headers: new Headers({
        Authorization: 'Bearer ' + getToken(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
  }, []);

  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    return JSON.parse(tokenString);
  }

  return (
    <div>
      <div>
        <h1 className="title is-1">Item Visualization</h1>
         {/* button that redirects to the Item page */}
        <a href="/item">
          <button className="button is-primary">Back</button>
        </a>
        <h3 className="title is-1">Selling Price vs Cost of Items Bar Chart</h3>
        {SellingPriceVsCostBarChart(items)}
        <h3 className="title is-1">Selling Price vs Cost of Items Line Chart</h3>
        {SellingPriceVsCostLineChart(items)}
      </div>
    </div>
        );

  }

  export function Itembarchart() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch('http://localhost:8000/item', {
        headers: new Headers({
          Authorization: 'Bearer ' + getToken(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
    }, []);

    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      return JSON.parse(tokenString);
    }

    return (
      <div>
        <div>
          <h3 className="title is-1"><center>Selling Price vs Cost of Items Bar Chart</center></h3>
          {SellingPriceVsCostBarChart(items)}
        </div>
      </div>
          );

    }

    export function Itemlinechart() {
      const [items, setItems] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetch('http://localhost:8000/item', {
          headers: new Headers({
            Authorization: 'Bearer ' + getToken(),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setItems(data);
            setLoading(false);
          })
          .catch((error) => {
            console.log('error: ' + error);
          });
      }, []);

      function getToken() {
        const tokenString = sessionStorage.getItem('token');
        return JSON.parse(tokenString);
      }

      return (
        <div>
          <div>
            <h3 className="title is-1"><center>Selling Price vs Cost of Items</center></h3>
            {SellingPriceVsCostLineChart(items)}
          </div>
        </div>
            );

      }

  export function Itempiechart() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch('http://localhost:8000/item', {
        headers: new Headers({
          Authorization: 'Bearer ' + getToken(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
    }, []);

    function getToken() {
      const tokenString = sessionStorage.getItem('token');
      return JSON.parse(tokenString);
    }

    return (
      <div>
        <div>
          <h3 className="title is-1"><center>Item ID</center></h3>
          <SillyPieChart items={items} />
        </div>
      </div>
          );

    }
