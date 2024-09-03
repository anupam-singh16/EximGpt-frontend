import React, { useState } from "react";
import "../App.css";

const DeleteConfirmationModal = () => {
    const [showModal, setShowModal] = useState(false);
    console.log(showModal, 'showModal')

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const confirmDelete = () => {

        closeModal();
    };

    return (
        <div>
            <button onClick={openModal} className="deleteBtn">
                Delete
            </button>


            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>

                        </span>
                        <h2>Are you sure?</h2>
                        <p>Do you really want to delete this item? This process cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={closeModal} className="cancel-btn">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteConfirmationModal;
