import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellService } from './shell/services/shell.service';

const routes: Routes = [
  ShellService.childRoutes(
    [
      { path: 'home', loadChildren: () => import('./modules/home/home.module').then((home) => home.HomeModule) },
      { path: 'products', loadChildren: () => import('./modules/products/products.module').then((home) => home.ProductsModule) },
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      { path: '**', redirectTo: '/home' },
    ]
  )
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
