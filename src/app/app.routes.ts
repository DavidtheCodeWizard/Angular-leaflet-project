import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Calculator } from './pages/calculator/calculator';
import { Dashboard } from './pages/dashboard/dashboard';
import { MapComponent } from './pages/map/map';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'dashboard', component: Dashboard },
  { path: 'calculator', component: Calculator },
  { path: 'map', component: MapComponent },
  { path: 'admin', component: Admin },
];
