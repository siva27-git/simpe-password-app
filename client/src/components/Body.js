import { useState } from "react";
import axios from 'axios';
import { Form, FormGroup, Button, Label, Input, Alert } from "reactstrap";

const Body = () => {

    const [password, setPassword] = useState("");
    const [showOutput, setShowOutput] = useState(false);
    const [passwordResponse, setPasswordResponse] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onClickCheck = async () => {
        try {
            if (password.length > 0) {
                const payload = { password };
                const res = await axios.post('http://localhost:8000/api/processPassword', payload);
                if (res?.data?.status === "success") {
                    setErrorMessage("");
                    setPasswordResponse(res?.data?.data);
                    setShowOutput(true);
                }
            } else {
                setErrorMessage("Password is empty")
            }
        } catch (error) {
            console.error(error?.message ? error?.message : error?.response?.data?.message);
            setErrorMessage(error?.message ? error?.message : error?.response?.data?.message)
        }
    };

    const onClickReset = () => {
        setErrorMessage("");
        setPassword("");
        setShowOutput(false);
    };

    return (
        <>
            <div className="notes">
                <Alert color="primary">
                    This app will show the number of steps required to make your password strong !
                </Alert>
            </div>

            <div className="notes">
                <Alert isOpen={errorMessage.length > 0} color="danger">
                    {errorMessage}
                </Alert>
            </div>

            <div className='body'>
                <Form className="form">
                    <FormGroup floating>
                        <Input
                            id="password"
                            name="password"
                            placeholder="Enter Password"
                            type="text"
                            onChange={onChangePassword}
                            value={password}
                        />
                        <Label for="password"> Enter Password</Label>
                    </FormGroup>
                    {
                        showOutput &&
                        <FormGroup floating>
                            <Input
                                id="minSteps"
                                name="minSteps"
                                placeholder="Minimum number of steps"
                                type="number"
                                disabled={true}
                                value={passwordResponse.minSteps}
                            />
                            <Label for="minSteps">Minimum number of steps required</Label>
                        </FormGroup>
                    }
                    <div className="form-buttons">
                        <Button color="success" disabled={showOutput} onClick={onClickCheck}> Check </Button>
                        <Button color="warning" onClick={onClickReset}> Reset </Button>
                    </div>
                </Form>
            </div>
        </>
    )
};

export default Body;
