import React from 'react'
import { BrowserRouter as Router,Route,Switch,Redirect } from 'react-router-dom'
import PatientTable from './PatientTable'
import PatientForm from './PatientForm'
import PatientDetail from './PatientDetail'
import { useRouteMatch } from 'react-router-dom'


const Patient = () => {
  const { path } = useRouteMatch();
  return (
    <div>
      
            <Switch>
                <Route exact path={`${path}`} component={PatientTable}></Route>
                <Route path={`${path}/PatientForm/:id?`} component={PatientForm}></Route>
                <Route path={`${path}/PatientDetail/:id`} component={PatientDetail}></Route>
                <Redirect to={`${path}`} />
            </Switch>
      
    </div>
  )
}

export default Patient
