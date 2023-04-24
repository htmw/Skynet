import React from "react"


export const DashLowInventory = ({lowInventoryItems}) => {
    return (
      <table>
      <thead>
        <tr>
          <th width = "50px">ItemID</th>
          <th width = "50px">Current</th>
          <th width = "50px">Minimum </th>
          </tr>
      </thead>
      <tbody>
      {lowInventoryItems.map((lowInventoryItem) => (
        <tr key={lowInventoryItems.itemID}>
          <td width = "50px">{lowInventoryItem.itemID}</td>
          <td width = "50px">{lowInventoryItem.quantity}</td>
          <td width = "50px">{lowInventoryItem.lowQuantity}</td>
        </tr>
        ))}
      </tbody>
      </table>
    );
  };