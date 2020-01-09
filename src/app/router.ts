import { SignUpComponent } from './component/user/auth/sign-up/sign-up.component';
import { AuthComponent } from './component/user/auth/auth.component';
import { SignInComponent } from './component/user/auth/sign-in/sign-in.component';
import { SubmitEmailComponent } from './component/user/auth/submit-email/submit-email.component';
import { MapComponent } from './component/user/map/map.component';
import { AdminComponent } from './component/admin/admin.component';
import { PlacesComponent } from './component/admin/places/places.component';
import { UsersComponent } from './component/admin/users/users.component';
import { FilterComponent } from './component/filter/filter.component';
import { RestoreFormComponent } from './component/user/restore-form/restore-form.component';
import { FeedbacksComponent } from './component/admin/feedbacks/feedbacks.component';
import { UserHabitPageComponent } from './component/user/habit/user-habit-page/user-habit-page.component';
import { Routes } from '@angular/router';
import { HomepageComponent } from './component/general/homepage/homepage/homepage.component';
import { AuthPageGuardService } from './service/route-guards/auth-page-guard.service';
import { HomePageGuardService } from './service/route-guards/home-page-guard.service';
import { AppComponent } from './app.component';

export const router: Routes = [
  { path: '',
    component: AppComponent,
    canActivate: [HomePageGuardService]
  },
  {
    path: 'welcome',
    component: HomepageComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'submit-email', component: SubmitEmailComponent },
      { path: 'restore/:token', component: RestoreFormComponent }
    ]
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: '',
    component: FilterComponent
  },
  {
    path: ':id/habits',
    component: UserHabitPageComponent,
    canActivate: [AuthPageGuardService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'places', pathMatch: 'prefix' },
      { path: 'places', component: PlacesComponent },
      { path: 'users', component: UsersComponent },
      { path: 'feedbacks', component: FeedbacksComponent }
    ]
  }
];
