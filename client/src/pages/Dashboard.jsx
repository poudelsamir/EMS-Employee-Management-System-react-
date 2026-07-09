import React, { useState, useEffect } from 'react'
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets'
import Loading from '../components/Loading'
import EmployeeDashboard from '../components/EmployeeDashboard'
import AdminDashboard from '../components/AdminDashboard'

const Dashboard = () => {
  const[data,setData]=useState(null)
  const[loading,setLoading]=useState(true)

  useEffect(() => {
    setData(dummyAdminDashboardData)
    // setData(dummyEmployeeDashboardData)
    setTimeout(() => {
      setLoading(false)
    }, 1000);   
  }, [])

  if(loading) return <Loading/>
  if(!data) return <p className='text-center text-slate-500 py-12'>Failed to load dashboard</p>
  // console.log(data.role)

  // Admin dummy data have a role key but employee doesnt have so we are doing so!
  if(data.role === "ADMIN"){
    return <AdminDashboard data={data} />
  }else{
    return <EmployeeDashboard data={data} />
  }
  
 
}

export default Dashboard
