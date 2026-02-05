import { Modal, Backdrop, Fade, Box, Typography, Button } from "@mui/material";
import React from "react";
import { MouseEventHandler } from "react";

interface Props {
  readonly title: string;
  readonly message: any;
  readonly openModal: boolean;
  readonly onConfirmLabel: string;
  readonly onCloseLabel: string;
  readonly handleCloseModal: MouseEventHandler;
  readonly handleConfirm: MouseEventHandler;
  readonly renderContent?: () => any;
}

const GenericModal = ({
  title,
  message,
  openModal,
  onConfirmLabel,
  onCloseLabel,
  handleCloseModal,
  handleConfirm,
  renderContent,
}: Props) => (
  <Modal
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
    open={openModal}
    onClose={handleCloseModal}
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={openModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: "4px",
          boxShadow: 24,
          p: 4,
        }}
      >
        {renderContent ? (
          renderContent()
        ) : (
          <>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
              {message}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gridTemplateRows: "auto",
              }}
            >
              <Button
                variant="outlined"
                sx={{ gridColumn: "span 6", justifySelf: "end", mr: 1 }}
                onClick={handleCloseModal}
              >
                {onCloseLabel}
              </Button>
              <Button
                variant="contained"
                sx={{ gridColumn: "span 2", justifySelf: "end" }}
                onClick={handleConfirm}
              >
                {onConfirmLabel}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Fade>
  </Modal>
);

export default GenericModal;
