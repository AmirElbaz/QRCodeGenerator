 import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { authGuard } from './authentication/guards/auth.guard';
import { AdminGuard } from './authentication/guards/admin.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';


export const routes: Routes = [
    {
        path: '',
        component: NotFoundComponent,
        children: [
          
           
         
            { path: 'QRCodeGenerator', 
                loadChildren: () => import('./qrgenerator/qrgenerator.module')
                                   .then(m => m.QRGeneratorModule),
                canActivate: [authGuard] 
          },
            { path: 'auth', 
                loadChildren: () => import('./authentication/authentication.module')
                                   .then(m => m.AuthenticationModule),
                
          },
             { path: 'admin', 
                 loadChildren: () => import('./qrtemplategenerator/qrtemplategenerator.module')
                                    .then(m => m.QrtemplategeneratorModule),
                 canActivate: [authGuard, AdminGuard] 
           },
        ],
    },

    {
        path: '',
        component: AuthLayout,
        children: [
        ],
    },
];
