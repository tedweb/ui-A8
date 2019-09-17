import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagenotfoundComponent } from './content/generic/frontpage/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./content/generic/frontpage/frontpage.module').then(m => m.FrontpageModule)
  },
  {
    path: 'edh-admin',
    loadChildren: () => import('./content/family_stuff/edh-admin.module').then(m => m.EdhAdminModule)
  },
  {
    path: 'cloud-dev',
    loadChildren: () => import('./content/cloud-dev/cloud-dev.module').then(m => m.CloudDevModule)
  },
  {
    path: '**',
    component: PagenotfoundComponent
  }
];


@NgModule({
  declarations: [
    PagenotfoundComponent
  ],
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
