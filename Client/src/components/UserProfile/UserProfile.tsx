import * as React from "react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {DefaultAvatar} from "../common/DefaultAvatar";
import {API_URL} from "../../http";
import {ModalPopUp} from "../common/ModalPopUp";
import {Confirmation} from "../common/Confirmation";
import {Tooltip} from "react-tooltip";
import {ReactComponent as EnvelopIcon} from "../../assets/svg/envelop.svg";
import {RoleType, UserType} from "../../types/Types";
import {UpdateUserForm} from "../Forms/UpdateUserForm";

type PropsType = {
    apiError: null | string;
    data: UserType | null;
    isDeletingPicturesInProcess: Array<string>;
    possibleRoles: Array<RoleType>;
    remove: () => void;
}

export const UserProfile: React.FC<PropsType> = ({
    apiError,
    data,
    isDeletingPicturesInProcess,
    possibleRoles,
    remove,

}) => {

    const { userId } = useParams();
    const [user, setUser] = useState<UserType | null>(null);
    const [editUserMode, setEditUserMode] = useState<boolean>(false);

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const modalTitle = 'EDIT YOUR PROFILE';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [userId]);

    const closeModal = () => {
        setEditUserMode(false);
        setConfirmationData({needConfirmation: false, context: ''});
        setUser(null);
    }

    if (!data) {
        return <div>Sorry, we can not find such a user in data base</div>
    }
    const getUserRoleValues = (userRoleIds: Array<string>, allRoles: Array<RoleType>) => {
        return userRoleIds?.map(userRoleId => {
            const role = allRoles.find(role => role._id === userRoleId);
            return role ? role.value : null;
        }).filter(roleValue => roleValue !== null);
    }

    const userRoleValues = getUserRoleValues(data?.roles, possibleRoles);

    return (
        <div className={"user-profile container"}>
            <aside className="user-profile__aside">
                <div className="user-profile__avatar">
                    {!data?.avatar
                        ? <DefaultAvatar/>
                        : <img src={`${API_URL}/users/${data._id}/avatar/${data.avatar}`} alt={data.displayName}/>
                    }
                </div>
                <div className="user-profile__details">
                    <div className={"user-profile__name"}>{data.displayName}</div>
                    <ul className={"user-profile__roles"}>
                        {userRoleValues?.map(role => <li>{role}</li>)}
                    </ul>
                </div>
                <div className="user-profile__actions">
                <button
                        className="btn btn--sm btn--transparent"
                        onClick={() => {
                            setEditUserMode(true);
                        }}
                    >Edit Profile
                    </button>
                    <button
                        className="btn btn--sm btn--transparent"
                        disabled={isDeletingPicturesInProcess?.some(id => id === data._id)}
                        onClick={() => {
                            setConfirmationData({
                                needConfirmation: true,
                                itemId: data._id,
                                context: 'Are you sure? You about to delete your profile FOREVER along with all data...',
                                cb: remove
                            });
                        }}
                    >Delete profile
                    </button>
                </div>
                <div className={"user-profile__contact"}>
                    <span className={"user-profile__contact-icon"}><EnvelopIcon /></span>
                    <span className={"user-profile__contact-email"}>{data.email}</span>
                </div>
                <ModalPopUp
                    isOpen={editUserMode}
                    modalTitle={modalTitle}
                    closeModal={closeModal}
                >
                    {editUserMode &&
                        <UpdateUserForm
                            apiError={apiError}
                            isEditing={editUserMode}
                            data={data}
                            closeModal={closeModal}
                        />
                    }
                </ModalPopUp>
                <Confirmation
                    isOpen={confirmationData.needConfirmation}
                    content={confirmationData.context}
                    confirm={() => {
                        if (confirmationData.cb) {
                            confirmationData.cb();
                        } else {
                            console.error("Item ID is undefined or callback function is not provided.");
                        }
                    }}
                    cancel={closeModal}
                />
                <Tooltip id="profile-tooltip"/>
            </aside>
            <section className="user-profile_content">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean
                massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
                Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut,
                imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.
                Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
                porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat
                a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam
                ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas
                tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed
                ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante
                tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet
                orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis
                magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,
            </section>
        </div>
    );
};

UserProfile.displayName = 'UserProfile';
