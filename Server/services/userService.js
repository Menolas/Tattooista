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
        const activationLink = uuid.v4();
        const userRole = await Role.findOne({value: "USER"});

        let user = await UserModel.create({
            displayName,
            email,
            password: hashPassword,
            roles: [userRole._id],
            activationLink
        });
        await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/auth/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                _id: userDto.id,
                displayName: userDto.displayName,
                isActivated: userDto.isActivated,
                roles: userDto.roles,
                avatar: userDto.avatar
            },
            roles: await Role.find()
        }
    }

    async editUser(displayName, email, userId) {
        const displayNameCandidate = await  UserModel.findOne({
            displayName: displayName,
            _id: {$ne: userId}
        });
        if (displayNameCandidate) {
            throw ApiError.BadRequest(`The user with Display Name ${displayName} already exist`);
        }
        const emailCandidate = await  UserModel.findOne({
            email: email,
            _id: {$ne: userId}
        });
        if (emailCandidate) {
            throw ApiError.BadRequest(`The user with email ${email} already exist`);
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link');
        }
        user.isActivated = true;
        await user.save();
        return user._id;
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
                _id: userDto.id,
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
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            isAuth: true,
            user: {
                _id: userDto.id,
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
