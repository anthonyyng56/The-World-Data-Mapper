import React 	from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteModal = (props) => {
	
	const hideDeleteConfirmation = () => {
		props.toggleDeleteConfirmation(false);
	}

	return (
		<WModal className="delete-modal" visible={true} cover={true} animation="slide-fade-top">
			<WMHeader className="modal-header" onClose={() => props.toggleDeleteConfirmation(false)}>
			&nbsp;&nbsp;&nbsp;&nbsp;{props.deleteMessage}
			</WMHeader>
                <WMMain>
				<div className="delete-modal-message">Are you sure you want to delete "{props.name}"?</div>
				<div className="button-layout">
					<WButton className="modal-button left-button" clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger" onClick={props.delete}>
						Delete
					</WButton>
                    <WButton className="modal-button" clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger" onClick={hideDeleteConfirmation}>
						Cancel
					</WButton>
                </div>
				</WMMain>
		</WModal>
	);
}

export default DeleteModal;