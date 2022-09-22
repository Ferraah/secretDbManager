import { Grid } from "gridjs-react";
import React from "react";
const GridWrap = React.memo(({ tableComponents, columns }) => {

  return (
    (
      <div>
      <Grid
        data={tableComponents}
        columns={columns}
        search={true}
        pagination={{
          enabled: false,
          limit: 10,
        }}
        style={
          {
            table: {
              width: "100%"
            }
          }
        }
      />
      </div>

    )
  )
})

const TestMessage = React.memo(()=>{
  console.log("Render")
  return(
    <Grid
    data={[
      ['John', 'john@example.com'],
      ['Mike', 'mike@gmail.com']
    ]}
    columns={['Name', 'Email']}
    search={true}
    pagination={{
      enabled: false,
      limit: 10,
    }}
    style={
      {
        table: {
          width: "100%"
        }
      }
    }
  />
  )
})
export {GridWrap, TestMessage};
