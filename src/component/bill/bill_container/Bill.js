import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import BillsTable from "./BillsTable";
import BillsForm from "./BillsForm";
import BillsEditForm from "./BillsEditForm";
import BillsDetail from "./BillsDetail";

const Bill = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={BillsTable} exact />
      <Route path={`${path}/form`} component={BillsForm} exact />
      <Route path={`${path}/form/:id`} component={BillsEditForm} />
      <Route path={`${path}/details/:id/:stage?`} component={BillsDetail} />
      {/* <Route path={`${path}/details/:id`} component={CategoryDetail} /> */}
      <Redirect to={`${path}`} />
    </Switch>
  )
}

export default Bill
