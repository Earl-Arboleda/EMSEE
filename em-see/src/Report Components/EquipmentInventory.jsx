import React, { useState, useEffect } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { PieChart, Pie, Cell , Tooltip, ResponsiveContainer } from 'recharts';
import "./ReportPage.css";

const EquipmentInv = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [brandCounts, setBrandCounts] = useState({});
  const [initialPieChartData, setInitialPieChartData] = useState([]);
  const [total, setTotal] = useState();
  const [functional, setFunctional] = useState();
  const [circulate, setCirculate] = useState();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4500', '#2E8B57', '#FFD700', '#9932CC'];
  useEffect(() => {
    fetch("/Api/Inventory")
      .then((res) => res.json())
      .then((data) => {
        setData(data);

        const totalCount = data.length;
        const functionalCount = data.filter((item) => item.Status === "Functional").length;
        const circulationCount = data.filter((item) => item.Availability === "Borrowed").length;

        setTotal(totalCount);
        setFunctional(functionalCount);
        setCirculate(circulationCount);
        setUpdate(!update)
        const initialItemCounts = data.reduce((acc, item) => {
          const { ItemName } = item;
          acc[ItemName] = (acc[ItemName] || 0) + 1;
          return acc;
        }, {});
        setInitialPieChartData(Object.keys(initialItemCounts).map((key) => ({
          itemName: key,
          count: initialItemCounts[key],
        })));
      })
      .catch((error) => console.log("error", error));
  }, []);

  // ...

  const pieChartData = selectedCategory
    ? Object.keys(brandCounts).map((brand) => ({
        brand,
        count: brandCounts[brand],
        itemName: brand,
      }))
    : initialPieChartData;
    
  useEffect(() => {
    const brandCountsObject = data.reduce((acc, item) => {
      const { ItemName, Brand } = item;
      if (selectedCategory && ItemName === selectedCategory) {
        acc[Brand] = (acc[Brand] || 0) + 1;
      }
      return acc;
    }, {});
    setBrandCounts(brandCountsObject);
  }, [data, selectedCategory]);


  const handleCategoryClick = (itemName) => {
    if (selectedCategory === itemName) {
      // If the category is already selected, deselect it
      setSelectedCategory(null);
      setExpandedCategories([]);
    
    } else {
      // If a new category is selected, update the state
      setSelectedCategory(itemName);
      setExpandedCategories([itemName]);
     
    }
  };



  const groupedData = data.reduce((acc, item) => {
    const { ItemName } = item;
    acc[ItemName] = (acc[ItemName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="equip-inv-table">
      <div className="equip-inv-summary">
      <div className="inv-summary">
      <div className="inv-summary-head">
        <h3>Inventory Summary</h3>
        </div>
        <div className="inv-summary-body">
          <div className="inv-summary-header">
          <p>Total Items:</p> <p> {total}</p>
          </div>
          <div className="inv-summary-header">
          <p>Functional:</p><p>{functional}</p>
          </div>
          <div className="inv-summary-header">
          <p>In Circulation:</p><p>{circulate}</p>
          </div>
          </div>
        </div>
        {Object.entries(groupedData).map(([itemName, count]) => (
          <div className="inv-category" key={itemName}>
            <div className="category" onClick={() => handleCategoryClick(itemName)}>
              <p>{itemName} : {count}</p>
              {selectedCategory === itemName ? (
                <GoChevronUp style={{ fontSize: '23px' }} />
              ) : (
                <GoChevronDown style={{ fontSize: '23px' }} />
              )}
            </div>
            {expandedCategories.includes(itemName) && (
              <div className="category-content">
                <div className={`categorical-items ${expandedCategories.includes(itemName) ? 'categorical-items-enter' : ''}`}>
                  <ul>
                    <li className="categorical-list-head"><p>ITEM CODE</p> <p>SERIAL NUMBER</p><p>BRAND</p><p>STATUS</p></li>
                    {data.filter((item) => item.ItemName === itemName).map((item) => (
                      <li key={item.ItemCode}><p>{item.ItemCode}</p><p>{item.SerialCode}</p> <p>{item.Brand}</p><p>{item.Status}</p></li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
      <div className="equip-inv-graph">
        <h3>Total Inventory Graph</h3>
      <ResponsiveContainer width="100%" height="90%"  minWidth="300px">
      <PieChart>
  <Pie
    dataKey="count"
    isAnimationActive={false}
    data={pieChartData}
    cx="50%"
    cy="50%"
    outerRadius={160}
    label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
      const RADIAN = Math.PI / 180;
      const radius = 25 + innerRadius + (outerRadius - innerRadius);
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill={COLORS[index % COLORS.length]} // Use index to get the color
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {pieChartData[index].itemName} = {" "} 
           {pieChartData[index].count }
        </text>
      );
    }}
  >
    {pieChartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip  formatter={(value, name, props) => [`${props.payload.itemName}: ${value}`, '']} />
</PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquipmentInv;

