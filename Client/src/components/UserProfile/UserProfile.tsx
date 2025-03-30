import * as React from "react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {DefaultAvatar} from "../common/DefaultAvatar";
import {API_URL} from "../../http";
import {ModalPopUp} from "../PopUps/ModalPopUp";
import {Confirmation} from "../common/Confirmation";
import {Tooltip} from "react-tooltip";
import {ReactComponent as EnvelopIcon} from "../../assets/svg/envelop.svg";
import {ReviewType, RoleType, UserType} from "../../types/Types";
import {UpdateUserForm} from "../Forms/UpdateUserForm";
import {ReviewItem} from "../../pages/reviews/ReviewItem";
import {UpdateReviewForm} from "../Forms/UpdateReviewForm";

type PropsType = {
    isAuth: null | string;
    apiError: null | string;
    data: UserType | null;
    reviewApiError: null | string;
    reviews: Array<ReviewType>;
    isSubmittedReviews: number;
    isDeletingPicturesInProcess: Array<string>;
    isDeletingReviewInProcess: Array<string>;
    possibleRoles: Array<RoleType>;
    remove: () => void;
    setReviewApiError: () => void;
}

export const UserProfile: React.FC<PropsType> = ({
    isAuth,
    apiError,
    data,
    reviewApiError,
    reviews,
    isSubmittedReviews,
    isDeletingPicturesInProcess,
    isDeletingReviewInProcess,
    possibleRoles,
    remove,
    setReviewApiError,
}) => {

    const {userId} = useParams();
    const [user, setUser] = useState<UserType | null>(null);
    const [editUserMode, setEditUserMode] = useState<boolean>(false);
    const [addReviewMode, setAddReviewMode] = useState<boolean>(false);

    const [confirmationData, setConfirmationData] = useState<{
        needConfirmation: boolean,
        itemId?: string,
        cb?: () => void,
        context: string
    }>({needConfirmation: false, context: ''});

    const modalTitle = 'EDIT YOUR PROFILE';

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [userId]);

    const closeModal = () => {
        setEditUserMode(false);
        setConfirmationData({needConfirmation: false, context: ''});
        setUser(null);
    };

    const getUserRoleValues = (userRoleIds: Array<string>, allRoles: Array<RoleType>) => {
        return userRoleIds?.map(userRoleId => {
            const role = allRoles.find(role => role._id === userRoleId);
            return role ? role.value : null;
        }).filter(roleValue => roleValue !== null);
    };

    const closeReviewUpdateModal = () => {
        setAddReviewMode(false);
        setReviewApiError();
    }

    const userRoleValues = data ? getUserRoleValues(data.roles, possibleRoles) : [];

    const reviewElements = reviews.map((review, index) => {
        return <ReviewItem
                    key={index}
                    isAuth={isAuth}
                    apiError={reviewApiError}
                    isDeletingInProcess={isDeletingReviewInProcess}
                    data={review}
                    remove={remove}
                    setReviewApiError={setReviewApiError}
                />
    });

    return (
        <div className="user-profile container">
            <aside className="user-profile__aside">
                <div className="user-profile__avatar">
                    {!data?.avatar
                        ? <DefaultAvatar/>
                        : <img src={`${API_URL}/users/${data._id}/avatar/${data.avatar}`} alt={data.displayName}/>
                    }
                </div>
                <div className="user-profile__details">
                    <div className={"user-profile__name"}>{data?.displayName}</div>
                    <ul className={"user-profile__roles"}>
                        {userRoleValues?.map(role => <li key={role}>{role}</li>)}
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
                        disabled={isDeletingPicturesInProcess?.some(id => id === data?._id)}
                        onClick={() => {
                            setConfirmationData({
                                needConfirmation: true,
                                itemId: data?._id,
                                context: 'Are you sure? You about to delete your profile FOREVER along with all data...',
                                cb: remove
                            });
                        }}
                    >Delete profile
                    </button>
                </div>
                <div className={"user-profile__contact"}>
                    <span className={"user-profile__contact-icon"}><EnvelopIcon/></span>
                    <span className={"user-profile__contact-email"}>{data?.email}</span>
                </div>
                <ModalPopUp
                    isOpen={editUserMode}
                    modalTitle={modalTitle}
                    closeModal={closeModal}
                >
                    {editUserMode &&
                        <UpdateUserForm
                            fromProfile={true}
                            apiError={apiError}
                            isEditing={editUserMode}
                            roles={possibleRoles}
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
                <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean
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
                    magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc.</p>
                <div className='reviews'>
                    <h4>My reviews</h4>
                    <ul className="reviews__list">{reviewElements}</ul>
                    { (isSubmittedReviews < 3) &&
                        <button
                            className="btn btn--bg btn--light-bg add-btn"
                            onClick={() => {
                                setAddReviewMode(true)
                            }}
                        >
                            Add a Review
                        </button>
                    }
                    {addReviewMode && (
                        <ModalPopUp
                            isOpen={addReviewMode}
                            modalTitle={"Leave a review"}
                            closeModal={closeReviewUpdateModal}
                        >
                            <UpdateReviewForm
                                apiError={apiError}
                                isEditing={false}
                                closeModal={closeReviewUpdateModal}
                            />
                        </ModalPopUp>
                    )}
                </div>
            </section>
        </div>

    );
};

UserProfile.displayName = 'UserProfile';
