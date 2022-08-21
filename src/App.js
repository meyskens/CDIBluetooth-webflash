import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from "react-bootstrap/Alert";

import { flashStageOne, flashStageTwo, flashStageThree } from "./samd/flasher";

function App() {
  const [agreed, setAgreed] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [stage, setStage] = useState(0);

  function getBrowserMessage() {
    if (
      navigator.userAgent.indexOf("Safari") !== -1 &&
      !window.chrome.runtime
    ) {
      return "Sorry, as much as I like Safari";
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
      return "Sorry, as much as I like Firefox";
    } else if (
      navigator.userAgent.indexOf("MSIE") !== -1 ||
      !!document.documentMode === true
    ) {
      return "Oh wow, you're using Internet Explorer... Sorry about that... Anyway, ";
    }

    return "I'm sorry,";
  }

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
          {navigator.serial ? (
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
          ) : (
            <Alert variant="danger">
              {getBrowserMessage()} you need a browser that supports WebSerial
              to use this app. You will need to use the latest Chrome, Opera or
              Edge to run this.
            </Alert>
          )}
        </Col>
      </Row>
      {agreed ? flasher : null}
    </Container>
  );
}

export default App;
