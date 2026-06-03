import { useState, useEffect } from 'react';
import {LineChartOutlined,DollarOutlined,ShoppingCartOutlined,BookOutlined,ScheduleOutlined } from '@ant-design/icons';
import { Skeleton, Col, Row,Card  } from 'antd';
import {fnGetDirectData, order_status } from '../shared/shared'
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// const data  = [
//   { label: 'Group A', value: 400 },
//   { label: 'Group B', value: 300},
//   { label: 'Group C', value: 300},
//   { label: 'Group D', value: 200},
// ];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  hideLegend: false,
};


const Analytics = () => {
    const [inventoryvalue, setInventoryValue] = useState(0);
    const [totalproducts, setTotalProducts] = useState(0);
    const [orders, setOrders] = useState(0);
    const [revenue, setRevenue] = useState(0)
    const [inventory, setInventory] = useState(0)
    const [totalPending, setTotalPending] = useState(0)
    const [totalCompleted, setTotalCompleted] = useState(0)
    const [lineData, setLineData] = useState({})
    const [lineOrders, setLineOrders] = useState({})
    const [salesOrders, setSalesOrders] = useState([])
    const [recentOrders, setRecentOrders] = useState([])
    const [data, setData] = useState([])
    const yr = new Date()

    const test = [
      0,
      0,
      4,
      0,
      0,
      0,
      0,
      149.95,
      0,
      0,
      0,
      0
  ]

  useEffect(() => {
    fnFetchData()
  }, []);

  const fnFetchData = async () => {
        var companyid = sessionStorage.getItem('companyid')
        // var uid = sessionStorage.getItem('uid')
  
        let sql_line = `
          WITH RECURSIVE months AS (
                SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 11 MONTH), '%Y-%m-01') AS month_start
                UNION ALL
                SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
                FROM months
                WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
            )

            SELECT
                DATE_FORMAT(m.month_start, '%Y-%m') AS month,
                COALESCE(SUM(op.quantity * op.price), 0) AS revenue
            FROM months m
            LEFT JOIN orders o
                ON DATE_FORMAT(
                    STR_TO_DATE(o.orderdate, '%Y-%m-%dT%H:%i'),
                    '%Y-%m'
                ) = DATE_FORMAT(m.month_start, '%Y-%m')
                AND o.companyid = ${companyid}
                AND o.status = 3
                AND o.isactive = 1
            LEFT JOIN order_products op
                ON o.id = op.orderid
                AND op.isactive = 1
            GROUP BY m.month_start
            ORDER BY m.month_start;
        `

        let sql_lineOrders = `
          WITH RECURSIVE months AS (
          SELECT DATE_FORMAT(
              DATE_SUB(CURDATE(), INTERVAL 11 MONTH),
              '%Y-%m-01'
          ) AS month_start

          UNION ALL

          SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
          FROM months
          WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      )

      SELECT
          DATE_FORMAT(m.month_start, '%Y-%m') AS month,
          COUNT(o.id) AS total_orders
      FROM months m
      LEFT JOIN orders o
          ON DATE_FORMAT(
              STR_TO_DATE(o.orderdate, '%Y-%m-%dT%H:%i'),
              '%Y-%m'
          ) = DATE_FORMAT(m.month_start, '%Y-%m')
          AND o.companyid = ${companyid}
          AND o.status = 3
          AND o.isactive = 1
      GROUP BY m.month_start
      ORDER BY m.month_start;
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

        let sql_orderskpis = `
            SELECT
            (SELECT COUNT(id) FROM orders o WHERE o.isactive = 1 AND o.companyid = ${companyid}) AS total_orders,
            (SELECT COUNT(id) FROM orders o WHERE o.isactive = 1 AND o.companyid = ${companyid} AND o.status = 1) AS pending_order,
            (SELECT COUNT(id) FROM orders o WHERE o.isactive = 1 AND o.companyid = ${companyid} AND o.status = 3) AS completed_order,
            ( SELECT SUM(p.price * p.instock) FROM products p WHERE p.isactive = 1 AND p.instock > 0 AND p.companyid = ${companyid}) AS total_value,
            (SELECT SUM(p.instock) FROM products p WHERE p.isactive = 1 AND p.companyid = ${companyid}) AS inventory,
            (SELECT 
                COALESCE(SUM(CASE WHEN o.isactive = 1 AND o.status = 3 AND op.isactive = 1 THEN op.quantity * op.price ELSE 0 END), 0)
            FROM orders o
            LEFT JOIN order_products op 
                ON o.id = op.orderid 
                AND op.isactive = 1
            WHERE o.companyid = 1 AND o.isactive = 1) AS total_revenue;
        `

        let sql_orderPie = `
          SELECT o.status, COUNT(id) AS value FROM orders o
          WHERE o.isactive AND o.companyid = ${companyid}
          GROUP BY o.status
        `

        try {
          const res = await fnGetDirectData('dashboard',sql_orderskpis);
          const res2 = await fnGetDirectData('dashboard',sql_line);
          const res3 = await fnGetDirectData('dashboard',sql_salesorders);
          const res4 = await fnGetDirectData('dashboard',sql_recentorders);
          const res5 = await fnGetDirectData('dashboard',sql_orderPie);
          const res6 = await fnGetDirectData('dashboard',sql_lineOrders);
  
          setRevenue(res[0].total_revenue)
          setInventory(res[0].inventory)
          setOrders(res[0].total_orders)
          setTotalPending(res[0].pending_order)
          setTotalCompleted(res[0].completed_order)
          setInventoryValue(res[0].total_value)

          let temp_data = mergeOrdersWithStatusFast(res5,order_status)
          console.log(temp_data)
          setData(temp_data)

          setLineData(res2)
          setSalesOrders(res3)
          setRecentOrders(res4)
          setLineOrders(res6)

          console.log(res2)

        } catch (error) {
        }
    };

  return (
    <div className="app" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="container">
        <h1 className="dashboard-title" style={{color: '#4361ee',marginBottom: '30px'}}><LineChartOutlined /> Analytics</h1>
        <Row>
            <Col span={24}>
                <StatsCards revenue={revenue} inventory={inventory} orders={orders} totalPending={totalPending} totalCompleted={totalCompleted}  inventoryvalue={inventoryvalue} totalproducts={totalproducts}/>
            </Col>
        </Row>
        
        <Row>
            <Col span={15}>
                <Card style={{ width: '100%', height: '350px'}}>
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Sales Revenue</h2>
                    {
                        JSON.stringify(lineData) != "{}" ? (
                            <LineChart
                                xAxis={[{scaleType: 'band', data: lineData.map(x => x.month) }]}
                                series={[
                                    {
                                    data: lineData.map(x => x.revenue),
                                    label: 'Revenue',
                                    }
                                ]}
                                height={270}
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
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Orders by status</h2>
                        <Row style={{height:'250px' ,marginTop: '30px', overflowY: 'scroll',scrollbarWidth: 'none'}}>
                            <Col span={24}>
                                <div className="orders-chart-container">
                                  <PieChart
                                    series={[{ innerRadius: 25, outerRadius: 100, data, arcLabel: 'value' }]}
                                    {...settings}
                                  />
                                </div>
                            </Col>
                        </Row>
                </Card>
            </Col>
        </Row>

        <Row>
            <Col span={24}>
                <Card style={{ width: '100%', height: '350px', marginTop: 30}}>
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Orders</h2>
                    {
                        JSON.stringify(lineOrders) != "{}" ? (
                            <LineChart
                                xAxis={[{scaleType: 'band', data: lineOrders.map(x => x.month) }]}
                                series={[
                                    {
                                    data: lineOrders.map(x => x.total_orders),
                                    label: 'Completed Orders',
                                    }
                                ]}
                                height={270}
                            />
                        ):(
                            <Skeleton active />
                        )
                    }
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
                      Recent Orders
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
const StatsCards = ({revenue, inventory, orders, totalPending, totalCompleted, inventoryvalue }) => {
  return (
    <div className="stats-cards">

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
      </div>

      <div className="stat-card primary">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Inventory Value</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4361ee', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <DollarOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{Intl.NumberFormat(undefined,{style: 'currency', currency: 'USD'}).format(inventoryvalue)}</Col>
        </Row>
      </div>

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
      </div>

      <div className="stat-card warning">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Completed Orders</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4cc9f0', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <ScheduleOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{totalCompleted}</Col>
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

function mergeOrdersWithStatusFast(ordersArray, statusArray) {
    // 1. Create a quick lookup map: { 1: 'Pending', 2: 'Processing', ... }
    const statusMap = {};
    statusArray.forEach(s => {
        statusMap[s.id] = s.label;
    });

    // 2. Map the orders using instant object property lookup
    return ordersArray.map(order => ({
        label: statusMap[order.status] || 'Unknown',
        value: order.value
    }));
}

export default Analytics;