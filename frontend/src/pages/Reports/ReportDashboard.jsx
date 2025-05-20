import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CardActionArea, 
  Container,
  Box
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  Receipt as ReceiptIcon,
  Factory as FactoryIcon,
  LocalPostOffice as LocalPostOfficeIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';

import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout';
import AdminLayout from '../../components/AdminLayout/AdminLayout';

const ReportDashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Get role from localStorage

  const reportCards = [
    {
      title: 'Raw Tea Report',
      icon: <InventoryIcon sx={{ fontSize: 50 }} />,
      path: '/raw-tea-report',
      description: 'View and generate reports on raw tea inventory'
    },
    {
      title: 'Supplier Delivery Records',
      icon: <LocalShippingIcon sx={{ fontSize: 50 }} />,
      path: '/supplier-delivery-records',
      description: 'Track and report supplier deliveries'
    },
    {
      title: 'Driver Delivery Records',
      icon: <LocalShippingIcon sx={{ fontSize: 50 }} />,
      path: '/driver-delivery-records',
      description: 'Monitor driver delivery performance'
    },
    {
      title: 'Daily Tea Delivery',
      icon: <AssignmentIcon sx={{ fontSize: 50 }} />,
      path: '/daily-tea-delivery-report',
      description: 'Daily delivery reports and summaries'
    },
    {
      title: 'Made Tea Production',
      icon: <FactoryIcon sx={{ fontSize: 50 }} />,
      path: '/made-tea-production-report',
      description: 'Production reports for made tea'
    },
    {
      title: 'Tea Packet Reports',
      icon: <LocalPostOfficeIcon sx={{ fontSize: 50 }} />,
      path: '/tea-packet-reports',
      description: 'Generate packet tea inventory reports'
    },
    {
      title: 'Lot Summary Report',
      icon: <AssessmentIcon sx={{ fontSize: 50 }} />,
      path: '/lot-summary-report',
      description: 'Comprehensive lot summaries'
    },
    {
      title: 'Sold Lots Report',
      icon: <MonetizationOnIcon sx={{ fontSize: 50 }} />,
      path: '/sold-lots-report',
      description: 'Reports on sold tea lots and revenue'
    }
  ];

  const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          color: '#2E7D32', 
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 1
        }}>
          Report Generation Dashboard
        </Typography>
        
        <Box sx={{ 
          backgroundColor: '#E8F5E9', 
          p: 3, 
          borderRadius: 2,
          mb: 4,
          boxShadow: 1
        }}>
          <Typography variant="body1" sx={{ color: '#1B5E20' }}>
            Select a report category below to generate detailed reports.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {reportCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                },
                borderTop: '4px solid #2E7D32',
                borderRadius: 2
              }}>
                <CardActionArea 
                  sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                  }} 
                  onClick={() => navigate(card.path)}
                >
                  <Box sx={{ 
                    color: '#2E7D32',
                    mb: 2
                  }}>
                    {card.icon}
                  </Box>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ 
                      fontWeight: 'bold',
                      color: '#1B5E20'
                    }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default ReportDashboard;
