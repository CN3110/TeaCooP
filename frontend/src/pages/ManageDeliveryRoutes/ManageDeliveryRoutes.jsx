import React, { useState, useEffect } from "react";
import axios from "axios";
import './ManageDeliveryRoutes.css';
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import AdminLayout from "../../components/AdminLayout/AdminLayout";

const ManageDeliveryRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [editRouteId, setEditRouteId] = useState(null);
  const [editRouteName, setEditRouteName] = useState("");

  // Fetch all delivery routes
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/deliveryRoutes");
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching delivery routes:", error);
    }
  };

  // Add a new delivery route
  const addRoute = async () => {
    if (!routeName) return;
    try {
      const response = await axios.post("http://localhost:3001/api/deliveryRoutes", {
        delivery_routeName: routeName,
      });

      // Update the state with the new route
      setRoutes([...routes, response.data]);
      setRouteName(""); // Clear the input field
    } catch (error) {
      console.error("Error adding delivery route:", error.response?.data);
    }
  };

  // Edit a delivery route
  const editRoute = async (id) => {
    if (!editRouteName) return;
    try {
      const response = await axios.put(`http://localhost:3001/api/deliveryRoutes/${id}`, {
        delivery_routeName: editRouteName,
      });

      // Update the state with the updated route
      setRoutes(
        routes.map((route) =>
          route.delivery_routeId === id ? response.data : route
        )
      );
      setEditRouteId(null); // Clear the edit mode
      setEditRouteName(""); // Clear the input field
    } catch (error) {
      console.error("Error updating delivery route:", error);
    }
  };

  // Delete a delivery route
  const deleteRoute = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/deliveryRoutes/${id}`);

      // Update the state by removing the deleted route
      setRoutes(routes.filter((route) => route.delivery_routeId !== id));
    } catch (error) {
      console.error("Error deleting delivery route:", error);
    }
  };

  
const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  return (
    <Layout>
      <div>
        <h1>Delivery Routes</h1>

        {/* Add Route Form */}
        <div>
          <input
            type="text"
            placeholder="Enter Route Name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
          <button onClick={addRoute}>Add Route</button>
        </div>

        {/* Routes Table */}
        <table>
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Route Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(routes) &&
              routes.map((route) => (
                <tr key={route.delivery_routeId}>
                  <td>{route.delivery_routeId}</td>
                  <td>
                    {editRouteId === route.delivery_routeId ? (
                      <input
                        type="text"
                        value={editRouteName}
                        onChange={(e) => setEditRouteName(e.target.value)}
                      />
                    ) : (
                      route.delivery_routeName
                    )}
                  </td>
                  <td>
                    {editRouteId === route.delivery_routeId ? (
                      <button onClick={() => editRoute(route.delivery_routeId)}>
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditRouteId(route.delivery_routeId);
                            setEditRouteName(route.delivery_routeName);
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteRoute(route.delivery_routeId)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ManageDeliveryRoutes;