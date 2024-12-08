module.exports = class UserDto {
    id
    displayName
    isActivated
    email
    roles
    avatar

    constructor(model) {
        this.id = model._id
        this.displayName = model.displayName
        this.isActivated = model.isActivated
        this.email = model.email
        this.roles = model.roles
        this.avatar = model.avatar
    }
};
