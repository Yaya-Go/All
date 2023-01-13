import { Route } from "@angular/router";
import { StatisticComponent } from "./statistic.component";

export default [
  {path: '', component: StatisticComponent},
  {path: ':year', component: StatisticComponent}
] as Route[];
