import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './DashboardItem.css';

const DashboardItem = ({ icon: Icon, title, route }) => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-item" onClick={() => navigate(route)}>
            <h1><Icon /></h1>
            <h1>{title}</h1>
        </div>
    );
};

export default DashboardItem;
