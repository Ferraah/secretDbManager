import { Grid } from "gridjs-react";
import React from "react";
function GridWrap({ tableComponents, columns }) {


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
}

export default GridWrap