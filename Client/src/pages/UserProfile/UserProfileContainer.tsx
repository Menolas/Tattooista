import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {UserProfile} from "./UserProfile";
import {getApiErrorSelector} from "../../redux/General/general-selectors";
import {getRoles} from "../../redux/Users/users-reducer";
import {
  deleteReviewFromProfile,
  deleteUserFromProfile, getReviews,
} from "../../redux/Auth/auth-reducer";
import {
  getUserProfileSelector,
  getTokenSelector,
  getIsDeletingInProcessSelector,
  getIsFetchingSelector,
  getIsAuthSelector,
  getUsersReviewsSelector,
} from "../../redux/Auth/auth-selectors";
import {AppDispatch} from "../../redux/redux-store";
import {getRolesSelector} from "../../redux/Users/users-selectors";
import {Preloader} from "../../components/common/Preloader";
import {NoAccessPopUp} from "../../components/PopUps/NoAccessPopUp";
import {FC, useEffect} from "react";
import {getIsDeletingReviewInProcessSelector, getReviewApiErrorSelector} from "../../redux/Reviews/reviews-selectors";
import {setReviewApiErrorAC} from "../../redux/Reviews/reviews-reducer";

export const UserProfileContainer: FC = () => {

  const apiError = useSelector(getApiErrorSelector);
  const isAuth = useSelector(getIsAuthSelector);
  const profile = useSelector(getUserProfileSelector);
  const reviews = useSelector(getUsersReviewsSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const isDeletingReviewInProcess = useSelector(getIsDeletingReviewInProcessSelector);
  const token = useSelector(getTokenSelector);
  const roles = useSelector(getRolesSelector);
  const isFetching = useSelector(getIsFetchingSelector);
  const reviewApiError = useSelector(getReviewApiErrorSelector);
  const submittedReviews = useSelector(getUsersReviewsSelector);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roles.length) dispatch(getRoles());
  }, []);

  useEffect(() => {
    if (profile) dispatch(getReviews(profile._id));
  }, [dispatch, profile]);

  const deleteUserCallBack = async () => {
    if (profile) {
      let success = await dispatch(deleteUserFromProfile(token, profile?._id));
      if (success) navigate("/");
    }
  };

  const closeModal = () => {
    navigate("/");
  };

  const removeReviewCallBack = (id: string) => {
    dispatch(deleteReviewFromProfile(token, id));
  }

  const setReviewApiErrorCallBack = () => {
    dispatch(setReviewApiErrorAC(null));
  }

  return (
    <>
      {isFetching
        ? <Preloader />
        : <UserProfile
             isAuth={isAuth}
             apiError={apiError}
             data={profile}
             reviewApiError={reviewApiError}
             reviews={reviews}
             isSubmittedReviews={submittedReviews.length}
             isDeletingPicturesInProcess={isDeletingInProcess}
             isDeletingReviewInProcess={isDeletingReviewInProcess}
             possibleRoles={roles}
             remove={deleteUserCallBack}
             removeReview={removeReviewCallBack}
             setReviewApiError={setReviewApiErrorCallBack}
            />
      }
      <NoAccessPopUp isOpen={!isAuth} closeModal={closeModal}/>
    </>
  );
};
