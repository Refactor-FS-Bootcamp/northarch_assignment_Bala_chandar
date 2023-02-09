
import React, { useState } from 'react';
import './App.css';
import MaterialTable from 'material-table'
import * as xlsx from "xlsx"

const EXTENSIONS = ['xlsx', 'xls', 'csv']
function App() {
  const [colDefs, setColDefs] = useState()
  const [data, setData] = useState()

  const getExention = (file) => {
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    return EXTENSIONS.includes(extension) 
  }

  const convertToJson = (headers, data) => {
    const rows = []
    data.forEach(row => {
      let rowData = {}
      row.forEach((element, index) => {
        rowData[headers[index]] = element
      })
      rows.push(rowData)

    });
    return rows
  }

  const importData = (e) => {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = (event) => {
      

      const bstr = event.target.result
      const workBook = xlsx.read(bstr, { type: "binary" })

     
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      
      const fileData = xlsx.utils.sheet_to_json(workSheet, { header: 1 })
      
      const headers = fileData[0]
      const heads = headers.map(head => ({ title: head, field: head }))
      setColDefs(heads)

     
      fileData.splice(0, 1)


      setData(convertToJson(headers, fileData))
    }

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file)
      }
      else {
        alert("Invalid file input Select Excel or CSV file")
      }
    } else {
      setData([])
      setColDefs([])
    }
  }

  return (
    <div className="App">
      <h1 align="center">React-App</h1>
      <h4 align='center'>Import Data from Excel Table</h4>
      <input type="file" onChange={importData} />
      <MaterialTable title="Olympic Data" data={data} columns={colDefs} />
    </div>
  );
}

export default App;
