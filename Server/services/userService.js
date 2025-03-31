const UserModel = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const ApiError = require('../exeptions/apiErrors');

class UserService {
    async registration(displayName, email, password, isAdmin = false) {
        const displayNameCandidate = await  UserModel.findOne({displayName})
        if (displayNameCandidate) {
            throw ApiError.BadRequest(`The user with Display Name ${displayName} already exist`);
        }
        const emailCandidate = await  UserModel.findOne({email})
        if (emailCandidate) {
            throw ApiError.BadRequest(`The user with email ${email} already exist`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        let user = new UserModel({
            displayName,
            email,
            password: hashPassword,
            activationLink,
        });

        await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/auth/activate/${activationLink}`);

        const payload = {
            id: user._id.toString(),
            email: user.email,
            roles: user.roles,
            isActivated: user.isActivated
        };

        console.log('payload in registration userService:', JSON.stringify(payload));

        if (!isAdmin) {
            const userRole = await Role.findOne({value: "USER"});
            user.roles = [userRole._id];
            await user.save();
            const tokens = tokenService.generateTokens(payload);
            await tokenService.saveToken(user._id, tokens.refreshToken);
            return {
                ...tokens,
                user: {
                    _id: user._id.toString(),
                    email: user.email,
                    displayName: user.displayName,
                    isActivated: user.isActivated,
                    roles: payload.roles,
                },
                roles: await Role.find()
            };
        } else {
            await user.save();
            return {
                _id: user._id.toString(),
                email: user.email,
                displayName: user.displayName,
                isActivated: user.isActivated,
            };
        }

    }

    async editUser(displayName, email, user) {
        const displayNameCandidate = await  UserModel.findOne({
            displayName: displayName,
            _id: {$ne: user._id}
        });
        if (displayNameCandidate) {
            throw ApiError.BadRequest(`The user with Display Name ${displayName} already exist`);
        }
        const emailCandidate = await  UserModel.findOne({
            email: email,
            _id: {$ne: user._id}
        });
        if (emailCandidate) {
            throw ApiError.BadRequest(`The user with email ${email} already exist`);
        }

        if (user.email !== email) {
            user.activationLink = uuid.v4();
            user.email = email;
            user.isActivated = false;

            await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/auth/activate/${user.activationLink}`);
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink});
        if (!user || user.isActivated) {
            throw ApiError.BadRequest('Incorrect activation link');
        }
        user.isActivated = true;
        await user.save();
        const payload = {
            id: user._id.toString(),
            email: user.email,
            roles: user.roles.map(role => role.toString()),
            isActivated: user.isActivated
        };

        return await tokenService.generateEmailVerificationToken(payload);
    }

    async login(email, password, isVerifyEmail = false) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequest('there is no user with such email');
        }

        if (!isVerifyEmail) {
            const isPassEquals = await bcrypt.compare(password, user.password)
            if (!isPassEquals) {
                throw ApiError.BadRequest('wrong password');
            }
        }

        const payload = {
            id: user._id.toString(),
            email: user.email,
            roles: user.roles.map(role => role.toString()),
            isActivated: user.isActivated
        };

        const tokens = tokenService.generateTokens(payload);
        await tokenService.saveToken(user._id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                _id: user._id.toString(),
                avatar: user.avatar,
                email: user.email,
                displayName: user.displayName,
                isActivated: user.isActivated,
                roles: payload.roles,
            },
            roles: await Role.find()
        }
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.BadRequest('no refresh token');
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.BadRequest('could not validate refresh token or it was not found in db');
        }
        const user = await UserModel.findById(userData.id);
        if (!user) {
            throw ApiError.BadRequest('no such user');
        }
        const payload = {
            id: user._id.toString(),
            email: user.email,
            roles: user.roles.map(role => role.toString()),
            isActivated: user.isActivated
        };

        const tokens = tokenService.generateTokens(payload);
        await tokenService.saveToken(user._id, tokens.refreshToken);
        return {
            ...tokens,
            isAuth: true,
            user: {
                _id: user._id.toString(),
                email: user.email,
                displayName: user.displayName,
                isActivated: user.isActivated,
                avatar: user.avatar,
                roles: payload.roles,
            },
            roles: await Role.find(),
        }
    }

    async verifyEmail(token) {
        if (!token) {
            throw ApiError.BadRequest('no token');
        }
        return await tokenService.validateAccessToken(token);
    }
}

module.exports = new UserService();
