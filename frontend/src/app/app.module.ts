import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeListComponent } from './homes/home-list/home-list.component';
import { HomeDetailsComponent } from './homes/home-details/home-details.component';
import { OtherComponent } from './other/other.component';
import { HomeService }  from './homes/home.service';
import { UserService }  from './users/user.service';
import { HostService }  from './host/host.service';
import { AdminService } from './admin/admin.service';
import { EditUserService }  from './users/edit-user/edit-user.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { LandingComponent } from './landing/landing.component';
import { SearchComponent } from './search/search.component';
import { EqualValidator } from './register/password-validator.directive';
import { AgeValidator } from './register/age-validator.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { AddHomeComponent } from './homes/add-home/add-home.component';
import { WizardModule } from '../../ng2-archwizard/src/components/wizard.module';
import { AgmCoreModule } from '@agm/core';
import { FilterPipe } from './filter.pipe';
import { MdButtonModule, MdCheckboxModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { HostComponent } from './host/host.component';
import { AdminComponent } from './admin/admin.component';
import { HomeRateComponent } from './homes/home-rate/home-rate.component';
import { EditHomeComponent } from './homes/edit-home/edit-home.component';

enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    HomeListComponent,
    HomeDetailsComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    LandingComponent,
    SearchComponent,
    EqualValidator,
    AgeValidator,
    UserProfileComponent,
    AddHomeComponent,
    FilterPipe,
    EditUserComponent,
    ChangePasswordComponent,
    HostComponent,
    AdminComponent,
    HomeRateComponent,
    EditHomeComponent,
    OtherComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    WizardModule,
    FormsModule,
    MdButtonModule,
    MdCheckboxModule,
    FlashMessagesModule,
    MdDatepickerModule,
    MdNativeDateModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB5rU-0guMF3o370yG7PICBljJJpD2QTzo'
    }),
    MdButtonModule,
    MdCheckboxModule,
    MdDatepickerModule,
    MdNativeDateModule,
    RouterModule.forRoot([
      {
        path: '',
        component: LandingComponent
      },
      {
        path: 'homes',
        component: HomeListComponent
      },
      {
        path: 'homes/:id',
        component: HomeDetailsComponent
      },  
      {
        path: 'homes/:id/edit',
        component: EditHomeComponent
      },
      {
        path: 'homes/:id/rate',
        component: HomeRateComponent
      },  
      {
        path: 'users/:id',
        component: UserProfileComponent
      },
      {
        path: 'admin',
        component: AdminComponent
      },
      {
        path: 'users/:id/edit',
        component: EditUserComponent
      },
      {
        path: 'users/:id/edit/change.password',
        component: ChangePasswordComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      },
      {
        path: 'create',
        component: AddHomeComponent
      },
      {
        path: "**",
        component: OtherComponent
      }
    ])
  ],
  providers: [
    HomeService,
    UserService,
    HostService,
    EditUserService,
    AdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
