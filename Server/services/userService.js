const UserModel = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exeptions/apiErrors');

class UserService {
    async registration(displayName, email, password) {
        const displayNameCandidate = await  UserModel.findOne({displayName})
        if (displayNameCandidate) {
            throw ApiError.BadRequest(`The user with Display Name ${displayName} already exist`);
        }
        const emailCandidate = await  UserModel.findOne({email})
        if (emailCandidate) {
            throw ApiError.BadRequest(`The user with email ${email} already exist`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const userRole = await Role.findOne({value: "USER"});
        const activationLink = uuid.v4();
        let user = await UserModel.create({
            displayName,
            email,
            password: hashPassword,
            roles: [userRole._id],
            activationLink
        });

        await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                displayName: userDto.displayName,
                isActivated: userDto.isActivated,
                roles: userDto.roles,
                avatar: userDto.avatar
            },
            roles: await Role.find()
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link');
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequest('there is no user with such email');
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('wrong password');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                displayName: userDto.displayName,
                isActivated: userDto.isActivated,
                roles: userDto.roles,
                avatar: userDto.avatar
            },
            roles: await Role.find()
        }
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            //throw ApiError.UnauthorizedError()
            return {
                isAuth: false
            }
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            //throw ApiError.UnauthorizedError()
            return {
                isAuth: false
            }
        }
        const user = await UserModel.findById(userData.id);
        if (!user) {
            return {
                isAuth: false
            }
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            isAuth: true,
            user: {
                displayName: userDto.displayName,
                isActivated: userDto.isActivated,
                roles: userDto.roles,
                avatar: userDto.avatar
            },
            roles: await Role.find()
        }
    }

}

module.exports = new UserService();
