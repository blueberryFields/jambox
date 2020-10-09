import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { signOut } from '../../redux/user/user.actions';
import CustomButton from '../custom-button/custom-button.component';
import ToggleContent from '../../modal-engine/toggle-content/toggle-content.component';
import Modal from '../../modal-engine/modal/modal.component';
import UploadModal from '../upload-modal/upload-modal.component';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import './header.styles.scss';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  return (
    <div className="header">
      {user && (
        <ToggleContent
          toggle={(show) => (
            <CustomButton onClick={show}>Ladda upp</CustomButton>
          )}
          content={(hide) => (
            <Modal hide={hide}>
              <UploadModal hide={hide} />
            </Modal>
          )}
        />
      )}
      <h1 className="logo">In Absurdum</h1>
      {/* <CustomButton inverted>Logga ut</CustomButton> */}
      {/* <FontAwesomeIcon className="menu-icon" icon={faBars} /> */}
      {user && (
        <div className="sign-out" onClick={() => dispatch(signOut())}>
          LOGGA UT
        </div>
      )}
    </div>
  );
};

export default Header;
