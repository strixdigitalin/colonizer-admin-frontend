import { Button, Modal, Paper, Typography } from "@mui/material";

const AlertPopup = ({ user, setFlag, flag, password }) => {
  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const paperStyle = {
    backgroundColor: "#fff",
    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
    padding: "16px",
    outline: "none",
    width: "300px",
    textAlign: "center"
  };

  const buttonStyle = {
    marginTop: "16px"
  };

  const handleClose = () => {
    setFlag(() => false);
  };
  return (
    <div>
      {/* <div className='cus-alert' style={{ position: "absolute", top: "100px", backgroundColor: "beige", borderRadius: "6px", padding: "1rem", zIndex: "100", left: "400px" }}>
                <p>Congratulation! You have successfully registerd wih m trade</p>
                <p>Dear {data?.fullName}, A confirmation email has been sent to {data?.email}.</p>
                <br />
                <br />
                <p>User ID : {user}</p>
                <p>Password: {data?.password}</p>
            </div> */}
      <Modal
        style={modalStyle}
        open={flag}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper style={paperStyle}>
          <Typography variant="h6" id="modal-title">
            Congratulations {user?.fullName}!😃
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            You have successfully registered with mtrade. A confirmation email
            has been sent to your email <strong>{user?.email}</strong>.
          </Typography>
          <Typography mt={2} variant="subtitle1" id="simple-modal-description">
            SponsorId:- <strong>{user?.sponserID}</strong>
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            UserId:- <strong>{user?.userId}</strong>
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            Password:- <strong>{password}</strong>
          </Typography>
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
            style={buttonStyle}
          >
            Close
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default AlertPopup;