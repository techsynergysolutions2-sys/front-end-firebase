import { useState, useEffect } from 'react';
import {LineChartOutlined,DollarOutlined,ShoppingCartOutlined,BookOutlined,ScheduleOutlined } from '@ant-design/icons';
import { Skeleton, Col, Row,Card  } from 'antd';
import {fnGetDirectData } from '../shared/shared'
import { LineChart } from '@mui/x-charts/LineChart';

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


const Analytics = () => {
    const [orders, setOrders] = useState(0);
    const [revenue, setRevenue] = useState(0)
    const [inventory, setInventory] = useState(0)
    const [totalPending, setTotalPending] = useState(0)
    const [lineData, setLineData] = useState({})
    const [salesOrders, setSalesOrders] = useState([])
    const [recentOrders, setRecentOrders] = useState([])
    const yr = new Date()

  useEffect(() => {
    fnFetchData()
  }, []);

  const fnFetchData = async () => {
        var companyid = sessionStorage.getItem('companyid')
        // var uid = sessionStorage.getItem('uid')
        
        let sql_indicators = `
          SELECT 
          COALESCE(SUM(CASE WHEN o.isactive = 1 AND op.isactive = 1 THEN op.quantity * op.price ELSE 0 END), 0) AS total_revenue,
          (
              SELECT COALESCE(SUM(p2.instock), 0)
              FROM products p2
              WHERE p2.isactive = 1
                AND p2.instock > 0
                AND p2.companyid = ${companyid}
          ) AS total_inventory,
          COUNT(CASE WHEN o.isactive = 1 THEN 1 END) AS total_orders,
          COUNT(CASE WHEN o.isactive = 1 AND o.status = 1 THEN 1 END) AS pending_orders
      FROM orders o
      LEFT JOIN order_products op 
          ON o.id = op.orderid 
          AND op.isactive = 1
      WHERE o.companyid = ${companyid} AND o.isactive = 1;

        `

        let sql_indicators_2 = `
          SELECT count(o.id) As total FROM orders o WHERE o.isactive = 1 AND o.status = 1; 
        `
  
        let sql_line = `
          SELECT 
                MONTH(STR_TO_DATE(o.orderdate, '%Y-%m-%dT%H:%i')) as month_number,
                MONTHNAME(STR_TO_DATE(o.orderdate, '%Y-%m-%dT%H:%i')) as month_name,
                COALESCE(SUM(op.quantity * op.price), 0) as revenue
            FROM orders o
            INNER JOIN order_products op ON o.id = op.orderid AND op.isactive = 1
            INNER JOIN products p ON op.productid = p.id AND p.companyid = ${companyid}
            WHERE o.companyid = ${companyid} 
                AND o.isactive = 1 
                AND YEAR(STR_TO_DATE(o.orderdate, '%Y-%m-%dT%H:%i')) = YEAR(CURDATE())
            GROUP BY MONTH(STR_TO_DATE(o.orderdate, '%Y-%m-%dT%H:%i')), MONTHNAME(STR_TO_DATE(o.orderdate, '%Y-%m-%dT%H:%i'))
            ORDER BY month_number;
        `

        let sql_salesorders = `
             SELECT
              o.id,
              o.customername,
              o.contactnumber,
              o.orderdate,
              o.assignto,
              op.price,
              CONCAT(e.firstname, ' ', e.lastname) As created_by,
              CONCAT(em.firstname, ' ', em.lastname) As assigned_to,
              -- Calculate total per order
              COALESCE(SUM(op.price * op.quantity), 0) AS order_total,
              COALESCE(SUM(op.quantity), 0) AS order_q

              FROM orders o
              LEFT JOIN order_products op ON o.id = op.orderid
              LEFT JOIN products p ON op.productid = p.id
              LEFT JOIN employees e ON o.assignto = e.id
              LEFT JOIN employees em ON o.createdby = em.id

              WHERE o.companyid = ${companyid}
              AND o.isactive = 1
              GROUP BY o.id
              ORDER BY o.orderdate DESC;
        `

        let sql_recentorders = `
            SELECT
            o.id,
            o.customername,
            -- Calculate total per order
            COALESCE(SUM(op.price * op.quantity), 0) AS order_total

            FROM orders o
            LEFT JOIN order_products op ON o.id = op.orderid
            LEFT JOIN products p ON op.productid = p.id

            WHERE o.companyid = ${companyid}
            AND o.isactive = 1
            GROUP BY o.id
            ORDER BY o.orderdate DESC
            LIMIT 5;
        `
        try {
          const data = await fnGetDirectData('dashboard',sql_indicators);
          const data1 = await fnGetDirectData('dashboard',sql_indicators_2);
          const data2 = await fnGetDirectData('dashboardlinechart',sql_line);
          const data3 = await fnGetDirectData('dashboard',sql_salesorders);
          const data4 = await fnGetDirectData('dashboard',sql_recentorders);
  
          setRevenue(data[0].total_revenue)
          setInventory(data[0].total_inventory)
          setOrders(data[0].total_orders)
          setTotalPending(data1[0].total)

          setLineData(data2)

          setSalesOrders(data3)

          setRecentOrders(data4)

        } catch (error) {
        }
    };

  return (
    <div className="app" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="container">
        <h1 className="dashboard-title" style={{color: '#4361ee',marginBottom: '30px'}}><LineChartOutlined /> Analytics</h1>
        <Row>
            <Col span={24}>
                <StatsCards revenue={revenue} inventory={inventory} orders={orders} totalPending={totalPending}/>
            </Col>
        </Row>
        
        <Row>
            <Col span={15}>
                <Card style={{ width: '100%', height: '350px'}}>
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Sales Revenue ({yr.getFullYear()})</h2>
                    {
                        JSON.stringify(lineData) != "{}" ? (
                            <LineChart
                                xAxis={[{scaleType: 'band', data: lineData?.monthNames }]}
                                series={[
                                    {
                                    data: lineData?.revenue,
                                    area: true,
                                    },
                                ]}
                                height={300}
                            />
                        ):(
                            <Skeleton active />
                        )
                    }
                </Card>
            </Col>
            <Col span={1}></Col>
            <Col span={8}>
                <Card style={{ width: '100%', height: '350px'}}>
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Latest Orders</h2>
                        <Row style={{height:'250px' ,marginTop: '30px', overflowY: 'scroll',scrollbarWidth: 'none'}}>
                            <Col span={24}>
                                <div className="orders-table-container">
                                    <table className="orders-table">
                                    <thead>
                                        <tr>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.length > 0 ? (
                                        recentOrders.map((or) => (
                                            <tr key={or.id}>
                                            <td>{or.id}</td>
                                            <td>{or.customername}</td>
                                            <td>{Intl.NumberFormat(undefined,{style: 'currency', currency: 'USD'}).format(or.order_total)}</td>
                                            </tr>
                                        ))
                                        ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                            No orders
                                            </td>
                                        </tr>
                                        )}
                                    </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                </Card>
            </Col>
        </Row>

        <Row>
            <Col span={24}>
                <Box
                gridColumn="span 8"
                gridRow="span 2"
                >
                <Box
                    mt="25px"
                    p="0 30px"
                    display="flex "
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box>
                    <Typography
                        variant="h5"
                        fontWeight="600"
                    >
                        Sales Orders
                    </Typography>
                    </Box>
                </Box>
                <Box height="250px" m="-20px 0 0 0">
                    <ResentSales salesorders={salesOrders} />
                </Box>
                </Box>
            </Col>
        </Row>
        
      </div>
    </div>
  );
};


