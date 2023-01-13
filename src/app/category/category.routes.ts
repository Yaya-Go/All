import { Route } from "@angular/router";
import { CategoryDetailComponent } from "./category-detail/category-detail.component";
import { CategoryComponent } from "./category.component";

export default [
  {path: '', component: CategoryComponent},
  {path: ':id', component: CategoryDetailComponent}
] as Route[];
