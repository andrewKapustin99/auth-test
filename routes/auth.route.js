import express from 'express';
import GreenSMS from 'greensms';
import { AuthService } from '../services/auth.service.js';



const authService = new AuthService();

const authRouter = express.Router();
authRouter.post('/register', (req, res) => authService.register(req, res));
authRouter.post('/register-alt', (req, res) => authService.registerAlternative(req, res));
authRouter.post('/login', (req, res) => authService.login(req, res));
authRouter.post('/refresh-token', (req, res) => authService.refresh(req, res));
authRouter.post('/createVersion', (req, res) => authService.createVersion(req, res));
authRouter.get('/checkVersion', (req, res) => authService.checkVersion(req, res));

authRouter.post('/2fa', async (req, res) => {
  try {
    const client = new GreenSMS({ user: 'blinov', pass: 'Pavlovich2002' });
    const resCode = await client.call.send({ to: req.body.phone });

    if (resCode) {
      return res.status(200).send({ message: resCode });
    }

    res.status(500).send({ message: false });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});


export {authRouter};