// Stats Cards Component
const StatsCards = ({revenue, inventory, orders, totalPending }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card primary">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Total Revenue</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4361ee', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <DollarOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{Intl.NumberFormat(undefined,{style: 'currency', currency: 'USD'}).format(revenue)}</Col>
        </Row>
        <Row>
            {/* <Col span={24} style={{color: '#dc3545'}}><ArrowDownOutlined /> 9.87%</Col> */}
        </Row>
      </div>
      <div className="stat-card success">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Inventory</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4cc9f0', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <BookOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{inventory}</Col>
        </Row>
        <Row>
            {/* <Col span={24} style={{color: '#28a745'}}><ArrowUpOutlined />8.3%</Col> */}
        </Row>
      </div>
      <div className="stat-card warning">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Orders</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4cc9f0', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <ScheduleOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{orders}</Col>
        </Row>
        <Row>
            {/* <Col span={24} style={{color: '#28a745'}}><ArrowUpOutlined />8.3%</Col> */}
        </Row>
      </div>
      <div className="stat-card warning">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Pending Orders</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4cc9f0', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <ShoppingCartOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{totalPending}</Col>
        </Row>
        <Row>
            {/* <Col span={24} style={{color: '#28a745'}}><ArrowUpOutlined />8.3%</Col> */}
        </Row>
      </div>
    </div>
  );
};

const GetStatusBadge = ({status}) => {
    const [statusClasses, setStatusClasses] = useState('')
    const [statusName, setStatusName] = useState('')
    useEffect(() => {
      if(status == 1){
        setStatusClasses('status-pending')
        setStatusName('Pending')
      }else if(status == 2){
        setStatusClasses('status-processing')
        setStatusName('Processing')
      }else if(status == 3){
        setStatusClasses('status-completed')
        setStatusName('Completed')
      }else if(status == 4){
        setStatusClasses('status-cancelled')
        setStatusName('Cancelled')
      }
    },[])

    return (
      <span className={`status-badge ${statusClasses}`}>
        {statusName}
      </span>
    );
};

const ResentSales = ({salesorders}) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);


  const columns = [
    {
      field: "id",
      headerName: "Order number",
      flex: 1
    },
    {
      field: "customername",
      headerName: "Customer name",
      flex: 1
    },
    {
      field: "contactnumber",
      headerName: "Contact number",
      flex: 1
    },
    {
      field: "orderdate",
      headerName: "Order date",
      flex: 1
    },
    {
      field: "assigned_to",
      headerName: "Assigned to",
      flex: 1
    },
    {
      field: "created_by",
      headerName: "Created by",
      flex: 1
    },
    {
      field: "order_q",
      headerName: "Quantity",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
    {
      field: "order_total",
      headerName: "Total ( $ )",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1
    }
    
  ];

  return (
      <Box
        m="40px 0 0 0"
        height="75vh"
        
      >
        <DataGrid
          rows={salesorders}
          columns={columns}
          showToolbar
        />
      </Box>
  );
};

export default Analytics;