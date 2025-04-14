import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get('/')
  @Render('home')
  getHomePage(@Req() req: Request) {
    return { title: 'Home', pageType: 'home', user: req.user };
  }

  @Get('/servicecenter')
  @Render('servicecenter')
  getServicePage(@Req() req: Request) {
    return { title: 'ServiceCenter', pageType: 'servicecenter', user: req.user };
  }

  @Get('/trainer')
  @Render('trainer')
  getTrainerPage(@Req() req: Request) {
    return { title: 'Trainer', pageType: 'trainer', user: req.user };
  }

  @Get('/techsupport')
  @Render('techsupport')
  getTechsupportPage(@Req() req: Request) {
    return { title: 'Technical support', pageType: 'techsupport', user: req.user };
  }

  @Get('/authorization')
  @Render('authorization')
  getAuthorizationPage(@Req() req: Request) {
    return { title: 'Authorization', pageType: 'authorization', user: req.user };
  }

  @Get('/servicecenter/activity')
  @Render('activity')
  getActivityPage(@Req() req: Request) {
    return { title: 'Activity', pageType: 'activity', user: req.user };
  }

  @Get('/servicecenter/certificatessc')
  @Render('certificatessc')
  getCertificatesSCPage(@Req() req: Request) {
    return { title: 'CertificatesSC', pageType: 'certificatessc', user: req.user };
  }

  @Get('/servicecenter/authorizationsc')
  @Render('authorizationsc')
  getAuthorizationSCPage(@Req() req: Request) {
    return { title: 'AuthorizationSC', pageType: 'authorizationsc', user: req.user };
  }

  @Get('/servicecenter/gratitudes')
  @Render('gratitudes')
  getGratitudesPage(@Req() req: Request) {
    return { title: 'Gratitudes', pageType: 'gratitudes', user: req.user };
  }

  @Get('/techsupport/szi_skzi')
  @Render('szi_skzi')
  getSZISKZIPage(@Req() req: Request) {
    return { title: 'SZI, SKZI', pageType: 'szi_skzi', user: req.user };
  }

  @Get('/techsupport/mfu')
  @Render('mfu')
  getMFUPage(@Req() req: Request) {
    return { title: 'MFU', pageType: 'mfu', user: req.user };
  }

  @Get('/techsupport/ARM')
  @Render('ARM')
  getARMPage(@Req() req: Request) {
    return { title: 'ARM', pageType: 'ARM', user: req.user };
  }

  @Get('/techsupport/PSPD')
  @Render('PSPD')
  getPSPDPage(@Req() req: Request) {
    return { title: 'PSPD', pageType: 'PSPD', user: req.user };
  }

  @Get('/techsupport/UPS')
  @Render('UPS')
  getUPSPage(@Req() req: Request) {
    return { title: 'UPS', pageType: 'UPS', user: req.user };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/application')
  @Render('application')
  getApplicationPage(@Req() req: Request) {
    return { title: 'Application', pageType: 'application', user: req.user };
  }

  @Get('/mytrainer')
  @Render('mytrainer')
  getMytrainerPage(@Req() req: Request) {
    return { title: 'Mytrainer', pageType: 'mytrainer', user: req.user };
  }

  @Get('/admintrainer')
  @Render('admintrainer')
  getAdmintrainerPage(@Req() req: Request) {
    return { title: 'Admintrainer', pageType: 'admintrainer', user: req.user };
  }

  @Get('/registration')
  @Render('registration')
  getRegistrationPage(@Req() req: Request) {
    return { title: 'Registration', pageType: 'registration', user: req.user };
  }
}
