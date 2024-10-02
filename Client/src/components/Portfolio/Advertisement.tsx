import * as React from "react";
import {ReactComponent as FaceBookIcon} from "../../assets/svg/facebook.svg";
import {ReactComponent as InstagramIcon} from "../../assets/svg/instagram.svg";
import {ReactComponent as LinkedinIcon} from "../../assets/svg/linkedin.svg";
import {ReactComponent as TwitterIcon} from "../../assets/svg/twitter.svg";
import {BookingButton} from "../common/BookingButton";
import {ShareButton} from "./ShareButton";
import {handleShare} from "../../utils/functions";

export const Advertisement: React.FC = () => {

  const FacebookLink = 'https://www.facebook.com/sharer/sharer.php?u';
  const InstagramLink = 'https://www.instagram.com/';
  const LinkedinLink = `https://www.linkedin.com/sharing/share-offsite/?url`;
  const TwitterLink = `https://twitter.com/intent/tweet?url`;
  const handleShareCallBack = () => {
    handleShare('portfolio');
  };

  return (
    <section className="advertisement">
      <div className="social-share">
          <h3 className={'page-block__title-secondary'}>Share this page:</h3>
          <ul className="social-share__list list">
            <ShareButton
                tooltipText={'Copy link and Share on Instagram'}
                socialLink={InstagramLink}
                icon=<InstagramIcon/>
                isInstagram={true}
            />
            <ShareButton
                tooltipText={'Share on Facebook'}
                socialLink={FacebookLink}
                icon=<FaceBookIcon/>
            />
            <ShareButton
                tooltipText={'Share on Linkedin'}
                socialLink={LinkedinLink}
                icon=<LinkedinIcon/>
            />
            <ShareButton
                tooltipText={'Share on Twitter'}
                socialLink={TwitterLink}
                icon=<TwitterIcon/>
            />
          </ul>
      </div>
      <BookingButton
          consentId={"consentAdvertisement"}
      />
    </section>
  );
};
