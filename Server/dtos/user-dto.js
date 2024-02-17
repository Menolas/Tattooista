module.exports = class UserDto {
    id
    displayName
    isActivated
    roles
    avatar

    constructor(model) {
        this.id = model._id
        this.displayName = model.displayName
        this.isActivated = model.isActivated
        this.roles = model.roles
        this.avatar = model.avatar
    }
}
