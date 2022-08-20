import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";

import { flashStageOne, flashStageTwo, flashStageThree } from "./samd/flasher";

function App() {
  const [agreed, setAgreed] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [stage, setStage] = useState(0);

  const flashOne = async () => {
    setFlashing(true);
    try {
      await flashStageOne(setProgress, setProgressMsg);
      setStage(1);
    } catch (e) {
      console.error(e);
      alert("Aha, here is the problem... too many toasters!");
    }
    setFlashing(false);
  };

  const flashTwo = async () => {
    setFlashing(true);
    try {
      await flashStageTwo(setProgress, setProgressMsg);
      setStage(2);
    } catch (e) {
      console.error(e);
      alert("Aha, here is the problem... too many toasters!");
    }
    setFlashing(false);
  };

  const flashThree = async () => {
    setFlashing(true);
    try {
      await flashStageThree(setProgress, setProgressMsg);
      setStage(3);
    } catch (e) {
      console.log(e);
      alert("Aha, here is the problem... too many toasters!");
    }
    setFlashing(false);
  };

  const flasher = (
    <Row>
      <Col xs={12}>
        <h2>Upgrade my module</h2>
        {stage === 0 && !flashing && (
          <p>
            <button className="btn btn-primary" onClick={flashOne}>
              Start upgrade!
            </button>
          </p>
        )}
        {stage === 1 && !flashing && (
          <p>
            <button className="btn btn-primary" onClick={flashTwo}>
              Upgrade BT Stack
            </button>
          </p>
        )}
        {stage === 2 && !flashing && (
          <p>
            <button className="btn btn-primary" onClick={flashThree}>
              Upgrade CD-i controller
            </button>
          </p>
        )}
      </Col>
      <Col xs={12}>
        <div>
          <ProgressBar animated now={progress} />
        </div>
        <div>{progressMsg}</div>
      </Col>
    </Row>
  );

  return (
    <Container className="bg-dark text-white">
      <Row>
        <Col>
          <h1>CD-i Bluetooth - Firmware Update ALPHA</h1>
          <p>
            This is a web firmware updater for the CD-i Bluetooth mouse support!
            Get it first and get bitten by bugs!
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Instructions</h2>
          <p>
            Connect your CD-i Bluetooth module with USB (DISCONNECT IT FROM THE
            CD-i). And then, click the button below.
          </p>
          <p>
            <input
              type="checkbox"
              id="agreed"
              onChange={(e) => setAgreed(e.target.checked)}
              checked={agreed}
            />
            &nbsp;
            <label for="agreed">
              I agree to not sue, have bugs and to give up my first born child
            </label>
          </p>
        </Col>
      </Row>
      {agreed ? flasher : null}
    </Container>
  );
}

export default App;
