import {useState} from "react";
import './App.css';
import './spinner.css';
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

function App() {
  const [backendResponse, setBackendResponse] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);

  const requestBackend = async () => {
    setBackendResponse(null);
    setButtonClicked(true);
    console.log('Button clicked!');
    console.log('User prompt: ', userPrompt);
    const url = `http://localhost:8000`;
    let response = null;
    try {
      console.log('Waiting for response from openai...');
      const response = await openai.createImage({
        prompt: userPrompt,
        n: 2,
        size: "256x256",
      });
      console.log('Response from openai: ', response.data.data[0]);
      setBackendResponse(response.data.data[0].url);
      setButtonClicked(false);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        {showPromptTextbox( { setUserPrompt} )}
        {showButton( { requestBackend, buttonClicked } )}
        {showOpenAIImage( { backendResponse } ) }
      </header>
    </div>
  );
}

function showButton({ requestBackend, buttonClicked }) {
  return (
    <div>
      <button onClick={requestBackend} disabled={buttonClicked}>Send Request To Backend</button>
    </div>
  );
}

function showOpenAIImage({ backendResponse }) {
  return (
    <div>
      {backendResponse && 
        <img 
          src={backendResponse} 
          style={{ maxWidth: '100%', height: 'auto' }}
          alt="Generated Image"
        />
      }
    </div>
  );
}

function showPromptTextbox({ setUserPrompt }) {
  const handleInputChange = (event) => {
    setUserPrompt(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        id="userInput"
        name="userInput"
        onChange={handleInputChange}
      />
    </div>
  );
}

export default App;
