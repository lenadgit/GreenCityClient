import {UserComponent} from './component/user/user.component';
import {SignUpComponent} from './component/user/auth/sign-up/sign-up.component';
import {AuthComponent} from './component/user/auth/auth.component';
import {SignInComponent} from './component/user/auth/sign-in/sign-in.component';
import {SubmitEmailComponent} from './component/user/auth/submit-email/submit-email.component';
import {MapComponent} from './component/user/map/map.component';
import {AdminComponent} from './component/admin/admin.component';
import {PlacesComponent} from './component/admin/places/places.component';
import {UsersComponent} from './component/admin/users/users.component';
import {FilterComponent} from './component/filter/filter.component';
import {RestoreFormComponent} from "./component/user/restore-form/restore-form.component";

export const router = [
  {
    path: '', name: 'MainPage', component: UserComponent, children: [
      {
        path: 'auth', component: AuthComponent, children: [
          {path: '', component: SignInComponent},
          {path: 'sign-up', component: SignUpComponent},
          {path: 'submit-email', component: SubmitEmailComponent},
          {path: 'restore/:token', component: RestoreFormComponent}
        ]
      },
      {
        path: '', component: MapComponent
      },
      {
        path: '', component: FilterComponent
      },
      {
        path: 'admin', component: AdminComponent, children: [
          {path: '', redirectTo: 'places', pathMatch: 'prefix'},
          {path: 'places', component: PlacesComponent},
          {path: 'users', component: UsersComponent}
        ]
      }
    ]
  }
];
