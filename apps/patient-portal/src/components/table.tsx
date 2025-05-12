import React from "react";

type HeaderConfig = {
  label: string;
  key: string;
};

type TableProps = {
  headers: HeaderConfig[];
  data: Record<string, any>[];
};

const Table: React.FC<TableProps> = ({ headers, data }) => {
  if (!data || data.length === 0)
    return <p className="no-data">No data available</p>;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map((header, j) => (
                <td key={j}>{row[header.key]?.toString().trim() || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
