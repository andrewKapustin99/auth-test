import {AuthModule} from "./auth.module.js"; 
import { generateError } from "../shared/modules/exceptions/generate.exception.js";
import { logger } from "../shared/modules/logger/logger.js";

export class AuthService {
    authModule = new AuthModule();

    async register (req, res) {
        const routePath = `auth/register`
        try {
            const result = await this.authModule.register(req.body);
            const response = {status: 200, message: result}
            
            await logger.logInfo(response, 'info');

            res.status(response.status).send({ message: response.message });
        } catch (error) {
            const { status, message } = await generateError(error, routePath);
            res.status(status).send({message});
        }
    };
    async registerAlternative (req, res) {
        const routePath = `auth/register-alt`
        try {
            const result = await this.authModule.registerAlternative(req.body);
            const response = {status: 200, message: result}
            
            await logger.logInfo(response, 'info');

            res.status(response.status).send({ message: response.message });
        } catch (error) {
            const { status, message } = await generateError(error, routePath);
            res.status(status).send({message});
        }
    };
    async login (req, res) {
        const routePath = `auth/login`
        try {
            const result = await this.authModule.login(req.body);
            const response = {status: 200, message: result}
            
            await logger.logInfo(response, 'info');

            res.status(response.status).send({ message: response.message });
        } catch (error) {
            const { status, message } = await generateError(error, routePath);
            res.status(status).send({message});
        }
    };
    async refresh (req, res) {
        const routePath = `auth/refresh`
        try {
            const result = await this.authModule.refresh(req.body);
            const response = {status: 200, message: result}
            
            await logger.logInfo(response, 'info');

            res.status(response.status).send({ message: response.message });
        } catch (error) {
            const { status, message } = await generateError(error, routePath);
            res.status(status).send({message});
        }
    };
    async checkVersion (req, res) {
        const routePath = `auth/checkVersion`
        try {
            const result = await this.authModule.checkVersion(req.body);
            const response = {status: 200, message: result}
            
            await logger.logInfo(response, 'info');

            res.status(response.status).send({ message: response.message });
        } catch (error) {
            const { status, message } = await generateError(error, routePath);
            res.status(status).send({message});
        }
    };
    async createVersion (req, res) {
        const routePath = `auth/createVersion`
        try {
            const result = await this.authModule.createVersion(req.body);
            const response = {status: 200, message: result}
            
            await logger.logInfo(response, 'info');

            res.status(response.status).send({ message: response.message });
        } catch (error) {
            const { status, message } = await generateError(error, routePath);
            res.status(status).send({message});
        }
    };
}